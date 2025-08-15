const Joi = require('joi');

exports.createRestaurantSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().allow(''),
  phone: Joi.string().allow('')
});
