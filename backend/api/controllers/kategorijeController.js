const pool = require("../config/db");

// ============================================================ //
// KATEGORIJA CRUD
// ============================================================ //

// KREIRAJ KATEGORIJU
exports.create = async (req, res) => {
    const { naziv, opis, id_nadkategorija, slika_url, redoslijed } = req.body;
    let conn;

    try {
        conn = await pool.getConnection();
        const result = await conn.query(
            `INSERT INTO Kategorija 
             (naziv, opis, id_nadkategorija, slika_url, redoslijed, aktivan, datum_kreiranja)
             VALUES (?, ?, ?, ?, ?, 1, NOW())`,
            [naziv, opis || null, id_nadkategorija || null, slika_url || null, redoslijed || 0]
        );
        res.status(201).json({
            success: true,
            message: "Kategorija uspješno kreirana",
            id: result.insertId,
        });
    } catch (err) {
        console.error("Greška pri kreiranju kategorije:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// DOHVATI SVE KATEGORIJE
exports.getAll = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT * FROM Kategorija WHERE aktivan = 1 ORDER BY redoslijed, naziv"
        );
        res.json(rows);
    } catch (err) {
        console.error("Greška pri dohvaćanju kategorija:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// DOHVATI JEDNU KATEGORIJU
exports.getOne = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT * FROM Kategorija WHERE id_kategorija = ?",
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Kategorija nije pronađena" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Greška pri dohvaćanju kategorije:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// AŽURIRAJ KATEGORIJU
exports.update = async (req, res) => {
    const { naziv, opis, id_nadkategorija, slika_url, redoslijed, aktivan } = req.body;
    let conn;

    try {
        conn = await pool.getConnection();
        await conn.query(
            `UPDATE Kategorija SET
             naziv = ?,
             opis = ?,
             id_nadkategorija = ?,
             slika_url = ?,
             redoslijed = ?,
             aktivan = ?,
             datum_azuriranja = NOW()
             WHERE id_kategorija = ?`,
            [naziv, opis || null, id_nadkategorija || null, slika_url || null, redoslijed || 0, aktivan, req.params.id]
        );
        res.json({
            success: true,
            message: "Kategorija uspješno ažurirana",
        });
    } catch (err) {
        console.error("Greška pri ažuriranju kategorije:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// OBRIŠI KATEGORIJU (soft delete)
exports.delete = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        // Provjeri ima li proizvoda u ovoj kategoriji
        const products = await conn.query(
            "SELECT COUNT(*) as count FROM Proizvod WHERE id_kategorija = ? AND aktivan = 1",
            [req.params.id]
        );

        if (products[0].count > 0) {
            return res.status(400).json({
                message: "Kategorija sadrži proizvode, ne može se obrisati",
            });
        }

        await conn.query(
            "UPDATE Kategorija SET aktivan = 0 WHERE id_kategorija = ?",
            [req.params.id]
        );
        res.json({
            success: true,
            message: "Kategorija uspješno obrisana",
        });
    } catch (err) {
        console.error("Greška pri brisanju kategorije:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI PODKATEGORIJE (za hijerarhiju)
// ============================================================ //
exports.getSubcategories = async (req, res) => {
    const { id } = req.params;
    let conn;

    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT * FROM Kategorija WHERE id_nadkategorija = ? AND aktivan = 1 ORDER BY redoslijed, naziv",
            [id]
        );
        res.json(rows);
    } catch (err) {
        console.error("Greška pri dohvaćanju podkategorija:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// DOHVATI SVE GLAVNE KATEGORIJE (bez nadkategorije)
exports.getMainCategories = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT * FROM Kategorija WHERE id_nadkategorija IS NULL AND aktivan = 1 ORDER BY redoslijed, naziv"
        );
        res.json(rows);
    } catch (err) {
        console.error("Greška pri dohvaćanju glavnih kategorija:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};