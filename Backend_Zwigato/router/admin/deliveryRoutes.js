const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/deliveryController");
const validation = require("../../validation/admin/deliveryValidation");

router.get("/viewall", controller.getAllDeliveries);
router.get("/view:id", controller.getDeliveryById);

router.post("/add", validation.createDelivery, controller.createDelivery);
router.put("/update:id", validation.updateDelivery, controller.updateDelivery);
router.delete("/dalete:id", controller.deleteDelivery);

module.exports = router;