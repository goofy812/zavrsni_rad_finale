const pool = require("../config/db");

// ============================================================
// DOHVATI SVE PROIZVODE
// GET /api/proizvodi
// Filter kategorija + pretraga + sortiranje + paginacija
// ============================================================

exports.getAll = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const {
            page = 1,
            limit = 12,
            kategorija,
            pretraga,
            sort,
        } = req.query;

        const safePage = Math.max(1, parseInt(page) || 1);
        const safeLimit = Math.min(
            100,
            Math.max(1, parseInt(limit) || 12)
        );

        const offset = (safePage - 1) * safeLimit;

        const where = ["p.aktivan = 1"];
        const params = [];

        // ----------------------------------------------------
        // KATEGORIJA
        // ----------------------------------------------------

        if (
            kategorija !== undefined &&
            kategorija !== null &&
            kategorija !== "" &&
            !isNaN(Number(kategorija))
        ) {
            where.push("p.id_kategorija = ?");
            params.push(Number(kategorija));
        }

        // ----------------------------------------------------
        // PRETRAGA
        // ----------------------------------------------------

        if (
            pretraga !== undefined &&
            pretraga !== null &&
            String(pretraga).trim() !== ""
        ) {
            const search = `%${String(pretraga).trim()}%`;

            where.push(`
                (
                    p.naziv LIKE ?
                    OR p.sifra LIKE ?
                    OR p.opis LIKE ?
                    OR p.namjena LIKE ?
                    OR pr.naziv LIKE ?
                    OR k.naziv LIKE ?
                )
            `);

            params.push(
                search,
                search,
                search,
                search,
                search,
                search
            );
        }

        // ----------------------------------------------------
        // SORTIRANJE
        // ----------------------------------------------------

        let orderBy = "p.naziv ASC";

        switch (sort) {
            case "naziv_asc":
                orderBy = "p.naziv ASC";
                break;

            case "naziv_desc":
                orderBy = "p.naziv DESC";
                break;

            case "cijena_asc":
                orderBy = "p.cijena ASC, p.naziv ASC";
                break;

            case "cijena_desc":
                orderBy = "p.cijena DESC, p.naziv ASC";
                break;

            case "datum_desc":
                orderBy = "p.datum_dodavanja DESC, p.naziv ASC";
                break;

            default:
                orderBy = "p.naziv ASC";
        }

        // ----------------------------------------------------
        // BASE QUERY
        // ----------------------------------------------------

        const base = `
            FROM Proizvod p

            LEFT JOIN Kategorija k
                ON p.id_kategorija = k.id_kategorija

            LEFT JOIN Proizvodac pr
                ON p.id_proizvodac = pr.id_proizvodac

            LEFT JOIN Zaliha z
                ON p.id_proizvod = z.id_proizvod

            WHERE ${where.join(" AND ")}
        `;

        // ----------------------------------------------------
        // PROIZVODI
        // ----------------------------------------------------

        const rows = await conn.query(
            `
            SELECT
                p.id_proizvod,
                p.naziv,
                p.opis,
                p.sifra,
                p.cijena,
                p.jedinica_mjere,
                p.tezina,
                p.dimenzije,
                p.namjena,
                p.slika_url,
                p.id_kategorija,
                p.id_proizvodac,
                p.aktivan,
                p.datum_dodavanja,
                p.datum_azuriranja,

                k.naziv AS kategorija_naziv,
                pr.naziv AS proizvodac_naziv,

                COALESCE(z.kolicina, 0) AS stanje_zaliha,
                COALESCE(z.minimalna_kolicina, 0) AS minimalna_kolicina,
                COALESCE(z.maksimalna_kolicina, 0) AS maksimalna_kolicina

            ${base}

            ORDER BY ${orderBy}

            LIMIT ? OFFSET ?
            `,
            [
                ...params,
                safeLimit,
                offset,
            ]
        );

        // ----------------------------------------------------
        // UKUPAN BROJ
        // ----------------------------------------------------

        const countRows = await conn.query(
            `
            SELECT COUNT(DISTINCT p.id_proizvod) AS total
            ${base}
            `,
            params
        );

        const total = Number(
            countRows[0]?.total || 0
        );

        const lastPage = Math.max(
            1,
            Math.ceil(total / safeLimit)
        );

        // ----------------------------------------------------
        // PRETVARANJE BIGINT VRIJEDNOSTI
        // ----------------------------------------------------

        const safeRows = rows.map((product) => ({
            ...product,

            id_proizvod: Number(product.id_proizvod),
            id_kategorija: product.id_kategorija
                ? Number(product.id_kategorija)
                : null,
            id_proizvodac: product.id_proizvodac
                ? Number(product.id_proizvodac)
                : null,

            cijena: Number(product.cijena || 0),
            stanje_zaliha: Number(product.stanje_zaliha || 0),
            minimalna_kolicina:
                Number(product.minimalna_kolicina || 0),
            maksimalna_kolicina:
                Number(product.maksimalna_kolicina || 0),
        }));

        return res.json({
            success: true,
            data: safeRows,
            meta: {
                total,
                page: safePage,
                limit: safeLimit,
                last_page: lastPage,
            },
        });

    } catch (err) {

        console.error(
            "Greška u getAll proizvoda:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju proizvoda.",
            error: err.message,
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};


// ============================================================
// DOHVATI JEDAN PROIZVOD
// GET /api/proizvodi/:id
// ============================================================

exports.getOne = async (req, res) => {
    let conn;

    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Neispravan ID proizvoda.",
            });
        }

        conn = await pool.getConnection();

        const rows = await conn.query(
            `
            SELECT
                p.id_proizvod,
                p.naziv,
                p.opis,
                p.sifra,
                p.cijena,
                p.jedinica_mjere,
                p.tezina,
                p.dimenzije,
                p.namjena,
                p.slika_url,
                p.id_kategorija,
                p.id_proizvodac,
                p.aktivan,
                p.datum_dodavanja,
                p.datum_azuriranja,

                k.naziv AS kategorija_naziv,
                pr.naziv AS proizvodac_naziv,

                COALESCE(z.kolicina, 0) AS stanje_zaliha,
                COALESCE(z.minimalna_kolicina, 0)
                    AS minimalna_kolicina,
                COALESCE(z.maksimalna_kolicina, 0)
                    AS maksimalna_kolicina

            FROM Proizvod p

            LEFT JOIN Kategorija k
                ON p.id_kategorija = k.id_kategorija

            LEFT JOIN Proizvodac pr
                ON p.id_proizvodac = pr.id_proizvodac

            LEFT JOIN Zaliha z
                ON p.id_proizvod = z.id_proizvod

            WHERE p.id_proizvod = ?
            LIMIT 1
            `,
            [id]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Proizvod nije pronađen.",
            });
        }

        const product = {
            ...rows[0],

            id_proizvod: Number(rows[0].id_proizvod),
            id_kategorija: rows[0].id_kategorija
                ? Number(rows[0].id_kategorija)
                : null,
            id_proizvodac: rows[0].id_proizvodac
                ? Number(rows[0].id_proizvodac)
                : null,

            cijena: Number(rows[0].cijena || 0),
            stanje_zaliha:
                Number(rows[0].stanje_zaliha || 0),
            minimalna_kolicina:
                Number(rows[0].minimalna_kolicina || 0),
            maksimalna_kolicina:
                Number(rows[0].maksimalna_kolicina || 0),
        };

        return res.json({
            success: true,
            data: product,
        });

    } catch (err) {

        console.error(
            "Greška u getOne proizvoda:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju proizvoda.",
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};


// ============================================================
// DOHVATI SRODNE PROIZVODE
// GET /api/proizvodi/:id/srodni
// ============================================================

exports.getRelated = async (req, res) => {
    let conn;

    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Neispravan ID proizvoda.",
            });
        }

        conn = await pool.getConnection();

        const result = await conn.query(`
    SELECT
        p.id_proizvod,
        p.naziv,
        p.opis,
        p.cijena,
        p.jedinica_mjere,
        p.slika_url,
        COALESCE(SUM(sn.kolicina), 0) AS ukupno_prodano
    FROM Proizvod p
    LEFT JOIN StavkaNarudzbe sn
        ON p.id_proizvod = sn.id_proizvod
    WHERE p.aktivan = 1
    GROUP BY p.id_proizvod
    ORDER BY ukupno_prodano DESC, p.naziv ASC
    LIMIT 1
`);

        const safeRows = rows.map((product) => ({
            ...product,
            id_proizvod: Number(product.id_proizvod),
            id_kategorija: product.id_kategorija
                ? Number(product.id_kategorija)
                : null,
            cijena: Number(product.cijena || 0),
            stanje_zaliha:
                Number(product.stanje_zaliha || 0),
        }));

        return res.json({
            success: true,
            data: safeRows,
        });

    } catch (err) {

        console.error(
            "Greška u getRelated proizvoda:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju srodnih proizvoda.",
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};


// ============================================================
// DODAJ PROIZVOD
// POST /api/proizvodi
// ADMIN
// ============================================================

exports.create = async (req, res) => {
    let conn;

    try {
        const {
            naziv,
            opis,
            sifra,
            cijena,
            jedinica_mjere,
            tezina,
            dimenzije,
            namjena,
            slika_url,
            id_kategorija,
            id_proizvodac,
            aktivan = 1,
        } = req.body;

        if (!naziv || cijena === undefined) {
            return res.status(400).json({
                success: false,
                message: "Naziv i cijena su obavezni.",
            });
        }

        conn = await pool.getConnection();

        const existing = await conn.query(
            `
            SELECT id_proizvod
            FROM Proizvod
            WHERE sifra = ?
            LIMIT 1
            `,
            [sifra]
        );

        if (sifra && existing.length) {
            return res.status(409).json({
                success: false,
                message: "Proizvod s tom šifrom već postoji.",
            });
        }

        const result = await conn.query(
            `
            INSERT INTO Proizvod
            (
                naziv,
                opis,
                sifra,
                cijena,
                jedinica_mjere,
                tezina,
                dimenzije,
                namjena,
                slika_url,
                id_kategorija,
                id_proizvodac,
                aktivan,
                datum_dodavanja
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `,
            [
                naziv,
                opis || null,
                sifra || null,
                Number(cijena),
                jedinica_mjere || "kom",
                tezina || null,
                dimenzije || null,
                namjena || null,
                slika_url || null,
                id_kategorija || null,
                id_proizvodac || null,
                aktivan ? 1 : 0,
            ]
        );

        const id = Number(result.insertId);

        return res.status(201).json({
            success: true,
            message: "Proizvod uspješno dodan.",
            id_proizvod: id,
        });

    } catch (err) {

        console.error(
            "Greška u create proizvoda:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Greška pri dodavanju proizvoda.",
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};


// ============================================================
// AŽURIRAJ PROIZVOD
// PUT /api/proizvodi/:id
// ADMIN
// ============================================================

exports.update = async (req, res) => {
    let conn;

    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Neispravan ID proizvoda.",
            });
        }

        const {
            naziv,
            opis,
            sifra,
            cijena,
            jedinica_mjere,
            tezina,
            dimenzije,
            namjena,
            slika_url,
            id_kategorija,
            id_proizvodac,
            aktivan,
        } = req.body;

        conn = await pool.getConnection();

        const existing = await conn.query(
            `
            SELECT id_proizvod
            FROM Proizvod
            WHERE id_proizvod = ?
            LIMIT 1
            `,
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({
                success: false,
                message: "Proizvod nije pronađen.",
            });
        }

        await conn.query(
            `
            UPDATE Proizvod
            SET
                naziv = ?,
                opis = ?,
                sifra = ?,
                cijena = ?,
                jedinica_mjere = ?,
                tezina = ?,
                dimenzije = ?,
                namjena = ?,
                slika_url = ?,
                id_kategorija = ?,
                id_proizvodac = ?,
                aktivan = ?,
                datum_azuriranja = NOW()

            WHERE id_proizvod = ?
            `,
            [
                naziv,
                opis || null,
                sifra || null,
                Number(cijena),
                jedinica_mjere || "kom",
                tezina || null,
                dimenzije || null,
                namjena || null,
                slika_url || null,
                id_kategorija || null,
                id_proizvodac || null,
                aktivan ? 1 : 0,
                id,
            ]
        );

        return res.json({
            success: true,
            message: "Proizvod uspješno ažuriran.",
        });

    } catch (err) {

        console.error(
            "Greška u update proizvoda:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Greška pri ažuriranju proizvoda.",
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};


// ============================================================
// OBRIŠI PROIZVOD
// DELETE /api/proizvodi/:id
// ADMIN
// ============================================================

exports.delete = async (req, res) => {
    let conn;

    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Neispravan ID proizvoda.",
            });
        }

        conn = await pool.getConnection();

        const existing = await conn.query(
            `
            SELECT id_proizvod
            FROM Proizvod
            WHERE id_proizvod = ?
            LIMIT 1
            `,
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({
                success: false,
                message: "Proizvod nije pronađen.",
            });
        }

        // Soft delete - proizvod se ne briše fizički
        await conn.query(
            `
            UPDATE Proizvod
            SET
                aktivan = 0,
                datum_azuriranja = NOW()
            WHERE id_proizvod = ?
            `,
            [id]
        );

        return res.json({
            success: true,
            message: "Proizvod uspješno uklonjen.",
        });

    } catch (err) {

        console.error(
            "Greška u delete proizvoda:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Greška pri brisanju proizvoda.",
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};