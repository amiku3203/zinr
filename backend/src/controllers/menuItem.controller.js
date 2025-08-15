const MenuItem = require('../models/menuItem.model');
const Category = require('../models/category.model');
const { createMenuItemSchema } = require('../validations/menuItem.validation');

 exports.createMenuItem = async (req, res, next) => {
  try {
    const { error } = createMenuItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const category = await Category.findById(req.params.categoryId).populate('restaurant');
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (category.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // 1. Create the menu item
    const menuItem = await MenuItem.create({
      category: req.params.categoryId,
      ...req.body
    });

    // 2. Push menu item into category
    category.items.push(menuItem._id);
    await category.save();

    res.status(201).json({ success: true, data: menuItem });
  } catch (err) {
    next(err);
  }
};
