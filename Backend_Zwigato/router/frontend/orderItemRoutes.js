const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/orderItemController");


// GET ALL
router.get("/:orderId", controller.getAllOrderItems);


// GET BY ID
router.get("/:orderId/:id", controller.getOrderItemById);


// ADD
router.post("/:orderId", controller.addOrderItem);


// UPDATE
router.put("/:orderId/:id", controller.updateOrderItem);


// DELETE
router.delete("/:orderId/:id", controller.deleteOrderItem);


module.exports = router;