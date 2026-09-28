const Joi = require("joi");

const paymentSchema = Joi.object({
  user: Joi.string()
    .required(),

  order: Joi.string()
    .required(),

  amount: Joi.number()
    .min(0)
    .required(),

  paymentMethod: Joi.string()
    .valid("COD", "UPI", "Card", "Net Banking")
    .default("COD"),

  transactionId: Joi.string()
    .allow("")
    .optional(),

  status: Joi.string()
    .valid("Pending", "Success", "Failed")
    .default("Pending"),
});

const createPayment = (req, res, next) => {
  const { error } = paymentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const updatePayment = (req, res, next) => {
  const { error } = paymentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  paymentSchema,
  createPayment,
  updatePayment,
};