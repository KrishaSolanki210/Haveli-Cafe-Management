const Order = require("../models/Order");
const Payment = require("../models/Payment");
const asyncHandler = require("../middleware/asyncHandler");
const { createRazorpayOrder, hasConfiguredRazorpayCredentials, verifyRazorpaySignature } = require("../utils/payment");

const createPaymentOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400);
    throw new Error("Order ID is required");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (String(order.customer) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not allowed to pay for this order");
  }

  if (!hasConfiguredRazorpayCredentials()) {
    res.status(503);
    throw new Error("Order created, but Razorpay is not configured. Add real RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env and restart the backend server.");
  }

  const razorpayOrder = await createRazorpayOrder({
    amount: Math.round(order.totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${order._id}`,
    notes: {
      orderId: String(order._id),
      customerId: String(order.customer),
    },
  });

  const payment = await Payment.create({
    order: order._id,
    customer: order.customer,
    amount: order.totalAmount,
    currency: "INR",
    razorpayOrderId: razorpayOrder.id,
    metadata: razorpayOrder,
  });

  res.status(201).json({
    success: true,
    message: "Payment order created successfully",
    data: {
      payment,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
    },
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400);
    throw new Error("Payment verification fields are required");
  }

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) {
    res.status(404);
    throw new Error("Payment record not found");
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    payment.status = "failed";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    res.status(400);
    throw new Error("Invalid Razorpay signature");
  }

  payment.status = "paid";
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  await payment.save();

  await Order.findByIdAndUpdate(payment.order, { paymentStatus: "paid", status: "confirmed" });

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: payment,
  });
});

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
