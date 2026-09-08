const express = require("express");
const router = express.Router();

// ============================================================
// UVOZ SVIH RUTA
// ============================================================

const authRoutes = require("./auth");
const korisniciRoutes = require("./korisnici");
const proizvodiRoutes = require("./proizvodi");
const proizvodaciRoutes = require("./proizvodaci");
const kategorijeRoutes = require("./kategorije");
const listaZeljaRoutes = require("./listaZelja");
const miscRoutes = require("./misc");
const narudzbeRoutes = require("./narudzbe");
const zalihaRoutes = require("./zaliha");
const statusiRoutes = require("./statusi");
const prijavaRoutes = require("./prijava");
const registracijaRoutes = require("./registracija");
const administratoriRoutes = require("./administratori");
const recenzijaRoutes = require("./recenzija");

const indexController = require("../controllers/indexController");

const pool = require("../config/db");

// ============================================================
// TEST RUTA
// ============================================================

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "TeraBuild API radi!",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});

// ============================================================
// POČETNA STRANICA - STATISTIKA
// ============================================================

router.get("/index-summary", async (req, res) => {
    try {
        // Broj aktivnih proizvoda
        const proizvodi = await pool.query(`
            SELECT COUNT(*) AS broj_proizvoda
            FROM Proizvod
            WHERE aktivan = 1
        `);

        // Broj korisnika
        const korisnici = await pool.query(`
            SELECT COUNT(*) AS broj_korisnika
            FROM Korisnik
        `);

        // Broj vidljivih recenzija
        const recenzije = await pool.query(`
            SELECT COUNT(*) AS broj_recenzija
            FROM Recenzija
            WHERE status = 'vidljivo'
        `);

        // Proizvod dana
        const proizvod = await pool.query(`
            SELECT
                id_proizvod AS id_proizvoda,
                naziv AS naziv_proizvoda,
                opis,
                cijena,
                jedinica_mjere,
                slika_url
            FROM Proizvod
            WHERE aktivan = 1
            ORDER BY id_proizvod DESC
            LIMIT 1
        `);

        res.json({
            success: true,

            broj_proizvoda: Number(proizvodi[0].broj_proizvoda),

            broj_korisnika: Number(korisnici[0].broj_korisnika),

            broj_recenzija: Number(recenzije[0].broj_recenzija),

            naziv_proizvoda: proizvod.length
                ? proizvod[0].naziv_proizvoda
                : null,

            opis: proizvod.length
                ? proizvod[0].opis
                : null,

            cijena: proizvod.length
                ? `${Number(proizvod[0].cijena).toFixed(2)} € / ${proizvod[0].jedinica_mjere}`
                : null,

            id_proizvoda: proizvod.length
                ? Number(proizvod[0].id_proizvoda)
                : null,

            // PUTANJA SLIKE PROIZVODA
            slika_url: proizvod.length
                ? proizvod[0].slika_url || ""
                : ""
        });

    } catch (error) {
        console.error("Greška u /index-summary:", error);

        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju statistike.",
            error: error.message,
        });
    }
});

// ============================================================
// ADMIN DASHBOARD
// ============================================================

router.get("/admin/dashboard", indexController.getSummary);

// ============================================================
// KORIŠTENJE RUTA
// ============================================================

router.use("/auth", authRoutes);

router.use("/prijava", prijavaRoutes);

router.use("/registracija", registracijaRoutes);

router.use("/administratori", administratoriRoutes);

router.use("/korisnici", korisniciRoutes);

router.use("/proizvodi", proizvodiRoutes);

router.use("/proizvodaci", proizvodaciRoutes);

router.use("/kategorije", kategorijeRoutes);

router.use("/lista-zelja", listaZeljaRoutes);

router.use("/recenzije", recenzijaRoutes);

router.use("/misc", miscRoutes);

router.use("/narudzbe", narudzbeRoutes);

router.use("/zaliha", zalihaRoutes);

router.use("/statusi", statusiRoutes);

// ============================================================
// 404 RUTA
// ============================================================

router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta nije pronađena",
        path: req.originalUrl,
        method: req.method,
    });
});

module.exports = router;