const express = require("express");

const router = express.Router();

const controller = require("../../controller/admin/categoryController");
const validation = require("../../validation/admin/categoryValidation");
const upload = require("../../middleware/upload");

// ================= GET ALL =================

router.get(
  "/viewall",
  controller.getAllCategories
);

// ================= GET BY ID =================

router.get(
  "/view/:id",
  controller.getCategoryById
);

// ================= ADD =================

router.post(
  "/add",
  upload.single("image"),
  validation.createCategory,
  controller.createCategory
);

// ================= UPDATE =================

router.put(
  "/update/:id",
  upload.single("image"),
  validation.updateCategory,
  controller.updateCategory
);

// ================= TOGGLE STATUS =================

router.put(
  "/status/:id",
  controller.toggleCategoryStatus
);

// ================= DELETE =================

router.delete(
  "/delete/:id",
  controller.deleteCategory
);

module.exports = router;