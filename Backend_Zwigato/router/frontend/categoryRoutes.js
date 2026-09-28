const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/categoryController");


// GET ALL CATEGORIES
router.get("/", controller.getAllCategories);


// GET CATEGORY BY ID
router.get("/:id", controller.getCategoryById);


module.exports = router;