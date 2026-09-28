const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/restaurantController");

// GET ALL RESTAURANTS
router.get("/", controller.getAllRestaurants);

// GET RESTAURANT BY ID
router.get("/:id", controller.getRestaurantById);

module.exports = router;