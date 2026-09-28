const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/paymentController");
const validation = require("../../validation/frontend/paymentValidation");

router.get("/viewall", controller.getAllPayments);
router.get("/view:id", controller.getPaymentById);

router.post("/add", validation.createPayment, controller.createPayment);
router.put("/update:id", validation.updatePayment, controller.updatePayment);
router.delete("/delete:id", controller.deletePayment);

module.exports = router;