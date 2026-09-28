const express = require("express");

const router = express.Router();

const controller = require("../../controller/frontend/deliveryController");


// GET ALL USER DELIVERIES
router.get("/:userId", controller.getDeliveries);


// GET DELIVERY BY ID
router.get("/:userId/:id", controller.getDeliveryById);


// CREATE DELIVERY
router.post("/:userId", controller.createDelivery);


// UPDATE DELIVERY
router.put("/:userId/:id", controller.updateDelivery);


// DELETE DELIVERY
router.delete("/:userId/:id", controller.deleteDelivery);


module.exports = router;