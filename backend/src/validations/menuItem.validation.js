const Joi = require('joi');

exports.createMenuItemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().positive().required(),
  restaurantId: Joi.string().required(),
  image: Joi.string().uri().allow(''),
  isAvailable: Joi.boolean().default(true)
});
