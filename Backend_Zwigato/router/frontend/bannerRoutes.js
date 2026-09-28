const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/bannerController");

// GET ALL BANNERS
router.get("/", controller.getAllBanners);

// GET BANNER BY ID
router.get("/:id", controller.getBannerById);

module.exports = router;