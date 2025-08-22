const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { createRestaurant, getPublicMenu, getMyRestaurant, getRestaurantMenu, updateRestaurant, deleteRestaurant, testQREmail } = require('../controllers/restaurant.controller');

const router = express.Router();

router.post('/', protect, createRestaurant);
router.get('/public/:id', getPublicMenu);
router.get("/me", protect, getMyRestaurant);
router.get("/:restaurantId/menu", protect, getRestaurantMenu);
router.put('/', protect, updateRestaurant);
router.delete("/", protect, deleteRestaurant);
router.post("/test-qr-email", protect, testQREmail);

module.exports = router;
