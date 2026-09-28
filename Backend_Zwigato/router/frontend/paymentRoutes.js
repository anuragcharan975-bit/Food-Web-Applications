const express = require("express");

const router = express.Router();

const controller = require("../../controller/frontend/paymentController");


router.get("/:userId", controller.getPayments);

router.get("/:userId/:id", controller.getPaymentById);

router.post("/:userId", controller.createPayment);

router.put("/:userId/:id", controller.updatePayment);

router.delete("/:userId/:id", controller.deletePayment);


module.exports = router;