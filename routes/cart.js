// Import necessary modules
const express = require("express");
const router = express.Router();
const { Cart } = require("../models/cart"); // Import the Cart model

// Create a new cart item
router.post("/cart", async (req, res) => {
  try {
    const cartItem = new Cart(req.body);
    await cartItem.save();
    res.status(201).send(cartItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all cart items
router.get("/cart", async (req, res) => {
  try {
    const { user_id } = req.query;
    const cartItems = await Cart.find({
      user_id,
    })
      .populate({
        path: "product_id",
        select: "name",
      })
      .populate({
        path: "inventory_id",
        select: "quantity unit price",
      });
    res.send(cartItems);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific cart item by ID
router.get("/cart/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).send();
    }
    res.send(cartItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a cart item by ID
router.patch("/cart/:id", async (req, res) => {
  const { quantity } = req.body;

  try {
    const cartItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: { quantity: quantity } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!cartItem) {
      return res.status(404).send();
    }
    res.send(cartItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a cart item by ID
router.delete("/cart/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartItem) {
      return res.status(404).send();
    }
    res.send(cartItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
