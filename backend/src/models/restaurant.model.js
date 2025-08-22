const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: String,
  phone: String,
  qrCode: String,
  // Razorpay credentials for payment collection
  razorpay: {
    keyId: { type: String, required: true },
    keySecret: { type: String, required: true },
    isConnected: { type: Boolean, default: false }
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
