const Category = require('../models/category.model');
const Restaurant = require('../models/restaurant.model');
const { createCategorySchema } = require('../validations/category.validation');

// Get all categories for a restaurant
exports.getCategoriesByRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Get categories with populated items
    const categories = await Category.find({ restaurant: req.params.restaurantId })
      .populate({
        path: 'items',
        select: 'name price description'
      });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

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
      name: req.body.name,
      description: req.body.description
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

// Update a category
exports.updateCategory = async (req, res, next) => {
  try {
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const category = await Category.findById(req.params.categoryId).populate('restaurant');
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (category.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update category
    category.name = req.body.name;
    if (req.body.description !== undefined) {
      category.description = req.body.description;
    }
    await category.save();

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId).populate('restaurant');
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (category.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Remove category from restaurant
    const restaurant = await Restaurant.findById(category.restaurant._id);
    restaurant.categories = restaurant.categories.filter(catId => catId.toString() !== category._id.toString());
    await restaurant.save();

    // Delete the category
    await Category.findByIdAndDelete(req.params.categoryId);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
