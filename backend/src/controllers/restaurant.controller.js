const QRCode = require('qrcode');

const {createRestaurantSchema} = require('../validations/restaurant.validation');

const Restaurant = require('../models/restaurant.model');

exports.createRestaurant = async (req, res, next) => {
    console.log("Creating restaurant with body:", req.body);
  try {
    const { error } = createRestaurantSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const restaurant = await Restaurant.create({
      owner: req.user.id,
      ...req.body
    });

    // Generate QR code for public menu link
    const menuUrl = `${process.env.FRONTEND_URL}/menu/${restaurant._id}`;
    const qrImage = await QRCode.toDataURL(menuUrl);

    // Save QR code to restaurant
    restaurant.qrCode = qrImage;
    await restaurant.save();

    res.status(201).json({ success: true, data: restaurant });
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
