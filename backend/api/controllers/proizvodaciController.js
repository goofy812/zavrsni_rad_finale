const pool = require("../config/db");

// ============================================================
// KREIRAJ PROIZVOĐAČA
// ============================================================

exports.create = async (req, res) => {
    const {
        naziv,
        kontakt_osoba,
        email,
        telefon,
        web
    } = req.body;

    let conn;

    try {
        if (!naziv || !naziv.trim()) {
            return res.status(400).json({
                success: false,
                message: "Naziv proizvođača je obavezan."
            });
        }

        conn = await pool.getConnection();

        // Provjera postoji li već proizvođač s istim nazivom
        const existing = await conn.query(
            `
            SELECT id_proizvodac
            FROM Proizvodac
            WHERE naziv = ?
            `,
            [naziv.trim()]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Proizvođač s ovim nazivom već postoji."
            });
        }

        const result = await conn.query(
            `
            INSERT INTO Proizvodac
            (
                naziv,
                kontakt_osoba,
                email,
                telefon,
                web,
                aktivan,
                datum_kreiranja
            )
            VALUES (?, ?, ?, ?, ?, 1, NOW())
            `,
            [
                naziv.trim(),
                kontakt_osoba || null,
                email || null,
                telefon || null,
                web || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Proizvođač uspješno kreiran.",
            id_proizvodac: Number(result.insertId)
        });

    } catch (err) {
        console.error("Greška pri kreiranju proizvođača:", err);

        res.status(500).json({
            success: false,
            message: "Greška pri kreiranju proizvođača.",
            error: err.message
        });

    } finally {
        if (conn) conn.release();
    }
};


// ============================================================
// DOHVATI SVE AKTIVNE PROIZVOĐAČE
// ============================================================

exports.getAll = async (req, res) => {
    let conn;

    try {
        const {
            page = 1,
            limit = 50,
            pretraga
        } = req.query;

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limitNumber = Math.max(parseInt(limit) || 50, 1);
        const offset = (pageNumber - 1) * limitNumber;

        let query = `
            SELECT
                id_proizvodac,
                naziv,
                kontakt_osoba,
                email,
                telefon,
                web,
                aktivan,
                datum_kreiranja,
                datum_azuriranja
            FROM Proizvodac
            WHERE aktivan = 1
        `;

        const params = [];

        // Pretraga po nazivu
        if (pretraga && pretraga.trim()) {
            query += ` AND naziv LIKE ?`;
            params.push(`%${pretraga.trim()}%`);
        }

        query += ` ORDER BY naziv ASC`;

        query += ` LIMIT ? OFFSET ?`;
        params.push(limitNumber, offset);

        conn = await pool.getConnection();

        const rows = await conn.query(query, params);

        // Ukupan broj proizvođača
        let countQuery = `
            SELECT COUNT(*) AS total
            FROM Proizvodac
            WHERE aktivan = 1
        `;

        const countParams = [];

        if (pretraga && pretraga.trim()) {
            countQuery += ` AND naziv LIKE ?`;
            countParams.push(`%${pretraga.trim()}%`);
        }

        const countResult = await conn.query(
            countQuery,
            countParams
        );

        const total = Number(countResult[0]?.total || 0);

        res.json({
            data: rows,
            meta: {
                total: total,
                page: pageNumber,
                limit: limitNumber,
                last_page: Math.ceil(total / limitNumber)
            }
        });

    } catch (err) {
        console.error("Greška pri dohvaćanju proizvođača:", err);

        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju proizvođača.",
            error: err.message
        });

    } finally {
        if (conn) conn.release();
    }
};


// ============================================================
// DOHVATI JEDNOG PROIZVOĐAČA
// ============================================================

exports.getOne = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const rows = await conn.query(
            `
            SELECT
                p.id_proizvodac,
                p.naziv,
                p.kontakt_osoba,
                p.email,
                p.telefon,
                p.web,
                p.aktivan,
                p.datum_kreiranja,
                p.datum_azuriranja,
                COUNT(pr.id_proizvod) AS broj_proizvoda
            FROM Proizvodac p
            LEFT JOIN Proizvod pr
                ON p.id_proizvodac = pr.id_proizvodac
                AND pr.aktivan = 1
            WHERE p.id_proizvodac = ?
            GROUP BY
                p.id_proizvodac,
                p.naziv,
                p.kontakt_osoba,
                p.email,
                p.telefon,
                p.web,
                p.aktivan,
                p.datum_kreiranja,
                p.datum_azuriranja
            `,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Proizvođač nije pronađen."
            });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error("Greška pri dohvaćanju proizvođača:", err);

        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju proizvođača.",
            error: err.message
        });

    } finally {
        if (conn) conn.release();
    }
};


// ============================================================
// AŽURIRAJ PROIZVOĐAČA
// ============================================================

exports.update = async (req, res) => {
    const {
        naziv,
        kontakt_osoba,
        email,
        telefon,
        web,
        aktivan
    } = req.body;

    let conn;

    try {
        if (!naziv || !naziv.trim()) {
            return res.status(400).json({
                success: false,
                message: "Naziv proizvođača je obavezan."
            });
        }

        conn = await pool.getConnection();

        // Dohvati postojećeg proizvođača
        const existing = await conn.query(
            `
            SELECT *
            FROM Proizvodac
            WHERE id_proizvodac = ?
            `,
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Proizvođač nije pronađen."
            });
        }

        const stariProizvodac = existing[0];

        // Provjera postoji li drugi proizvođač s istim nazivom
        const duplicate = await conn.query(
            `
            SELECT id_proizvodac
            FROM Proizvodac
            WHERE naziv = ?
            AND id_proizvodac != ?
            `,
            [
                naziv.trim(),
                req.params.id
            ]
        );

        if (duplicate.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Proizvođač s ovim nazivom već postoji."
            });
        }

        // Ako frontend ne pošalje aktivan,
        // zadržava se postojeća vrijednost.
        const novaAktivnost =
            aktivan !== undefined
                ? (Number(aktivan) === 1 ? 1 : 0)
                : stariProizvodac.aktivan;

        await conn.query(
            `
            UPDATE Proizvodac
            SET
                naziv = ?,
                kontakt_osoba = ?,
                email = ?,
                telefon = ?,
                web = ?,
                aktivan = ?,
                datum_azuriranja = NOW()
            WHERE id_proizvodac = ?
            `,
            [
                naziv.trim(),
                kontakt_osoba || null,
                email || null,
                telefon || null,
                web || null,
                novaAktivnost,
                req.params.id
            ]
        );

        res.json({
            success: true,
            message: "Proizvođač uspješno ažuriran."
        });

    } catch (err) {
        console.error("Greška pri ažuriranju proizvođača:", err);

        res.status(500).json({
            success: false,
            message: "Greška pri ažuriranju proizvođača.",
            error: err.message
        });

    } finally {
        if (conn) conn.release();
    }
};


// ============================================================
// OBRIŠI PROIZVOĐAČA
// SOFT DELETE
// ============================================================

exports.delete = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        // Provjera postoji li proizvođač
        const existing = await conn.query(
            `
            SELECT *
            FROM Proizvodac
            WHERE id_proizvodac = ?
            `,
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Proizvođač nije pronađen."
            });
        }

        // Provjera ima li aktivnih proizvoda
        const products = await conn.query(
            `
            SELECT COUNT(*) AS count
            FROM Proizvod
            WHERE id_proizvodac = ?
            AND aktivan = 1
            `,
            [req.params.id]
        );

        const brojProizvoda = Number(
            products[0]?.count || 0
        );

        if (brojProizvoda > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Proizvođač ima aktivne proizvode i ne može se obrisati."
            });
        }

        // Soft delete
        await conn.query(
            `
            UPDATE Proizvodac
            SET
                aktivan = 0,
                datum_azuriranja = NOW()
            WHERE id_proizvodac = ?
            `,
            [req.params.id]
        );

        res.json({
            success: true,
            message: "Proizvođač uspješno obrisan."
        });

    } catch (err) {
        console.error("Greška pri brisanju proizvođača:", err);

        res.status(500).json({
            success: false,
            message: "Greška pri brisanju proizvođača.",
            error: err.message
        });

    } finally {
        if (conn) conn.release();
    }
};


// ============================================================
// JEDNOSTAVNA LISTA PROIZVOĐAČA
// ZA DROPDOWN
// ============================================================

exports.getSimpleList = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const rows = await conn.query(
            `
            SELECT
                id_proizvodac,
                naziv
            FROM Proizvodac
            WHERE aktivan = 1
            ORDER BY naziv ASC
            `
        );

        res.json(rows);

    } catch (err) {
        console.error("Greška pri dohvaćanju liste proizvođača:", err);

        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju liste proizvođača.",
            error: err.message
        });

    } finally {
        if (conn) conn.release();
    }
};


// ============================================================
// DOHVATI PROIZVODE OD PROIZVOĐAČA
// ============================================================

exports.getProducts = async (req, res) => {
    const { id } = req.params;

    let conn;

    try {
        conn = await pool.getConnection();

        const rows = await conn.query(
            `
            SELECT
                p.id_proizvod,
                p.naziv,
                p.cijena,
                p.jedinica_mjere,
                p.sifra,
                p.aktivan,
                z.kolicina AS stanje_zaliha
            FROM Proizvod p
            LEFT JOIN Zaliha z
                ON p.id_proizvod = z.id_proizvod
            WHERE p.id_proizvodac = ?
            AND p.aktivan = 1
            ORDER BY p.naziv ASC
            `,
            [id]
        );

        res.json({
            success: true,
            data: rows,
            count: rows.length
        });

    } catch (err) {
        console.error("Greška pri dohvaćanju proizvoda proizvođača:", err);

        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju proizvoda.",
            error: err.message
        });

    } finally {
        if (conn) conn.release();
    }
};