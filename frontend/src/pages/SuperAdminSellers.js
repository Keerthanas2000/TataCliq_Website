import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";

function SuperAdminSellers() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    mobile: "",
    name: "",
    address: "",
    pincode: "",
    password: "",
  });
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSellers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/sellers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSellers(response.data.sellers || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load sellers.");
      }
    };
    fetchSellers();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/seller",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Seller created successfully!");
      setSellers([response.data.user, ...sellers]);
      setForm({
        email: "",
        mobile: "",
        name: "",
        address: "",
        pincode: "",
        password: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create seller.");
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 12, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        SuperAdmin: Add New Seller
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mobile (10 digits)"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ pattern: "\\d{10}", maxLength: 10 }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Pincode (6 digits)"
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ pattern: "\\d{6}", maxLength: 6 }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Create Seller
        </Button>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {" "}
          Seller List{" "}
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller._id}>
                <TableCell>{seller._id}</TableCell>
                <TableCell>{seller.name}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{seller.mobile}</TableCell>
                <TableCell>
                  {seller.addresses[0]?.address}, {seller.addresses[0]?.pincode}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default SuperAdminSellers;
