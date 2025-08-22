const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { createMenuItem, updateMenuItem, deleteMenuItem, getMenuItemsByCategory, getMenuItemsByRestaurant } = require('../controllers/menuItem.controller');

const router = express.Router();

router.get('/restaurant/:restaurantId', protect, getMenuItemsByRestaurant);
router.post('/:categoryId', protect, createMenuItem);
router.get('/:categoryId', protect, getMenuItemsByCategory);
router.put('/:menuItemId', protect, updateMenuItem);
router.delete('/:menuItemId', protect, deleteMenuItem);

module.exports = router;
