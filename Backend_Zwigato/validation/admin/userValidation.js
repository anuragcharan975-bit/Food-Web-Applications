const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .lowercase()
    .required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Admin mobile number must be exactly 10 digits.",
    }),

  password: Joi.string()
    .min(6)
    .required(),

  role: Joi.string()
    .valid("user", "admin", "restaurant")
    .default("user"),
});

const createUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const updateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  createUser,
  updateUser,
};