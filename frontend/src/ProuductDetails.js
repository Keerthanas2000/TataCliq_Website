import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { addTocart } from "./actions/CartActions";
import {
  Button,
  TextField,
  Alert,
  IconButton,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const ProductDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showStockAlert, setShowStockAlert] = useState(false);
  const [stock, setStock] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = () => {
      try {
        const storedProduct = localStorage.getItem("currProd");
        if (!storedProduct) {
          setError("No product selected");
          setLoading(false);
          return;
        }

        const parsedProduct = JSON.parse(storedProduct);
        setProduct(parsedProduct);
        setMainImage(parsedProduct.images?.[0] || "");
        const firstAvailableSize =
          parsedProduct.sizes?.find((size) => {
            const sizeStock =
              parsedProduct.stock?.find((s) => s.size === size)?.quantity || 0;
            return sizeStock > 0;
          }) ||
          parsedProduct.sizes?.[0] ||
          "";
        setSelectedSize(firstAvailableSize);
        const initialStock =
          parsedProduct.stock?.find((s) => s.size === firstAvailableSize)
            ?.quantity || 0;
        setStock(initialStock);
        setError(null);
      } catch (error) {
        console.error("Error parsing product from localStorage:", error);
        setError("Failed to load product details");
        setStock(0);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, []);

  useEffect(() => {
    if (product && selectedSize) {
      const sizeStock =
        product.stock?.find((s) => s.size === selectedSize)?.quantity || 0;
      setStock(sizeStock);
      if (quantity > Math.min(5, sizeStock)) {
        setQuantity(Math.min(5, sizeStock));
        setShowStockAlert(sizeStock > 0);
      }
    }
  }, [selectedSize, product, quantity]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    const maxQuantity = Math.min(5, stock || 0);
    if (newQuantity > maxQuantity) {
      setShowStockAlert(true);
      setQuantity(maxQuantity);
    } else {
      setShowStockAlert(false);
      setQuantity(newQuantity);
    }
  };

 const handleAddToCart = () => {
  if (stock <= 0) {
    setShowStockAlert(true);
    return;
  }

  const cartItem = {
    _id: product._id,
    title: product.name,
    price: product.price,
    images: product.images,
    size: selectedSize,
    quantity: 1, // Dispatch one item at a time
    totalPrice: product.price,
  };

  // Dispatch addTocart for each unit of quantity
  for (let i = 0; i < quantity; i++) {
    dispatch(addTocart(cartItem));
  }

  setStock((prev) => prev - quantity);
  setQuantity(1);
  setShowStockAlert(false);
  navigate("/cart");
};

  if (loading) return <Box sx={{ my: 5, textAlign: "center" }}>Loading...</Box>;
  if (error)
    return (
      <Box sx={{ my: 5, textAlign: "center", color: "error.main" }}>
        {error}
      </Box>
    );
  if (!product)
    return <Box sx={{ my: 5, textAlign: "center" }}>No product found</Box>;

  return (
    <Box sx={{ mt: "20vh" }}>
      <Box className="container my-5">
        <Box sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <img
                src={mainImage}
                alt={product.name}
                style={{
                  height: 500,
                  borderRadius: 8,
                  width: "100%",
                }}
              />
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 3, justifyContent: "center" }}
              >
                {product.images?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    style={{
                      width: 80,
                      borderRadius: 4,
                      cursor: "pointer",
                      border:
                        mainImage === img
                          ? "2px solid #a000c8"
                          : "1px solid #ddd",
                    }}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </Stack>
            </Box>

            {/* Right: Product Details Section */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Typography
                variant="body1"
                component="a"
                href="#"
                sx={{ display: "block", mb: 2, textDecoration: "none" }}
              >
                BRAND: {product.brand}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <span style={{ color: "#ffc107" }}>
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star-half-alt" />
                </span>
                <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                  4.1 (21)
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="success.main">
                  Price: ₹{product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Old Price: <del>₹{product.price + 100}</del>
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  About this item:
                </Typography>
                <Typography variant="body2">{product.description}</Typography>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li>
                    Brand: <strong>{product.brand}</strong>
                  </li>
                  <li>
                    Available Stock for {selectedSize || "selected size"}:{" "}
                    <strong>{stock ?? "Loading..."}</strong>
                  </li>
                  <li>
                    Category: <strong>{product.subcategory}</strong>
                  </li>
                  <li>
                    Shipping:{" "}
                    <strong>Within {product.shipmentIndays} days</strong>
                  </li>
                </ul>
              </Box>

              {/* Stock Alert */}
              {showStockAlert && (
                <Alert
                  severity="warning"
                  onClose={() => setShowStockAlert(false)}
                  sx={{ mb: 3 }}
                >
                  {stock <= 0
                    ? "No items available for this size!"
                    : `Maximum ${Math.min(5, stock)} items can be added!`}
                </Alert>
              )}

              {/* Size Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Select Size:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {product.sizes?.map((size) => {
                    const sizeStock =
                      product.stock?.find((s) => s.size === size)?.quantity ||
                      0;
                    return (
                      <Button
                        key={size}
                        variant={
                          selectedSize === size ? "contained" : "outlined"
                        }
                        color="primary"
                        onClick={() => setSelectedSize(size)}
                        disabled={sizeStock <= 0}
                        sx={{ minWidth: 60 }}
                      >
                        {size} {sizeStock <= 0 ? "(Out of Stock)" : ""}
                      </Button>
                    );
                  })}
                </Stack>
              </Box>

              {/* Quantity Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Select Quantity:
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ddd",
                      borderRadius: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={stock <= 0 || quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value) || 1)
                      }
                      inputProps={{ min: 1, max: Math.min(5, stock || 0) }}
                      sx={{ width: 60, "& input": { textAlign: "center" } }}
                      disabled={stock <= 0}
                    />
                    <IconButton
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={
                        stock <= 0 || quantity >= Math.min(5, stock || 0)
                      }
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  {stock <= 0 && (
                    <Typography variant="body2" color="error">
                      Out of Stock
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<i className="fas fa-shopping-cart" />}
                  onClick={handleAddToCart}
                  disabled={stock <= 0}
                  sx={{ px: 4, py: 1 }}
                >
                  {stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </Stack>

              <Box sx={{ borderTop: "1px solid #ddd", pt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Share this product:
                </Typography>
                <Stack direction="row" spacing={2}>
                  <a href="#" style={{ color: "inherit" }}>
                    <i className="fab fa-facebook-f fa-lg" />
                  </a>
                  <a href="#" style={{ color: "inherit" }}>
                    <i className="fab fa-twitter fa-lg" />
                  </a>
                  <a href="#" style={{ color: "inherit" }}>
                    <i className="fab fa-instagram fa-lg" />
                  </a>
                  <a href="#" style={{ color: "inherit" }}>
                    <i className="fab fa-whatsapp fa-lg" />
                  </a>
                  <a href="#" style={{ color: "inherit" }}>
                    <i className="fab fa-pinterest fa-lg" />
                  </a>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetails;
