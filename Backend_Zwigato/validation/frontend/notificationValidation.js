const Joi = require("joi");


// ================= CREATE NOTIFICATION =================

const createNotificationSchema = Joi.object({
  user: Joi.string().required(),

  title: Joi.string()
    .required()
    .min(3),

  message: Joi.string()
    .required()
    .min(3),

  isRead: Joi.boolean()
    .default(false),
});


// ================= UPDATE NOTIFICATION =================

const updateNotificationSchema = Joi.object({
  user: Joi.string(),

  title: Joi.string()
    .min(3),

  message: Joi.string()
    .min(3),

  isRead: Joi.boolean(),
});


// ================= CREATE VALIDATION =================

const createNotification = (req, res, next) => {

  const { error } = createNotificationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


// ================= UPDATE VALIDATION =================

const updateNotification = (req, res, next) => {

  const { error } = updateNotificationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


module.exports = {
  createNotification,
  updateNotification,
};