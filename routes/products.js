const express = require("express");

const multer = require("multer");
const path = require("path");
const Product = require("../models/product");
const { pagination } = require("../helper/query");
const app = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

app.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const imageUrl = req.file ? req.file.path : "";

    const newProduct = new Product({
      name,
      price,
      imageUrl,
      category,
    });

    const savedProduct = await newProduct.save();

    res.json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", async (req, res) => {
  try {
    const { page, perPage } = req.query;
    const products = await Product.aggregate([
      ...pagination({ page, perPage }),
      {
        $lookup: {
          from: "productinventories",
          localField: "_id",
          foreignField: "product_id",
          as: "inventory",
        },
      },
      {
        $unwind: {
          path: "$inventory",
          preserveNullAndEmptyArrays: true, // Preserve documents that do not match the $lookup
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          price: {
            $min: {
              $cond: {
                if: { $gt: ["$inventory", null] }, // Check if inventory exists
                then: "$inventory.price", // If inventory price exists, use it
                else: "$price", // Otherwise, use the product price
              },
            },
          },
          imageUrl: { $first: "$imageUrl" },
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { name, price, category } = req.body;
    const result = await Product.findByIdAndUpdate(
      { _id: id },
      { $set: { name, price, category } },
      { new: true }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.deleteOne({ _id: id });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = app;
