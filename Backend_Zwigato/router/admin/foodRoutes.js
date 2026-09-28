const express = require("express");

const router = express.Router();

const controller = require("../../controller/admin/foodController");

const upload = require("../../middleware/upload");

// ================= GET ALL FOODS =================

router.get(
  "/viewall",
  controller.getAllFoods
);

// ================= GET FOOD BY ID =================

router.get(
  "/view/:id",
  controller.getFoodById
);

// ================= ADD FOOD =================

router.post(
  "/add",
  upload.single("image"),
  controller.createFood
);

// ================= UPDATE FOOD =================

router.put(
  "/update/:id",
  upload.single("image"),
  controller.updateFood
);

// ================= STATUS =================

router.put(
  "/status/:id",
  controller.toggleFoodStatus
);

// ================= DELETE FOOD =================

router.delete(
  "/delete/:id",
  controller.deleteFood
);

module.exports = router;