const express = require("express");
const router = express.Router();
const statusController = require("../controllers/status_narudzbeController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Javne rute
router.get("/", statusController.getAll);
router.get("/:id", statusController.getOne);

// Admin rute
router.post("/", authenticate, isAdmin, statusController.create);
router.put("/:id", authenticate, isAdmin, statusController.update);
router.delete("/:id", authenticate, isAdmin, statusController.delete);

module.exports = router;