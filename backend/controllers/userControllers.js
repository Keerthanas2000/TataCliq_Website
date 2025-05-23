const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.login = async (req, res) => {
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_Key);

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_Key, {
    expiresIn: "10m",
  });

  const resetLink = `http://localhost:5000/reset-password/${token}`;

  await sendEmail(
    email,
    "Password Reset Request",
    `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 10 minutes.</p>`
  );

  res.status(200).json({ message: "Reset link sent to your email" });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_Key);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, mobile, name, address, _id } = req.body;

    // Validate email or mobile presence
    if (!email && !mobile) {
      return res
        .status(400)
        .json({ message: "At least one of email or mobile is required" });
    }

    // Validate email format
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate mobile format
    if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    // Validate address array
    if (!Array.isArray(address)) {
      return res.status(400).json({ message: "Address must be an array" });
    }

    // Allow empty address array, but validate pincode if address exists
    if (address.length > 0) {
      for (let i = 0; i < address.length; i++) {
        const addr = address[i];
        if (!addr || typeof addr !== "object") {
          return res
            .status(400)
            .json({ message: `Address ${i + 1} must be a valid object` });
        }
        const pincode = addr.pincode || "";
        const addressStr = addr.address || "";
        if (!addressStr) {
          return res
            .status(400)
            .json({ message: `Address ${i + 1} cannot be empty` });
        }
        if (!pincode || pincode.length !== 6) {
          return res.status(400).json({
            message: ` Invalid Pincode for Address ${i + 1}`,
          });
        }
      }
    } else {
      return res
        .status(400)
        .json({ message: "Please add Address and pincode " });
    }

    // Check for existing user with the same email or mobile
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
      _id: { $ne: _id },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or mobile already exists" });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { email, mobile, name, address, type: "ProfileUpdate" },
      { new: true }
    ).select("_id email mobile name address type");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error("Update Profile Error:", err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or mobile already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
