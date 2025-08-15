const Joi = require('joi');

exports.createCategorySchema = Joi.object({
  name: Joi.string().required()
});
