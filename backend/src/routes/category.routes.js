const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { createCategory } = require('../controllers/category.controller');

const router = express.Router();

router.post('/:restaurantId', protect, createCategory);

module.exports = router;
