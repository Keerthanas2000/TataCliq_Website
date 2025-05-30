import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { addTocart, removeProd, addToWishlist } from "../actions/CartActions";
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Alert,
} from "@mui/material";

function CartDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ address: "", pincode: "" });
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "", cliqCash: 0, giftCard: 0 });
  const [applyCliqCash, setApplyCliqCash] = useState(false);
  const [applyGiftCard, setApplyGiftCard] = useState(false);
  const [cliqCashUsed, setCliqCashUsed] = useState(0);
  const [giftCardUsed, setGiftCardUsed] = useState(0);

  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const deliveryCharges = useSelector((state) => state.cart.deliveryCharges);
  const taxes = useSelector((state) => state.cart.taxes);
  const grandTotal = useSelector((state) => state.cart.grandTotal);
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    const token = user?.token || sessionStorage.getItem("token");
    if (!token) {
      setError("Please log in to view cart details.");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const [profileResponse, addressesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/user/addresses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUserDetails({
          name: profileResponse.data.user.name || "",
          email: profileResponse.data.user.email || "",
          mobile: profileResponse.data.user.mobile || "",
          cliqCash: profileResponse.data.user.cliqCash || 0,
          giftCard: profileResponse.data.user.giftCard || 0,
        });
        setAddresses(addressesResponse.data.addresses || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.response?.data?.message || "Failed to load user data or addresses.");
      }
    };
    fetchUserData();
  }, [user, navigate]);

  useEffect(() => {
    let newGrandTotal = grandTotal;
    let cliqCashApplied = 0;
    let giftCardApplied = 0;

    if (applyCliqCash) {
      cliqCashApplied = Math.min(userDetails.cliqCash, newGrandTotal);
      newGrandTotal -= cliqCashApplied;
    }

    if (applyGiftCard) {
      const maxGiftCard = newGrandTotal * 0.5; // Gift card up to 50%
      giftCardApplied = Math.min(userDetails.giftCard, maxGiftCard);
      newGrandTotal -= giftCardApplied;
    }

    setCliqCashUsed(cliqCashApplied);
    setGiftCardUsed(giftCardApplied);
  }, [applyCliqCash, applyGiftCard, userDetails.cliqCash, userDetails.giftCard, grandTotal]);

  const finalGrandTotal = grandTotal - cliqCashUsed - giftCardUsed;

  useEffect(() => {
    console.log("Cart Items:", cartItems.map(item => ({
      _id: item._id,
      sellerId: item.sellerId,
      sellername: item.sellername,
    })));
  }, [cartItems]);

  const handleIncreaseQuantity = (item) => {
    dispatch(addTocart(item));
  };

  const handleDecreaseQuantity = (item) => {
    dispatch(removeProd(item, item.quantity <= 1));
  };

  const handleRemoveItem = (item) => {
    dispatch(removeProd(item, true));
  };

  const handleWishlistToggle = (item) => {
    dispatch(addToWishlist(item));
    dispatch(removeProd(item, true));
  };

  const handleAddAddress = async () => {
    if (!newAddress.address || !newAddress.pincode) {
      setError("Please fill in both address and pincode.");
      return;
    }
    if (newAddress.pincode.length !== 6 || isNaN(newAddress.pincode)) {
      setError("Pincode must be a 6-digit number.");
      return;
    }
    if (!user?._id) {
      setError("Please log in to add an address.");
      navigate("/login");
      return;
    }

    const token = user?.token || sessionStorage.getItem("token");
    try {
      const newAddressEntry = {
        id: uuidv4(),
        address: newAddress.address,
        pincode: newAddress.pincode,
      };
      const updatedAddresses = [...addresses, newAddressEntry];
      const response = await axios.put(
        "http://localhost:5000/api/user/updateProfile",
        {
          _id: user._id,
          email: userDetails.email,
          mobile: userDetails.mobile,
          name: userDetails.name,
          addresses: updatedAddresses,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(response.data.user.addresses || updatedAddresses);
      setNewAddress({ address: "", pincode: "" });
      setError(null);
    } catch (err) {
      console.error("Error adding address:", err);
      setError(err.response?.data?.message || "Failed to add address. Please try again.");
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleCheckout = async () => {
    const token = user?.token || sessionStorage.getItem("token");
    if (!token || !user) {
      setError("Please log in to proceed with checkout.");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty. Add items to proceed.");
      return;
    }
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }
    if (cartItems.some(item => !item.sellerId || !item.sellername)) {
      setError("Some items are missing seller information. Please remove and add them again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        cartItems: cartItems.map((item) => ({
          _id: item._id,
          title: item.title || "Unknown Product",
          price: item.price,
          quantity: item.quantity,
          total_item_price: item.price * item.quantity,
          size: item.size || "N/A",
          color: item.color || "N/A",
          images: item.images || ["/images/fallback.jpg"],
          sellerId: item.sellerId,
          sellername: item.sellername,
          packagestatus: "order_placed",
        })),
        totalPrice,
        deliveryCharges,
        taxes,
        grandTotal: finalGrandTotal,
        cliqCashUsed,
        giftCardUsed,
        deliveryAddress: {
          id: selectedAddress.id,
          address: selectedAddress.address,
          pincode: selectedAddress.pincode,
        },
      };

      console.log("Checkout payload:", payload);

      const response = await axios.post(
        "http://localhost:5000/api/payment/create",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { url, sessionId } = response.data;
      if (url && sessionId) {
        localStorage.setItem("stripeSessionId", sessionId);
        localStorage.setItem("orderDetails", JSON.stringify(payload));
        window.location.href = url;
      } else {
        throw new Error("No checkout URL or session ID returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.error || "Failed to initiate checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "1200px" }}>
      {cartItems?.length > 0 ? (
        <div className="row" style={{ marginTop: "120px" }}>
          <div className="col-md-8 pe-4">
            <h4 className="mb-4 fw-bold">My Bag</h4>
            {userDetails.name && (
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  User Details
                </Typography>
                <Typography variant="body2">Name: {userDetails.name}</Typography>
                <Typography variant="body2">Email: {userDetails.email}</Typography>
                <Typography variant="body2">Mobile: {userDetails.mobile}</Typography>
                <Typography variant="body2">Cliq Cash: ₹{userDetails.cliqCash}</Typography>
                <Typography variant="body2">Gift Card: ₹{userDetails.giftCard}</Typography>
              </Box>
            )}
            {cartItems.length > 0 && (
              <div className="alert alert-info mb-4">
                Get this order at ₹{finalGrandTotal.toFixed(2)} only!
              </div>
            )}
            <div className="card mb-3 p-3">
              {cartItems.map((item) => (
                <div key={item._id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : "/images/fallback.jpg"}
                      alt={item.title || "Product"}
                      className="me-3"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.title}</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <span className="text-danger fw-bold">₹{item.price.toFixed(2)}</span>
                          <span className="text-decoration-line-through text-muted ms-2">
                            ₹{(item.price * 1.25).toFixed(2)}
                          </span>
                          <span className="text-success ms-2">
                            {Math.round((1 - item.price / (item.price * 1.25)) * 100)}% Off
                          </span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Color: {item.color || "N/A"}</small>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="me-2">Size: {item.size || "N/A"}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleDecreaseQuantity(item)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleIncreaseQuantity(item)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-2">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleRemoveItem(item)}
                    >
                      Remove
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleWishlistToggle(item)}
                    >
                      Save to Wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <h6 className="mb-3 fw-bold">Order Summary</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Bag Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Processing Fee</span>
                <span className="text-success">FREE</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Charges</span>
                <span>₹{deliveryCharges.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Taxes</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applyCliqCash}
                    onChange={(e) => setApplyCliqCash(e.target.checked)}
                    disabled={userDetails.cliqCash <= 0}
                  />
                }
                label={`Apply Cliq Cash (₹${userDetails.cliqCash})`}
                sx={{ mb: 1 }}
              />
              {applyCliqCash && cliqCashUsed > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Cliq Cash Discount</span>
                  <span>-₹{cliqCashUsed.toFixed(2)}</span>
                </div>
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applyGiftCard}
                    onChange={(e) => setApplyGiftCard(e.target.checked)}
                    disabled={userDetails.giftCard <= 0}
                  />
                }
                label={`Apply Gift Card (₹${userDetails.giftCard})`}
                sx={{ mb: 1 }}
              />
              {applyGiftCard && giftCardUsed > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Gift Card Discount</span>
                  <span>-₹{giftCardUsed.toFixed(2)}</span>
                </div>
              )}
              <div className="border-top pt-3 mb-3">
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>₹{finalGrandTotal.toFixed(2)}</span>
                </div>
              </div>
              <Typography variant="subtitle2" gutterBottom>
                Select Delivery Address
              </Typography>
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <FormControlLabel
                    key={address.id}
                    control={
                      <Checkbox
                        checked={selectedAddress?.id === address.id}
                        onChange={() => handleAddressSelect(address)}
                      />
                    }
                    label={`${address.address}, ${address.pincode}`}
                    sx={{ mb: 1 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" mb={2}>
                  No addresses saved. Add one below.
                </Typography>
              )}
              <Typography variant="subtitle2" gutterBottom>
                Add New Address
              </Typography>
              <TextField
                fullWidth
                label="Address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                margin="dense"
                inputProps={{ maxLength: 6 }}
              />
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2, mb: 2 }}
                onClick={handleAddAddress}
              >
                Add Address
              </Button>
              {selectedAddress && (
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Address
                  </Typography>
                  <Typography variant="body2">
                    {selectedAddress.address}, {selectedAddress.pincode}
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ py: 1.5, backgroundColor: "#ff3e6c" }}
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </Button>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="row" style={{ marginTop: "120px" }}>
          <div className="text-center py-5">
            <h4 className="mb-3">Your bag is empty!</h4>
            <p className="text-muted mb-4">Let's fill it up shall we?</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartDetails;