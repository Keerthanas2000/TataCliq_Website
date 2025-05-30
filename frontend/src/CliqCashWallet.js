import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PushPinIcon from "@mui/icons-material/PushPin";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Divider,
  List,
  ListItem,
} from "@mui/material";
import {
  Bolt as BoltIcon,
  AssignmentReturn as RefundIcon,
  AccountBalanceWallet as WalletIcon,
  Lock as SecureIcon,
  Info as NoteIcon,
} from "@mui/icons-material";

const CliqCashWallet = () => {
  const navigate = useNavigate();
  const [cliqCash, setCliqCash] = useState(0);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    const token = user?.token || sessionStorage.getItem("token");
    if (!token) {
      setError("Please log in to view wallet.");
      navigate("/login");
      return;
    }

    const fetchCliqCash = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCliqCash(response.data.user.cliqCash || 0);
      } catch (err) {
        console.error("Error fetching cliqCash:", err);
        setError(err.response?.data?.message || "Failed to load wallet balance.");
      }
    };
    fetchCliqCash();
  }, [user, navigate]);

  const handleExternalNavigate = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#333", mb: 1 }}
              >
                CLiQ Cash Wallet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Available Balance
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mt: 1, color: "#333" }}
              >
                ₹{cliqCash.toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                A quick and convenient way for faster checkout and refund.
              </Typography>
            </Box>
          </Stack>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box
            sx={{
              backgroundColor: "#fff8e1",
              borderLeft: "4px solid #ffc107",
              borderRadius: "4px",
              p: 1.5,
              mt: 3,
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <PushPinIcon sx={{ color: "#ff9800", fontSize: "16px" }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: "500", fontSize: "0.8rem" }}
            >
              ₹100 CLiQ Cash will expire on <b>May 31, 2025</b>
            </Typography>
          </Box>
        </CardContent>
      </Card>

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
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            The CLiQ Cash Advantage
          </Typography>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ color: "primary.main" }}>
                <BoltIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  FASTER CHECKOUT
                </Typography>
                <Typography variant="body2">Instant Checkout</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Box sx={{ color: "primary.main" }}>
                <RefundIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  FASTER REFUNDS
                </Typography>
                <Typography variant="body2">
                  Get Refunds instantly post successful pick up
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Box sx={{ color: "primary.main" }}>
                <WalletIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  CONSOLIDATED WALLET
                </Typography>
                <Typography variant="body2">
                  All balances at one place
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Box sx={{ color: "primary.main" }}>
                <SecureIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Safe & Secure
                </Typography>
                <Typography variant="body2">
                  Your trusted place to keep money
                </Typography>
              </Box>
            </Stack>
          </Stack>
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
              onClick={() => handleExternalNavigate("https://www.tatacliq.com/cliq-cash-tnc")}
              variant="text"
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

export default CliqCashWallet;