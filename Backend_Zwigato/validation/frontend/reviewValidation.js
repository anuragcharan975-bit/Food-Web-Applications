const Joi = require("joi");

const reviewSchema = Joi.object({
  user: Joi.string()
    .required(),

  restaurant: Joi.string()
    .optional()
    .allow(null, ""),

  food: Joi.string()
    .optional()
    .allow(null, ""),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required(),

  comment: Joi.string()
    .max(500)
    .allow(""),

  image: Joi.string()
    .allow("")
    .optional(),
});


// ================= CREATE REVIEW =================

const createReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


// ================= UPDATE REVIEW =================

const updateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


module.exports = {
  reviewSchema,
  createReview,
  updateReview,
};