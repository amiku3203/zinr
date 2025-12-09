import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCreateOrderMutation } from "../store/features/orders/orderApi";
import { motion, AnimatePresence } from "framer-motion";
import { showSuccess, showError } from "../utils/toast";
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
  DollarSign,
  ChevronRight,
  UtensilsCrossed,
  Star,
  Hash,
  Search,
  Filter,
  Sparkles,
} from "lucide-react";
import SEO from "../components/SEO";

const CustomerOrder = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    email: "",
    tableNumber: "",
    notes: "",
    paymentMethod: "cash",
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
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchRestaurantData = async () => {
    try {
      console.log("Fetching restaurant data for ID:", restaurantId);
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(
        `${apiUrl}/restaurants/public/${restaurantId}`
      );
      const data = await response.json();

      if (data.success) {
        console.log("Restaurant data fetched successfully:", data.data);
        // Map the API response correctly
        const restaurantData = data.data;
        setRestaurant(restaurantData);
        // Categories are already populated in the response
        setCategories(restaurantData.categories || []);
      } else {
        console.error("Failed to fetch restaurant:", data.message);
        setRestaurant(null);
        setCategories([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      setRestaurant(null);
      setCategories([]);
      setIsLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        return prevCart.map((cartItem) =>
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
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getItemQuantityInCart = (itemId) => {
    const cartItem = cart.find((item) => item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const filteredCategories =
    selectedCategory === "all"
      ? categories.filter(
          (category) => category.items && category.items.length > 0
        )
      : categories.filter(
          (category) =>
            category._id === selectedCategory &&
            category.items &&
            category.items.length > 0
        );

  const getMenuStructuredData = () => {
    if (!restaurant) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: restaurant.name,
      address: restaurant.address,
      telephone: restaurant.phone,
      menu: {
        "@type": "Menu",
        hasMenuSection: categories.map((category) => ({
          "@type": "MenuSection",
          name: category.name,
          description: category.description,
          hasMenuItem:
            category.items?.map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              description: item.description,
              offers: {
                "@type": "Offer",
                price: item.price,
                priceCurrency: "INR",
              },
            })) || [],
        })),
      },
    };
  };

  const handlePayment = async (orderData, paymentOrder) => {
    const options = {
      key: restaurant.razorpay?.keyId || paymentOrder.paymentKey,
      amount: paymentOrder.paymentOrder.amount,
      currency: paymentOrder.paymentOrder.currency,
      name: restaurant.name,
      description: `Order #${orderData.orderNumber}`,
      order_id: paymentOrder.paymentOrder.id,
      handler: async (response) => {
        try {
          setIsProcessingPayment(true);

          // Verify payment with backend
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
          const verifyResponse = await fetch(
            `${apiUrl}/orders/verify-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: orderData._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            }
          );

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok && verifyData.order) {
            showSuccess("Payment successful! Your order has been confirmed.");
            setPlacedOrder(verifyData.order);
            setOrderPlaced(true);
            setCart([]);
            setShowOrderForm(false);
            setShowCart(false);
          } else {
            showError("Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          showError("Payment verification failed. Please contact support.");
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
        color: "#F59E0B",
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
        showError(
          "Restaurant payment gateway not configured. Please contact restaurant owner."
        );
        return;
      }

      setIsProcessingPayment(true);

      const orderData = {
        restaurantId,
        customer: {
          name: orderForm.name,
          phone: orderForm.phone,
          email: orderForm.email,
        },
        items: cart.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || "",
        })),
        tableNumber: orderForm.tableNumber,
        notes: orderForm.notes,
        paymentMethod: "razorpay", // Force Razorpay payment
      };

      const response = await createOrder(orderData).unwrap();

      // Always handle Razorpay payment since it's required
      await handlePayment(response.order, response);
    } catch (error) {
      console.error("Error placing order:", error);
      showError(
        error?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg font-medium text-gray-300">Loading menu...</p>
          <div className="mt-4 w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Restaurant Not Found
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-300 mb-4 leading-relaxed">
            The restaurant you're looking for doesn't exist or the QR code link
            is invalid.
          </p>
          <p className="text-sm text-gray-400">
            Please check the QR code or contact the restaurant directly.
          </p>
          <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Order Placed Successfully!
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Your order has been received and is being prepared.
          </p>

          <div className="bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-gray-600/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Hash className="w-5 h-5 text-yellow-400" />
              <p className="text-sm font-medium text-gray-400">Order Number</p>
            </div>
            <p className="text-2xl font-bold text-white mb-6">
              #{placedOrder.orderNumber}
            </p>

            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <p className="text-sm font-medium text-gray-400">Queue Number</p>
            </div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              #{placedOrder.queueNumber}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-sm font-medium text-gray-300">
                Total Amount
              </span>
              <span className="text-lg font-bold text-yellow-400">
                ₹{placedOrder.totalAmount}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-sm font-medium text-gray-300">Status</span>
              <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-semibold">
                Pending
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-sm font-medium text-gray-300">Payment</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  placedOrder.paymentStatus === "paid"
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400"
                }`}
              >
                {placedOrder.paymentStatus === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <p className="text-sm">
              We'll notify you when your order is ready!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={
          restaurant ? `${restaurant.name} - Digital Menu` : "Restaurant Menu"
        }
        description={
          restaurant
            ? `Order delicious food online from ${restaurant.name}. Browse our digital menu, place orders, and pay securely.`
            : "Restaurant digital menu and online ordering"
        }
        keywords={[
          "digital menu",
          "online food ordering",
          "restaurant menu",
          "food delivery",
          "online restaurant",
          "QR code menu",
        ]}
        image={restaurant?.image || "https://zinr.com/restaurant-menu.jpg"}
        url={window.location.href}
        type="website"
        structuredData={getMenuStructuredData()}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700/50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                    <UtensilsCrossed className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">
                    {restaurant?.name}
                  </h1>
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4"></div>
                {restaurant?.address && (
                  <p className="text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {restaurant.address}
                  </p>
                )}
                {/* Payment Gateway Status */}
                <div className="mt-3">
                  {restaurant?.razorpay?.isConnected ? (
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Online payments accepted</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>Payment gateway not configured</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <ShoppingCart className="w-6 h-6" />
                {getCartItemCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-gray-900 shadow-lg"
                  >
                    {getCartItemCount()}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Section Header with Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-3">
                Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Menu
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto md:mx-0 mb-4"></div>
              <p className="text-gray-300">
                Browse our delicious menu and add items to your cart
              </p>
            </div>

            {/* Category Filter - Right Side */}
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-xl p-3 flex items-center gap-3 shadow-xl min-w-[280px]">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <Filter className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-gray-300 font-medium text-sm whitespace-nowrap">
                    Category:
                  </span>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700/80 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 cursor-pointer font-medium text-sm outline-none"
                >
                  <option value="all" className="bg-gray-800 text-white">
                    All Categories
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                      className="bg-gray-800 text-white"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, categoryIndex) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <UtensilsCrossed className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {category.name}
                    </h2>
                  </div>
                  {category.description && (
                    <p className="text-white/90 text-sm mt-2">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {category.items?.map((item, itemIndex) => {
                    const quantityInCart = getItemQuantityInCart(item._id);
                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: categoryIndex * 0.1 + itemIndex * 0.05,
                        }}
                        className="border-b border-gray-700/30 pb-4 last:border-b-0 hover:bg-gray-700/20 p-3 rounded-xl transition-all duration-300"
                      >
                        {/* Item Image */}
                        {item.image && (
                          <div className="mb-3 relative overflow-hidden rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-40 object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/400x300/1f2937/fbbf24?text=No+Image";
                              }}
                            />
                            {!item.isAvailable && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  Unavailable
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <h3 className="font-semibold text-white text-lg">
                                {item.name}
                              </h3>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                            {item.isAvailable ? (
                              <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span className="text-xs text-green-400 font-medium">
                                  Available
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                                <X className="w-3 h-3 text-red-400" />
                                <span className="text-xs text-red-400 font-medium">
                                  Unavailable
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-bold text-yellow-400 text-xl mb-3">
                              ₹{item.price}
                            </p>
                            {item.isAvailable &&
                              (quantityInCart > 0 ? (
                                <div className="flex items-center gap-2 bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-gray-600/30 rounded-lg p-2">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item._id,
                                        quantityInCart - 1
                                      )
                                    }
                                    className="bg-gray-600/50 hover:bg-gray-500/50 text-white p-1.5 rounded-lg transition-all duration-300"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-bold text-white text-lg">
                                    {quantityInCart}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item._id,
                                        quantityInCart + 1
                                      )
                                    }
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-1.5 rounded-lg transition-all duration-300 shadow-lg"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(item)}
                                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                  <Plus className="w-5 h-5" />
                                  <span className="font-semibold">Add</span>
                                </button>
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <AnimatePresence>
          {showCart && (
            <div className="fixed inset-0 bg-opacity-50 z-50 backdrop-blur-sm">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border-l border-gray-700/50"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        Your Order
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowCart(false)}
                      className="text-gray-400 hover:text-white p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShoppingCart className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg">
                          Your cart is empty
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Add some delicious items!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex-1 overflow-y-auto space-y-3 mb-6"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#4B5563 transparent",
                        }}
                      >
                        {cart.map((item, index) => (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-gray-600/30 rounded-xl hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">
                                {item.name}
                              </h3>
                              <p className="text-sm text-yellow-400 mt-1">
                                ₹{item.price}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Subtotal: ₹
                                {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity - 1)
                                }
                                className="bg-gray-600/50 hover:bg-gray-500/50 text-white p-2 rounded-lg transition-all duration-300"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-10 text-center font-bold text-white text-lg">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity + 1)
                                }
                                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-2 rounded-lg transition-all duration-300 shadow-lg"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="border-t border-gray-700/50 pt-6">
                        <div className="bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-gray-600/30 rounded-xl p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">
                              Items ({getCartItemCount()})
                            </span>
                            <span className="text-white font-medium">
                              ₹{getCartTotal()}
                            </span>
                          </div>
                          <div className="border-t border-gray-600/30 my-3"></div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-white">
                              Total:
                            </span>
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                              ₹{getCartTotal()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setShowCart(false);
                            setShowOrderForm(true);
                          }}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                          <span>Proceed to Order</span>
                          <ChevronRight className="w-5 h-5" />
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
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#4B5563 transparent",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <CreditCard className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    Complete Your Order
                  </h2>
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6"></div>

                <form onSubmit={handleOrderSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderForm.name}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        type="tel"
                        required
                        value={orderForm.phone}
                        onChange={(e) =>
                          setOrderForm({ ...orderForm, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Email (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        type="email"
                        value={orderForm.email}
                        onChange={(e) =>
                          setOrderForm({ ...orderForm, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Table Number (Optional)
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        type="text"
                        value={orderForm.tableNumber}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            tableNumber: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                        placeholder="Enter table number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Payment Method *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 p-4 rounded-xl cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={orderForm.paymentMethod === "razorpay"}
                          onChange={(e) =>
                            setOrderForm({
                              ...orderForm,
                              paymentMethod: e.target.value,
                            })
                          }
                          className="mr-3"
                          disabled
                        />
                        <CreditCard className="w-5 h-5 mr-2 text-blue-400" />
                        <span className="text-blue-300 font-semibold">
                          Online Payment (Required)
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Payment is required to place your order. You'll be
                        redirected to a secure payment gateway.
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={orderForm.notes}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, notes: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                      placeholder="Any special requests or dietary restrictions?"
                      rows="3"
                    />
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-gray-600/30 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          Items ({getCartItemCount()})
                        </span>
                        <span className="text-white font-medium">
                          ₹{getCartTotal()}
                        </span>
                      </div>
                      <div className="border-t border-gray-600/30 my-2"></div>
                      <div className="flex justify-between">
                        <span className="text-white font-semibold">Total</span>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                          ₹{getCartTotal()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      className="flex-1 px-4 py-3 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className={`flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                        isProcessingPayment
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl transform hover:-translate-y-0.5"
                      }`}
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
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
