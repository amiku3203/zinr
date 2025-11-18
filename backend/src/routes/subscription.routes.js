const express = require("express");
const subscriptionController = require("../controllers/subscription.controller");
const { protect } = require("../middlewares/auth.middleware");
const router = express.Router();

// Public routes
router.get("/plans", subscriptionController.getAvailablePlans);

// Protected routes (for restaurant owners)
router.post(
  "/create-order",
  protect,
  subscriptionController.createSubscriptionOrder
);
router.post("/verify-payment", protect, subscriptionController.verifyPayment);
router.post(
  "/link-restaurant",
  protect,
  subscriptionController.linkSubscriptionToRestaurant
);
router.get(
  "/restaurant/:restaurantId",
  protect,
  subscriptionController.getRestaurantSubscription
);
router.get("/:subscriptionId", protect, subscriptionController.getSubscription);
router.patch(
  "/:subscriptionId/cancel",
  protect,
  subscriptionController.cancelSubscription
);

module.exports = router;
