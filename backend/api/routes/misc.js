const express = require("express");
const router = express.Router();
const miscController = require("../controllers/miscController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Javne rute
router.get("/index-summary", miscController.getIndexSummary);
router.get("/statusi", miscController.getStatuses);
router.get("/kategorije-dropdown", miscController.getCategories);
router.get("/proizvodaci-dropdown", miscController.getProizvodaci);
router.get("/app-info", miscController.getAppInfo);

// Admin rute
router.get("/dashboard-stats", authenticate, isAdmin, miscController.getDashboardStats);

module.exports = router;