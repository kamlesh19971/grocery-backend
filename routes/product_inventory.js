// brandRoutes.js
const express = require("express");
const router = express.Router();
const ProductInventory = require("../models/product_inventory");
const Product = require("../models/product");
const mongoose = require("mongoose");

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

    skip = parseInt(skip) || 0;
    limit = parseInt(limit) || 10;

    if (product_id) {
      query["product_id"] = new mongoose.Types.ObjectId(req.query.product_id);
    }
    if (brand_id) {
      query["brand_id"] = new mongoose.Types.ObjectId(req.query.brand_id);
    }
    const productInventory = await ProductInventory.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$brand_id",
          product_id: { $first: "$product_id" },
          productInventory: {
            $push: {
              _id: "$_id",
              quantity: "$quantity",
              price: "$price",
              unit: "$unit",
            },
          },
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand",
      },
      {
        $project: {
          _id: 0,
          brand: "$brand",
          productInventory: 1,
        },
      },
      {
        $sort: { "brand.name": 1 },
      },
      {
        $skip: skip,
      },
      { $limit: limit },
    ]);

    const product = await Product.findById(product_id).select("name").lean();

    res.json({ productInventory, product });
  } catch (err) {
    console.log(err);
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
