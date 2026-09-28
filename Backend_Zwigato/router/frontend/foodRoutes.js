const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/foodController");

router.get("/", controller.getAllFoods);
router.get("/viewall", controller.getAllFoods);

router.get("/:id", controller.getFoodById);
router.get("/view:id", controller.getFoodById);

module.exports = router;