const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  product_id: { type: Schema.Types.ObjectId, ref: "Product" },
  inventory_id: { type: Schema.Types.ObjectId, ref: "ProductInventory" },
  quantity: Number,
  amount: Number,
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = { Cart };
