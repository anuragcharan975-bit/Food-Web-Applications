const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/couponController");
const validation = require("../../validation/admin/couponValidation");

router.get("/viewall", controller.getAllCoupons);
router.get("/view:id", controller.getCouponById);

router.post("/add", validation.createCoupon, controller.createCoupon);
router.put("/update:id", validation.updateCoupon, controller.updateCoupon);
router.delete("/delete:id", controller.deleteCoupon);

module.exports = router;