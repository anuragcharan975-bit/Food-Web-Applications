const Joi = require("joi");

const deliverySchema = Joi.object({
  order: Joi.string()
    .required(),

  deliveryPerson: Joi.string()
    .optional()
    .allow(null, ""),

  status: Joi.string()
    .valid(
      "Assigned",
      "Picked",
      "On The Way",
      "Delivered",
      "Cancelled"
    )
    .default("Assigned"),

  deliveryTime: Joi.date()
    .optional()
    .allow(null),

  location: Joi.string()
    .optional()
    .allow(""),
});


// ================= CREATE DELIVERY =================

const createDelivery = (req, res, next) => {
  const { error } = deliverySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


// ================= UPDATE DELIVERY =================

const updateDelivery = (req, res, next) => {
  const { error } = deliverySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


module.exports = {
  deliverySchema,
  createDelivery,
  updateDelivery,
};