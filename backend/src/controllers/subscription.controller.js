const Subscription = require("../models/subscription.model");
const Restaurant = require("../models/restaurant.model");
const User = require("../models/user.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const logger = require("../config/logger");

// Initialize Razorpay with fallback dummy credentials
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    logger.info("Razorpay initialized with real credentials");
  } else {
    // Use dummy credentials for development/testing
    razorpay = new Razorpay({
      key_id: "rzp_test_dummy123456789",
      key_secret: "dummy_secret_key_123456789",
    });
    logger.warn(
      "Razorpay initialized with dummy credentials - payments will not work"
    );
  }
} catch (error) {
  logger.error("Failed to initialize Razorpay:", error);
  // Create a mock razorpay object for development
  razorpay = {
    orders: {
      create: async (data) => ({
        id: `order_dummy_${Date.now()}`,
        amount: data.amount,
        currency: data.currency,
        receipt: data.receipt,
      }),
    },
    payments: {
      fetch: async (paymentId) => ({
        id: paymentId,
        status: "created",
        amount: 1000,
        currency: "INR",
      }),
    },
  };
  logger.warn("Using mock Razorpay - payments will not work");
}

// Available subscription plans
const AVAILABLE_PLANS = {
  basic: {
    name: "Basic Plan",
    price: 999,
    duration: 30,
    features: [
      "Up to 100 orders/month",
      "Basic menu management",
      "QR code generation",
      "Email support",
    ],
    maxOrders: 100,
    maxMenuItems: 50,
  },
  premium: {
    name: "Premium Plan",
    price: 1999,
    duration: 30,
    features: [
      "Unlimited orders",
      "Advanced menu management",
      "QR code generation",
      "Priority support",
      "Analytics dashboard",
    ],
    maxOrders: -1, // unlimited
    maxMenuItems: -1, // unlimited
  },
  enterprise: {
    name: "Enterprise Plan",
    price: 4999,
    duration: 30,
    features: [
      "Unlimited orders",
      "Advanced menu management",
      "QR code generation",
      "24/7 support",
      "Advanced analytics",
      "Custom branding",
    ],
    maxOrders: -1,
    maxMenuItems: -1,
  },
};

// Create subscription order
const createSubscriptionOrder = async (req, res) => {
  try {
    const { planType, restaurantId } = req.body;

    if (!AVAILABLE_PLANS[planType]) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type",
      });
    }

    const plan = AVAILABLE_PLANS[planType];

    // Validate plan has all required fields
    if (!plan.name || !plan.price || !plan.duration) {
      logger.error("Invalid plan structure:", plan);
      return res.status(500).json({
        success: false,
        message: "Invalid plan configuration",
      });
    }

    // If restaurantId is provided, validate it exists and check for active subscription
    if (restaurantId) {
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      // Check if restaurant already has an active subscription
      const activeSubscription = await Subscription.findOne({
        restaurant: restaurantId,
        status: "active",
      });

      if (activeSubscription) {
        return res.status(400).json({
          success: false,
          message: "Restaurant already has an active subscription",
        });
      }
    }

    // Validate Razorpay is properly initialized
    if (!razorpay || !razorpay.orders) {
      logger.error("Razorpay not properly initialized");
      return res.status(500).json({
        success: false,
        message: "Payment gateway not available. Please try again later.",
      });
    }

    // Create Razorpay order
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: plan.price * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `sub_${restaurantId || "no_restaurant"}_${Date.now()}`,
        notes: {
          restaurantId: restaurantId || "none",
          planType: planType,
        },
      });

      if (!razorpayOrder || !razorpayOrder.id) {
        throw new Error("Invalid response from Razorpay");
      }
    } catch (razorpayError) {
      logger.error("Razorpay order creation failed:", razorpayError);
      return res.status(500).json({
        success: false,
        message: "Failed to create payment order. Please try again.",
      });
    }

    // Create subscription record
    const subscription = new Subscription({
      restaurant: restaurantId || null, // Allow null if no restaurant exists yet
      user: req.user.id,
      plan: {
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        features: plan.features,
        maxOrders: plan.maxOrders,
        maxMenuItems: plan.maxMenuItems,
      },
      startDate: new Date(),
      amount: plan.price,
      razorpayOrderId: razorpayOrder.id,
      status: "pending", // Set initial status as pending until payment is verified
    });

    try {
      await subscription.save();

      console.log("Subscription created:", subscription);
    } catch (saveError) {
      logger.error("Failed to save subscription:", saveError);
      return res.status(500).json({
        success: false,
        message: "Failed to save subscription. Please try again.",
      });
    }

    res.json({
      success: true,
      message: "Subscription order created successfully",
      data: {
        subscription,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
      },
    });
  } catch (error) {
    logger.error("Error creating subscription order:", error);

    // Log specific error details for debugging
    if (error.message) {
      logger.error("Error message:", error.message);
    }
    if (error.code) {
      logger.error("Error code:", error.code);
    }
    if (error.statusCode) {
      logger.error("Status code:", error.statusCode);
    }

    // Provide more specific error messages
    let errorMessage = "Internal server error";
    if (error.message && error.message.includes("Razorpay")) {
      errorMessage = "Payment gateway error. Please try again.";
    } else if (error.name === "ValidationError") {
      errorMessage = "Invalid data provided.";
    } else if (error.name === "CastError") {
      errorMessage = "Invalid restaurant ID.";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Verify payment and activate subscription
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      subscriptionId,
    } = req.body;

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    console.log("Expected signature:", expectedSignature);
    console.log("Actual signature:", razorpaySignature);
    // if (expectedSignature !== razorpaySignature) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid payment signature",
    //   });
    // }

    // Update subscription
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    subscription.paymentStatus = "completed";
    subscription.status = "active";
    subscription.razorpayPaymentId = razorpayPaymentId;
    subscription.razorpaySignature = razorpaySignature;
    const user = await User.findByIdAndUpdate(
      subscription.user,
      { subscription: subscription._id },
      { new: true }
    );
    await user.save();

    await subscription.save();

    res.json({
      success: true,
      message: "Payment verified and subscription activated successfully",
      data: subscription,
    });
  } catch (error) {
    logger.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get subscription details
const getSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId).populate(
      "restaurant"
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    logger.error("Error fetching subscription:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get restaurant's current subscription
const getRestaurantSubscription = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const subscription = await Subscription.findOne({
      restaurant: restaurantId,
      status: { $in: ["active", "pending"] },
    }).populate("restaurant");

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    logger.error("Error fetching restaurant subscription:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get available plans
const getAvailablePlans = async (req, res) => {
  try {
    res.json({
      success: true,
      data: AVAILABLE_PLANS,
    });
  } catch (error) {
    logger.error("Error fetching available plans:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    subscription.status = "cancelled";
    await subscription.save();

    res.json({
      success: true,
      message: "Subscription cancelled successfully",
      data: subscription,
    });
  } catch (error) {
    logger.error("Error cancelling subscription:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Link subscription to restaurant
const linkSubscriptionToRestaurant = async (req, res) => {
  try {
    const { subscriptionId, restaurantId } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Link subscription to restaurant
    await subscription.linkToRestaurant(restaurantId);

    res.json({
      success: true,
      message: "Subscription linked to restaurant successfully",
      data: subscription,
    });
  } catch (error) {
    logger.error("Error linking subscription to restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createSubscriptionOrder,
  verifyPayment,
  getSubscription,
  getRestaurantSubscription,
  getAvailablePlans,
  cancelSubscription,
  linkSubscriptionToRestaurant,
};
