require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require("path");
const productApi = require("./routes/products");
const categoryapi = require("./routes/category");
const brandApi = require("./routes/brand");
const productInventoryApi = require("./routes/product_inventory");
const cartApi = require("./routes/cart");
const orderApi = require("./routes/order");

const app = express();
const port = 5000;

(() => {
  db().then(() => console.log("MongoDB connected"));
})();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "build")));

app.use("/api/brand", brandApi);
app.use("/api/cart", cartApi);
app.use("/api/category", categoryapi);
app.use("/api/product_inventory", productInventoryApi);
app.use("/api/product", productApi);
app.use("/api/order", orderApi);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
