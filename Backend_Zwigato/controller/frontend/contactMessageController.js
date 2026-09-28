const ContactMessage = require("../../model/contactMessage");


// ================= SEND MESSAGE =================

const createContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.create(req.body);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};


// ================= GET MY MESSAGES =================

const getMyContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get messages",
      error: error.message,
    });
  }
};


module.exports = {
  createContactMessage,
  getMyContactMessages,
};