const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        if (!allowed.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Dozvoljene su samo JPG, PNG, WEBP i GIF slike."
                )
            );
        }

        cb(null, true);
    },
});

const proizvodiController = require("../controllers/proizvodiController");

const {
    authenticate,
    isAdmin
} = require("../middleware/auth");


// ============================================================
// JAVNE RUTE
// ============================================================

router.get(
    "/",
    proizvodiController.getAll
);

router.get(
    "/:id/srodni",
    proizvodiController.getRelated
);


// ============================================================
// ADMIN - SVI PROIZVODI
// ============================================================

router.get(
    "/admin/svi",
    authenticate,
    isAdmin,
    proizvodiController.getAllAdmin
);


// ============================================================
// DOHVAT JEDNOG PROIZVODA
// ============================================================

router.get(
    "/:id",
    proizvodiController.getOne
);


// ============================================================
// ADMIN - DODAVANJE PROIZVODA
// ============================================================

router.post(
    "/",
    authenticate,
    isAdmin,
    upload.single("slika"),
    proizvodiController.create
);


// ============================================================
// ADMIN - UREĐIVANJE PROIZVODA
// ============================================================

router.put(
    "/:id",
    authenticate,
    isAdmin,
    upload.single("slika"),
    proizvodiController.update
);


// ============================================================
// ADMIN - BRISANJE / DEAKTIVACIJA
// ============================================================

router.delete(
    "/:id",
    authenticate,
    isAdmin,
    proizvodiController.delete
);


module.exports = router;