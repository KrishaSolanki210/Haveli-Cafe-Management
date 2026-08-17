const Booking = require("../models/Booking");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const Table = require("../models/Table");
const asyncHandler = require("../middleware/asyncHandler");

const getMenuItems = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find({ isAvailable: true }).sort({ category: 1, name: 1 });

  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems,
  });
});

const placeOrder = asyncHandler(async (req, res) => {
  const { items, orderType = "dine-in", tableId, notes } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Order items are required");
  }

  const menuIds = items.map((item) => item.menuItemId);
  const menuItems = await MenuItem.find({ _id: { $in: menuIds }, isAvailable: true });
  const menuMap = new Map(menuItems.map((item) => [item._id.toString(), item]));

  const orderItems = items.map((item) => {
    const menuItem = menuMap.get(item.menuItemId);
    if (!menuItem) {
      throw new Error(`Menu item not found or unavailable: ${item.menuItemId}`);
    }

    return {
      menuItem: menuItem._id,
      name: menuItem.name,
      quantity: Number(item.quantity),
      price: menuItem.price,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const totalAmount = Number((subtotal + tax).toFixed(2));

  let table = null;
  if (tableId) {
    table = await Table.findById(tableId);
    if (!table) {
      res.status(404);
      throw new Error("Table not found");
    }
  }

  const order = await Order.create({
    customer: req.user._id,
    items: orderItems,
    subtotal,
    tax,
    totalAmount,
    orderType,
    table: table ? table._id : undefined,
    notes,
  });

  if (table && table.status === "available") {
    table.status = "occupied";
    await table.save();
  }

  const populatedOrder = await Order.findById(order._id)
    .populate("customer", "name email")
    .populate("table");

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: populatedOrder,
  });
});

const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate("table")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

const bookTable = asyncHandler(async (req, res) => {
  const { tableId, bookingDate, guests, notes } = req.body;

  if (!tableId || !bookingDate || !guests) {
    res.status(400);
    throw new Error("Table, booking date, and guest count are required");
  }

  const table = await Table.findById(tableId);
  if (!table) {
    res.status(404);
    throw new Error("Table not found");
  }

  if (table.capacity < guests) {
    res.status(400);
    throw new Error("Selected table does not have enough capacity");
  }

  const requestedDate = new Date(bookingDate);
  const existingBooking = await Booking.findOne({
    table: tableId,
    bookingDate: requestedDate,
    status: { $in: ["pending", "confirmed"] },
  });

  if (existingBooking) {
    res.status(409);
    throw new Error("Table is already booked for this time");
  }

  const booking = await Booking.create({
    customer: req.user._id,
    table: table._id,
    bookingDate: requestedDate,
    guests,
    notes,
  });

  table.status = "reserved";
  await table.save();

  const populatedBooking = await Booking.findById(booking._id)
    .populate("customer", "name email phone")
    .populate("table");

  res.status(201).json({
    success: true,
    message: "Table booked successfully",
    data: populatedBooking,
  });
});

module.exports = {
  getMenuItems,
  placeOrder,
  getOrderHistory,
  bookTable,
};
