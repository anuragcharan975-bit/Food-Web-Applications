const Address = require("../../model/address");


// ================= GET ALL USER ADDRESSES =================

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.params.userId,
    })
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get addresses",
      error: error.message,
    });
  }
};


// ================= GET ADDRESS BY ID =================

const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.params.userId,
    }).populate("user");

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get address",
      error: error.message,
    });
  }
};


// ================= CREATE ADDRESS =================

const createAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.params.userId,
    });

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create address",
      error: error.message,
    });
  }
};


// ================= UPDATE ADDRESS =================

const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
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

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};


// ================= DELETE ADDRESS =================

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.params.userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};


// ================= EXPORT =================

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};