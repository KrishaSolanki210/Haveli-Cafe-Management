const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    purpose: {
      type: String,
      enum: ["registration", "forgot_password"],
      required: true,
    },
    channel: {
      type: String,
      enum: ["email", "sms"],
      required: true,
    },
    target: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OTP", otpSchema);
