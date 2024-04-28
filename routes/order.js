const express = require("express");
const router = express.Router();
const Order = require("../models/order");

const createOrderId = async () => {
  const count = await Order.countDocuments();
  return count === 0 ? `100001` : `${count + 1}`;
};

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { body } = req;
    const orderId = await createOrderId();
    const order = new Order({ ...body, orderId });
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    let { visitorId, mobile, created_at, page, perPage } = req.query;

    let filters = {};
    if (visitorId) {
      filters.visitorId = visitorId;
    }
    if (mobile) {
      filters.mobile = mobile;
    }
    if (created_at) {
      filters.created_at = created_at;
    }

    page = parseInt(page);
    perPage = parseInt(perPage);

    const orders = await Order.find(filters)
      .skip(page * perPage)
      .limit(perPage)
      .lean();
    res.send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update order by ID
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    res.send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete order by ID
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
