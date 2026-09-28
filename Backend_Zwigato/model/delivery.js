const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Assigned",
        "Picked",
        "On The Way",
        "Delivered",
        "Cancelled",
      ],
      default: "Assigned",
    },

    deliveryTime: {
      type: Date,
      default: null,
    },

    location: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;