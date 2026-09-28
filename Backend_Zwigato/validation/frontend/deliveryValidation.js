const Joi = require("joi");

const deliverySchema = Joi.object({
  order: Joi.string()
    .required(),

  address: Joi.string()
    .required(),

  status: Joi.string()
    .valid(
      "pending",
      "assigned",
      "picked",
      "out_for_delivery",
      "delivered",
      "cancelled"
    )
    .required(),

  deliveryBoy: Joi.string()
    .allow(null, "")
});

module.exports = {
  deliverySchema
};