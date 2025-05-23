import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

function Viewprofile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("userdata");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData({
          ...parsedData,
          address: parsedData.address || [],
        });
      } else {
        navigate("/login");
      }
    } catch (e) {
      console.error("Error parsing userdata:", e);
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (index, field, value) => {
    setUserData((prev) => {
      const updatedAddress = [...prev.address];
      updatedAddress[index] = { ...updatedAddress[index], [field]: value };
      return { ...prev, address: updatedAddress };
    });
  };

  const addAddressField = () => {
    setUserData((prev) => ({
      ...prev,
      address: [...prev.address, { address: "", pincode: "" }],
    }));
  };

  const removeAddressField = (index) => {
    setUserData((prev) => ({
      ...prev,
      address: prev.address.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!userData.email    || !userData.mobile) {
      setError(" email and  mobile is required");
      notify(" email and  mobile is required", "error");
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
    for (let i = 0; i < userData.address.length; i++) {
      const pincode = userData.address[i].pincode || "";
      if (pincode && pincode.length !== 6) {
        setError(`Pincode for Address ${i + 1} must be exactly 6 digits`);
        notify(
          `Pincode for Address ${i + 1} must be exactly 6 digits`,
          "error"
        );
        return;
      }
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/updateProfile",
        {
          email: userData.email,
          mobile: userData.mobile,
          name: userData.name,
          address: userData.address,
          _id: userData._id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
          maxHeight: "calc(80vh - 80px)", // Adjust for button height and padding
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
              sx={{ textTransform: "none", bgcolor: "#e6335d;" }}
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
            //   disabled={!!userData.email}
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

                  //    disabled={!!userData.mobile}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Name"
              name="name"
              value={userData.name}
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
          {userData.address.map((addr, index) => (
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
                  color="black"
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
