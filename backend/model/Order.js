

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      total_item_price: { type: Number, required: true },
      size: { type: String, default: "N/A" },
      color: { type: String, default: "N/A" },
      image: { type: String, default: "/images/fallback.jpg" },
    },
  ],
  totalPrice: { type: Number, required: true },
  deliveryCharges: { type: Number, required: true },
  taxes: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  deliveryAddress: {
    id: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  stripeSessionId: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
