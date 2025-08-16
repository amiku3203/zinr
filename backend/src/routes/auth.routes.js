const express = require('express');
const router = express.Router();
const { signup, verifyEmail, login,getCurrentUser } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
module.exports = router;
