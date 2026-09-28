const Joi = require("joi");

const couponSchema = Joi.object({
  code: Joi.string()
    .min(3)
    .max(20)
    .required(),

  discountType: Joi.string()
    .valid("Percentage", "Fixed")
    .default("Percentage"),

  discountValue: Joi.number()
    .min(0)
    .required(),

  minimumAmount: Joi.number()
    .min(0)
    .default(0),

  expiryDate: Joi.date()
    .required(),

  usageLimit: Joi.number()
    .min(1)
    .default(100),

  active: Joi.boolean()
    .default(true),
});

const createCoupon = (req, res, next) => {
  const { error } = couponSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const updateCoupon = (req, res, next) => {
  const { error } = couponSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  couponSchema,
  createCoupon,
  updateCoupon,
};