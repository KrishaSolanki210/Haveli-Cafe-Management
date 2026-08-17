const User = require("../models/User");
const OTP = require("../models/OTP");
const asyncHandler = require("../middleware/asyncHandler");
const generateToken = require("../utils/generateToken");
const { generateOTP, getOTPExpiry } = require("../utils/otp");
const { sendEmail } = require("../utils/email");
const { sendSMS } = require("../utils/sms");

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const normalizePhone = (phone = "") => phone.trim();

const ensureVerifiedOTP = async ({ target, purpose }) => {
  const otpRecord = await OTP.findOne({
    target,
    purpose,
    isVerified: true,
    verifiedAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
  }).sort({ verifiedAt: -1 });

  if (!otpRecord) {
    throw new Error("Verified OTP required for this action");
  }

  return otpRecord;
};

const buildAuthPayload = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token: generateToken(user),
});

const registerByRole = (role, successMessage) =>
  asyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    const normalizedEmail = normalizeEmail(email);
    await ensureVerifiedOTP({ target: normalizedEmail, purpose: "registration" });

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(409);
      throw new Error("User already exists with this email");
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone: normalizePhone(phone),
      password,
      role,
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      message: successMessage,
      data: buildAuthPayload(user),
    });
  });

const loginByRoles = (allowedRoles, unauthorizedMessage) =>
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email: normalizeEmail(email) });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error("User account is inactive");
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      res.status(403);
      throw new Error(unauthorizedMessage);
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: buildAuthPayload(user),
    });
  });

const register = registerByRole("customer", "User registered successfully");
const registerAdmin = registerByRole("admin", "Admin registered successfully");
const registerStaff = registerByRole("staff", "Staff registered successfully");

const login = loginByRoles([], "Invalid login role");
const loginAdmin = loginByRoles(["admin"], "Only admin accounts can login here");
const loginStaff = loginByRoles(
  ["staff", "admin"],
  "Only staff or admin accounts can login here"
);

const sendOtp = asyncHandler(async (req, res) => {
  const { purpose, channel, email, phone } = req.body;

  if (!purpose || !channel || !["registration", "forgot_password"].includes(purpose)) {
    res.status(400);
    throw new Error("Valid OTP purpose is required");
  }

  if (!["email", "sms"].includes(channel)) {
    res.status(400);
    throw new Error("OTP channel must be email or sms");
  }

  const target = channel === "email" ? normalizeEmail(email) : normalizePhone(phone);
  if (!target) {
    res.status(400);
    throw new Error(`${channel === "email" ? "Email" : "Phone"} is required`);
  }

  if (purpose === "registration" && channel === "email") {
    const exists = await User.findOne({ email: target });
    if (exists) {
      res.status(409);
      throw new Error("User already exists with this email");
    }
  }

  if (purpose === "forgot_password" && channel === "email") {
    const user = await User.findOne({ email: target });
    if (!user) {
      res.status(404);
      throw new Error("No user found with this email");
    }
  }

  const otp = generateOTP();

  await OTP.deleteMany({ target, purpose, channel });
  await OTP.create({
    purpose,
    channel,
    target,
    otp,
    expiresAt: getOTPExpiry(),
  });

  const message = `Your Haveli Cafe OTP is ${otp}. It expires in 5 minutes.`;

  if (channel === "email") {
    await sendEmail({
      to: target,
      subject: "Haveli Cafe OTP Verification",
      html: `<p>${message}</p>`,
    });
  } else {
    await sendSMS({
      to: target,
      body: message,
    });
  }

  res.status(200).json({
    success: true,
    message: `OTP sent successfully via ${channel}`,
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { purpose, channel, email, phone, otp } = req.body;

  const target = channel === "email" ? normalizeEmail(email) : normalizePhone(phone);
  if (!purpose || !channel || !target || !otp) {
    res.status(400);
    throw new Error("Purpose, channel, target, and OTP are required");
  }

  const otpRecord = await OTP.findOne({
    purpose,
    channel,
    target,
    otp,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  otpRecord.isVerified = true;
  otpRecord.verifiedAt = new Date();
  await otpRecord.save();

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    res.status(400);
    throw new Error("Email and new password are required");
  }

  const normalizedEmail = normalizeEmail(email);
  await ensureVerifiedOTP({ target: normalizedEmail, purpose: "forgot_password" });

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

module.exports = {
  register,
  registerAdmin,
  registerStaff,
  login,
  loginAdmin,
  loginStaff,
  sendOtp,
  verifyOtp,
  resetPassword,
  getProfile,
};
