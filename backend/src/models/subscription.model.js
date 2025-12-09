const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: false, // Made optional so users can subscribe before creating restaurant
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      duration: { type: Number, required: true }, // in days
      features: [String],
      maxOrders: Number,
      maxMenuItems: Number,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "pending",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false }, // Made optional as it's calculated
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    autoRenew: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Calculate end date based on start date and duration
subscriptionSchema.pre("save", function (next) {
  try {
    if (this.startDate && this.plan && this.plan.duration && !this.endDate) {
      this.endDate = new Date(
        this.startDate.getTime() + this.plan.duration * 24 * 60 * 60 * 1000
      );
    }
  } catch (error) {
    console.error("Error calculating end date:", error);
  }
  next();
});

// Check if subscription is active
subscriptionSchema.methods.isActive = function () {
  const now = new Date();
  return (
    this.status === "active" && now >= this.startDate && now <= this.endDate
  );
};

// Check if subscription is expiring soon (within 7 days)
subscriptionSchema.methods.isExpiringSoon = function () {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return this.status === "active" && this.endDate <= sevenDaysFromNow;
};

// Link subscription to restaurant
subscriptionSchema.methods.linkToRestaurant = function (restaurantId) {
  this.restaurant = restaurantId;
  return this.save();
};

module.exports = mongoose.model("Subscription", subscriptionSchema);
