const express = require("express");
const router = express.Router();
const zalihaController = require("../controllers/zalihaController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Javne rute
router.get("/proizvod/:id", zalihaController.getByProduct);

// Admin rute
router.get("/", authenticate, isAdmin, zalihaController.getAll);
router.get("/upozorenja", authenticate, isAdmin, zalihaController.getWarnings);
router.get("/:id", authenticate, isAdmin, zalihaController.getOne);
router.put("/:id", authenticate, isAdmin, zalihaController.update);
router.post("/:id/dodaj", authenticate, isAdmin, zalihaController.addStock);
router.post("/:id/umanji", authenticate, isAdmin, zalihaController.removeStock);

module.exports = router;