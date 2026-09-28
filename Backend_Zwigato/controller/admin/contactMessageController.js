const ContactMessage = require("../../model/contactMessage");

// ================= CREATE CONTACT MESSAGE =================

const createContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.create(req.body);

    res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create contact message",
      error: error.message,
    });
  }
};

// ================= GET ALL CONTACT MESSAGES =================

const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get contact messages",
      error: error.message,
    });
  }
};

// ================= GET CONTACT MESSAGE BY ID =================

const getContactMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get contact message",
      error: error.message,
    });
  }
};

// ================= UPDATE CONTACT MESSAGE =================

const updateContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact message updated successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update contact message",
      error: error.message,
    });
  }
};

// ================= DELETE CONTACT MESSAGE =================

const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete contact message",
      error: error.message,
    });
  }
};

// ================= EXPORT =================

module.exports = {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
};