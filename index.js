// index.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5000;

// Connect to MongoDB (update the connection string)
mongoose
  .connect(
    `mongodb+srv://kamlesh_1997:kamlesh_1997@shah-collections.1k1pn.mongodb.net/grocery_shop?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"));

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,
});

const Product = mongoose.model("Product", productSchema);

app.use(express.json());

// Multer configuration for file uploads
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

app.use("/uploads", express.static("uploads"));

// API endpoint to save a product with an image
app.post("/api/product", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    const imageUrl = req.file.path; // Multer adds a 'file' object to the request

    const newProduct = new Product({
      name,
      price,
      imageUrl,
    });

    const savedProduct = await newProduct.save();

    res.json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
