const Banner = require("../../model/banner");

// ================= CREATE =================

const createBanner = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Banner name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });
    }

    const banner = await Banner.create({
      name,
      description,
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    console.log("Create Banner Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create banner",
      error: error.message,
    });
  }
};

// ================= GET ALL =================

const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    console.log("Get Banner Error:", error);

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
    const banner = await Banner.findById(req.params.id);

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
    console.log("Get Banner Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get banner",
      error: error.message,
    });
  }
};

// ================= UPDATE =================

const updateBanner = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updateData = {
      name,
      description,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    console.log("Update Banner Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update banner",
      error: error.message,
    });
  }
};

// ================= DELETE =================

const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(
      req.params.id
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.log("Delete Banner Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete banner",
      error: error.message,
    });
  }
};

// ================= STATUS =================

const toggleBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    banner.status = !banner.status;

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner status updated",
      data: banner,
    });
  } catch (error) {
    console.log("Banner Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update banner status",
      error: error.message,
    });
  }
};

module.exports = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
};