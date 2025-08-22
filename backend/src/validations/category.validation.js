const Joi = require('joi');

exports.createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional()
});
