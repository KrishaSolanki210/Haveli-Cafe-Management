const express = require("express");

const customerController = require("../controllers/customerController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/menu", customerController.getMenuItems);
router.post("/orders", protect, authorize("customer"), customerController.placeOrder);
router.get("/orders/history", protect, authorize("customer"), customerController.getOrderHistory);
router.post("/bookings", protect, authorize("customer"), customerController.bookTable);

module.exports = router;
