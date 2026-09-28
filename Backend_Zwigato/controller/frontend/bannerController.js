const Banner = require("../../model/banner");


// ================= GET ALL ACTIVE BANNERS =================

const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get banners",
      error: error.message,
    });
  }
};


// ================= GET BY ID =================

const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get banner",
      error: error.message,
    });
  }
};


module.exports = {
  getAllBanners,
  getBannerById,
};