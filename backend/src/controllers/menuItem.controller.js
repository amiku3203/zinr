const MenuItem = require('../models/menuItem.model');
const Category = require('../models/category.model');
const Restaurant = require('../models/restaurant.model');
const { createMenuItemSchema } = require('../validations/menuItem.validation');

// Get all menu items for a restaurant
exports.getMenuItemsByRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Get all menu items for this restaurant
    const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId })
      .populate({
        path: 'category',
        select: 'name'
      });

    res.status(200).json({
      success: true,
      data: menuItems
    });
  } catch (err) {
    next(err);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const { error } = createMenuItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Check if category exists and belongs to the user's restaurant
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if user owns the restaurant
    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Create the menu item
    const menuItem = await MenuItem.create({
      category: req.params.categoryId,
      restaurantId: req.body.restaurantId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      isAvailable: req.body.isAvailable !== false
    });

    // Push menu item into category
    category.items.push(menuItem._id);
    await category.save();

    res.status(201).json({ success: true, data: menuItem });
  } catch (err) {
    next(err);
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res, next) => {
  try {
    const { error } = createMenuItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const menuItem = await MenuItem.findById(req.params.menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    // Check if user owns the restaurant
    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (!restaurant || restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update menu item
    Object.assign(menuItem, req.body);
    await menuItem.save();

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (err) {
    next(err);
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    // Check if user owns the restaurant
    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (!restaurant || restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Remove menu item from category
    const category = await Category.findById(menuItem.category);
    if (category) {
      category.items = category.items.filter(itemId => itemId.toString() !== menuItem._id.toString());
      await category.save();
    }

    // Delete the menu item
    await MenuItem.findByIdAndDelete(req.params.menuItemId);

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// Get menu items by category
exports.getMenuItemsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId)
      .populate({
        path: 'restaurant',
        select: 'owner'
      })
      .populate('items');

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (category.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};
