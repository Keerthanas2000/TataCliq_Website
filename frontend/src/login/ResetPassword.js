import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/user/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
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
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;