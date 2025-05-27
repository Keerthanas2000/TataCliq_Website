import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import tatacliqlogo from "../images/tatacliqlogo.png";
import { notify } from "../utils/toast";
import {
  InputAdornment,
  IconButton,
  TextField,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setUser } from "../reducers/userReducer";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    email: "",
    mobile: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character (!@#$%^&* etc.)";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validatePhone = () => {
    const isValid = /^[6-9]\d{9}$/.test(credentials.mobile.trim());
    if (!isValid) {
      notify("Invalid mobile number. Please enter a valid 10-digit number.", "error");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const passwordValidationError = validatePassword(credentials.password);
    if (passwordValidationError) {
      notify(passwordValidationError, "error");
      return;
    }

    if (!isEmailLogin && !validatePhone()) {
      return;
    }

    try {
      const payload = {
        password: credentials.password,
        ...(isEmailLogin ? { email: credentials.email.trim() } : { mobile: credentials.mobile.trim() }),
      };
      const res = await axios.post("http://localhost:5000/api/user/login", payload);
      const { token, user } = res.data;
      
      // Store in sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userdata", JSON.stringify(user));
      
      // Store in Redux
      dispatch(setUser({ ...user, token }));

      notify("Login successful!", "success");
      user.type === "Register" ? navigate("/viewprofile") : navigate("/");
    } catch (error) {
      notify(error.response?.data?.message || "Something went wrong", "error");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/user/forgot-password", {
        email: forgotEmail,
      });
      notify(res.data.message, "success");
      setShowForgotPassword(false);
    } catch (error) {
      notify(error.response?.data?.message || "Failed to send reset link", "error");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
          marginBottom: "20px",
        }}
      >
        <img src={tatacliqlogo} alt="Tata CLiQ Logo" style={{ width: "200px" }} />
      </div>

      {showForgotPassword ? (
        <div style={{ width: "100%", maxWidth: "350px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Reset Password</h2>
          <p style={{ fontSize: "14px", marginBottom: "20px" }}>
            Enter your email to receive a password reset link
          </p>
          <form onSubmit={handleForgotPassword}>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#ff3e6c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              SEND RESET LINK
            </button>
          </form>
          <p
            style={{
              color: "#ff3e6c",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "20px",
            }}
            onClick={() => setShowForgotPassword(false)}
          >
            Back to Login
          </p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "30px" }}>
            {isEmailLogin ? "Login / Sign up with your email address" : "Login / Sign up with your mobile number"}
          </p>
          <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "350px" }}>
            {isEmailLogin ? (
              <div style={{ marginBottom: "20px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                  value={credentials.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: "20px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="+91 Enter Mobile Number"
                  value={credentials.mobile}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
            )}
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
                Password
              </label>
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
                size="small"
                error={!!passwordError && credentials.password.length > 0}
                InputProps={{
                  style: { padding: "12px", fontSize: "14px" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {passwordError && credentials.password.length > 0 && (
                <FormHelperText error style={{ marginTop: "4px", fontSize: "12px" }}>
                  {passwordError}
                </FormHelperText>
              )}
              {!passwordError && credentials.password.length >= 8 && (
                <FormHelperText style={{ color: "green", marginTop: "4px", fontSize: "12px" }}>
                  Valid Password format
                </FormHelperText>
              )}
            </div>
            <p
              style={{
                textAlign: "right",
                marginBottom: "20px",
                color: "#ff3e6c",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </p>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#ff3e6c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              LOGIN
            </button>
          </form>
          <p
            style={{
              margin: "20px 0",
              color: "#ff3e6c",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={() => setIsEmailLogin(!isEmailLogin)}
          >
            {isEmailLogin ? "USE MOBILE NUMBER" : "USE EMAIL ADDRESS"}
          </p>
          <p style={{ fontSize: "12px", color: "#999", marginBottom: "20px", lineHeight: "1.5" }}>
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
            <br />
            By continuing, you agree to our Terms of Use and Privacy Policy.
          </p>
        </>
      )}
      <button
        onClick={() => navigate("/")}
        style={{
          background: "transparent",
          border: "none",
          color: "#ff3e6c",
          cursor: "pointer",
          fontSize: "14px",
          marginTop: "20px",
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default Login;