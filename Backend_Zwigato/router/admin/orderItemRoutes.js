const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/orderItemController");
const validation = require("../../validation/admin/orderItemValidation");

router.get("/viewall", controller.getAllOrderItems);
router.get("/view:id", controller.getOrderItemById);

router.post("/add", validation.createOrderItem, controller.createOrderItem);
router.put("/update:id", validation.updateOrderItem, controller.updateOrderItem);
router.delete("/delete:id", controller.deleteOrderItem);

module.exports = router;