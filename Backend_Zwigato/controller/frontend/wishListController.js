const WishList = require("../../model/wishList");


// ================= GET ALL WISHLISTS =================

const getAllWishLists = async (req, res) => {
  try {
    const wishLists = await WishList.find()
      .populate("user")
      .populate("food")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: wishLists.length,
      data: wishLists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get wish lists",
      error: error.message,
    });
  }
};


// ================= GET WISHLIST BY ID =================

const getWishListById = async (req, res) => {
  try {
    const wishList = await WishList.findById(req.params.id)
      .populate("user")
      .populate("food");

    if (!wishList) {
      return res.status(404).json({
        success: false,
        message: "Wish list not found",
      });
    }

    res.status(200).json({
      success: true,
      data: wishList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get wish list",
      error: error.message,
    });
  }
};


// ================= CREATE WISHLIST =================

const createWishList = async (req, res) => {
  try {
    const wishList = await WishList.create(req.body);

    res.status(201).json({
      success: true,
      message: "Food added to wishlist",
      data: wishList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create wish list",
      error: error.message,
    });
  }
};


// ================= UPDATE WISHLIST =================

const updateWishList = async (req, res) => {
  try {
    const wishList = await WishList.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!wishList) {
      return res.status(404).json({
        success: false,
        message: "Wish list not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wish list updated successfully",
      data: wishList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update wish list",
      error: error.message,
    });
  }
};


// ================= DELETE WISHLIST =================

const deleteWishList = async (req, res) => {
  try {
    const wishList = await WishList.findByIdAndDelete(
      req.params.id
    );

    if (!wishList) {
      return res.status(404).json({
        success: false,
        message: "Wish list not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete wish list",
      error: error.message,
    });
  }
};


// ================= EXPORT =================

module.exports = {
  getAllWishLists,
  getWishListById,
  createWishList,
  updateWishList,
  deleteWishList,
};