const express = require("express");
const Stripe = require("stripe");
const Order = require("../models/Order");
const User = require("../models/User");
const { verifyToken } = require("../middleware/verification");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create", verifyToken, async (req, res) => {
  try {
    const { cartItems, totalPrice, deliveryCharges, taxes, grandTotal, stripeSessionId } = req.body;
    const userId = req.user.userId; // Adjust based on JWT payload

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    if (!stripeSessionId) {
      return res.status(400).json({ error: "Stripe session ID is required" });
    }

    const existingOrder = await Order.findOne({ stripeSessionId });
    if (existingOrder) {
      return res.status(400).json({ error: "Order already exists" });
    }

    const orderItems = cartItems.map((item) => ({
      productId: item._id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      total_item_price: item.total_item_price,
    }));

    const order = new Order({
      userId,
      items: orderItems,
      totalPrice,
      deliveryCharges,
      taxes,
      grandTotal,
      stripeSessionId,
    });

    await order.save();

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { orderHistory: order._id },
        $set: { cart: [] },
      },
      { new: true }
    );

    res.status(201).json({ message: "Order saved successfully", order });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_SECRET_KEY;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { cartItems, totalPrice, deliveryCharges, taxes, grandTotal, userId } = session.metadata;

    try {
      const existingOrder = await Order.findOne({ stripeSessionId: session.id });
      if (existingOrder) {
        return res.json({ received: true });
      }

      const orderItems = JSON.parse(cartItems).map((item) => ({
        productId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        total_item_price: item.total_item_price,
      }));

      const order = new Order({
        userId,
        items: orderItems,
        totalPrice: parseFloat(totalPrice),
        deliveryCharges: parseFloat(deliveryCharges),
        taxes: parseFloat(taxes),
        grandTotal: parseFloat(grandTotal),
        stripeSessionId: session.id,
      });

      await order.save();

      await User.findByIdAndUpdate(
        userId,
        {
          $push: { orderHistory: order._id },
          $set: { cart: [] },
        },
        { new: true }
      );

      console.log("Order saved via webhook:", order._id);
    } catch (error) {
      console.error("Error saving order via webhook:", error);
      return res.status(500).json({ error: "Failed to save order" });
    }
  }

  res.json({ received: true });
});

module.exports = router;