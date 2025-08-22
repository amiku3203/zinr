const express = require('express');
const authRoutes = require('./auth.routes');
const restaurantRoutes = require('./restaurant.routes');
const categoryRoutes = require('./category.routes');
const menuItemRoutes = require('./menuItem.routes');
const orderRoutes = require('./order.routes');
const subscriptionRoutes = require('./subscription.routes');
const healthRoutes = require("./health.routes");
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/categories', categoryRoutes);
router.use('/items', menuItemRoutes);
router.use('/orders', orderRoutes);
router.use('/subscriptions', subscriptionRoutes);

router.use("/health", healthRoutes);

module.exports = router;
