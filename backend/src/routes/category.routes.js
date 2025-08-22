const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { createCategory, updateCategory, deleteCategory, getCategoriesByRestaurant } = require('../controllers/category.controller');

const router = express.Router();

router.get('/restaurant/:restaurantId', protect, getCategoriesByRestaurant);
router.post('/:restaurantId', protect, createCategory);
router.put('/:categoryId', protect, updateCategory);
router.delete('/:categoryId', protect, deleteCategory);

module.exports = router;
