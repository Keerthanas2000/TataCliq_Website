import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { notify } from "./utils/toast"; // Adjust the import path as necessary
function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    // Optionally, you can validate the token on load by calling an API
    const validateToken = async () => {
      try {
        await axios.get(`http://localhost:5000/api/user/validate-token/${token}`);
      } catch (err) {
        setIsTokenValid(false);
        notify("Invalid or expired token", "error");
      }
    };
    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/api/user/reset-password/${token}`,
        { newPassword }
      );
      notify(res.data.message, "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      notify(err.response?.data?.message || "Failed to reset password", "error");
    }
  };

  if (!isTokenValid) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Invalid or Expired Token</h2>
        <p>
          The password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff3e6c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div
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
      <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>
        Reset Your Password
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ width: "100%", maxWidth: "350px" }}
      >
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          RESET PASSWORD
        </button>
      </form>
      <button
        onClick={() => navigate("/login")}
        style={{
          background: "transparent",
          border: "none",
          color: "#ff3e6c",
          cursor: "pointer",
          fontSize: "14px",
          marginTop: "20px",
        }}
      >
        ← Back to Login
      </button>
    </div>
  );
}

export default ResetPassword;