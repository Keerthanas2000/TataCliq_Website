import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { addTocart, removeProd, addToWishlist } from "../actions/CartActions";

function CartDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const deliveryCharges = useSelector((state) => state.cart.deliveryCharges);
  const taxes = useSelector((state) => state.cart.taxes);
  const grandTotal = useSelector((state) => state.cart.grandTotal);
  const user = useSelector((state) => state.user?.user);

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

  const handleCheckout = async () => {
    if (!user) {
      setError("Please log in to proceed with checkout.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty. Add items to proceed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3010/api/payment/create-checkout-session",
        {
          cartItems,
          totalPrice,
          deliveryCharges,
          taxes,
          grandTotal,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const { url, sessionId } = response.data;
      if (url && sessionId) {
        localStorage.setItem("stripeSessionId", sessionId);
        localStorage.setItem("orderDetails", JSON.stringify({
          cartItems,
          totalPrice,
          deliveryCharges,
          taxes,
          grandTotal,
          userId: user._id,
        }));
        window.location.href = url;
      } else {
        throw new Error("No checkout URL or session ID returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.message || "Failed to initiate checkout. Please try again.");
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

            {cartItems.length > 0 && (
              <div className="alert alert-info mb-4">
                Get this order at ₹{grandTotal.toFixed(2)} only!
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
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.title}</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <span className="text-danger fw-bold">
                            ₹{item.price.toFixed(2)}
                          </span>
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
                          <span className="me-2">Size: {item.size || "UK/MID-9"}</span>
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

              <div className="border-top pt-3 mb-3">
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn btn-danger w-100 py-2"
                style={{ backgroundColor: "#ff3e6c", border: "none" }}
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>

              {error && (
                <div className="alert alert-danger mt-2" role="alert">
                  {error}
                </div>
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