const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { createMenuItem } = require('../controllers/menuItem.controller');

const router = express.Router();

router.post('/:categoryId', protect, createMenuItem);

module.exports = router;
