const express = require("express");

const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/register/admin", authController.registerAdmin);
router.post("/register/staff", authController.registerStaff);
router.post("/login", authController.login);
router.post("/login/admin", authController.loginAdmin);
router.post("/login/staff", authController.loginStaff);
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.get("/profile", protect, authController.getProfile);

module.exports = router;
