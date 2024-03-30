// brandRoutes.js
const express = require("express");
const router = express.Router();
const ProductInventory = require("../models/product_inventory");

router.post("/", async (req, res) => {
  try {
    const productInventory = new ProductInventory(req.body);
    await productInventory.save();
    res.status(201).json(productInventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all ProductInventories
router.get("/", async (req, res) => {
  try {
    let { product_id, brand_id, skip, limit } = req.query;

    let query = {};

    if (product_id) {
      query["product_id"] = product_id;
    }
    if (brand_id) {
      query["brand_id"] = brand_id;
    }

    skip = parseInt(skip) || 0;
    limit = parseInt(limit) || 10;

    const productInventories = await ProductInventory.find(query)
      .skip(skip)
      .limit(limit);
    res.json(productInventories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single ProductInventory by ID
router.get("/:id", async (req, res) => {
  try {
    const productInventory = await ProductInventory.findById(req.params.id);
    if (!productInventory) {
      return res.status(404).json({ message: "ProductInventory not found" });
    }
    res.json(productInventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a ProductInventory by ID
router.put("/:id", async (req, res) => {
  try {
    const productInventory = await ProductInventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!productInventory) {
      return res.status(404).json({ message: "ProductInventory not found" });
    }
    res.json(productInventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a ProductInventory by ID
router.delete("/:id", async (req, res) => {
  try {
    const productInventory = await ProductInventory.findByIdAndDelete(
      req.params.id
    );
    if (!productInventory) {
      return res.status(404).json({ message: "ProductInventory not found" });
    }
    res.json({ message: "ProductInventory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
