const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    name: String,
    city: String,
    state: String,
    pincode: String
  },
  {
    versionKey: false
  }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;