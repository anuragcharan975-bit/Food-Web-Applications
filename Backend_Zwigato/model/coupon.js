const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountType: {
      type: String,
      enum: ["Percentage", "Fixed"],
      default: "Percentage",
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minimumAmount: {
      type: Number,
      default: 0,
    },
    expiryDate: Date,
    usageLimit: {
      type: Number,
      default: 100,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const coupan= mongoose.model("coupon", couponSchema);
module.exports = coupan