const express = require("express");

const router = express.Router();

const controller = require("../../controller/admin/adminAuthController");

// Create Admin
router.post("/create", controller.createAdmin);

// Admin Login
router.post("/login", controller.adminLogin);

module.exports = router;