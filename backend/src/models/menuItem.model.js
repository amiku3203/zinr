const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
