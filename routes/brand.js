// brandRoutes.js
const express = require("express");
const router = express.Router();
const Brand = require("../models/brand");

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

module.exports = router;
