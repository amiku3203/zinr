import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCreateOrderMutation } from '../store/features/orders/orderApi';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '../utils/toast';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  DollarSign
} from 'lucide-react';
import SEO from '../components/SEO';

const CustomerOrder = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    tableNumber: '',
    notes: '',
    paymentMethod: 'cash'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [createOrder] = useCreateOrderMutation();

  useEffect(() => {
    fetchRestaurantData();
    loadRazorpayScript();
  }, [restaurantId]);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchRestaurantData = async () => {
    try {
      console.log('Fetching restaurant data for ID:', restaurantId);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${apiUrl}/restaurants/public/${restaurantId}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Restaurant data fetched successfully:', data.data);
        setRestaurant(data.data);
        setCategories(data.data.categories || []);
      } else {
        console.error('Failed to fetch restaurant:', data.message);
        setRestaurant(null);
        setCategories([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      setRestaurant(null);
      setCategories([]);
      setIsLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handlePayment = async (orderData, paymentOrder) => {
    const options = {
      key: paymentOrder.paymentKey,
      amount: paymentOrder.paymentOrder.amount,
      currency: paymentOrder.paymentOrder.currency,
      name: restaurant.name,
      description: `Order #${orderData.orderNumber}`,
      order_id: paymentOrder.paymentOrder.id,
      handler: async (response) => {
        try {
          setIsProcessingPayment(true);
          
          // Verify payment with backend
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
          const verifyResponse = await fetch(`${apiUrl}/orders/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: orderData._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          
          if (verifyData.success) {
            showSuccess('Payment successful! Your order has been confirmed.');
            setPlacedOrder(verifyData.order);
            setOrderPlaced(true);
            setCart([]);
            setShowOrderForm(false);
            setShowCart(false);
          } else {
            showError('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          showError('Payment verification failed. Please contact support.');
        } finally {
          setIsProcessingPayment(false);
        }
      },
      prefill: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        contact: orderData.customer.phone,
      },
      theme: {
        color: '#F59E0B',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check if restaurant has payment gateway configured
      if (!restaurant.razorpay || !restaurant.razorpay.isConnected) {
        showError('Restaurant payment gateway not configured. Please contact restaurant owner.');
        return;
      }

      setIsProcessingPayment(true);
      
      const orderData = {
        restaurantId,
        customer: {
          name: orderForm.name,
          phone: orderForm.phone,
          email: orderForm.email
        },
        items: cart.map(item => ({
          menuItem: item._id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || ''
        })),
        tableNumber: orderForm.tableNumber,
        notes: orderForm.notes,
        paymentMethod: 'razorpay' // Force Razorpay payment
      };

      const response = await createOrder(orderData).unwrap();
      
      // Always handle Razorpay payment since it's required
      await handlePayment(response.order, response);
      
    } catch (error) {
      console.error('Error placing order:', error);
      showError(error?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-600 mb-4">
            The restaurant you're looking for doesn't exist or the QR code link is invalid.
          </p>
          <p className="text-sm text-gray-500">
            Please check the QR code or contact the restaurant directly.
          </p>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-mono">
              URL: /menu/{restaurantId}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">
            Your order has been received and is being prepared.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-lg font-bold text-gray-800">#{placedOrder.orderNumber}</p>
            <p className="text-sm text-gray-600 mt-2">Queue Number</p>
            <p className="text-lg font-bold text-blue-600">#{placedOrder.queueNumber}</p>
          </div>
          
          <div className="text-left space-y-2 mb-6">
            <p className="text-sm text-gray-600">
              <strong>Total Amount:</strong> ₹{placedOrder.totalAmount}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong> 
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                Pending
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <strong>Payment:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                placedOrder.paymentStatus === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {placedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </p>
          </div>
          
          <p className="text-sm text-gray-500">
            We'll notify you when your order is ready!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={restaurant ? `${restaurant.name} - Digital Menu` : 'Restaurant Menu'}
        description={restaurant ? `Order delicious food online from ${restaurant.name}. Browse our digital menu, place orders, and pay securely.` : 'Restaurant digital menu and online ordering'}
        keywords={[
          "digital menu",
          "online food ordering",
          "restaurant menu",
          "food delivery",
          "online restaurant",
          "QR code menu"
        ]}
        image={restaurant?.image || "https://zinr.com/restaurant-menu.jpg"}
        url={window.location.href}
        type="website"
        structuredData={getMenuStructuredData()}
      />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{restaurant?.name}</h1>
              {restaurant?.address && (
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  {restaurant.address}
                </p>
              )}
              {/* Payment Gateway Status */}
              <div className="mt-2">
                {restaurant?.razorpay?.isConnected ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Online payments accepted</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Payment gateway not configured</span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-yellow-400 text-white p-3 rounded-full hover:bg-yellow-500 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-yellow-400 p-4">
                <h2 className="text-xl font-bold text-white">{category.name}</h2>
              </div>
              
              <div className="p-4 space-y-4">
                {category.items?.map((item) => (
                  <div key={item._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-gray-800">₹{item.price}</p>
                        <button
                          onClick={() => addToCart(item)}
                          className="mt-2 bg-yellow-400 text-white p-2 rounded-full hover:bg-yellow-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Your Order</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-4">
                      {cart.map((item) => (
                        <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-600">₹{item.price}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="bg-yellow-400 text-white p-1 rounded-full hover:bg-yellow-500"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-yellow-600">₹{getCartTotal()}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowCart(false);
                          setShowOrderForm(true);
                        }}
                        className="w-full bg-yellow-400 text-white py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                      >
                        Proceed to Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Order</h2>
              
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.name}
                    onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={orderForm.email}
                    onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderForm.tableNumber}
                    onChange={(e) => setOrderForm({ ...orderForm, tableNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter table number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={orderForm.paymentMethod === 'razorpay'}
                        onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                        className="mr-2"
                        disabled
                      />
                      <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-blue-800 font-medium">Online Payment (Required)</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment is required to place your order. You'll be redirected to a secure payment gateway.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Any special requests or dietary restrictions?"
                    rows="3"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className={`flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isProcessingPayment 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'hover:bg-yellow-600'
                    }`}
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pay & Place Order
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default CustomerOrder;
