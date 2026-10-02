const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/orderController");

router.get("/:userId", controller.getOrders);

router.get("/:userId/:id", controller.getOrderById);

router.post("/:userId", controller.createOrder);

// VERIFY PAYMENT
router.post("/verify-payment", controller.verifyPayment);


router.put("/:userId/:id", controller.updateOrder);

router.delete("/:userId/:id", controller.deleteOrder);

module.exports = router;