const QRCode = require('qrcode');

const {createRestaurantSchema} = require('../validations/restaurant.validation');

const Restaurant = require('../models/restaurant.model');
const MenuItem = require('../models/menuItem.model');
const Category = require('../models/category.model');
const emailService = require('../services/email.service');
const User = require('../models/user.model');
 exports.createRestaurant = async (req, res, next) => {
  try {
    // Check if the user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: req.user.id });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "You have already created a restaurant"
      });
    }

    const { error } = createRestaurantSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const restaurant = await Restaurant.create({
      owner: req.user.id,
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      razorpay: {
        keyId: req.body.razorpay.keyId,
        keySecret: req.body.razorpay.keySecret,
        isConnected: true
      }
    });

    // Generate QR code for public menu link
    const frontendUrl = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
    const menuUrl = `${frontendUrl}/menu/${restaurant._id}`;
    
    console.log('Generated QR code URL:', menuUrl);
    console.log('Frontend URL from env:', process.env.FRONTEND_URL);
    console.log('VITE Frontend URL from env:', process.env.VITE_FRONTEND_URL);
    console.log('Using URL:', frontendUrl);
    const qrImage = await QRCode.toDataURL(menuUrl);

    // Save QR code to restaurant
    restaurant.qrCode = qrImage;
    await restaurant.save();

    // Send QR code email to restaurant owner
    try {
      const user = await User.findById(req.user.id);
      if (user && user.email) {
        // Ensure QR code is properly formatted for email
        const qrCodeForEmail = qrImage.startsWith('data:image/png;base64,') 
          ? qrImage 
          : `data:image/png;base64,${qrImage}`;
        
        console.log('Sending email with QR code:', {
          to: user.email,
          restaurantName: restaurant.name,
          qrCodeLength: qrCodeForEmail.length,
          qrCodeStartsWith: qrCodeForEmail.substring(0, 50)
        });
        
        // Send email using the dedicated function (no QR code data needed)
        await emailService.sendRestaurantQREmail(user.email, restaurant);
        console.log('Restaurant creation email sent successfully to:', user.email);
      }
    } catch (emailError) {
      console.error('Failed to send QR code email:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        code: emailError.code,
        command: emailError.command
      });
    }

    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// Test endpoint to debug QR code email
exports.testQREmail = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "No restaurant found to test"
      });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.email) {
      return res.status(400).json({
        success: false,
        message: "User email not found"
      });
    }

    // Send test email
    await emailService.sendTestQREmail(user.email, restaurant);

    res.status(200).json({
      success: true,
      message: "Test QR code email sent successfully",
      debug: {
        restaurantName: restaurant.name,
        hasQRCode: !!restaurant.qrCode,
        qrCodeLength: restaurant.qrCode ? restaurant.qrCode.length : 0,
        qrCodeStartsWith: restaurant.qrCode ? restaurant.qrCode.substring(0, 50) + '...' : 'N/A'
      }
    });
  } catch (err) {
    next(err);
  }
};


 exports.getPublicMenu = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate({
        path: 'categories',
        populate: { path: 'items' }
      });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// Get current user's restaurant
exports.getMyRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id })
      .populate({
        path: 'categories',
        populate: { path: 'items' }
      });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "No restaurant found" });
    }
    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// Get restaurant menu (categories with items)
exports.getRestaurantMenu = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId)
      .populate({
        path: 'categories',
        populate: { path: 'items' }
      });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (err) {
    next(err);
  }
};
exports.updateRestaurant = async (req, res, next) => {
  try {
    // Validate body
    const { error } = createRestaurantSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Find restaurant owned by user
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Update fields
    restaurant.name = req.body.name || restaurant.name;
    restaurant.address = req.body.address || restaurant.address;
    restaurant.phone = req.body.phone || restaurant.phone;

    // If any change requires QR regeneration (e.g., new ID-based public link)
    const frontendUrl = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
    const menuUrl = `${frontendUrl}/menu/${restaurant._id}`;
    restaurant.qrCode = await QRCode.toDataURL(menuUrl);

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  } catch (err) {
    next(err);
  }
};


exports.deleteRestaurant = async (req, res, next) => {
  try {
    // Find restaurant owned by logged-in user
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "No restaurant found to delete",
      });
    }

    // Delete all menu items belonging to categories of this restaurant
    await MenuItem.deleteMany({ category: { $in: restaurant.categories } });

    // Delete all categories of this restaurant
    await Category.deleteMany({ restaurant: restaurant._id });

    // Delete the restaurant itself
    await Restaurant.findByIdAndDelete(restaurant._id);

    res.status(200).json({
      success: true,
      message: "Restaurant and related data deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};