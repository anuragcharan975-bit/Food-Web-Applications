const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/authController");

router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", controller.verifyOtp);
router.post("/reset-password", controller.resetPassword);

module.exports = router;
