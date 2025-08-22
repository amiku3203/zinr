const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MenuItem', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  price: { 
    type: Number, 
    required: true 
  },
  specialInstructions: String
});

const orderSchema = new mongoose.Schema({
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String
  },
  items: [orderItemSchema],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online', 'upi', 'wallet', 'razorpay'],
    default: 'cash'
  },
  paymentDetails: {
    transactionId: String,
    paymentGateway: String,
    paidAmount: Number,
    paidAt: Date,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
  },
  tableNumber: String,
  estimatedTime: Number, // in minutes
  notes: String,
  orderNumber: { 
    type: String, 
    unique: true 
  },
  queueNumber: {
    type: Number,
    required: true
  }
}, { 
  timestamps: true 
});

// Generate order number and queue number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
  }
  
  if (!this.queueNumber) {
    // Get the highest queue number for this restaurant today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const highestQueue = await this.constructor.findOne({
      restaurant: this.restaurant,
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ queueNumber: -1 });
    
    this.queueNumber = highestQueue ? highestQueue.queueNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
