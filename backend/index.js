const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const orderRoutes = require("./Routes/orderRoutes");

const connecttoDb = require("./config/database");

dotenv.config();

const PORT = process.env.PORT || 5000; // Changed to 5000

const app = express();
connecttoDb();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});