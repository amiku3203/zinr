const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { createRestaurant,  getPublicMenu } = require('../controllers/restaurant.controller');

const router = express.Router();

router.post('/', protect, createRestaurant);
router.get('/public/:id', getPublicMenu);

module.exports = router;
