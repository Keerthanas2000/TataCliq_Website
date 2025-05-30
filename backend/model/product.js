const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  type: { type: String, required: true },

  price: { type: Number, required: true },
  brand: { type: String, required: true },
  images: [{ type: String, required: true }],
  description: { type: String, required: true },
  sellername: { type: String, required: true },
  sellerId: { type: String, required: true },
  shipmentIndays: { type: Number, required: true },
  sizes:{ type: [String], required: true },
  stock: [
    {
      size: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ]});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
