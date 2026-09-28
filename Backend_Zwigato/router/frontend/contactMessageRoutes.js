const express = require("express");

const router = express.Router();

const controller = require("../../controller/frontend/reviewController");

router.get("/", controller.getAllReviews);

router.get("/:id", controller.getReviewById);

router.post("/:userId", controller.addReview);

router.put("/:userId/:id", controller.updateReview);

router.delete("/:userId/:id", controller.deleteReview);

module.exports = router;