const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        phone: String,

        subject: String,

        message: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Read",
                "Resolved"
            ],
            default: "Pending",
        },
    },
    { timestamps: true }
);
const contactMessage = mongoose.model("contactMessage", contactMessageSchema);
module.exports = contactMessage