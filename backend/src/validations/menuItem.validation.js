const Joi = require('joi');

exports.createMenuItemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().positive().required()
});
