const nodemailer = require("nodemailer");
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In your email configuration file (nodemailer setup)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Add proper error handling
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Tata Cliq" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;

