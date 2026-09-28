const Joi = require("joi");

const wishListSchema = Joi.object({
  user: Joi.string()
    .required(),

  food: Joi.string()
    .required(),
});


// ================= CREATE WISHLIST =================

const createWishList = (req, res, next) => {
  const { error } = wishListSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


// ================= UPDATE WISHLIST =================

const updateWishList = (req, res, next) => {
  const { error } = wishListSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


module.exports = {
  wishListSchema,
  createWishList,
  updateWishList,
};