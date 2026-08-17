const express = require("express");

const adminController = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.post("/menu", adminController.createMenuItem);
router.get("/menu", adminController.getMenuItems);
router.put("/menu/:id", adminController.updateMenuItem);
router.delete("/menu/:id", adminController.deleteMenuItem);

router.post("/staff", adminController.createStaff);
router.get("/staff", adminController.getStaff);
router.put("/staff/:id", adminController.updateStaff);
router.delete("/staff/:id", adminController.deleteStaff);

router.get("/orders", adminController.getAllOrders);
router.get("/reports", adminController.generateReports);

router.post("/tables", adminController.createTable);
router.get("/tables", adminController.getTables);

module.exports = router;
