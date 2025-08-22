const express = require('express');
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();

// Public routes (for customers)
router.post('/', orderController.createOrder);
router.post('/verify-payment', orderController.verifyPayment);
router.get('/number/:orderNumber', orderController.getOrderByNumber);

// Protected routes (for restaurant owners)
router.get('/restaurant/:restaurantId', protect, orderController.getRestaurantOrders);
router.get('/stats/:restaurantId', protect, orderController.getOrderStats);
router.get('/:orderId', protect, orderController.getOrderById);
router.patch('/:orderId/status', protect, orderController.updateOrderStatus);
router.post('/:orderId/resend-invoice', protect, orderController.resendInvoice);

module.exports = router;
