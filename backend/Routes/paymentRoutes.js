const express = require("express");
const Stripe = require("stripe");
const { verifyToken } = require("../middleware/verification");

const router = express.Router();
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

console.log("verifyToken type:", typeof verifyToken); // Debug log

router.post("/create-checkout-session", verifyToken, async (req, res) => {
  try {
    const { cartItems, totalPrice, deliveryCharges, taxes, grandTotal } = req.body;
    const userId = req.user.userId; // Adjust based on your JWT payload

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          images: item.images || [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cart",
      metadata: {
        cartItems: JSON.stringify(
          cartItems.map((item) => ({
            _id: item._id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            total_item_price: item.total_item_price,
          }))
        ),
        totalPrice,
        deliveryCharges,
        taxes,
        grandTotal,
        userId,
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

module.exports = router;