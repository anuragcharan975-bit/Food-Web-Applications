const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: String,
    description: String,
  },
  { timestamps: true }
);
const category= mongoose.model("category", categorySchema);
module.exports =category