const pool = require("../config/db");

// ============================================================ //
// DOHVATI SVE ZALIHE (admin)
// ============================================================ //
exports.getAll = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT z.*, 
                    p.naziv AS proizvod_naziv, 
                    p.sifra,
                    p.cijena
             FROM Zaliha z
             JOIN Proizvod p ON z.id_proizvod = p.id_proizvod
             ORDER BY z.kolicina ASC`
        );
        res.json(rows);
    } catch (err) {
        console.error("Greška pri dohvaćanju zaliha:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI JEDNU ZALIHU
// ============================================================ //
exports.getOne = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT z.*, 
                    p.naziv AS proizvod_naziv,
                    p.sifra
             FROM Zaliha z
             JOIN Proizvod p ON z.id_proizvod = p.id_proizvod
             WHERE z.id_zaliha = ?`,
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Zaliha nije pronađena" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Greška pri dohvaćanju zalihe:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI ZALIHU PO PROIZVODU
// ============================================================ //
exports.getByProduct = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT * FROM Zaliha WHERE id_proizvod = ?",
            [req.params.id]
        );
        res.json(rows[0] || { kolicina: 0, minimalna_kolicina: 0 });
    } catch (err) {
        console.error("Greška pri dohvaćanju zalihe:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// AŽURIRAJ ZALIHU (admin)
// ============================================================ //
exports.update = async (req, res) => {
    const { kolicina, minimalna_kolicina, maksimalna_kolicina, lokacija_skladista } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();

        const existing = await conn.query(
            "SELECT * FROM Zaliha WHERE id_zaliha = ?",
            [req.params.id]
        );
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Zaliha nije pronađena",
            });
        }

        await conn.query(
            `UPDATE Zaliha SET
             kolicina = ?,
             minimalna_kolicina = ?,
             maksimalna_kolicina = ?,
             lokacija_skladista = ?,
             datum_zadnje_azuriranje = NOW()
             WHERE id_zaliha = ?`,
            [
                kolicina,
                minimalna_kolicina || 10,
                maksimalna_kolicina || null,
                lokacija_skladista || null,
                req.params.id
            ]
        );
        res.json({
            success: true,
            message: "Zaliha uspješno ažurirana",
        });
    } catch (err) {
        console.error("Greška pri ažuriranju zalihe:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DODAJ KOLIČINU NA ZALIHU (admin)
// ============================================================ //
exports.addStock = async (req, res) => {
    const { kolicina } = req.body;
    const zalihaId = req.params.id;

    if (!kolicina || kolicina <= 0) {
        return res.status(400).json({
            success: false,
            message: "Količina mora biti veća od 0",
        });
    }

    let conn;
    try {
        conn = await pool.getConnection();

        const existing = await conn.query(
            "SELECT * FROM Zaliha WHERE id_zaliha = ?",
            [zalihaId]
        );
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Zaliha nije pronađena",
            });
        }

        await conn.query(
            `UPDATE Zaliha SET
             kolicina = kolicina + ?,
             datum_zadnje_azuriranje = NOW()
             WHERE id_zaliha = ?`,
            [kolicina, zalihaId]
        );
        res.json({
            success: true,
            message: `Dodano ${kolicina} komada na zalihu`,
        });
    } catch (err) {
        console.error("Greška pri dodavanju na zalihu:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// UMANJI KOLIČINU NA ZALIHI (admin)
// ============================================================ //
exports.removeStock = async (req, res) => {
    const { kolicina } = req.body;
    const zalihaId = req.params.id;

    if (!kolicina || kolicina <= 0) {
        return res.status(400).json({
            success: false,
            message: "Količina mora biti veća od 0",
        });
    }

    let conn;
    try {
        conn = await pool.getConnection();

        const existing = await conn.query(
            "SELECT * FROM Zaliha WHERE id_zaliha = ?",
            [zalihaId]
        );
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Zaliha nije pronađena",
            });
        }

        if (existing[0].kolicina < kolicina) {
            return res.status(400).json({
                success: false,
                message: "Nema dovoljno proizvoda na zalihi",
                trenutno: existing[0].kolicina,
            });
        }

        await conn.query(
            `UPDATE Zaliha SET
             kolicina = kolicina - ?,
             datum_zadnje_azuriranje = NOW()
             WHERE id_zaliha = ?`,
            [kolicina, zalihaId]
        );
        res.json({
            success: true,
            message: `Umanjeno ${kolicina} komada sa zalihe`,
        });
    } catch (err) {
        console.error("Greška pri umanjenju zalihe:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI UPOZORENJA ZA ZALIHE (ispod minimalne)
// ============================================================ //
exports.getWarnings = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT z.*, 
                    p.naziv AS proizvod_naziv, 
                    p.sifra,
                    (z.minimalna_kolicina - z.kolicina) AS manjak
             FROM Zaliha z
             JOIN Proizvod p ON z.id_proizvod = p.id_proizvod
             WHERE z.kolicina <= z.minimalna_kolicina
               AND p.aktivan = 1
             ORDER BY manjak DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error("Greška pri dohvaćanju upozorenja:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};