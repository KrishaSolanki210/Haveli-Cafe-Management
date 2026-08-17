const express = require("express");

const paymentController = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/order", protect, authorize("customer", "admin"), paymentController.createPaymentOrder);
router.post("/verify", protect, authorize("customer", "admin"), paymentController.verifyPayment);

module.exports = router;
