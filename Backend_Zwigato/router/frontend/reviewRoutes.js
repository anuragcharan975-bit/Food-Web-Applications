const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/reviewController");

// GET ALL REVIEWS
router.get("/", controller.getAllReviews);

// GET REVIEW BY ID
router.get("/:id", controller.getReviewById);

// ADD REVIEW
router.post("/:userId", controller.addReview);

// UPDATE REVIEW
router.put("/:userId/:id", controller.updateReview);

// DELETE REVIEW
router.delete("/:userId/:id", controller.deleteReview);

module.exports = router;