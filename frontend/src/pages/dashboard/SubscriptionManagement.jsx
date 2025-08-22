import React, { useState, useEffect } from 'react';
import { useGetAvailablePlansQuery, useCreateSubscriptionOrderMutation, useVerifyPaymentMutation, useGetRestaurantSubscriptionQuery, useGetSubscriptionByIdQuery, useCancelSubscriptionMutation } from '../../store/features/subscription/subscriptionApi';
import { useGetMyRestaurantQuery } from '../../store/features/restorent/restoApi';
import { useSubscription } from '../../context/SubscriptionContext';
import { motion } from 'framer-motion';
import { showSuccess, showError, showInfo } from '../../utils/toast';
import { 
  Crown, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star,
  Zap,
  Shield,
  CreditCard,
  Calendar,
  DollarSign,
  AlertCircle,
  Info,
  Play
} from 'lucide-react';

const SubscriptionManagement = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const { checkSubscriptionStatus, updateSubscriptionWithRealData } = useSubscription();

  const { data: restaurantData } = useGetMyRestaurantQuery();
  console.log("restaurant data", restaurantData)
  const { data: plansData } = useGetAvailablePlansQuery();
  
  // Get subscription data - either from restaurant or user directly
  const { data: subscriptionData, refetch: refetchSubscription } = useGetRestaurantSubscriptionQuery(
    restaurantData?.data?._id,
    { skip: !restaurantData?.data?._id }
  );
  
  // Get user's active subscription regardless of restaurant
  const { data: userSubscriptionData } = useGetSubscriptionByIdQuery(
    localStorage.getItem('user_subscription_id'),
    { skip: !localStorage.getItem('user_subscription_id') }
  );
  
  // Use either restaurant subscription or user subscription
  const activeSubscription = subscriptionData?.data || userSubscriptionData?.data;

  // Update subscription context when subscription data changes
  useEffect(() => {
    if (activeSubscription && activeSubscription.status === 'active') {
      updateSubscriptionWithRealData(activeSubscription);
    }
  }, [activeSubscription, updateSubscriptionWithRealData]);

  const [createSubscriptionOrder] = useCreateSubscriptionOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();

  // Demo subscription activation
  const activateDemoSubscription = () => {
    localStorage.setItem('zinr_subscription_status', 'active');
    checkSubscriptionStatus();
    showSuccess('Demo subscription activated! You now have access to all premium features.');
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePlanSelect = (planType) => {
    // Validate Razorpay key before showing payment modal
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      showError('Payment system not configured. Please contact support.');
      return;
    }
    
    setSelectedPlan(planType);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    try {
      // Validate Razorpay key is available
      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
        throw new Error('Razorpay key not configured. Please check your environment variables.');
      }

      // Create subscription order - restaurantId is optional now
      const orderData = {
        planType: selectedPlan
      };
      
      // Only add restaurantId if it exists
      if (restaurantData?.data?._id) {
        orderData.restaurantId = restaurantData.data._id;
      }

      const orderResponse = await createSubscriptionOrder(orderData).unwrap();

      const { subscription, razorpayOrder } = orderResponse.data;

      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Zinr Restaurant Services',
        description: `Subscription for ${restaurantData?.data?.name || 'Restaurant Services'}`,
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Show payment verification loader
            setIsVerifyingPayment(true);
            
            // Verify payment with 5-second minimum display
            const startTime = Date.now();
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpayPaymentId,
              razorpaySignature: response.razorpay_signature,
              subscriptionId: subscription._id
            });
            
            // Ensure loader shows for at least 5 seconds
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < 5000) {
              await new Promise(resolve => setTimeout(resolve, 5000 - elapsedTime));
            }
            
            setShowPaymentModal(false);
            setIsVerifyingPayment(false);
            
            // Store subscription ID for future reference
            localStorage.setItem('user_subscription_id', subscription._id);
            
            // Update subscription context with real subscription data
            updateSubscriptionWithRealData(subscription);
            
            // Only refetch if the query is active (has restaurant ID)
            if (restaurantData?.data?._id) {
              refetchSubscription();
            }
            
            // Show success message
            showSuccess('Payment successful! Your subscription is now active. All premium features are unlocked! 🎉');
          } catch (error) {
            console.error('Payment verification failed:', error);
            setIsVerifyingPayment(false);
            showError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: restaurantData?.data?.name || 'Restaurant Owner',
          email: localStorage.getItem('userEmail') || '',
        },
        theme: {
          color: '#F59E0B'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error creating subscription order:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      console.error('Error message:', error?.message);
      console.error('Error status:', error?.status);
      console.error('Error data:', error?.data);
      
      // Provide specific error messages with proper error handling
      if (error?.message && error.message.includes('Razorpay key not configured')) {
        showError('Payment system not configured. Please contact support.');
      } else if (error?.status === 400) {
        showError(error?.data?.message || 'Invalid request. Please check your selection.');
      } else if (error?.status === 401) {
        showError('Authentication failed. Please login again.');
      } else if (error?.status === 500) {
        showError('Server error. Please try again later.');
      } else if (error?.data?.message) {
        showError(error.data.message);
      } else {
        showError('Failed to create subscription order. Please try again.');
      }
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await cancelSubscription(activeSubscription._id);
        
        // Update subscription context to remove subscription
        updateSubscriptionWithRealData({ status: 'cancelled' });
        
        // Only refetch if the query is active (has restaurant ID)
        if (restaurantData?.data?._id) {
          refetchSubscription();
        }
        
        showSuccess('Subscription cancelled successfully.');
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        showError('Failed to cancel subscription. Please try again.');
      }
    }
  };

  const getPlanIcon = (planType) => {
    const icons = {
      basic: <Star className="w-6 h-6" />,
      premium: <Crown className="w-6 h-6" />,
      enterprise: <Zap className="w-6 h-6" />
    };
    return icons[planType] || icons.basic;
  };

  const getPlanColor = (planType) => {
    const colors = {
      basic: 'border-blue-500 bg-blue-50',
      premium: 'border-yellow-500 bg-yellow-50',
      enterprise: 'border-purple-500 bg-purple-50'
    };
    return colors[planType] || colors.basic;
  };

  if (!plansData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscription Management</h1>
          <p className="text-gray-600">Choose a plan that fits your restaurant's needs</p>
          {!restaurantData?.data?._id && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>No restaurant yet?</strong> You can still subscribe to a plan and create your restaurant later!
              </p>
            </div>
          )}
        </motion.div>

                 {/* Current Subscription Status */}
         {activeSubscription && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-6 mb-6"
           >
             <div className="flex items-center justify-between">
               <div>
                 <div className="flex items-center gap-3 mb-3">
                   <Crown className="w-8 h-8 text-green-400" />
                   <h2 className="text-2xl font-bold text-green-400">
                     {activeSubscription.plan.name} Active
                   </h2>
                 </div>
                 <div className="flex items-center gap-6 text-sm text-gray-300">
                   <div className="flex items-center gap-2">
                     <Calendar className="w-4 h-4" />
                     <span>Started: {new Date(activeSubscription.startDate).toLocaleDateString()}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Calendar className="w-4 h-4" />
                     <span>Expires: {new Date(activeSubscription.endDate).toLocaleDateString()}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <DollarSign className="w-4 h-4" />
                     <span>₹{activeSubscription.amount}/month</span>
                   </div>
                 </div>
                 <div className="mt-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                   <p className="text-sm text-green-400 mb-2">
                     🎉 <strong>All premium features are now unlocked!</strong> You have full access to the dashboard.
                   </p>
                   <div className="grid grid-cols-2 gap-2 text-xs">
                     <div className="flex items-center gap-1">
                       <CheckCircle className="w-3 h-3 text-green-400" />
                       <span>Restaurant Management</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <CheckCircle className="w-3 h-3 text-green-400" />
                       <span>Menu Creation</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <CheckCircle className="w-3 h-3 text-green-400" />
                       <span>Order Processing</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <CheckCircle className="w-3 h-3 text-green-400" />
                       <span>Analytics Dashboard</span>
                     </div>
                   </div>
                 </div>
               </div>
               
               <div className="flex flex-col items-end gap-3">
                 <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                   activeSubscription.status === 'active' 
                     ? 'bg-green-500 text-white' 
                     : 'bg-yellow-500 text-white'
                 }`}>
                   {activeSubscription.status === 'active' ? '✅ Active' : '⏳ Pending'}
                 </span>
                 
                 {activeSubscription.status === 'active' && (
                   <button
                     onClick={handleCancelSubscription}
                     className="px-4 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                   >
                     Cancel Subscription
                   </button>
                 )}
               </div>
             </div>
           </motion.div>
         )}

        {/* Demo Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Demo Controls</h3>
              <p className="text-gray-300 text-sm">
                Test subscription functionality by activating or deactivating demo mode
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={activateDemoSubscription}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Activate Demo
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('zinr_subscription_status');
                  checkSubscriptionStatus();
                  showSuccess('Demo subscription deactivated! You now have limited access.');
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Deactivate Demo
              </button>
            </div>
          </div>
        </motion.div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {Object.entries(plansData.data).map(([planType, plan], index) => (
            <motion.div
              key={planType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 ${getPlanColor(planType)} relative`}
            >
              {planType === 'premium' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getPlanColor(planType)} mb-4`}>
                  {getPlanIcon(planType)}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-800 mb-1">
                  ₹{plan.price}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">{plan.duration} days</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

                             {activeSubscription?.status === 'active' ? (
                 <div className="space-y-2">
                   <button
                     disabled
                     className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                   >
                     Current Plan
                   </button>
                   <button
                     onClick={() => handlePlanSelect(planType)}
                     className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                       planType === 'premium'
                         ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                         : 'bg-gray-800 text-white hover:bg-gray-900'
                     }`}
                   >
                     Upgrade to {plan.name}
                   </button>
                 </div>
               ) : (
                <button
                  onClick={() => handlePlanSelect(planType)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    planType === 'premium'
                      ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  Choose Plan
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Demo Subscription Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Play className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-semibold text-blue-400">Demo Mode</h3>
          </div>
          <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
            Want to test all premium features? Activate demo subscription to unlock the full dashboard 
            experience without payment. Perfect for exploring the platform!
          </p>
          <button
            onClick={activateDemoSubscription}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            Activate Demo Subscription
          </button>
          <p className="text-xs text-gray-400 mt-3">
            This is for demonstration purposes only. In production, users would pay for subscriptions.
          </p>
        </motion.div>

        {/* Features Comparison */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Plan Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Feature</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Basic</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Premium</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Monthly Orders</td>
                  <td className="text-center py-3 px-4">100</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Menu Items</td>
                  <td className="text-center py-3 px-4">50</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">QR Code Generation</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Analytics Dashboard</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Support</td>
                  <td className="text-center py-3 px-4">Email</td>
                  <td className="text-center py-3 px-4">Priority</td>
                  <td className="text-center py-3 px-4">24/7</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Custom Branding</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Subscription
            </h3>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                You're about to subscribe to the <strong>{plansData.data[selectedPlan]?.name}</strong> plan.
              </p>
              <p className="text-gray-600 mb-4">
                Amount: <strong>₹{plansData.data[selectedPlan]?.price}</strong> per month
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    You'll be redirected to Razorpay for secure payment processing.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Verification Loader */}
      {isVerifyingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verifying Payment
              </h3>
              <p className="text-gray-600">
                Please wait while we verify your payment. This may take a few moments.
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  <strong>Don't close this window</strong> - Your payment is being processed securely.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
