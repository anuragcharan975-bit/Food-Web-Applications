const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/cartController");

// GET USER CART
router.get("/:userId", controller.getCart);

// ADD TO CART
router.post("/:userId", controller.addToCart);

// UPDATE CART
router.put("/:userId/:id", controller.updateCart);

// DELETE CART
router.delete("/:userId/:id", controller.deleteCart);

module.exports = router;