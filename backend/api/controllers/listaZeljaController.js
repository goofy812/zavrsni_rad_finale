const pool = require("../config/db");

// ============================================================ //
// DODAJ PROIZVOD NA LISTU ŽELJA
// ============================================================ //
exports.addToList = async (req, res) => {
    const { id_proizvod } = req.body;
    const userId = req.userId; // iz middleware-a

    if (!id_proizvod) {
        return res.status(400).json({
            success: false,
            message: "ID proizvoda je obavezan",
        });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        // Provjeri postoji li proizvod
        const product = await conn.query(
            "SELECT id_proizvod FROM Proizvod WHERE id_proizvod = ? AND aktivan = 1",
            [id_proizvod]
        );

        if (product.length === 0) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: "Proizvod nije pronađen",
            });
        }

        // Provjeri je li već na listi
        const existing = await conn.query(
            "SELECT * FROM ProizvodNaListi WHERE id_korisnik = ? AND id_proizvod = ?",
            [userId, id_proizvod]
        );

        if (existing.length > 0) {
            await conn.rollback();
            return res.status(409).json({
                success: false,
                message: "Proizvod je već na vašoj listi želja",
                alreadyExists: true,
            });
        }

        // Dodaj na listu
        await conn.query(
            `INSERT INTO ProizvodNaListi 
             (id_korisnik, id_proizvod, datum_dodavanja)
             VALUES (?, ?, NOW())`,
            [userId, id_proizvod]
        );

        await conn.commit();

        res.status(201).json({
            success: true,
            message: "Proizvod uspješno dodan na listu želja",
            data: {
                id_korisnik: userId,
                id_proizvod: id_proizvod,
            },
        });
    } catch (err) {
        if (conn) await conn.rollback();
        console.error("Greška pri dodavanju na listu:", err);

        if (err.code === "ER_DUP_ENTRY" || err.code === 1062) {
            return res.status(409).json({
                success: false,
                message: "Proizvod je već na vašoj listi želja",
                alreadyExists: true,
            });
        }

        if (err.code === "ER_NO_REFERENCED_ROW" || err.code === 1452) {
            return res.status(400).json({
                success: false,
                message: "Korisnik ili proizvod ne postoji",
            });
        }

        res.status(500).json({
            success: false,
            message: "Greška pri dodavanju proizvoda na listu",
        });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI SVE STAVKE SA LISTE (admin)
// ============================================================ //
exports.getAll = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT pl.*, 
                    p.naziv AS proizvod_naziv,
                    p.cijena,
                    k.naziv AS kategorija_naziv,
                    CONCAT(u.ime, ' ', u.prezime) AS korisnik_ime
             FROM ProizvodNaListi pl
             JOIN Proizvod p ON pl.id_proizvod = p.id_proizvod
             LEFT JOIN Kategorija k ON p.id_kategorija = k.id_kategorija
             JOIN Korisnik u ON pl.id_korisnik = u.id_korisnik
             ORDER BY pl.datum_dodavanja DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error("Greška pri dohvaćanju liste:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI JEDNU STAVKU SA LISTE
// ============================================================ //
exports.getOne = async (req, res) => {
    const { userId, productId } = req.params;
    let conn;

    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT pl.*, 
                    p.naziv AS proizvod_naziv,
                    p.cijena,
                    p.jedinica_mjere,
                    k.naziv AS kategorija_naziv
             FROM ProizvodNaListi pl
             JOIN Proizvod p ON pl.id_proizvod = p.id_proizvod
             LEFT JOIN Kategorija k ON p.id_kategorija = k.id_kategorija
             WHERE pl.id_korisnik = ? AND pl.id_proizvod = ?`,
            [userId, productId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Stavka nije pronađena",
            });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Greška pri dohvaćanju stavke:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI KORISNIKOVU LISTU ŽELJA
// ============================================================ //
exports.getUserList = async (req, res) => {
    const userId = req.userId; // iz middleware-a

    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT pl.*, 
                    p.naziv AS proizvod_naziv,
                    p.cijena,
                    p.jedinica_mjere,
                    p.slika_url,
                    k.naziv AS kategorija_naziv,
                    z.kolicina AS stanje_zaliha
             FROM ProizvodNaListi pl
             JOIN Proizvod p ON pl.id_proizvod = p.id_proizvod
             LEFT JOIN Kategorija k ON p.id_kategorija = k.id_kategorija
             LEFT JOIN Zaliha z ON p.id_proizvod = z.id_proizvod
             WHERE pl.id_korisnik = ?
             ORDER BY pl.datum_dodavanja DESC`,
            [userId]
        );

        res.json({
            success: true,
            data: rows,
            count: rows.length,
        });
    } catch (err) {
        console.error("Greška pri dohvaćanju korisnikove liste:", err);
        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju liste želja",
        });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// AŽURIRAJ STAVKU NA LISTI (ocjena, bilješka, prioritet)
// ============================================================ //
exports.update = async (req, res) => {
    const { userId, productId } = req.params;
    const { biljeska, prioritet } = req.body;

    let conn;
    try {
        conn = await pool.getConnection();

        // Provjeri postoji li stavka
        const existing = await conn.query(
            "SELECT * FROM ProizvodNaListi WHERE id_korisnik = ? AND id_proizvod = ?",
            [userId, productId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Stavka nije pronađena",
            });
        }

        await conn.query(
            `UPDATE ProizvodNaListi SET
             biljeska = ?,
             prioritet = ?,
             datum_azuriranja = NOW()
             WHERE id_korisnik = ? AND id_proizvod = ?`,
            [biljeska || null, prioritet || 'srednji', userId, productId]
        );

        res.json({
            success: true,
            message: "Stavka uspješno ažurirana",
        });
    } catch (err) {
        console.error("Greška pri ažuriranju stavke:", err);
        res.status(500).json({
            success: false,
            message: "Greška pri ažuriranju stavke",
        });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// UKLONI PROIZVOD S LISTE ŽELJA
// ============================================================ //
exports.delete = async (req, res) => {
    const userId = req.userId; // iz middleware-a
    const productId = req.params.id;

    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        // Provjeri postoji li stavka
        const existing = await conn.query(
            "SELECT * FROM ProizvodNaListi WHERE id_korisnik = ? AND id_proizvod = ?",
            [userId, productId]
        );

        if (existing.length === 0) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: "Stavka nije pronađena",
            });
        }

        // Obriši stavku
        await conn.query(
            "DELETE FROM ProizvodNaListi WHERE id_korisnik = ? AND id_proizvod = ?",
            [userId, productId]
        );

        await conn.commit();

        res.json({
            success: true,
            message: "Proizvod uspješno uklonjen s liste želja",
            data: {
                userId,
                productId,
            },
        });
    } catch (err) {
        if (conn) await conn.rollback();
        console.error("Greška pri brisanju s liste:", err);
        res.status(500).json({
            success: false,
            message: "Greška pri uklanjanju proizvoda s liste",
        });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI FILTRIRANU KORISNIKOVU LISTU
// ============================================================ //
exports.getFilteredUserList = async (req, res) => {
    const userId = req.userId; // iz middleware-a
    const { pretraga, kategorija, sort, prioritet } = req.query;

    let where = ["pl.id_korisnik = ?"];
    let params = [userId];

    // Pretraga po nazivu proizvoda
    if (pretraga) {
        where.push("p.naziv LIKE ?");
        params.push(`%${pretraga}%`);
    }

    // Filter po kategoriji
    if (kategorija) {
        where.push("p.id_kategorija = ?");
        params.push(kategorija);
    }

    // Filter po prioritetu
    if (prioritet) {
        where.push("pl.prioritet = ?");
        params.push(prioritet);
    }

    // Sortiranje
    let orderBy = "pl.datum_dodavanja DESC";
    if (sort === "naziv") {
        orderBy = "p.naziv ASC";
    } else if (sort === "cijena_asc") {
        orderBy = "p.cijena ASC";
    } else if (sort === "cijena_desc") {
        orderBy = "p.cijena DESC";
    } else if (sort === "prioritet") {
        orderBy = "FIELD(pl.prioritet, 'visok', 'srednji', 'nizak')";
    }

    let sql = `
        SELECT pl.*, 
               p.naziv AS proizvod_naziv,
               p.cijena,
               p.jedinica_mjere,
               p.slika_url,
               k.naziv AS kategorija_naziv,
               z.kolicina AS stanje_zaliha
        FROM ProizvodNaListi pl
        JOIN Proizvod p ON pl.id_proizvod = p.id_proizvod
        LEFT JOIN Kategorija k ON p.id_kategorija = k.id_kategorija
        LEFT JOIN Zaliha z ON p.id_proizvod = z.id_proizvod
        WHERE ${where.join(" AND ")}
        ORDER BY ${orderBy}
    `;

    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql, params);

        res.json({
            success: true,
            data: rows,
            count: rows.length,
        });
    } catch (err) {
        console.error("Greška pri filtriranju liste:", err);
        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju filtrirane liste",
        });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// PROVJERI JE LI PROIZVOD NA LISTI
// ============================================================ //
exports.checkInList = async (req, res) => {
    const userId = req.userId;
    const productId = req.params.id;

    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT * FROM ProizvodNaListi WHERE id_korisnik = ? AND id_proizvod = ?",
            [userId, productId]
        );

        res.json({
            success: true,
            exists: rows.length > 0,
        });
    } catch (err) {
        console.error("Greška pri provjeri liste:", err);
        res.status(500).json({
            success: false,
            message: "Greška pri provjeri",
        });
    } finally {
        if (conn) conn.release();
    }
};