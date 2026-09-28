const Delivery = require("../../model/delivery");

// ================= CREATE DELIVERY =================

const createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);

    res.status(201).json({
      success: true,
      message: "Delivery created successfully",
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create delivery",
      error: error.message,
    });
  }
};

// ================= GET ALL DELIVERIES =================

const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("order")
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get deliveries",
      error: error.message,
    });
  }
};

// ================= GET DELIVERY BY ID =================

const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("order")
      .populate("user");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get delivery",
      error: error.message,
    });
  }
};

// ================= UPDATE DELIVERY =================

const updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery updated successfully",
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update delivery",
      error: error.message,
    });
  }
};

// ================= DELETE DELIVERY =================

const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete delivery",
      error: error.message,
    });
  }
};

// ================= EXPORT =================

module.exports = {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
};