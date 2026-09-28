const Joi = require("joi");

// ================= CREATE USER =================

const createUserSchema = Joi.object({
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
      "string.pattern.base": "Mobile number must be exactly 10 digits.",
    })
    .optional(),

  password: Joi.string()
    .min(6)
    .required(),

  role: Joi.string()
    .valid("user", "admin", "restaurant")
    .default("user"),
});


// ================= UPDATE USER =================

const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50),

  email: Joi.string()
    .email()
    .lowercase(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits.",
    }),

  password: Joi.string()
    .min(6),

  role: Joi.string()
    .valid("user", "admin", "restaurant"),
});


// ================= CREATE VALIDATION MIDDLEWARE =================

const createUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


// ================= UPDATE VALIDATION MIDDLEWARE =================

const updateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);

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