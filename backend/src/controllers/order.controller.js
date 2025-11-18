const Order = require('../models/order.model');
const Restaurant = require('../models/restaurant.model');
const MenuItem = require('../models/menuItem.model');
const { sendOrderConfirmationEmail, sendPaymentConfirmationEmail, resendInvoiceEmail } = require('../services/email.service');
const logger = require('../config/logger');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create new order
const createOrder = async (req, res) => {
  try {
    const { restaurantId, customer, items, tableNumber, notes, paymentMethod } = req.body;

    // Validate restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if restaurant has Razorpay connected
    if (!restaurant.razorpay || !restaurant.razorpay.isConnected) {
      return res.status(400).json({ 
        message: 'Restaurant payment gateway not configured. Please contact restaurant owner.' 
      });
    }

    // Calculate total and validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(400).json({ message: `MenuItem ${item.menuItem} not found` });
      }
      
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions || ''
      });
    }
     
    const queueNumber = Math.floor(Math.random() * 1000) + 1;
    // Create order with pending payment status
    const order = new Order({
      restaurant: restaurantId,
      customer,
      items: orderItems,
      totalAmount,
      tableNumber,
      notes,
      queueNumber,
      paymentMethod: 'razorpay', // Force Razorpay payment
      paymentStatus: 'pending'
    });

    await order.save();

    // Create Razorpay order using restaurant's credentials
    try {
      const restaurantRazorpay = new Razorpay({
        key_id: restaurant.razorpay.keyId,
        key_secret: restaurant.razorpay.keySecret,
      });

      const razorpayOrder = await restaurantRazorpay.orders.create({
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          orderId: order._id.toString(),
          restaurantId: restaurantId
        }
      });

      // Update order with Razorpay order ID
      order.paymentDetails.razorpayOrderId = razorpayOrder.id;
      await order.save();

      res.status(201).json({
        message: 'Order created successfully. Payment required.',
        order,
        paymentOrder: razorpayOrder,
        paymentKey: restaurant.razorpay.keyId,
        requiresPayment: true
      });
      return;
    } catch (paymentError) {
      logger.error('Error creating Razorpay order:', paymentError);
      // Delete the order if payment creation fails
      await Order.findByIdAndDelete(order._id);
      return res.status(500).json({ 
        message: 'Failed to create payment order. Please try again.' 
      });
    }

    // Send invoice email immediately after order creation
    if (customer.email) {
      try {
        await sendOrderConfirmationEmail(customer.email, order, restaurant);
        logger.info(`Invoice email sent successfully to ${customer.email} for order ${order.orderNumber}`);
      } catch (emailError) {
        logger.error('Failed to send invoice email:', emailError);
      }
    } else {
      logger.warn(`No customer email provided for order ${order.orderNumber} - invoice not sent`);
    }

    // Populate menu item details for response
    await order.populate('items.menuItem');

    // Emit real-time update to restaurant dashboard
    if (global.io) {
      global.io.to(`restaurant-${restaurantId}`).emit('new-order', {
        type: 'new-order',
        order: order
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify payment and update order
const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify payment signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order payment status
    order.paymentStatus = 'paid';
    order.paymentDetails = {
      ...order.paymentDetails,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paidAmount: order.totalAmount,
      paidAt: new Date(),
      transactionId: razorpayPaymentId,
      paymentGateway: 'razorpay'
    };

    await order.save();

    // Send payment confirmation email
    if (order.customer.email) {
      try {
        await sendPaymentConfirmationEmail(order.customer.email, order, restaurant);
        logger.info(`Payment confirmation email sent successfully to ${order.customer.email} for order ${order.orderNumber}`);
      } catch (emailError) {
        logger.error('Failed to send payment confirmation email:', emailError);
      }
    }

    // Emit real-time update
    if (global.io) {
      global.io.to(`restaurant-${order.restaurant}`).emit('payment-received', {
        type: 'payment-received',
        order: order
      });
    }

    res.json({
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    logger.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get restaurant orders (for restaurant owners)
const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { restaurant: restaurantId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.menuItem')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    logger.error('Error fetching restaurant orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('items.menuItem')
      .populate('restaurant');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    logger.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, estimatedTime } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['completed'],
      'completed': [],
      'cancelled': []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status transition from ${order.status} to ${status}` 
      });
    }

    order.status = status;
    if (estimatedTime) {
      order.estimatedTime = estimatedTime;
    }

    await order.save();

    // Emit real-time update to restaurant dashboard
    if (global.io) {
      global.io.to(`restaurant-${order.restaurant}`).emit('order-updated', {
        type: 'order-updated',
        order: order
      });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    logger.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get order by order number (for customers)
const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    const order = await Order.findOne({ orderNumber })
      .populate('items.menuItem')
      .populate('restaurant');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    logger.error('Error fetching order by number:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get order statistics for restaurant
const getOrderStats = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { period = 'today' } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'today':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
          }
        };
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: weekAgo } };
        break;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        dateFilter = { createdAt: { $gte: monthAgo } };
        break;
    }

    const query = { restaurant: restaurantId, ...dateFilter };

    const stats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments(query);
    const totalRevenue = await Order.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    logger.error('Error fetching order statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Resend invoice email
const resendInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('items.menuItem')
      .populate('restaurant');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this restaurant
    if (req.user.restaurant.toString() !== order.restaurant._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!order.customer.email) {
      return res.status(400).json({ message: 'No customer email found for this order' });
    }

    const result = await resendInvoiceEmail(order.customer.email, order, order.restaurant);
    
    if (result.success) {
      res.json({ 
        message: 'Invoice email resent successfully',
        email: order.customer.email,
        orderNumber: order.orderNumber
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to resend invoice email',
        error: result.message
      });
    }
  } catch (error) {
    logger.error('Error resending invoice:', error);
    res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
  createOrder,
  verifyPayment,
  getRestaurantOrders,
  getOrderById,
  updateOrderStatus,
  getOrderByNumber,
  getOrderStats,
  resendInvoice
};
