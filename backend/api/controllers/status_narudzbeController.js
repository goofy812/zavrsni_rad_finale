const pool = require("../config/db");

// ============================================================ //
// DOHVATI SVE STATUSE
// ============================================================ //
exports.getAll = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT * FROM StatusNarudzbe WHERE aktivan = 1 ORDER BY redoslijed"
        );
        res.json(rows);
    } catch (err) {
        console.error("Greška pri dohvaćanju statusa:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI JEDAN STATUS
// ============================================================ //
exports.getOne = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT * FROM StatusNarudzbe WHERE id_status_narudzbe = ?",
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Status nije pronađen" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Greška pri dohvaćanju statusa:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// KREIRAJ STATUS (admin)
// ============================================================ //
exports.create = async (req, res) => {
    const { naziv, opis, redoslijed, boja } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(
            `INSERT INTO StatusNarudzbe 
             (naziv, opis, redoslijed, boja, aktivan, datum_kreiranja)
             VALUES (?, ?, ?, ?, 1, NOW())`,
            [naziv, opis || null, redoslijed, boja || null]
        );
        res.status(201).json({
            success: true,
            message: "Status uspješno kreiran",
            id: result.insertId,
        });
    } catch (err) {
        console.error("Greška pri kreiranju statusa:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// AŽURIRAJ STATUS (admin)
// ============================================================ //
exports.update = async (req, res) => {
    const { naziv, opis, redoslijed, boja, aktivan } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(
            `UPDATE StatusNarudzbe SET
             naziv = ?,
             opis = ?,
             redoslijed = ?,
             boja = ?,
             aktivan = ?,
             datum_azuriranja = NOW()
             WHERE id_status_narudzbe = ?`,
            [naziv, opis || null, redoslijed, boja || null, aktivan, req.params.id]
        );
        res.json({
            success: true,
            message: "Status uspješno ažuriran",
        });
    } catch (err) {
        console.error("Greška pri ažuriranju statusa:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// OBRIŠI STATUS (soft delete)
// ============================================================ //
exports.delete = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Provjeri da li status koriste narudžbe
        const used = await conn.query(
            "SELECT COUNT(*) as count FROM Narudzba WHERE id_status_narudzbe = ?",
            [req.params.id]
        );

        if (used[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: "Status se koristi u narudžbama, ne može se obrisati",
            });
        }

        await conn.query(
            "UPDATE StatusNarudzbe SET aktivan = 0 WHERE id_status_narudzbe = ?",
            [req.params.id]
        );
        res.json({
            success: true,
            message: "Status uspješno obrisan",
        });
    } catch (err) {
        console.error("Greška pri brisanju statusa:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};