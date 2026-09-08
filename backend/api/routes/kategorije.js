const express = require("express");
const router = express.Router();
const kategorijeController = require("../controllers/kategorijeController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Javne rute
router.get("/", kategorijeController.getAll);
router.get("/glavne", kategorijeController.getMainCategories);
router.get("/:id", kategorijeController.getOne);
router.get("/:id/podkategorije", kategorijeController.getSubcategories);

// Admin rute
router.post("/", authenticate, isAdmin, kategorijeController.create);
router.put("/:id", authenticate, isAdmin, kategorijeController.update);
router.delete("/:id", authenticate, isAdmin, kategorijeController.delete);

module.exports = router;