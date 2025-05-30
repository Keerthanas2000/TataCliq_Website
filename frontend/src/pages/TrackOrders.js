import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  styled,
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

function TrackOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userdata"));
    if (!userData) {
      setError("Please log in to view your orders.");
      navigate("/login");
      return;
    }

    const userId = userData._id;

    const fetchOrdersAndProducts = async () => {
      try {
        const ordersResponse = await axios.get(
          `http://localhost:5000/api/orders/user/${userId}`
        );
        const fetchedOrders = ordersResponse.data.orders || [];

        const ordersWithProducts = await Promise.all(
          fetchedOrders.map(async (order) => {
            const itemsWithProducts = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const productResponse = await axios.get(
                    `http://localhost:5000/api/products?productId=${item._id}`
                  );
                  const product = productResponse.data.products[0] || {};
                  return { ...item, productDetails: product };
                } catch (err) {
                  console.error(`Error fetching product ${item._id}:`, err);
                  return { ...item, productDetails: {} };
                }
              })
            );
            return { ...order, items: itemsWithProducts };
          })
        );

        setOrders(ordersWithProducts);
        console.log("Fetched orders:", ordersWithProducts);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Failed to load orders.");
      }
    };
    fetchOrdersAndProducts();
  }, [navigate]);

  const getActiveStep = (status) => {
    const stepIndex = steps.findIndex((step) => step.status === status);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 12, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Track Your Orders
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {orders.length === 0 && !error ? (
        <>
          <Typography variant="body1" color="text.secondary">
            No orders found. Let's place First Order?
          </Typography>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '10px', display: 'inline-block' }}>
            Continue Shopping
          </Link>
        </>
      ) : (
        orders.map((order) => (
          <Paper key={order._id} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="body2" gutterBottom>
              Order ID #{order.orderId}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Items:</Typography>
              {order.items.map((item) => (
                <Box key={item._id} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", mb: 1 }}>
                    <img
                      src={item.image }
                      alt={item.productDetails.name || "Product"}
                      style={{
                        width: 60,
                        height: 120,
                        objectFit: "cover",
                        mr: 2,
                      }}
                    />
                    <Box sx={{ marginLeft: 10 }}>
                      <Typography variant="body2">{item.productDetails.name || item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity} | Price: ₹{item.price} | Total: ₹{item.total_item_price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Size: {item.size || "N/A"}
                      </Typography>
                      {item.productDetails && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Category: {item.productDetails.category || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Subcategory: {item.productDetails.subcategory || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Brand: {item.productDetails.brand || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Type: {item.productDetails.type || "N/A"}
                          </Typography>
                        </Box>
                      )}
                    </Box>
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

export default TrackOrders;