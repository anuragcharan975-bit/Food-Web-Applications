const OrderItem = require("../../model/orderItem");

// ================= CREATE ORDER ITEM =================

const createOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.create(req.body);

    res.status(201).json({
      success: true,
      message: "Order item created successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order item",
      error: error.message,
    });
  }
};

// ================= GET ALL ORDER ITEMS =================

const getAllOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.find()
      .populate("order")
      .populate("food")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order items",
      error: error.message,
    });
  }
};

// ================= GET ORDER ITEM BY ID =================

const getOrderItemById = async (req, res) => {
  try {
    const item = await OrderItem.findById(req.params.id)
      .populate("order")
      .populate("food");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order item",
      error: error.message,
    });
  }
};

// ================= UPDATE ORDER ITEM =================

const updateOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order item updated successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order item",
      error: error.message,
    });
  }
};

// ================= DELETE ORDER ITEM =================

const deleteOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order item",
      error: error.message,
    });
  }
};

// ================= EXPORT =================

module.exports = {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
};