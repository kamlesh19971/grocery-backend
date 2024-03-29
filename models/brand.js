// brandModel.js
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  // Add more fields as needed
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
