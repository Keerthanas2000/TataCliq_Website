const nodemailer = require("nodemailer");

// Validate environment variables

const EMAIL_USER="keerthanasbhardwaj@gmail.com"
const EMAIL_PASS="gfvyqamkrgnfxtbp"

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error("Missing email credentials:", {
    EMAIL_USER: EMAIL_USER,
    EMAIL_PASS: EMAIL_PASS ? "[REDACTED]" : undefined,
  });
  throw new Error("Missing email credentials: EMAIL_USER and EMAIL_PASS must be set in .env");
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Test SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Connection Successful:", success);
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log("Attempting to send email to:", to);
    const mailOptions = {
      from: `"Tata CLiQ" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
};

module.exports = sendEmail;