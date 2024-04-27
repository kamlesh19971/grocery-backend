const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true, default: "" },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
});

const orderSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  mobile: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  address: { type: String, required: true },
  total: { type: Number, required: true },
  created_date: { type: Date, default: Date.now },
  items: { type: [itemSchema], required: true },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
