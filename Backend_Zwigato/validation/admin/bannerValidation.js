const Joi = require("joi");

const bannerSchema = Joi.object({
  title: Joi.string()
    .min(2)
   .required(),

  image: Joi.string(),

  description: Joi.string()
    .max(300)
    .allow(""),
});

const createBanner = (req, res, next) => {
  const { error } = bannerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const updateBanner = (req, res, next) => {
  const { error } = bannerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  bannerSchema,
  createBanner,
  updateBanner,
};