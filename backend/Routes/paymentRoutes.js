const express = require("express");
const Stripe = require("stripe");
const { v4: uuidv4 } = require("uuid");
const Order=require("../model/Order")
const User= require("../model/user")
const { verifyToken } = require("../middleware/verification");

const router = express.Router();
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create", verifyToken, async (req, res) => {
  try {
    const {
      cartItems,
      totalPrice,
      deliveryCharges,
      taxes,
      grandTotal,
      deliveryAddress,
    } = req.body;
    const userId = req.user.id;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }
    if (!deliveryAddress || !deliveryAddress.id || !deliveryAddress.address || !deliveryAddress.pincode) {
      return res.status(400).json({ error: "Valid delivery address is required" });
    }

    // Validate cartItems
    for (const item of cartItems) {
      if (!item.title) {
        return res.status(400).json({ error: "Each cart item must have a title" });
      }
    }

    // Create Stripe checkout session
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          images: item.images || [],
          metadata: { size: item.size || "N/A", color: item.color || "N/A" },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/cart",
      metadata: { userId },
    });

    // Create order
    const orderItems = cartItems.map((item) => ({
      productId: item._id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      total_item_price: item.total_item_price,
      size: item.size || "N/A",
      color: item.color || "N/A",
      image: item.images?.[0] || "/images/fallback.jpg",
    }));

    const order = new Order({
      orderId: uuidv4(),
      userId,
      items: orderItems,
      totalPrice,
      deliveryCharges,
      taxes,
      grandTotal,
      deliveryAddress,
      stripeSessionId: session.id,
      status: "success", // Temporary
    });

    await order.save();
    console.log("Order created:", order._id, "Order ID:", order.orderId);

    // Update user's orderHistory and clear cart
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { orderHistory: order._id },
        $set: { cart: [] },
      },
      { new: true }
    );

    res.status(201).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error.message, error.stack);
    res.status(500).json({ error: `Failed to create checkout session: ${error.message}` });
  }
});

router.get("/verify/:sessionId", verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const order = await Order.findOne({ stripeSessionId: sessionId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ status: order.status });
  } catch (error) {
    console.error("Error verifying payment:", error.message, error.stack);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

module.exports = router;