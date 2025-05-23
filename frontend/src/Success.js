import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

function Success() {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    const saveOrder = async () => {
      try {
        const sessionId = localStorage.getItem("stripeSessionId");
        const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));

        if (!sessionId || !orderDetails || !user) {
          setError("Order details or user not found.");
          return;
        }

        const { cartItems, totalPrice, deliveryCharges, taxes, grandTotal } = orderDetails;

        await axios.post(
          "http://localhost:3010/api/orders/create",
          {
            cartItems,
            totalPrice,
            deliveryCharges,
            taxes,
            grandTotal,
            stripeSessionId: sessionId,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        localStorage.removeItem("stripeSessionId");
        localStorage.removeItem("orderDetails");
      } catch (err) {
        if (err.response?.data?.error === "Order already exists") {
          localStorage.removeItem("stripeSessionId");
          localStorage.removeItem("orderDetails");
        } else {
          console.error("Error saving order:", err);
          setError(err.response?.data?.message || "Failed to save order. Please contact support.");
        }
      }
    };

    saveOrder();
  }, [dispatch, user]);

  return (
    <div className="container text-center py-5">
      <h2>Payment Successful!</h2>
      <p>Thank you for your purchase.</p>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Link to="/" className="btn btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
}

export default Success;