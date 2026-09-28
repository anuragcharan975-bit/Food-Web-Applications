const Coupon = require("../../model/coupon");


// ================= GET ACTIVE COUPONS =================

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get coupons",
      error: error.message,
    });
  }
};


// ================= GET COUPON BY ID =================

const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get coupon",
      error: error.message,
    });
  }
};


module.exports = {
  getAllCoupons,
  getCouponById,
};