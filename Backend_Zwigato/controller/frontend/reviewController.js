const Review = require("../../model/review");

// ================= GET ALL REVIEWS =================

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user")
      .populate("food")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get reviews",
      error: error.message,
    });
  }
};


// ================= GET REVIEW BY ID =================

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user")
      .populate("food");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get review",
      error: error.message,
    });
  }
};


// ================= ADD REVIEW =================

const addReview = async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      user: req.params.userId,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};


// ================= UPDATE REVIEW =================

const updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.params.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};


// ================= DELETE REVIEW =================

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.params.userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};


module.exports = {
  getAllReviews,
  getReviewById,
  addReview,
  updateReview,
  deleteReview,
};