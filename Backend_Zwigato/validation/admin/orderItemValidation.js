const Joi = require("joi");

const orderItemSchema = Joi.object({
  order: Joi.string()
    .required(),

  food: Joi.string()
    .required(),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required(),

  price: Joi.number()
    .min(0)
    .required(),
});

const createOrderItem = (req, res, next) => {
  const { error } = orderItemSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const updateOrderItem = (req, res, next) => {
  const { error } = orderItemSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  orderItemSchema,
  createOrderItem,
  updateOrderItem,
};