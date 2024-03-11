require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");
const productApi = require("./products-api");

const app = express();
const port = 5000;

(() => {
  db().then(() => console.log("MongoDB connected"));
})();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/product", productApi);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
