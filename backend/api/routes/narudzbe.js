const express = require("express");

const router = express.Router();

const narudzbaController = require("../controllers/narudzbaController");

const {
    authenticate,
    isAdmin
} = require("../middleware/auth");


// ============================================================
// KORISNIČKE RUTE
// ============================================================

// Moje narudžbe
router.get(
    "/moje",
    authenticate,
    narudzbaController.getUserOrders
);


// Kreiranje narudžbe
router.post(
    "/",
    authenticate,
    narudzbaController.create
);


// Detalji jedne narudžbe
router.get(
    "/:id",
    authenticate,
    narudzbaController.getOne
);


// ============================================================
// ADMIN RUTE
// ============================================================

// Sve narudžbe
router.get(
    "/",
    authenticate,
    isAdmin,
    narudzbaController.getAll
);


// Promjena statusa
router.put(
    "/:id/status",
    authenticate,
    isAdmin,
    narudzbaController.updateStatus
);


// Otkazivanje narudžbe
router.put(
    "/:id/otkazi",
    authenticate,
    isAdmin,
    narudzbaController.cancelOrder
);


module.exports = router;