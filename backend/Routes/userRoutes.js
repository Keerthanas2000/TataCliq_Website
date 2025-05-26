


const express = require("express");
const router = express.Router();
const {
  login,
  forgotPassword,
  resetPassword,
  updateProfile,

  validateToken,
} = require("../controllers/userControllers");

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/updateProfile", updateProfile);
router.get('/validate-token/:token', validateToken);
module.exports = router;