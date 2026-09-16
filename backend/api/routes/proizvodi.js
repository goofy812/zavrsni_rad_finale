const express = require("express");

const router = express.Router();

const proizvodiController = require("../controllers/proizvodiController");

const {
    authenticate,
    isAdmin
} = require("../middleware/auth");

// ============================================================
// JAVNE RUTE
// ============================================================

// Dohvat samo aktivnih proizvoda
router.get("/", proizvodiController.getAll);

// Srodni proizvod
router.get("/:id/srodni", proizvodiController.getRelated);


// ============================================================
// ADMIN - SVI PROIZVODI
// Uključuje aktivne i neaktivne proizvode
// VAŽNO: ova ruta mora biti PRIJE /:id
// ============================================================

router.get(
    "/admin/svi",
    authenticate,
    isAdmin,
    proizvodiController.getAllAdmin
);


// Dohvat jednog proizvoda
router.get("/:id", proizvodiController.getOne);


// ============================================================
// ADMIN RUTE
// ============================================================

// Dodavanje proizvoda
router.post(
    "/",
    authenticate,
    isAdmin,
    proizvodiController.create
);

// Uređivanje proizvoda
router.put(
    "/:id",
    authenticate,
    isAdmin,
    proizvodiController.update
);

// Deaktiviranje proizvoda
router.delete(
    "/:id",
    authenticate,
    isAdmin,
    proizvodiController.delete
);


module.exports = router;