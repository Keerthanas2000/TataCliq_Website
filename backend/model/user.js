const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  mobile: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  resetToken: { type: String, required: false },
  resetTokenExpiry: { type: Number, required: false },
  name: { type: String, default: "Guest" },
  role: {
    type: String,
    enum: ["user", "seller", "superadmin"],
    default: "user",
  },
  type: { type: String, default: "signin" },
  cliqCash: { type: Number, default: 0 },
  giftCard: { type: Number, default: 0 },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      sellerId: { type: String, required: true },
      sellername: { type: String, required: true },
      packagestatus: { type: String, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  addresses: [
    {
      id: { type: String, required: true },
      address: { type: String, required: true },
      pincode: { type: String, required: true },
    },
  ],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
