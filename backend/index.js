const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");

const connecttoDb = require("./config/database");

dotenv.config();


const PORT = process.env.PORT || 3010;

const app = express();
connecttoDb();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes); 
app.use("/api/products", productRoutes); 
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const Stripe = require("stripe");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems } = req.body;

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
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

module.exports = router;



