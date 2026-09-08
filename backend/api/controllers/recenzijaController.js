const pool = require("../config/db");

// ============================================================
// DOHVATI RECENZIJE ZA PROIZVOD
// GET /api/recenzije/proizvod/:id
// ============================================================

exports.getByProduct = async (req, res) => {
    let conn;

    try {
        const { id } = req.params;

        conn = await pool.getConnection();

        const rows = await conn.query(
            `
            SELECT
                r.id_recenzija,
                r.id_korisnik,
                r.id_proizvod,
                r.ocjena,
                r.naslov,
                r.komentar,
                r.status,
                r.datum_kreiranja,
                k.korisnicko_ime
            FROM Recenzija r
            INNER JOIN Korisnik k
                ON k.id_korisnik = r.id_korisnik
            WHERE r.id_proizvod = ?
              AND r.status = 'vidljivo'
            ORDER BY r.datum_kreiranja DESC
            `,
            [id]
        );

        res.json({
            success: true,
            data: rows,
        });

    } catch (err) {
        console.error("Greška pri dohvaćanju recenzija:", err);

        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju recenzija.",
            error: err.message,
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
};


// ============================================================
// DODAJ RECENZIJU
// ============================================================

exports.create = async (req, res) => {
    let conn;

    try {
        const userId = Number(req.userId);
        const {
            id_proizvod,
            ocjena,
            naslov,
            komentar
        } = req.body;

        // --------------------------------------------------------
        // PROVJERA KORISNIKA
        // --------------------------------------------------------

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Korisnik nije prijavljen."
            });
        }

        // --------------------------------------------------------
        // PROVJERA PROIZVODA
        // --------------------------------------------------------

        const proizvodId = Number(id_proizvod);

        if (!proizvodId) {
            return res.status(400).json({
                success: false,
                message: "Proizvod nije naveden."
            });
        }

        // --------------------------------------------------------
        // PROVJERA OCJENE
        // --------------------------------------------------------

        const ocjenaBroj = Number(ocjena);

        if (
            !Number.isInteger(ocjenaBroj) ||
            ocjenaBroj < 1 ||
            ocjenaBroj > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Ocjena mora biti između 1 i 5."
            });
        }

        // --------------------------------------------------------
        // PROVJERA NASLOVA
        // --------------------------------------------------------

        if (
            typeof naslov !== "string" ||
            !naslov.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Naslov recenzije je obavezan."
            });
        }

        // --------------------------------------------------------
        // PROVJERA KOMENTARA
        // --------------------------------------------------------

        if (
            typeof komentar !== "string" ||
            !komentar.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Komentar je obavezan."
            });
        }

        conn = await pool.getConnection();

        // --------------------------------------------------------
        // PROVJERA POSTOJI LI PROIZVOD
        // --------------------------------------------------------

        const proizvod = await conn.query(
            `
            SELECT id_proizvod
            FROM Proizvod
            WHERE id_proizvod = ?
            LIMIT 1
            `,
            [proizvodId]
        );

        if (!proizvod.length) {
            return res.status(404).json({
                success: false,
                message: "Proizvod nije pronađen."
            });
        }

        // --------------------------------------------------------
        // PROVJERA POSTOJI LI VEĆ RECENZIJA
        // --------------------------------------------------------

        const postojeca = await conn.query(
            `
            SELECT id_recenzija
            FROM Recenzija
            WHERE id_korisnik = ?
              AND id_proizvod = ?
            LIMIT 1
            `,
            [userId, proizvodId]
        );

        if (postojeca.length) {
            return res.status(409).json({
                success: false,
                message: "Već ste ostavili recenziju za ovaj proizvod."
            });
        }

        // --------------------------------------------------------
        // INSERT
        // --------------------------------------------------------

        const result = await conn.query(
            `
            INSERT INTO Recenzija
            (
                id_korisnik,
                id_proizvod,
                ocjena,
                naslov,
                komentar,
                status,
                datum_kreiranja
            )
            VALUES (?, ?, ?, ?, ?, 'vidljivo', NOW())
            `,
            [
                userId,
                proizvodId,
                ocjenaBroj,
                naslov.trim(),
                komentar.trim()
            ]
        );

        console.log("Recenzija uspješno spremljena:", {
            id_korisnik: userId,
            id_proizvod: proizvodId,
            ocjena: ocjenaBroj
        });

        // --------------------------------------------------------
        // ODGOVOR
        // --------------------------------------------------------
        // Namjerno ne šaljemo result.insertId kao BigInt.
        // Time izbjegavamo 500 nakon uspješnog INSERT-a.
        // --------------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Recenzija je uspješno dodana."
        });

    } catch (err) {
        console.error("GREŠKA PRI DODAVANJU RECENZIJE:", err);

        return res.status(500).json({
            success: false,
            message: "Greška pri dodavanju recenzije.",
            error: err.message
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
};

// ============================================================
// DOHVATI MOJU RECENZIJU
// GET /api/recenzije/moja/:id
// ============================================================

exports.getMyReview = async (req, res) => {
    let conn;

    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Korisnik nije prijavljen.",
            });
        }

        conn = await pool.getConnection();

        const rows = await conn.query(
            `
            SELECT
                id_recenzija,
                id_korisnik,
                id_proizvod,
                ocjena,
                naslov,
                komentar,
                status,
                datum_kreiranja
            FROM Recenzija
            WHERE id_korisnik = ?
              AND id_proizvod = ?
            LIMIT 1
            `,
            [userId, id]
        );

        res.json({
            success: true,
            data: rows.length > 0 ? rows[0] : null,
        });

    } catch (err) {
        console.error(
            "Greška pri dohvaćanju moje recenzije:",
            err
        );

        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju recenzije.",
            error: err.message,
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
};