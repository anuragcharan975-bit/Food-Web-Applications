const Joi = require("joi");


// ================= CREATE WISHLIST =================

const createWishList = (req, res, next) => {

  const schema = Joi.object({
    food: Joi.string()
      .required()
      .messages({
        "string.empty": "Food is required",
        "any.required": "Food is required",
      }),
  });

  const { error } = schema.validate(req.body);

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

  const schema = Joi.object({
    food: Joi.string()
      .required()
      .messages({
        "string.empty": "Food is required",
        "any.required": "Food is required",
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


module.exports = {
  createWishList,
  updateWishList,
};