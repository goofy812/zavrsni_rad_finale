const express = require("express");

const router = express.Router();

const recenzijaController = require("../controllers/recenzijaController");

const { authenticate } = require("../middleware/auth");

// ============================================================
// JAVNO - RECENZIJE PROIZVODA
// ============================================================

router.get(
    "/proizvod/:id",
    recenzijaController.getByProduct
);

// ============================================================
// PRIJAVLJENI KORISNIK
// ============================================================

// Dodavanje recenzije
router.post(
    "/",
    authenticate,
    recenzijaController.create
);

// Moja recenzija
router.get(
    "/moja/:id",
    authenticate,
    recenzijaController.getMyReview
);

module.exports = router;