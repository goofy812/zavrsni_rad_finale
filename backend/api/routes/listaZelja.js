const express = require("express");
const router = express.Router();
const listaZeljaController = require("../controllers/listaZeljaController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Korisnikove rute
router.get("/", authenticate, listaZeljaController.getUserList);
router.get("/filter", authenticate, listaZeljaController.getFilteredUserList);
router.get("/check/:id", authenticate, listaZeljaController.checkInList);
router.post("/", authenticate, listaZeljaController.addToList);
router.put("/:id", authenticate, listaZeljaController.update);
router.delete("/:id", authenticate, listaZeljaController.delete);

// Admin rute
router.get("/all", authenticate, isAdmin, listaZeljaController.getAll);

module.exports = router;