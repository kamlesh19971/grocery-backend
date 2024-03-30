const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Product Inventory schema
const productInventorySchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  brand_id: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const ProductInventory = mongoose.model(
  "ProductInventory",
  productInventorySchema
);

module.exports = ProductInventory;
