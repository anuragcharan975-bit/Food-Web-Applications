const Joi = require("joi");

const orderSchema = Joi.object({
  user: Joi.string().required(),

  restaurant: Joi.string().required(),

  items: Joi.array()
    .items(
      Joi.object({
        food: Joi.string().required(),

        quantity: Joi.number()
          .min(1)
          .default(1),

        price: Joi.number()
          .min(0)
          .required(),
      })
    )
    .min(1)
    .required(),

  address: Joi.string().required(),

  totalAmount: Joi.number()
    .min(0)
    .required(),

  paymentStatus: Joi.string()
    .valid("Pending", "Paid", "Failed")
    .default("Pending"),

  orderStatus: Joi.string()
    .valid(
      "Placed",
      "Preparing",
      "Out For Delivery",
      "Delivered",
      "Cancelled"
    )
    .default("Placed"),
});

const createOrder = (req, res, next) => {
  const { error } = orderSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const updateOrderSchema = Joi.object({
  orderStatus: Joi.string().valid("Placed", "Preparing", "Out For Delivery", "Delivered", "Cancelled"),
  paymentStatus: Joi.string().valid("Pending", "Paid", "Failed"),
  paymentMethod: Joi.string().valid("COD", "Online")
}).unknown(true);

const updateOrder = (req, res, next) => {
  const { error } = updateOrderSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  orderSchema,
  createOrder,
  updateOrder,
};