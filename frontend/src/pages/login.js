import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import tatacliqlogo from "../images/tatacliqlogo.png";
import { notify } from "../utils/toast"; // Import the notify function

function Login() {
  const navigate = useNavigate();
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    email: "",
    mobile: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Handle input changes for email, mobile, and password
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate mobile format and login with mobile
  const validatePhone = () => {
    const isValid = /^[6-9]\d{9}$/.test(credentials.mobile.trim());
    if (!isValid) {
      notify("Invalid mobile number. Please enter a valid 10-digit number.", "error");
      return;
    }
    handleMobileLogin();
  };

  // Call mobile login API
  const handleMobileLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        mobile: credentials.mobile.trim(),
        password: credentials.password,
        email: credentials.email.trim(),
      });
      sessionStorage.setItem("userdata", JSON.stringify(res.data.user));
      res.data.user.type === "Register"
        ? navigate(`/viewprofile`)
        : navigate(`/`);
    } catch (error) {
      notify(error.response?.data?.message || "Something went wrong", "error");
    }
  };

  // Call email login API
  const handleEmailLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        mobile: credentials.mobile.trim(),
        password: credentials.password,
        email: credentials.email.trim(),
      });

      console.log("api response", res);
      sessionStorage.setItem("userdata", JSON.stringify(res.data.user));

      res.data.user.type === "Register"
        ? navigate(`/viewprofile`)
        : navigate(`/`);
    } catch (error) {
      notify(error.response?.data?.message || "Something went wrong", "error");
    }
  };

  // Submit login form
  const handleLogin = (e) => {
    e.preventDefault();
    if (isEmailLogin) {
      handleEmailLogin();
    } else {
      validatePhone();
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/forgot-password",
        { email: forgotEmail }
      );
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
          backgroundColor: "#000",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
          marginBottom: "20px",
        }}
      >
        <img
          src={tatacliqlogo}
          alt="Tata CLiQ Logo"
          style={{ width: "200px" }}
        />
      </div>

      {showForgotPassword ? (
        <div style={{ width: "100%", maxWidth: "350px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>
            Reset Password
          </h2>
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
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "30px",
            }}
          >
            {isEmailLogin
              ? "Login / Sign up with your email address"
              : "Login / Sign up with your mobile number"}
          </p>

          <form
            onSubmit={handleLogin}
            style={{ width: "100%", maxWidth: "350px" }}
          >
            {isEmailLogin ? (
              <div style={{ marginBottom: "20px", textAlign: "left" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
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
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
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
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={credentials.password}
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

          <p
            style={{
              fontSize: "12px",
              color: "#999",
              marginBottom: "20px",
              lineHeight: "1.5",
            }}
          >
            This site is protected by reCAPTCHA and the Google Privacy Policy
            and Terms of Service apply.
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