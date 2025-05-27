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

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});