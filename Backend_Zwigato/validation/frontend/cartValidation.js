const Joi = require("joi");


// ================= ADD TO CART =================

const addToCartSchema = Joi.object({
  food: Joi.string()
    .required(),

  quantity: Joi.number()
    .min(1)
    .required(),
});


// ================= UPDATE CART =================

const updateCartSchema = Joi.object({
  quantity: Joi.number()
    .min(1)
    .required(),
});


// ================= ADD VALIDATION =================

const addToCart = (req, res, next) => {
  const { error } = addToCartSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


// ================= UPDATE VALIDATION =================

const updateCart = (req, res, next) => {
  const { error } = updateCartSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};


module.exports = {
  addToCart,
  updateCart,
};