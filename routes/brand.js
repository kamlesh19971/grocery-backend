// brandRoutes.js
const express = require("express");
const router = express.Router();
const Brand = require("../models/brand");
const ProductInventory = require("../models/product_inventory");
const { default: mongoose } = require("mongoose");

// Create a brand
router.post("/", async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).send(brand);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all brands
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find().lean();
    res.send(brands);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single brand by ID
router.get("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).lean();
    if (!brand) {
      return res.status(404).send();
    }
    res.send(brand);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a brand by ID
router.patch("/:id", async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!brand) {
      return res.status(404).send();
    }
    res.send(brand);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a brand by ID
router.delete("/:id", async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).send();
    }
    res.send(brand);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/get_by_product/:product_id", async (req, res) => {
  const product_id = new mongoose.Types.ObjectId(req.params.product_id);
  try {
    const brands = await ProductInventory.aggregate([
      {
        $match: {
          product_id: product_id,
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand_id",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand",
      },
      {
        $group: {
          _id: "$brand.name",
          brand_id: { $first: "$brand._id" },
          brand_name: { $first: "$brand.name" },
          items: {
            $push: {
              _id: "$_id",
              quantity: "$quantity",
              unit: "$unit",
              price: "$price",
            },
          },
        },
      },
    ]);
    if (!brands) {
      return res.status(404).send();
    }
    res.send(brands);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
