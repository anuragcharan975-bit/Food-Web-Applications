const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .required(),

  description: Joi.string()
    .max(300)
    .allow(""),
});

const createCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const updateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  categorySchema,
  createCategory,
  updateCategory,
};