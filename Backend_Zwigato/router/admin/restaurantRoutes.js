const express = require("express");

const router = express.Router();

const controller =
  require("../../controller/admin/restaurantController");

const validation =
  require("../../validation/admin/restaurantValidation");

const upload =
  require("../../middleware/upload");

// ================= GET ALL =================

router.get(
  "/viewall",
  controller.getAllRestaurants
);

// ================= GET BY ID =================

router.get(
  "/view/:id",
  controller.getRestaurantById
);

// ================= ADD =================

router.post(
  "/add",
  upload.single("image"),
  validation.createRestaurant,
  controller.createRestaurant
);

// ================= UPDATE =================

router.put(
  "/update/:id",
  upload.single("image"),
  validation.updateRestaurant,
  controller.updateRestaurant
);

// ================= DELETE =================

router.delete(
  "/delete/:id",
  controller.deleteRestaurant
);

// ================= STATUS =================

router.put(
  "/status/:id",
  controller.toggleRestaurantStatus
);

module.exports = router;