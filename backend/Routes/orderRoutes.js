// const express = require("express");
// const Order=require("../model/Order")

// const router = express.Router();

// router.get("/user/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const orders = await Order.find({ userId }).sort({ createdAt: -1 });
//     res.status(200).json({ orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const Order = require("../model/Order");
const mongoose = require("mongoose");
const { verifyToken } = require("../middleware/verification");

const router = express.Router();

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/seller/:sellerId", verifyToken, async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid sellerId" });
    }

    if (req.user.id !== sellerId && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied: Seller or SuperAdmin only" });
    }

    const orders = await Order.find({ "items.sellerId": sellerId })
      .populate("items.productId", "title")
      .populate("userId", "email name")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:orderId/item/:itemId/status", verifyToken, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { packagestatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid orderId or itemId" });
    }

    const validStatuses = [
      "order_placed",
      "payment_confirmed",
      "order_confirmed",
      "packed",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled"
    ];
    if (!validStatuses.includes(packagestatus)) {
      return res.status(400).json({ message: "Invalid packagestatus" });
    }

    const order = await Order.findOne({ 
      _id: orderId, 
      "items._id": itemId 
    });

    if (!order) {
      return res.status(404).json({ message: "Order or item not found" });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (req.user.id !== item.sellerId.toString() && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied: Seller or SuperAdmin only" });
    }

    order.items.id(itemId).packagestatus = packagestatus;
    await order.save();

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error updating packagestatus:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;