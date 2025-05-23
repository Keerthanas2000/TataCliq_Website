const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProducts,
} = require("../controllers/productController");

router.get("/", getProducts);
router.post("/createProducts", createProducts);
module.exports = router;
