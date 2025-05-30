import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  styled,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const steps = [
  { status: "order_placed", label: "Order Placed", description: "Order has been placed by the customer." },
  { status: "payment_confirmed", label: "Payment Confirmed", description: "Payment is successfully processed." },
  { status: "order_confirmed", label: "Order Confirmed", description: "Merchant confirms product availability." },
  { status: "packed", label: "Packed", description: "Items are packed and ready for shipment." },
  { status: "shipped", label: "Shipped", description: "Order handed over to courier/logistics partner." },
  { status: "out_for_delivery", label: "Out for Delivery", description: "Courier out for customer delivery." },
  { status: "delivered", label: "Delivered", description: "Customer has received the order." },
  { status: "cancelled", label: "Cancelled", description: "Order cancelled (by admin before shipment)." },
];

const CustomStepIcon = styled("div")(({ theme, active, completed }) => ({
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: completed
    ? theme.palette.success.main
    : active
    ? theme.palette.primary.main
    : theme.palette.grey[400],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: 14,
  fontWeight: "bold",
}));

const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontSize: "0.9rem",
  },
  "& .MuiStepLabel-label.Mui-active": {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: theme.palette.success.main,
  },
}));

function ViewOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userdata"));

    if (!userData || (userData.role !== "seller" && userData.role !== "superadmin")) {
      setError("Please log in as a seller or superadmin to view orders.");
      navigate("/login");
      return;
    }

    const sellerId = userData._id;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/seller/${sellerId}`,
          { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
        );
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Error fetching seller orders:", err);
        const errorMessage = err.response?.data?.message || "Failed to load orders.";
        setError(errorMessage);
      }
    };
    fetchOrders();
  }, [navigate]);

  const getActiveStep = (status) => {
    const stepIndex = steps.findIndex((step) => step.status === status);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const handleStatusUpdate = async (orderId, itemId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/item/${itemId}/status`,
        { packagestatus: newStatus },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
      );

    

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: order.items.map((item) =>
                  item._id === itemId ? { ...item, packagestatus: newStatus } : item
                ),
              }
            : order
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      const errorMessage = err.response?.data?.message || "Failed to update status.";
      setError(errorMessage);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 12, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Seller Orders
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {orders.length === 0 && !error ? (
        <Typography variant="body1" color="text.secondary">
          No orders found.
        </Typography>
      ) : (
        orders.map((order) => (
          <Paper key={order._id} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="body2" gutterBottom>
              Order ID #{order.orderId}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" mb={2}>
              Buyer: {order.userId?.name || "N/A"} ({order.userId?.email || "N/A"})
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Items:</Typography>
              {order.items
                .filter((item) => item.sellerId === JSON.parse(sessionStorage.getItem("userdata"))._id)
                .map((item) => (
                  <Box key={item._id} sx={{ mb: 1 }}>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: 60, height: 120, objectFit: "cover", mr: 2 }}
                      />
                      <Box sx={{ marginLeft: 10 }}>
                        <Typography variant="body2">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity} | Price: ₹{item.price} | Total: ₹{item.total_item_price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Size: {item.size}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {item.packagestatus}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Select
                        value={item.packagestatus}
                        onChange={(e) => handleStatusUpdate(order._id, item._id, e.target.value)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        {steps.map((step) => (
                          <MenuItem key={step.status} value={step.status}>
                            {step.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleStatusUpdate(order._id, item._id, item.packagestatus)}
                      >
                        Update Status
                      </Button>
                    </Box>
                    <Stepper activeStep={getActiveStep(item.packagestatus)} alternativeLabel sx={{ mt: 2 }}>
                      {steps.map((step) => (
                        <Step key={step.status}>
                          <CustomStepLabel>{step.label}</CustomStepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {steps[getActiveStep(item.packagestatus)].description}
                    </Typography>
                  </Box>
                ))}
            </Box>
            <Typography variant="subtitle2" mb={1}>
              Total: ₹{order.grandTotal} (Items: ₹{order.totalPrice} + Delivery: ₹{order.deliveryCharges} + Taxes: ₹{order.taxes})
            </Typography>
            <Typography variant="subtitle2" mb={1}>
              Delivery Address: {order.deliveryAddress.address}, {order.deliveryAddress.pincode}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default ViewOrders;