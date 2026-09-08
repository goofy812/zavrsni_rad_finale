const express = require("express");
const router = express.Router();
const proizvodaciController = require("../controllers/proizvodaciController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Javne rute
router.get("/", proizvodaciController.getAll);
router.get("/simple", proizvodaciController.getSimpleList);
router.get("/:id", proizvodaciController.getOne);
router.get("/:id/proizvodi", proizvodaciController.getProducts);

// Admin rute
router.post("/", authenticate, isAdmin, proizvodaciController.create);
router.put("/:id", authenticate, isAdmin, proizvodaciController.update);
router.delete("/:id", authenticate, isAdmin, proizvodaciController.delete);

module.exports = router;