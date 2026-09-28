const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/reviewController");
const validation = require("../../validation/frontend/reviewValidation");

router.get("/viewall", controller.getAllReviews);
router.get("/view:id", controller.getReviewById);

router.post("/add", validation.createReview, controller.createReview);
router.put("/update:id", validation.updateReview, controller.updateReview);
router.delete("/delete:id", controller.deleteReview);

module.exports = router;