const { body } = require("express-validator");

const createRestaurant = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Restaurant name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

  body("description")
    .optional()
    .trim(),
];

const updateRestaurant = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Restaurant name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

  body("description")
    .optional()
    .trim(),
];

module.exports = {
  createRestaurant,
  updateRestaurant,
};