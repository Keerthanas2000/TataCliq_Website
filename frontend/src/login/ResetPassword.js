import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import tatacliqlogo from "../images/tatacliqlogo.png";
import { notify } from "../utils/toast";
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        console.log('Validating token:', token);
        const response = await axios.get(`http://localhost:5000/api/user/validate-token/${token}`);
        console.log('Validation response:', response.data);
      } catch (err) {
        console.error('Token validation error:', err.response?.status, err.response?.data || err.message);
        setIsTokenValid(false);
        setMessage(err.response?.data?.message || 'Invalid or expired token');
      }
    };
    validateToken();
  }, [token]);

  // Password validation function
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
      return "Must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Must contain at least one lowercase letter";
    }
    if (!hasNumber) {
      return "Must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Must contain at least one special character";
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check password validation before submitting
    const validationError = validatePassword(password);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/user/reset-password/${token}`, { password });
      notify(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (!isTokenValid) {
    return (
      <div className="reset-password-container">
        <h2>Invalid or Expired Token</h2>
        <p>The password reset link is invalid or has expired. Please request a new one.</p>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: "#fff",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "10px 0",
        marginBottom: "20px",
      }}>
        <img
          src={tatacliqlogo}
          alt="Tata CLiQ Logo"
          style={{ width: "200px" }}
        />
      </div>
      
      <h2 style={{ marginBottom: '20px' }}>Reset Password</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ position: 'relative', marginBottom: '15px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={password}
            onChange={handlePasswordChange}
            required
            style={{
              width: '100%',
              padding: '12px 40px 12px 12px',
              border: passwordError ? '1px solid red' : '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '5px'
            }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
        
        {passwordError && (
          <div style={{ 
            color: 'red', 
            fontSize: '12px', 
            marginBottom: '15px',
            textAlign: 'left'
          }}>
            {passwordError}
          </div>
        )}
        
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#ff3e6c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Reset Password
        </button>
      </form>
      
      {message && !passwordError && (
        <p style={{ 
          marginTop: '15px',
          color: message.includes('success') ? 'green' : 'red'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;