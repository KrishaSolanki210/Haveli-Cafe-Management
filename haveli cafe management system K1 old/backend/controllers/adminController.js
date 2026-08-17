const Booking = require("../models/Booking");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Table = require("../models/Table");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const createMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.create(req.body);

  res.status(201).json({
    success: true,
    message: "Menu item created successfully",
    data: menuItem,
  });
});

const getMenuItems = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems,
  });
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!menuItem) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  res.status(200).json({
    success: true,
    message: "Menu item updated successfully",
    data: menuItem,
  });
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  await menuItem.deleteOne();

  res.status(200).json({
    success: true,
    message: "Menu item deleted successfully",
  });
});

const createStaff = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role = "staff" } = req.body;

  if (!["staff", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Role must be staff or admin");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    password,
    role,
    isVerified: true,
  });

  res.status(201).json({
    success: true,
    message: `${role} created successfully`,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const getStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({ role: { $in: ["staff", "admin"] } }).select("-password");

  res.status(200).json({
    success: true,
    count: staff.length,
    data: staff,
  });
});

const updateStaff = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || !["staff", "admin"].includes(user.role)) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  const fields = ["name", "email", "phone", "role", "isActive"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = field === "email" ? String(req.body[field]).toLowerCase() : req.body[field];
    }
  });

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Staff member updated successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

const deleteStaff = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || !["staff", "admin"].includes(user.role)) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "Staff member deleted successfully",
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("customer", "name email")
    .populate("table")
    .populate("assignedStaff", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

const generateReports = asyncHandler(async (req, res) => {
  const [totalOrders, totalRevenueAgg, totalCustomers, totalStaff, totalBookings, tableCount] =
    await Promise.all([
      Order.countDocuments(),
      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
      ]),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "staff" }),
      Booking.countDocuments(),
      Table.countDocuments(),
    ]);

  const orderStatusBreakdown = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const topMenuItems = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        orderedQuantity: { $sum: "$items.quantity" },
      },
    },
    { $sort: { orderedQuantity: -1 } },
    { $limit: 5 },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: totalRevenueAgg[0]?.totalRevenue || 0,
      totalCustomers,
      totalStaff,
      totalBookings,
      tableCount,
      orderStatusBreakdown,
      topMenuItems,
    },
  });
});

const createTable = asyncHandler(async (req, res) => {
  const table = await Table.create(req.body);

  res.status(201).json({
    success: true,
    message: "Table created successfully",
    data: table,
  });
});

const getTables = asyncHandler(async (req, res) => {
  const tables = await Table.find().sort({ tableNumber: 1 });

  res.status(200).json({
    success: true,
    count: tables.length,
    data: tables,
  });
});

module.exports = {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff,
  getAllOrders,
  generateReports,
  createTable,
  getTables,
};
