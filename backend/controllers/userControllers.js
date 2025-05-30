const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { v4: uuidv4 } = require("uuid");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_Key);
    req.user = await User.findById(decoded.id).select("_id email mobile name addresses role");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    if (!password || (!email && !mobile)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let user;
    if (email) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      user = await User.findOne({ email });
    } else {
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number" });
      }
      user = await User.findOne({ mobile });
    }
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = { password: hashedPassword };
      if (email) userData.email = email;
      if (mobile) userData.mobile = mobile;
      userData.type = "Register";
      user = new User(userData);
      await user.save();
    } else {
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      user.type = "Login";
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_Key);
    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a seller (SuperAdmin only)
const createSeller = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied: SuperAdmin only" });
    }

    const { email, mobile, name, address, pincode, password } = req.body;

    if (!email || !mobile || !name || !address || !pincode || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ message: "Pincode must be 6 digits" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or mobile already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      mobile,
      password: hashedPassword,
      name,
      role: "seller",
      addresses: [{ id: uuidv4(), address, pincode }],
      type: "Register",
    });

    await user.save();
    res.status(201).json({ message: "Seller created successfully", user });
  } catch (error) {
    console.error("Error creating seller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all sellers (SuperAdmin only)
const getSellers = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied: SuperAdmin only" });
    }

    const sellers = await User.find({ role: "seller" }).select("_id email mobile name addresses").sort({ createdAt: -1 });
    res.status(200).json({ sellers });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_Key, { expiresIn: "10m" });
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();
  const resetLink = `http://localhost:3000/reset-password/${token}`;
  await sendEmail(
    email,
    "Tata Cliq Account Password Reset Request",
    `<p>Click <a href="${resetLink}">here</a> to reset your password. Please note Link expires in 10 minutes.</p>`
  );
  res.status(200).json({ message: "Reset password link sent to your email" });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_Key);
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in /reset-password:", error.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, mobile, name, addresses, cliqCash, giftCard, _id } = req.body;

    // Validate required fields
    if (!email && !mobile) {
      return res.status(400).json({ message: "At least one of email or mobile is required" });
    }

    // Validate email format
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate mobile number
    if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    // Validate addresses
    if (addresses && !Array.isArray(addresses)) {
      return res.status(400).json({ message: "Addresses must be an array" });
    }
    if (addresses && addresses.length > 0) {
      for (let i = 0; i < addresses.length; i++) {
        const addr = addresses[i];
        if (!addr || typeof addr !== "object") {
          return res.status(400).json({ message: `Address ${i + 1} must be a valid object` });
        }
        const pincode = addr.pincode || "";
        const addressStr = addr.address || "";
        if (!addressStr) {
          return res.status(400).json({ message: `Address ${i + 1} cannot be empty` });
        }
        if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
          return res.status(400).json({ message: `Invalid Pincode for Address ${i + 1}` });
        }
      }
    }

    // Validate cliqCash and giftCard
    if (cliqCash !== undefined && (typeof cliqCash !== "number" || cliqCash < 0)) {
      return res.status(400).json({ message: "Cliq Cash must be a non-negative number" });
    }
    if (giftCard !== undefined && (typeof giftCard !== "number" || giftCard < 0)) {
      return res.status(400).json({ message: "Gift Card must be a non-negative number" });
    }

    // Check for duplicate email or mobile
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
      _id: { $ne: _id },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email or mobile already exists" });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        email,
        mobile,
        name,
        addresses,
        cliqCash: cliqCash !== undefined ? cliqCash : undefined,
        giftCard: giftCard !== undefined ? giftCard : undefined,
        type: "ProfileUpdate",
      },
      { new: true }
    ).select("_id email mobile name addresses cliqCash giftCard type");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error("Update Profile Error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email or mobile already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const validateToken = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_Key);
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Error in /validate-token:", error.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ addresses: user.addresses || [] });
  } catch (err) {
    console.error("Get Addresses Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("_id email mobile name addresses cliqCash giftCard");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  validateToken,
  getAddresses,
  getProfile,
  authMiddleware,
  createSeller,
  getSellers,
};