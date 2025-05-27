import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { notify } from "../utils/toast";
import { v4 as uuidv4 } from "uuid";

function Viewprofile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user?.user); 
  useEffect(() => {
    const storedData = sessionStorage.getItem("userdata");
    const token = sessionStorage.getItem("token");
    
    if (user || (storedData && token)) {
      try {
        const parsedData = storedData ? JSON.parse(storedData) : user;
        setUserData({
          _id: parsedData._id,
          email: parsedData.email || "",
          mobile: parsedData.mobile || "",
          name: parsedData.name || "",
          addresses: parsedData.addresses || [], 
        });
      } catch (e) {
        console.log("Error parsing userdata:", e);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (index, field, value) => {
    setUserData((prev) => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };
      return { ...prev, addresses: updatedAddresses };
    });
  };

  const addAddressField = () => {
    setUserData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, { id: uuidv4(), address: "", pincode: "" }],
    }));
  };

  const removeAddressField = (index) => {
    setUserData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!userData.email && !userData.mobile) {
      setError("At least one of email or mobile is required");
      notify("At least one of email or mobile is required", "error");
      return;
    }
    if (userData.email && !/^\S+@\S+\.\S+$/.test(userData.email)) {
      setError("Invalid email format");
      notify("Invalid email format", "error");
      return;
    }
    if (userData.mobile && !/^[6-9]\d{9}$/.test(userData.mobile)) {
      setError("Invalid mobile number");
      notify("Invalid mobile number", "error");
      return;
    }
    for (let i = 0; i < userData.addresses.length; i++) {
      const addr = userData.addresses[i];
      if (!addr.address) {
        setError(`Address ${i + 1} cannot be empty`);
        notify(`Address ${i + 1} cannot be empty`, "error");
        return;
      }
      if (!addr.pincode || addr.pincode.length !== 6) {
        setError(`Pincode for Address ${i + 1} must be exactly 6 digits`);
        notify(`Pincode for Address ${i + 1} must be exactly 6 digits`, "error");
        return;
      }
    }

    const token = sessionStorage.getItem("token") || user?.token;
    if (!token) {
      setError("Please log in to update profile");
      notify("Please log in to update profile", "error");
      navigate("/login");
      return;
    }

    try {
      console.log("Token:", token); // Debug token
      const response = await axios.put(
        "http://localhost:5000/api/user/updateProfile", // Fixed endpoint
        {
          _id: userData._id,
          email: userData.email,
          mobile: userData.mobile,
          name: userData.name,
          addresses: userData.addresses.map(({ address, pincode, id }) => ({
            id: id || uuidv4(),
            address,
            pincode,
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.user) {
        sessionStorage.setItem("userdata", JSON.stringify(response.data.user));
        setUserData(response.data.user);
        setError("");
        notify("Profile updated successfully!", "success");
        navigate("/");
      } else {
        setError(response.data.message || "Failed to update profile");
        notify(response.data.message || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error("Save Profile Error:", err);
      setError(err.response?.data?.message || "Server error");
      notify(err.response?.data?.message || "Server error", "error");
    }
  };

  if (!userData) return null;

  return (
    <Box sx={{ mx: 4, mt: 20, mb: 4, position: "relative", minHeight: "80vh" }}>
      <Box
        sx={{
          maxHeight: "calc(80vh - 80px)",
          overflowY: "auto",
          pr: 2,
          pb: 10,
        }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={10}>
            <Typography variant="h5" fontWeight="bold">
              My Profile
            </Typography>
          </Grid>
          <Grid size={2}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ textTransform: "none", bgcolor: "#e6335d" }}
            >
              Update Profile
            </Button>
          </Grid>
          <Grid size={6}>
            <TextField
              label="Email"
              name="email"
              value={userData.email || ""}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Mobile"
              name="mobile"
              value={userData.mobile || ""}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Name"
              name="name"
              value={userData.name || ""}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid size={12}>
            <Button
              startIcon={<AddIcon />}
              onClick={addAddressField}
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "#e6335d",
                borderColor: "#e6335d",
              }}
            >
              Add Address
            </Button>
          </Grid>
          {userData?.addresses?.map((addr, index) => (
            <>
              <Grid size={12} sm={10}>
                <Typography variant="h6" fontWeight="bold">
                  Address {index + 1}
                </Typography>
              </Grid>
              <Grid size={6} sm={10}>
                <TextField
                  label={`Address ${index + 1}`}
                  value={addr.address || ""}
                  onChange={(e) =>
                    handleAddressChange(index, "address", e.target.value)
                  }
                  fullWidth
                  rows={5}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={4} sm={10}>
                <TextField
                  label={`Pincode ${index + 1}`}
                  value={addr.pincode || ""}
                  onChange={(e) =>
                    handleAddressChange(index, "pincode", e.target.value)
                  }
                  fullWidth
                  type="text"
                  inputProps={{ maxLength: 6 }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={2} sm={2}>
                <IconButton
                  color="error"
                  onClick={() => removeAddressField(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </>
          ))}
        </Grid>
       
      </Box>
    </Box>
  );
}

export default Viewprofile;