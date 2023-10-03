const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      // required: true,
    },
    publicId: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
    },
    subcategories: [
      {
        name: String,
      },
    ],
  },
  { timestamps: true }
);

const category = mongoose.model("Category", categorySchema);

module.exports = category;
