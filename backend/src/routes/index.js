 const express = require('express');
const authRoutes = require('./auth.routes');
const restaurantRoutes = require('./restaurant.routes');
const categoryRoutes = require('./category.routes');
const menuItemRoutes = require('./menuItem.routes');
const healthRouth= require("./health.routes");
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/categories', categoryRoutes);
router.use('/items', menuItemRoutes);

router.use("/health",healthRouth);

module.exports = router;
