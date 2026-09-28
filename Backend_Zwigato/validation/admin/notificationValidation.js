const Joi = require("joi");

const notificationSchema = Joi.object({
  user: Joi.string()
    .required(),

  title: Joi.string()
    .min(2)
    .max(100)
    .required(),

  message: Joi.string()
    .min(2)
    .max(500)
    .required(),

  type: Joi.string()
    .valid("Order", "Offer", "Payment", "General")
    .default("General"),

  isRead: Joi.boolean()
    .default(false),
});


// ================= CREATE NOTIFICATION =================

const createNotification = (req, res, next) => {
  const { error } = notificationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


// ================= UPDATE NOTIFICATION =================

const updateNotification = (req, res, next) => {
  const { error } = notificationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


module.exports = {
  notificationSchema,
  createNotification,
  updateNotification,
};