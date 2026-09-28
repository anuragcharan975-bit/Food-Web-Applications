const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/couponController");

// GET ALL COUPONS
router.get("/", controller.getAllCoupons);

// GET COUPON BY ID
router.get("/:id", controller.getCouponById);

module.exports = router;