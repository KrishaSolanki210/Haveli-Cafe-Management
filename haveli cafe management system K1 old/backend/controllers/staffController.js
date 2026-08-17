const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Table = require("../models/Table");
const asyncHandler = require("../middleware/asyncHandler");

const getTables = asyncHandler(async (req, res) => {
  const tables = await Table.find().sort({ tableNumber: 1 });

  res.status(200).json({
    success: true,
    count: tables.length,
    data: tables,
  });
});

const manageTableStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const table = await Table.findById(req.params.id);
  if (!table) {
    res.status(404);
    throw new Error("Table not found");
  }

  table.status = status;
  await table.save();

  res.status(200).json({
    success: true,
    message: "Table status updated successfully",
    data: table,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "preparing", "served", "completed", "cancelled"];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  order.assignedStaff = req.user._id;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
});

const getDailyTransactions = asyncHandler(async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const payments = await Payment.find({
    status: "paid",
    createdAt: { $gte: start, $lte: end },
  })
    .populate("customer", "name email")
    .populate("order");

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

  res.status(200).json({
    success: true,
    data: {
      date: start.toISOString().split("T")[0],
      totalRevenue,
      transactions: payments.length,
      payments,
    },
  });
});

module.exports = {
  getTables,
  manageTableStatus,
  updateOrderStatus,
  getDailyTransactions,
};
