import React, { useState, useEffect } from "react";
import {
  useGetAvailablePlansQuery,
  useCreateSubscriptionOrderMutation,
  useVerifyPaymentMutation,
  useGetRestaurantSubscriptionQuery,
  useGetSubscriptionByIdQuery,
  useCancelSubscriptionMutation,
} from "../../store/features/subscription/subscriptionApi";
import { useGetMyRestaurantQuery } from "../../store/features/restorent/restoApi";
import { useSubscription } from "../../context/SubscriptionContext";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { showSuccess, showError, showInfo } from "../../utils/toast";
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
  Play,
} from "lucide-react";

const SubscriptionManagement = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const { checkSubscriptionStatus, updateSubscriptionWithRealData } =
    useSubscription();
  const { refetchUser } = useAuth();

  const { data: restaurantData } = useGetMyRestaurantQuery();
  console.log("restaurant data", restaurantData);
  const { data: plansData } = useGetAvailablePlansQuery();

  // Get subscription data - either from restaurant or user directly
  const { data: subscriptionData, refetch: refetchSubscription } =
    useGetRestaurantSubscriptionQuery(restaurantData?.data?._id, {
      skip: !restaurantData?.data?._id,
    });

  // Get user's active subscription regardless of restaurant
  const { data: userSubscriptionData } = useGetSubscriptionByIdQuery(
    localStorage.getItem("user_subscription_id"),
    { skip: !localStorage.getItem("user_subscription_id") }
  );

  // Use either restaurant subscription or user subscription
  const activeSubscription =
    subscriptionData?.data || userSubscriptionData?.data;

  // Update subscription context when subscription data changes
  useEffect(() => {
    if (activeSubscription && activeSubscription.status === "active") {
      updateSubscriptionWithRealData(activeSubscription);
    }
  }, [activeSubscription, updateSubscriptionWithRealData]);

  const [createSubscriptionOrder] = useCreateSubscriptionOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();

  // Demo subscription activation
  const activateDemoSubscription = () => {
    localStorage.setItem("zinr_subscription_status", "active");
    checkSubscriptionStatus();
    showSuccess(
      "Demo subscription activated! You now have access to all premium features."
    );
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
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
      showError("Payment system not configured. Please contact support.");
      return;
    }

    setSelectedPlan(planType);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    try {
      // Validate Razorpay key is available
      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
        throw new Error(
          "Razorpay key not configured. Please check your environment variables."
        );
      }

      // Create subscription order - restaurantId is optional now
      const orderData = {
        planType: selectedPlan,
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
        name: "Zinr Restaurant Services",
        description: `Subscription for ${
          restaurantData?.data?.name || "Restaurant Services"
        }`,
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
              subscriptionId: subscription._id,
            });

            // Ensure loader shows for at least 5 seconds
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < 5000) {
              await new Promise((resolve) =>
                setTimeout(resolve, 5000 - elapsedTime)
              );
            }

            setShowPaymentModal(false);
            setIsVerifyingPayment(false);

            // Store subscription ID for future reference
            localStorage.setItem("user_subscription_id", subscription._id);

            // Update subscription context with real subscription data
            updateSubscriptionWithRealData(subscription);

            // Refetch user data to get updated subscription details
            await refetchUser();

            // Only refetch if the query is active (has restaurant ID)
            if (restaurantData?.data?._id) {
              refetchSubscription();
            }

            // Show success message
            showSuccess(
              "Payment successful! Your subscription is now active. All premium features are unlocked! 🎉"
            );
          } catch (error) {
            console.error("Payment verification failed:", error);
            setIsVerifyingPayment(false);
            showError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: restaurantData?.data?.name || "Restaurant Owner",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#F59E0B",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error creating subscription order:", error);
      console.error("Error type:", typeof error);
      console.error("Error keys:", Object.keys(error || {}));
      console.error("Error message:", error?.message);
      console.error("Error status:", error?.status);
      console.error("Error data:", error?.data);

      // Provide specific error messages with proper error handling
      if (
        error?.message &&
        error.message.includes("Razorpay key not configured")
      ) {
        showError("Payment system not configured. Please contact support.");
      } else if (error?.status === 400) {
        showError(
          error?.data?.message ||
            "Invalid request. Please check your selection."
        );
      } else if (error?.status === 401) {
        showError("Authentication failed. Please login again.");
      } else if (error?.status === 500) {
        showError("Server error. Please try again later.");
      } else if (error?.data?.message) {
        showError(error.data.message);
      } else {
        showError("Failed to create subscription order. Please try again.");
      }
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      try {
        await cancelSubscription(activeSubscription._id);

        // Update subscription context to remove subscription
        updateSubscriptionWithRealData({ status: "cancelled" });

        // Refetch user data to get updated subscription details
        await refetchUser();

        // Only refetch if the query is active (has restaurant ID)
        if (restaurantData?.data?._id) {
          refetchSubscription();
        }

        showSuccess("Subscription cancelled successfully.");
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        showError("Failed to cancel subscription. Please try again.");
      }
    }
  };

  const getPlanIcon = (planType) => {
    const icons = {
      basic: <Star className="w-6 h-6" />,
      premium: <Crown className="w-6 h-6" />,
      enterprise: <Zap className="w-6 h-6" />,
    };
    return icons[planType] || icons.basic;
  };

  const getPlanColor = (planType) => {
    const colors = {
      basic: "border-blue-500 bg-blue-50",
      premium: "border-yellow-500 bg-yellow-50",
      enterprise: "border-purple-500 bg-purple-50",
    };
    return colors[planType] || colors.basic;
  };

  if (!plansData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg font-medium text-gray-300">
            Loading subscription plans...
          </p>
          <div className="mt-4 w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Subscription Management
            </h1>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4"></div>
          <p className="text-gray-300 text-lg">
            Choose a plan that fits your restaurant's needs
          </p>
          {!restaurantData?.data?._id && (
            <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-300">
                  <strong>No restaurant yet?</strong> You can still subscribe to
                  a plan and create your restaurant later!
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Current Subscription Status */}
        {activeSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border border-green-500/30 rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <Crown className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-green-400">
                    {activeSubscription.plan.name} Active
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                  <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span>
                      Started:{" "}
                      {new Date(
                        activeSubscription.startDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span>
                      Expires:{" "}
                      {new Date(
                        activeSubscription.endDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-2 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span>₹{activeSubscription.amount}/month</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-gray-600/30 rounded-xl p-4">
                  <p className="text-sm text-green-400 mb-3 font-semibold">
                    🎉 <strong>All premium features are now unlocked!</strong>{" "}
                    You have full access to the dashboard.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">
                        Restaurant Management
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Menu Creation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Order Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Analytics Dashboard</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span
                  className={`px-6 py-3 rounded-xl text-sm font-bold shadow-lg ${
                    activeSubscription.status === "active"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
                  }`}
                >
                  {activeSubscription.status === "active"
                    ? "✅ Active"
                    : "⏳ Pending"}
                </span>

                {activeSubscription.status === "active" && (
                  <button
                    onClick={handleCancelSubscription}
                    className="px-6 py-3 border-2 border-red-400/50 text-red-400 rounded-xl hover:bg-red-500/20 transition-all duration-300 font-semibold shadow-lg"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Demo Controls */}
        {!activeSubscription&&<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <Play className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400">
                  Demo Controls
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                Test subscription functionality by activating or deactivating
                demo mode
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={activateDemoSubscription}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Play className="w-4 h-4" />
                Activate Demo
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("zinr_subscription_status");
                  checkSubscriptionStatus();
                  showSuccess(
                    "Demo subscription deactivated! You now have limited access."
                  );
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <XCircle className="w-4 h-4" />
                Deactivate Demo
              </button>
            </div>
          </div>
        </motion.div>
}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(plansData.data).map(([planType, plan], index) => (
            <motion.div
              key={planType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-2 ${
                planType === "basic"
                  ? "border-blue-500/50"
                  : planType === "premium"
                  ? "border-yellow-500/50"
                  : "border-purple-500/50"
              } rounded-2xl shadow-xl p-6 relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
            >
              {planType === "premium" && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                    planType === "basic"
                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30"
                      : planType === "premium"
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                      : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                  }`}
                >
                  <div
                    className={`${
                      planType === "basic"
                        ? "text-blue-400"
                        : planType === "premium"
                        ? "text-yellow-400"
                        : "text-purple-400"
                    }`}
                  >
                    {getPlanIcon(planType)}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {plan.name}
                </h3>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                  ₹{plan.price}
                </div>
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold">per month</span> •{" "}
                  {plan.duration} days
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {activeSubscription?.status === "active" ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-gray-700/50 text-gray-500 rounded-xl cursor-not-allowed font-semibold border border-gray-600/30"
                  >
                    Current Plan
                  </button>
                  <button
                    onClick={() => handlePlanSelect(planType)}
                    className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                      planType === "premium"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                        : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white"
                    }`}
                  >
                    Upgrade to {plan.name}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handlePlanSelect(planType)}
                  className={`w-full px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    planType === "premium"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                      : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white"
                  }`}
                >
                  Choose Plan
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Demo Subscription Button */}
       {!activeSubscription && <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl shadow-xl p-8 text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl">
              <Play className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-blue-400">Demo Mode</h3>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300 mb-6 max-w-3xl mx-auto text-lg leading-relaxed">
            Want to test all premium features? Activate demo subscription to
            unlock the full dashboard experience without payment. Perfect for
            exploring the platform!
          </p>
          <button
            onClick={activateDemoSubscription}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Play className="w-6 h-6" />
            Activate Demo Subscription
          </button>
          <p className="text-xs text-gray-400 mt-4">
            This is for demonstration purposes only. In production, users would
            pay for subscriptions.
          </p>
        </motion.div>
}
        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Plan Comparison</h3>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6"></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-4 px-4 font-semibold text-gray-300">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-blue-400">
                    Basic
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-yellow-400">
                    Premium
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-purple-400">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700/30">
                  <td className="py-4 px-4 text-gray-300">Monthly Orders</td>
                  <td className="text-center py-4 px-4 text-white font-medium">
                    100
                  </td>
                  <td className="text-center py-4 px-4 text-white font-medium">
                    Unlimited
                  </td>
                  <td className="text-center py-4 px-4 text-white font-medium">
                    Unlimited
                  </td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-4 px-4 text-gray-300">Menu Items</td>
                  <td className="text-center py-4 px-4 text-white font-medium">
                    50
                  </td>
                  <td className="text-center py-4 px-4 text-white font-medium">
                    Unlimited
                  </td>
                  <td className="text-center py-4 px-4 text-white font-medium">
                    Unlimited
                  </td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-4 px-4 text-gray-300">
                    QR Code Generation
                  </td>
                  <td className="text-center py-4 px-4 text-green-400">✓</td>
                  <td className="text-center py-4 px-4 text-green-400">✓</td>
                  <td className="text-center py-4 px-4 text-green-400">✓</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-4 px-4 text-gray-300">
                    Analytics Dashboard
                  </td>
                  <td className="text-center py-4 px-4 text-red-400">✗</td>
                  <td className="text-center py-4 px-4 text-green-400">✓</td>
                  <td className="text-center py-4 px-4 text-green-400">✓</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-4 px-4 text-gray-300">Support</td>
                  <td className="text-center py-4 px-4 text-white font-medium">
                    Email
                  </td>
                  <td className="text-center py-4 px-4 text-white font-medium">
                    Priority
                  </td>
                  <td className="text-center py-4 px-4 text-white font-medium">
                    24/7
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Custom Branding</td>
                  <td className="text-center py-4 px-4 text-red-400">✗</td>
                  <td className="text-center py-4 px-4 text-red-400">✗</td>
                  <td className="text-center py-4 px-4 text-green-400">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <CreditCard className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Confirm Subscription
              </h3>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6"></div>

            <div className="mb-6">
              <p className="text-gray-300 mb-3">
                You're about to subscribe to the{" "}
                <strong className="text-yellow-400">
                  {plansData.data[selectedPlan]?.name}
                </strong>{" "}
                plan.
              </p>
              <p className="text-gray-300 mb-4">
                Amount:{" "}
                <strong className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  ₹{plansData.data[selectedPlan]?.price}
                </strong>{" "}
                per month
              </p>

              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-300">
                    You'll be redirected to Razorpay for secure payment
                    processing.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all duration-300 font-bold shadow-lg"
              >
                Proceed to Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Verification Loader */}
      {isVerifyingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
          >
            <div className="mb-6">
              <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Verifying Payment
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300">
                Please wait while we verify your payment. This may take a few
                moments.
              </p>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-yellow-400" />
                <p className="text-sm text-yellow-300 text-left">
                  <strong>Don't close this window</strong> - Your payment is
                  being processed securely.
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
