import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  TextField,
  Divider,
  Alert,
  List,
  ListItem,
} from "@mui/material";
import { Info as NoteIcon } from "@mui/icons-material";

const GiftCardPage = () => {
  const navigate = useNavigate();
  const [giftCardBalance, setGiftCardBalance] = useState(0);
  const [error, setError] = useState("");
  const [giftCardData, setGiftCardData] = useState({
    email: "keerthanashhardwaj@gmail.com",
    amount: "100",
    senderName: "Keerthana S",
  });
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    const token = user?.token || sessionStorage.getItem("token");
    if (!token) {
      setError("Please log in to view gift card balance.");
      navigate("/login");
      return;
    }

    const fetchGiftCardBalance = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGiftCardBalance(response.data.user.giftCard || 0);
      } catch (err) {
        console.error("Error fetching giftCard balance:", err);
        setError(err.response?.data?.message || "Failed to load gift card balance.");
      }
    };
    fetchGiftCardBalance();
  }, [user, navigate]);

  const handleExternalNavigate = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAmountSelect = (amount) => {
    setGiftCardData({ ...giftCardData, amount });
    setError("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setGiftCardData({ ...giftCardData, amount: value });

    if (value) {
      const amount = parseFloat(value);
      if (isNaN(amount) || amount < 10 || amount > 10000) {
        setError("Enter an amount between ₹10–₹10,000");
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!giftCardData.amount) {
      setError("Please select or enter an amount");
      return;
    }

    const amount = parseFloat(giftCardData.amount);
    if (isNaN(amount) || amount < 10 || amount > 10000) {
      setError("Enter an amount between ₹10–₹10,000");
      return;
    }

    const giftCardJson = {
      recipientEmail: giftCardData.email,
      amount,
      senderName: giftCardData.senderName,
      currency: "INR",
      timestamp: new Date().toISOString(),
    };

    console.log("Gift Card Data:", giftCardJson);
    alert(`Gift card data saved: ${JSON.stringify(giftCardJson, null, 2)}`);
  };

  return (
    <Box sx={{ mx: 4, mt: 20, mb: 4, position: "relative", minHeight: "80vh" }}>
      <Card
        sx={{
          p: 3,
          margin: "60px",
          width: "60%",
          backgroundColor: "rgba(171, 138, 138, 0.05)",
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <CardContent>
          <Button
            variant="text"
            onClick={() => navigate("/cliqcashwallet")}
            sx={{
              textTransform: "none",
              color: "primary.main",
              fontWeight: "bold",
              mb: 3,
              p: 0,
            }}
          >
            ‹ Back to CLIQ Cash
          </Button>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Gift Card Balance: ₹{giftCardBalance.toFixed(2)}
          </Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Buy Yourself CLiQ Gift Card
          </Typography>
          <img
            style={{
              height: "30vh",
              width: "50%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            src={"https://www.tatacliq.com/src/account/components/img/gift_card.png"}
            alt={"Gift Card"}
          />
          <Stack direction="row" spacing={2} sx={{ mb: 2, mt: 4 }}>
            <Button
              variant={giftCardData.amount === "100" ? "contained" : "outlined"}
              onClick={() => handleAmountSelect("100")}
            >
              ₹100
            </Button>
            <Button
              variant={giftCardData.amount === "500" ? "contained" : "outlined"}
              onClick={() => handleAmountSelect("500")}
            >
              ₹500
            </Button>
            <Button
              variant={giftCardData.amount === "1000" ? "contained" : "outlined"}
              onClick={() => handleAmountSelect("1000")}
            >
              ₹1,000
            </Button>
            <Button
              variant={giftCardData.amount === "2000" ? "contained" : "outlined"}
              onClick={() => handleAmountSelect("2000")}
            >
              ₹2,000
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Or enter an amount between ₹10–₹10,000
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            variant="outlined"
            sx={{ mb: 2 }}
            value={giftCardData.amount}
            onChange={handleCustomAmountChange}
            inputProps={{ min: 10, max: 10000 }}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Recipient details
          </Typography>
          <TextField
            fullWidth
            label="Enter email ID of the receiver*"
            variant="outlined"
            sx={{ mb: 2 }}
            value={giftCardData.email}
            onChange={(e) => setGiftCardData({ ...giftCardData, email: e.target.value })}
          />
          <Typography variant="body2" sx={{ mb: 3 }}>
            {giftCardData.senderName} (from) <Button color="primary">Change</Button>
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ mb: 3, py: 1.5 }}
            onClick={handleSubmit}
            disabled={!!error || !giftCardData.amount}
          >
            Buy Gift Card
          </Button>
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={2}>
            <Box sx={{ color: "warning.main" }}>
              <NoteIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Please Note
              </Typography>
              <List dense sx={{ py: 0, listStyleType: "disc", pl: 2 }}>
                <ListItem sx={{ display: "list-item", p: 0, pl: 1 }}>
                  <Typography variant="body2">
                    CLiQ Cash can't be cancelled or transferred to another account.
                  </Typography>
                </ListItem>
                <ListItem sx={{ display: "list-item", p: 0, pl: 1 }}>
                  <Typography variant="body2">
                    It can't be withdrawn in the form of cash or transferred to any bank account. It can't be used to purchase Gift Cards.
                  </Typography>
                </ListItem>
                <ListItem sx={{ display: "list-item", p: 0, pl: 1 }}>
                  <Typography variant="body2">
                    Net-banking and credit/debit cards issued in India can be used for CLiQ Credit top up.
                  </Typography>
                </ListItem>
                <ListItem sx={{ display: "list-item", p: 0, pl: 1 }}>
                  <Typography variant="body2">
                    CLiQ Cash has an expiration date. Check FAQs for details.
                  </Typography>
                </ListItem>
              </List>
            </Box>
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={10} justifyContent="flex-start">
            <Button
              variant="text"
              onClick={() => handleExternalNavigate("https://www.tatacliq.com/cliq-cash-faq")}
              sx={{
                textTransform: "none",
                color: "primary.main",
                fontWeight: "bold",
                p: 0,
                minWidth: 0,
              }}
              endIcon={<span style={{ fontSize: "0.8rem" }}>›</span>}
            >
              FAQ's
            </Button>
            <Button
              variant="text"
              onClick={() => handleExternalNavigate("https://www.tatacliq.com/cliq-cash-tnc")}
              sx={{
                textTransform: "none",
                color: "primary.main",
                fontWeight: "bold",
                p: 0,
                minWidth: 0,
              }}
              endIcon={<span style={{ fontSize: "0.8rem" }}>›</span>}
            >
              T&C's
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GiftCardPage;