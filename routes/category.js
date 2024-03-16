const express = require("express");

const Category = require("../models/category");
const Product = require("../models/product");
const app = express.Router();

app.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
  });
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/:id", getCategory, (req, res) => {
  res.json(res.category);
});

app.put("/:id", getCategory, async (req, res) => {
  if (req.body.name != null) {
    res.category.name = req.body.name;
  }
  try {
    const updatedCategory = await res.category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/:id", getCategory, async (req, res) => {
  try {
    const { id } = req.params;

    const productsWithCategory = await Product.countDocuments({
      category: id,
    }).lean();

    if (productsWithCategory) {
      res.status(400).json({
        message: "Couldn't delete category, because it's assigned to products",
      });
      return;
    }
    await Category.deleteOne({ _id: id });
    res.json({ message: "Deleted Category" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a single category by ID
async function getCategory(req, res, next) {
  let category;
  try {
    category = await Category.findById(req.params.id);
    if (category == null) {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.category = category;
  next();
}

module.exports = app;
