const express = require("express");
const router = express.Router();
const {
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  validateToken,
  getAddresses,
  getProfile,
  createSeller,
  getSellers,authMiddleware,
} = require("../controllers/userControllers");

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/updateProfile", authMiddleware, updateProfile);
router.get("/validate-token/:token", validateToken);
router.get("/addresses", authMiddleware, getAddresses);
router.get("/profile", authMiddleware, getProfile);
router.post("/seller", authMiddleware, createSeller); // New route
router.get("/sellers", authMiddleware, getSellers); // New route

module.exports = router;