const mongoose = require("mongoose");

// Define Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Create Category model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
