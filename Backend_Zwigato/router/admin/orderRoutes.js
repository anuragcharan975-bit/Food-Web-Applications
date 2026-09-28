const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/orderController");
const validation = require("../../validation/frontend/orderValidation");

router.get("/viewall", controller.getAllOrders);
router.get("/view:id", controller.getOrderById);

router.post("/add", validation.createOrder, controller.createOrder);
router.put("/update:id", validation.updateOrder, controller.updateOrder);
router.delete("/delete:id", controller.deleteOrder);

module.exports = router;