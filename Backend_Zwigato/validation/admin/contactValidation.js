const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .lowercase()
    .required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Phone number must be 10 digits",
    }),

  subject: Joi.string()
    .min(2)
    .max(100)
    .required(),

  message: Joi.string()
    .min(5)
    .max(1000)
    .required(),
});


// CREATE CONTACT
const createContact = (req, res, next) => {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


// UPDATE CONTACT
const updateContact = (req, res, next) => {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


module.exports = {
  contactSchema,
  createContact,
  updateContact,
};