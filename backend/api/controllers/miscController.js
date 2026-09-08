const pool = require("../config/db");

// ============================================================ //
// DOHVATI PODATKE ZA POČETNU STRANICU
// ============================================================ //
exports.getIndexSummary = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Broj proizvoda
        const products = await conn.query(
            "SELECT COUNT(*) as broj_proizvoda FROM Proizvod WHERE aktivan = 1"
        );

        // Broj korisnika
        const users = await conn.query(
            "SELECT COUNT(*) as broj_korisnika FROM Korisnik WHERE tip_korisnika = 'kupac'"
        );

        // Broj recenzija
        let reviews = { broj_recenzija: 0 };
        try {
            const result = await conn.query(
                "SELECT COUNT(*) as broj_recenzija FROM Recenzija WHERE status = 'vidljivo'"
            );
            reviews = result[0] || { broj_recenzija: 0 };
        } catch (e) {
            // Tablica Recenzija možda ne postoji
        }

        // Proizvod dana (najprodavaniji)
        let productOfDay = {
            naziv_proizvoda: "Nema podataka",
            opis: "Trenutno nema dovoljno podataka",
            cijena: "",
            id_proizvoda: null,
        };

        try {
            const result = await conn.query(`
                SELECT p.id_proizvod, p.naziv, p.opis, p.cijena, p.jedinica_mjere,
                       COALESCE(SUM(sn.kolicina), 0) as ukupno_prodano
                FROM Proizvod p
                LEFT JOIN StavkaNarudzbe sn ON p.id_proizvod = sn.id_proizvod
                WHERE p.aktivan = 1
                GROUP BY p.id_proizvod
                ORDER BY ukupno_prodano DESC, p.naziv ASC
                LIMIT 1
            `);

            if (result && result.length > 0 && result[0].ukupno_prodano > 0) {
                productOfDay = {
                    naziv_proizvoda: result[0].naziv,
                    opis: result[0].opis || "Kvalitetni građevinski materijal",
                    cijena: `${result[0].cijena.toFixed(2)} € / ${result[0].jedinica_mjere}`,
                    id_proizvoda: result[0].id_proizvod,
                    ukupno_prodano: result[0].ukupno_prodano,
                };
            }
        } catch (e) {
            console.log("Nema stavki narudžbe, koristim default.");
        }

        res.json({
            broj_proizvoda: products[0]?.broj_proizvoda || 0,
            broj_korisnika: users[0]?.broj_korisnika || 0,
            broj_recenzija: reviews.broj_recenzija || 0,
            ...productOfDay,
        });
    } catch (err) {
        console.error("Greška pri dohvaćanju statistike:", err);
        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju podataka",
        });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI STATISTIKU ZA ADMIN DASHBOARD
// ============================================================ //
exports.getDashboardStats = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Ukupno proizvoda
        const products = await conn.query(
            "SELECT COUNT(*) as count FROM Proizvod WHERE aktivan = 1"
        );

        // Ukupno korisnika
        const users = await conn.query(
            "SELECT COUNT(*) as count FROM Korisnik WHERE tip_korisnika = 'kupac'"
        );

        // Ukupno narudžbi
        const orders = await conn.query(
            "SELECT COUNT(*) as count FROM Narudzba"
        );

        // Ukupna zarada (isporučene narudžbe)
        const revenue = await conn.query(
            "SELECT COALESCE(SUM(ukupno_sa_pdv), 0) as total FROM Narudzba WHERE id_status_narudzbe = 4"
        );

        // Broj narudžbi po statusima
        const ordersByStatus = await conn.query(`
            SELECT s.naziv, s.boja, COUNT(n.id_narudzba) as count
            FROM StatusNarudzbe s
            LEFT JOIN Narudzba n ON s.id_status_narudzbe = n.id_status_narudzbe
            WHERE s.aktivan = 1
            GROUP BY s.id_status_narudzbe
            ORDER BY s.redoslijed
        `);

        // Zadnjih 5 narudžbi
        const recentOrders = await conn.query(`
            SELECT n.id_narudzba, n.broj_narudzbe, n.ukupno_sa_pdv, n.datum_kreiranja,
                   CONCAT(k.ime, ' ', k.prezime) AS korisnik,
                   s.naziv AS status_naziv,
                   s.boja AS status_boja
            FROM Narudzba n
            JOIN Korisnik k ON n.id_korisnik = k.id_korisnik
            JOIN StatusNarudzbe s ON n.id_status_narudzbe = s.id_status_narudzbe
            ORDER BY n.datum_kreiranja DESC
            LIMIT 5
        `);

        // Upozorenja za zalihe (količina ispod minimalne)
        const warnings = await conn.query(`
            SELECT COUNT(*) as count
            FROM Zaliha z
            JOIN Proizvod p ON z.id_proizvod = p.id_proizvod
            WHERE z.kolicina <= z.minimalna_kolicina AND p.aktivan = 1
        `);

        // Najprodavaniji proizvodi (top 5)
        const topProducts = await conn.query(`
            SELECT p.id_proizvod, p.naziv, p.cijena, p.jedinica_mjere,
                   COALESCE(SUM(sn.kolicina), 0) as ukupno_prodano,
                   COALESCE(SUM(sn.ukupno), 0) as ukupna_zarada
            FROM Proizvod p
            LEFT JOIN StavkaNarudzbe sn ON p.id_proizvod = sn.id_proizvod
            WHERE p.aktivan = 1
            GROUP BY p.id_proizvod
            ORDER BY ukupno_prodano DESC
            LIMIT 5
        `);

        // Mjesečna prodaja (zadnjih 12 mjeseci)
        const monthlySales = await conn.query(`
            SELECT 
                DATE_FORMAT(datum_kreiranja, '%Y-%m') as mjesec,
                COUNT(*) as broj_narudzbi,
                COALESCE(SUM(ukupno_sa_pdv), 0) as ukupno
            FROM Narudzba
            WHERE datum_kreiranja >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(datum_kreiranja, '%Y-%m')
            ORDER BY mjesec DESC
            LIMIT 12
        `);

        res.json({
            broj_proizvoda: products[0]?.count || 0,
            broj_korisnika: users[0]?.count || 0,
            broj_narudzbi: orders[0]?.count || 0,
            ukupna_zarada: revenue[0]?.total || 0,
            narudzbe_po_statusima: ordersByStatus,
            zadnje_narudzbe: recentOrders,
            upozorenja_zaliha: warnings[0]?.count || 0,
            top_proizvodi: topProducts,
            mjesecna_prodaja: monthlySales,
        });
    } catch (err) {
        console.error("Greška pri dohvaćanju dashboard statistike:", err);
        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju podataka",
        });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI SVE STATUS (za dropdown)
// ============================================================ //
exports.getStatuses = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT id_status_narudzbe, naziv, boja FROM StatusNarudzbe WHERE aktivan = 1 ORDER BY redoslijed"
        );
        res.json(rows);
    } catch (err) {
        console.error("Greška pri dohvaćanju statusa:", err);
        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju statusa",
        });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI KATEGORIJE ZA DROPDOWN
// ============================================================ //
exports.getCategories = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT id_kategorija, naziv FROM Kategorija WHERE aktivan = 1 ORDER BY naziv"
        );
        res.json(rows);
    } catch (err) {
        console.error("Greška pri dohvaćanju kategorija:", err);
        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju kategorija",
        });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI PROIZVOĐAČE ZA DROPDOWN
// ============================================================ //
exports.getProizvodaci = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT id_proizvodac, naziv FROM Proizvodac WHERE aktivan = 1 ORDER BY naziv"
        );
        res.json(rows);
    } catch (err) {
        console.error("Greška pri dohvaćanju proizvođača:", err);
        res.status(500).json({
            success: false,
            message: "Greška pri dohvaćanju proizvođača",
        });
    } finally {
        if (conn) conn.release();
    }
};

// ============================================================ //
// DOHVATI INFORMACIJE O APLIKACIJI
// ============================================================ //
exports.getAppInfo = async (req, res) => {
    res.json({
        name: "TeraBuild",
        version: "1.0.0",
        description: "Web trgovina građevinskog materijala",
        author: "Tomislav",
        year: 2026,
        api_status: "online",
    });
};