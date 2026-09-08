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

router.get("/", proizvodiController.getAll);

router.get("/:id/srodni", proizvodiController.getRelated);

router.get("/:id", proizvodiController.getOne);


// ============================================================
// ADMIN RUTE
// ============================================================

router.post(
    "/",
    authenticate,
    isAdmin,
    proizvodiController.create
);

router.put(
    "/:id",
    authenticate,
    isAdmin,
    proizvodiController.update
);

router.delete(
    "/:id",
    authenticate,
    isAdmin,
    proizvodiController.delete
);

module.exports = router;