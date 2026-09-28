const express = require("express");

const router = express.Router();

const controller = require("../../controller/admin/bannerController");

const upload = require("../../middleware/upload");

// ================= GET ALL =================

router.get(
  "/viewall",
  controller.getAllBanners
);

// ================= GET BY ID =================

router.get(
  "/view/:id",
  controller.getBannerById
);

// ================= ADD =================

router.post(
  "/add",
  upload.single("image"),
  controller.createBanner
);

// ================= UPDATE =================

router.put(
  "/update/:id",
  upload.single("image"),
  controller.updateBanner
);

// ================= DELETE =================

router.delete(
  "/delete/:id",
  controller.deleteBanner
);

// ================= STATUS =================

router.put(
  "/status/:id",
  controller.toggleBannerStatus
);

module.exports = router;