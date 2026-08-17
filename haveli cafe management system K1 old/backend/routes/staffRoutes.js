const express = require("express");

const staffController = require("../controllers/staffController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("staff", "admin"));

router.get("/tables", staffController.getTables);
router.patch("/tables/:id/status", staffController.manageTableStatus);
router.patch("/orders/:id/status", staffController.updateOrderStatus);
router.get("/transactions/daily", staffController.getDailyTransactions);

module.exports = router;
