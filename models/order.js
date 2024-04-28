const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  // id: { type: String, required: true, default: "" },
  name: { type: String, required: true },
  // imageSrc: { type: String, required: true, default: "" },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  visitorId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  address: { type: String, required: true },
  total: { type: Number, required: true },
  // created_date: { type: Date, default: Date.now },
  created_date: {
    type: Date,
    default: () => new Date().toISOString().split("T")[0],
  },
  items: { type: [itemSchema], required: true },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
