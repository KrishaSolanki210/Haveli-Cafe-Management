const crypto = require("crypto");
const Razorpay = require("razorpay");

let razorpayInstance;

const hasConfiguredRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return false;
  }

  const placeholderValues = new Set(["your-razorpay-key-id", "your-razorpay-key-secret"]);
  return !placeholderValues.has(keyId) && !placeholderValues.has(keySecret);
};

const getRazorpayInstance = () => {
  if (razorpayInstance) {
    return razorpayInstance;
  }

  if (!hasConfiguredRazorpayCredentials()) {
    throw new Error("Razorpay credentials are not configured. Update backend/.env with real RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET values.");
  }

  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  return razorpayInstance;
};

const createRazorpayOrder = async ({ amount, currency = "INR", receipt, notes = {} }) => {
  const razorpay = getRazorpayInstance();

  return razorpay.orders.create({
    amount,
    currency,
    receipt,
    notes,
  });
};

const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expectedSignature === signature;
};

module.exports = {
  hasConfiguredRazorpayCredentials,
  createRazorpayOrder,
  verifyRazorpaySignature,
};
