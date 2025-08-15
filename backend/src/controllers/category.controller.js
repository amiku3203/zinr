const Category = require('../models/category.model');
const Restaurant = require('../models/restaurant.model');
const { createCategorySchema } = require('../validations/category.validation');

exports.createCategory = async (req, res, next) => {
  try {
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Create category
    const category = await Category.create({
      restaurant: req.params.restaurantId,
      name: req.body.name
    });

    // Link category to restaurant
    restaurant.categories.push(category._id);
    await restaurant.save();

    // Return updated restaurant with categories populated
    const updatedRestaurant = await Restaurant.findById(req.params.restaurantId)
      .populate('categories');

    res.status(201).json({
      success: true,
      data: updatedRestaurant
    });
  } catch (err) {
    next(err);
  }
};
