import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { clearCart } from "./actions/CartActions";
import { Typography, Button, Box, Alert } from "@mui/material";

function PaymentSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token || !sessionId) {
          setError("Missing session ID or user authentication.");
          navigate("/cart");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/payment/verify/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === "success") {
          dispatch(clearCart());
          localStorage.removeItem("stripeSessionId");
          localStorage.removeItem("orderDetails");
        } else {
          setError("Payment not confirmed. Please contact support.");
          navigate("/cart");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(err.response?.data?.error || "Failed to verify payment. Please try again.");
        navigate("/cart");
      }
    };
    verifyPayment();
  }, [dispatch, navigate, sessionId]);

  return (
    <Box sx={{ textAlign: "center", mt: 20, p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for your order. You'll receive a confirmation soon.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 2, maxWidth: "500px", mx: "auto" }}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ mt: 2 }}
      >
        Continue Shopping
      </Button>
    </Box>
  );
}

export default PaymentSuccess;