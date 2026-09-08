const pool = require("../config/db");

// ============================================================
// POMOĆNA FUNKCIJA - BIGINT -> NUMBER
// ============================================================

function safeJson(data) {
    return JSON.parse(
        JSON.stringify(data, (_, value) => {
            if (typeof value === "bigint") {
                return Number(value);
            }

            return value;
        })
    );
}


// ============================================================
// KREIRAJ NARUDŽBU
// POST /api/narudzbe
// ============================================================

// ============================================================
// KREIRAJ NARUDŽBU
// POST /api/narudzbe
// ============================================================

exports.create = async (req, res) => {

    const {
        stavke,

        ime_primatelja,
        prezime_primatelja,

        adresa_dostave,
        grad_dostave,
        postanski_broj,
        telefon_dostave,

        nacin_placanja,
        napomena,
    } = req.body || {};


    const userId = Number(req.userId);


    console.log("=================================");
    console.log("🛒 KREIRANJE NARUDŽBE");
    console.log("Korisnik:", userId);
    console.log("Stavke:", stavke);
    console.log("Primatelj:", ime_primatelja, prezime_primatelja);
    console.log("Adresa:", adresa_dostave);
    console.log("Grad:", grad_dostave);
    console.log("Poštanski broj:", postanski_broj);
    console.log("Telefon:", telefon_dostave);
    console.log("Način plaćanja:", nacin_placanja);
    console.log("Napomena:", napomena);
    console.log("=================================");


    // ============================================================
    // PROVJERA KORISNIKA
    // ============================================================

    if (!userId || !Number.isInteger(userId)) {

        return res.status(401).json({
            success: false,
            message:
                "Korisnik nije prijavljen ili token nije ispravan.",
        });

    }


    // ============================================================
    // PROVJERA STAVKI
    // ============================================================

    if (
        !Array.isArray(stavke) ||
        stavke.length === 0
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Narudžba mora sadržavati barem jednu stavku.",
        });

    }


    // ============================================================
    // PROVJERA PODATAKA ZA DOSTAVU
    // ============================================================

    if (
        !ime_primatelja ||
        !prezime_primatelja ||
        !adresa_dostave ||
        !grad_dostave ||
        !postanski_broj ||
        !telefon_dostave
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Svi podaci za dostavu su obavezni.",
        });

    }


    // ============================================================
    // NORMALIZACIJA NAČINA PLAĆANJA
    // ============================================================

    let nacinPlacanja =
        String(nacin_placanja || "pouzece")
            .trim()
            .toLowerCase();


    /*
     * Podržavamo nekoliko mogućih vrijednosti
     * kako ne bi došlo do problema ako frontend
     * pošalje "kartično", "karticno" ili "kartica".
     */

    if (
        nacinPlacanja === "karticno" ||
        nacinPlacanja === "kartično" ||
        nacinPlacanja === "karticno_placanje" ||
        nacinPlacanja === "kartično_plaćanje"
    ) {

        nacinPlacanja = "kartica";

    }


    if (
        nacinPlacanja === "poucece" ||
        nacinPlacanja === "pouzećem" ||
        nacinPlacanja === "pouzece"
    ) {

        nacinPlacanja = "pouzece";

    }


    // ============================================================
    // PROVJERA NAČINA PLAĆANJA
    // ============================================================

    if (
        nacinPlacanja !== "pouzece" &&
        nacinPlacanja !== "kartica"
    ) {

        console.log(
            "❌ Nepodržani način plaćanja:",
            nacin_placanja
        );

        return res.status(400).json({
            success: false,
            message:
                "Odabrani način plaćanja nije podržan.",
        });

    }


    // ============================================================
    // STATUS PLAĆANJA
    // ============================================================
    //
    // POUZEĆE:
    // nije_placeno
    //
    // KARTICA:
    // placeno
    //
    // Status se određuje na backendu.
    // ============================================================

    const statusPlacanja =
        nacinPlacanja === "kartica"
            ? "placeno"
            : "nije_placeno";


    console.log(
        "✅ Normalizirani način plaćanja:",
        nacinPlacanja
    );

    console.log(
        "✅ Status plaćanja:",
        statusPlacanja
    );


    let conn;


    try {

        conn = await pool.getConnection();


        // ========================================================
        // TRANSAKCIJA
        // ========================================================

        await conn.beginTransaction();


        let ukupnoBezPdv = 0;

        const validated = [];


        // ========================================================
        // PROVJERI SVE STAVKE
        // ========================================================

        for (const item of stavke) {

            const id =
                Number(item.id_proizvod);


            const kolicina =
                Number(item.kolicina);


            if (
                !Number.isInteger(id) ||
                !Number.isFinite(kolicina) ||
                kolicina <= 0
            ) {

                throw new Error(
                    "Neispravna stavka narudžbe."
                );

            }


            // ====================================================
            // DOHVATI PROIZVOD I ZALIHU
            // ====================================================

            const rows = await conn.query(
                `
                SELECT
                    p.id_proizvod,
                    p.naziv,
                    p.cijena,
                    p.aktivan,
                    z.kolicina AS stanje_zalihe
                FROM Proizvod p
                LEFT JOIN Zaliha z
                    ON p.id_proizvod = z.id_proizvod
                WHERE p.id_proizvod = ?
                  AND p.aktivan = 1
                FOR UPDATE
                `,
                [id]
            );


            if (!rows.length) {

                throw new Error(
                    `Proizvod s ID ${id} nije pronađen ili nije aktivan.`
                );

            }


            const proizvod =
                rows[0];


            const cijena =
                Number(proizvod.cijena);


            const stanjeZalihe =
                Number(
                    proizvod.stanje_zalihe || 0
                );


            console.log(
                `📦 ${proizvod.naziv} | količina: ${kolicina} | zaliha: ${stanjeZalihe}`
            );


            // ====================================================
            // PROVJERA ZALIHE
            // ====================================================

            if (
                stanjeZalihe < kolicina
            ) {

                throw new Error(
                    `Nema dovoljno zalihe za proizvod "${proizvod.naziv}". Dostupno: ${stanjeZalihe}.`
                );

            }


            validated.push({

                id,

                kolicina,

                cijena,

            });


            ukupnoBezPdv +=
                cijena * kolicina;

        }


        // ========================================================
        // PDV
        // ========================================================

        const iznosPdv =
            ukupnoBezPdv * 0.25;


        const ukupnoSaPdv =
            ukupnoBezPdv + iznosPdv;


        // ========================================================
        // BROJ NARUDŽBE
        // ========================================================

        const brojNarudzbe =
            `NAR-${new Date().getFullYear()}-${Date.now()
                .toString()
                .slice(-6)}`;


        // ========================================================
        // KREIRAJ NARUDŽBU
        // ========================================================

        const result = await conn.query(
            `
            INSERT INTO Narudzba
            (
                id_korisnik,
                broj_narudzbe,

                ukupno_bez_pdv,
                iznos_pdv,
                ukupno_sa_pdv,

                id_status_narudzbe,

                napomena,

                adresa_dostave,
                grad_dostave,
                postanski_broj,
                telefon_dostave,

                ime_primatelja,
                prezime_primatelja,

                nacin_placanja,
                status_placanja,

                datum_kreiranja
            )
            VALUES
            (
                ?,
                ?,

                ?,
                ?,
                ?,

                1,

                ?,

                ?,
                ?,
                ?,
                ?,

                ?,
                ?,

                ?,
                ?,

                NOW()
            )
            `,
            [

                userId,

                brojNarudzbe,


                ukupnoBezPdv,

                iznosPdv,

                ukupnoSaPdv,


                napomena || null,


                adresa_dostave,

                grad_dostave,

                postanski_broj,

                telefon_dostave,


                ime_primatelja,

                prezime_primatelja,


                // NAČIN PLAĆANJA
                nacinPlacanja,


                // STATUS PLAĆANJA
                statusPlacanja,

            ]
        );


        const narudzbaId =
            Number(result.insertId);


        console.log(
            "✅ Narudžba kreirana:",
            narudzbaId,
            brojNarudzbe
        );


        // ========================================================
        // STAVKE NARUDŽBE
        // ========================================================

        for (const item of validated) {

            const ukupnoStavke =
                item.cijena *
                item.kolicina;


            await conn.query(
                `
                INSERT INTO StavkaNarudzbe
                (
                    id_narudzba,
                    id_proizvod,
                    kolicina,
                    cijena_po_jedinici,
                    ukupno
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [

                    narudzbaId,

                    item.id,

                    item.kolicina,

                    item.cijena,

                    ukupnoStavke,

                ]
            );


            // ====================================================
            // SMANJI ZALIHU
            // ====================================================

            await conn.query(
                `
                UPDATE Zaliha
                SET
                    kolicina =
                        kolicina - ?,

                    datum_zadnje_azuriranje =
                        NOW()

                WHERE id_proizvod = ?
                `,
                [

                    item.kolicina,

                    item.id,

                ]
            );

        }


        // ========================================================
        // POTVRDI TRANSAKCIJU
        // ========================================================

        await conn.commit();


        console.log(
            "✅ Narudžba i plaćanje uspješno spremljeni."
        );


        // ========================================================
        // ODGOVOR
        // ========================================================

        return res.status(201).json({

            success: true,

            message:
                nacinPlacanja === "kartica"

                    ? "Plaćanje karticom uspješno simulirano. Narudžba je plaćena."

                    : "Narudžba uspješno kreirana.",


            id:
                narudzbaId,


            broj:
                brojNarudzbe,


            ukupno:
                Number(
                    ukupnoSaPdv.toFixed(2)
                ),


            nacin_placanja:
                nacinPlacanja,


            status_placanja:
                statusPlacanja,

        });


    } catch (err) {


        // ========================================================
        // ROLLBACK
        // ========================================================

        if (conn) {

            try {

                await conn.rollback();

            } catch (rollbackError) {

                console.error(
                    "Rollback greška:",
                    rollbackError
                );

            }

        }


        console.error(
            "❌ GREŠKA PRI KREIRANJU NARUDŽBE:",
            err
        );


        return res.status(500).json({

            success: false,

            message:
                err.message ||
                "Greška pri kreiranju narudžbe.",

        });


    } finally {

        if (conn) {

            conn.release();

        }

    }

};

// ============================================================
// DOHVATI SVE NARUDŽBE - ADMIN
// GET /api/narudzbe
// ============================================================

exports.getAll = async (req, res) => {

    const page =
        Number(req.query.page) || 1;

    const limit =
        Number(req.query.limit) || 20;

    const offset =
        (page - 1) * limit;

    let conn;

    try {

        conn = await pool.getConnection();

        let query = `
            SELECT
                n.*,
                CONCAT(
                    k.ime,
                    ' ',
                    k.prezime
                ) AS korisnik_ime,
                k.email AS korisnik_email,
                s.naziv AS status_naziv,
                s.boja AS status_boja
            FROM Narudzba n
            JOIN Korisnik k
                ON n.id_korisnik = k.id_korisnik
            JOIN StatusNarudzbe s
                ON n.id_status_narudzbe =
                   s.id_status_narudzbe
            WHERE 1 = 1
        `;

        const params = [];

        if (req.query.status) {

            query += `
                AND n.id_status_narudzbe = ?
            `;

            params.push(
                Number(req.query.status)
            );
        }

        query += `
            ORDER BY n.datum_kreiranja DESC
            LIMIT ? OFFSET ?
        `;

        params.push(
            limit,
            offset
        );

        const rows = await conn.query(
            query,
            params
        );

        const countResult =
            await conn.query(
                `
                SELECT COUNT(*) AS total
                FROM Narudzba
                `
            );

        const total =
            Number(
                countResult[0]?.total || 0
            );

        return res.json({
            success: true,
            data: safeJson(rows),
            meta: {
                total,
                page,
                limit,
                last_page:
                    Math.ceil(
                        total / limit
                    ),
            },
        });

    } catch (err) {

        console.error(
            "Greška pri dohvaćanju svih narudžbi:",
            err
        );

        return res.status(500).json({
            success: false,
            message:
                "Greška pri dohvaćanju narudžbi.",
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};


// ============================================================
// DOHVATI KORISNIKOVE NARUDŽBE
// GET /api/narudzbe/moje
// ============================================================

exports.getUserOrders = async (req, res) => {

    const userId =
        Number(req.userId);

    let conn;

    try {

        conn = await pool.getConnection();

        const rows = await conn.query(
            `
            SELECT
                n.*,

                s.naziv AS status_naziv,
                s.boja AS status_boja,

                (
                    SELECT COUNT(*)
                    FROM StavkaNarudzbe sn
                    WHERE sn.id_narudzba =
                          n.id_narudzba
                ) AS broj_stavki

            FROM Narudzba n

            JOIN StatusNarudzbe s
                ON n.id_status_narudzbe =
                   s.id_status_narudzbe

            WHERE n.id_korisnik = ?

            ORDER BY
                n.datum_kreiranja DESC
            `,
            [userId]
        );

        const safeRows =
            safeJson(rows);

        console.log(
            "📋 Moje narudžbe:",
            safeRows.length
        );

        return res.json({
            success: true,
            data: safeRows,
        });

    } catch (err) {

        console.error(
            "❌ Greška pri dohvaćanju korisnikovih narudžbi:",
            err
        );

        return res.status(500).json({
            success: false,
            message:
                "Greška pri dohvaćanju narudžbi.",
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};


// ============================================================
// DOHVATI JEDNU NARUDŽBU
// GET /api/narudzbe/:id
// ============================================================

exports.getOne = async (req, res) => {

    const narudzbaId =
        Number(req.params.id);

    const userId =
        Number(req.userId);

    let conn;

    try {

        conn = await pool.getConnection();

        const narudzba =
            await conn.query(
                `
                SELECT
                    n.*,

                    CONCAT(
                        k.ime,
                        ' ',
                        k.prezime
                    ) AS korisnik_ime,

                    k.email AS korisnik_email,

                    s.naziv AS status_naziv,
                    s.boja AS status_boja

                FROM Narudzba n

                JOIN Korisnik k
                    ON n.id_korisnik =
                       k.id_korisnik

                JOIN StatusNarudzbe s
                    ON n.id_status_narudzbe =
                       s.id_status_narudzbe

                WHERE n.id_narudzba = ?
                `,
                [narudzbaId]
            );

        if (!narudzba.length) {

            return res.status(404).json({
                success: false,
                message:
                    "Narudžba nije pronađena.",
            });
        }

        const narudzbaData =
            safeJson(narudzba[0]);

        // Korisnik smije vidjeti samo
        // svoju narudžbu.
        //
        // Admin može vidjeti sve.

        if (
            Number(
                narudzbaData.id_korisnik
            ) !== userId &&
            req.userTip !== "admin"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Nemate pravo pregledati ovu narudžbu.",
            });
        }

        // ========================================================
        // STAVKE NARUDŽBE
        // ========================================================

        const stavke =
            await conn.query(
                `
                SELECT
                    sn.*,

                    p.naziv AS proizvod_naziv,
                    p.jedinica_mjere,
                    p.slika_url

                FROM StavkaNarudzbe sn

                JOIN Proizvod p
                    ON sn.id_proizvod =
                       p.id_proizvod

                WHERE sn.id_narudzba = ?
                `,
                [narudzbaId]
            );

        return res.json({
            success: true,

            data: {
                ...narudzbaData,
                stavke: safeJson(stavke),
            },
        });

    } catch (err) {

        console.error(
            "Greška pri dohvaćanju narudžbe:",
            err
        );

        return res.status(500).json({
            success: false,
            message:
                "Greška pri dohvaćanju narudžbe.",
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};


// ============================================================
// PROMIJENI STATUS NARUDŽBE - ADMIN
// PUT /api/narudzbe/:id/status
// ============================================================

exports.updateStatus = async (req, res) => {

    const narudzbaId =
        Number(req.params.id);

    const idStatusNarudzbe =
        Number(
            req.body.id_status_narudzbe
        );

    if (!idStatusNarudzbe) {

        return res.status(400).json({
            success: false,
            message:
                "ID statusa je obavezan.",
        });
    }

    let conn;

    try {

        conn = await pool.getConnection();

        const narudzba =
            await conn.query(
                `
                SELECT id_narudzba
                FROM Narudzba
                WHERE id_narudzba = ?
                `,
                [narudzbaId]
            );

        if (!narudzba.length) {

            return res.status(404).json({
                success: false,
                message:
                    "Narudžba nije pronađena.",
            });
        }

        const status =
            await conn.query(
                `
                SELECT id_status_narudzbe
                FROM StatusNarudzbe
                WHERE id_status_narudzbe = ?
                  AND aktivan = 1
                `,
                [idStatusNarudzbe]
            );

        if (!status.length) {

            return res.status(400).json({
                success: false,
                message:
                    "Status nije pronađen ili nije aktivan.",
            });
        }

        await conn.query(
            `
            UPDATE Narudzba
            SET
                id_status_narudzbe = ?,
                datum_azuriranja = NOW()
            WHERE id_narudzba = ?
            `,
            [
                idStatusNarudzbe,
                narudzbaId,
            ]
        );

        // Status 4 = Isporučena

        if (idStatusNarudzbe === 4) {

            await conn.query(
                `
                UPDATE Narudzba
                SET datum_isporuke = NOW()
                WHERE id_narudzba = ?
                `,
                [narudzbaId]
            );
        }

        // Status 3 = Otpremljena

        if (idStatusNarudzbe === 3) {

            await conn.query(
                `
                UPDATE Narudzba
                SET datum_otpreme = NOW()
                WHERE id_narudzba = ?
                `,
                [narudzbaId]
            );
        }

        return res.json({
            success: true,
            message:
                "Status narudžbe uspješno promijenjen.",
        });

    } catch (err) {

        console.error(
            "Greška pri promjeni statusa:",
            err
        );

        return res.status(500).json({
            success: false,
            message:
                "Greška pri promjeni statusa.",
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};


// ============================================================
// OTKAŽI NARUDŽBU - ADMIN
// PUT /api/narudzbe/:id/otkazi
// ============================================================

exports.cancelOrder = async (req, res) => {

    const narudzbaId =
        Number(req.params.id);

    let conn;

    try {

        conn =
            await pool.getConnection();

        await conn.beginTransaction();

        const narudzba =
            await conn.query(
                `
                SELECT *
                FROM Narudzba
                WHERE id_narudzba = ?
                FOR UPDATE
                `,
                [narudzbaId]
            );

        if (!narudzba.length) {

            await conn.rollback();

            return res.status(404).json({
                success: false,
                message:
                    "Narudžba nije pronađena.",
            });
        }

        const statusId =
            Number(
                narudzba[0]
                    .id_status_narudzbe
            );

        // Status 4 = Isporučena

        if (statusId === 4) {

            await conn.rollback();

            return res.status(400).json({
                success: false,
                message:
                    "Isporučena narudžba se ne može otkazati.",
            });
        }

        // Status 5 = Otkazana

        if (statusId === 5) {

            await conn.rollback();

            return res.status(400).json({
                success: false,
                message:
                    "Narudžba je već otkazana.",
            });
        }

        // ========================================================
        // VRATI PROIZVODE NA ZALIHU
        // ========================================================

        const stavke =
            await conn.query(
                `
                SELECT
                    id_proizvod,
                    kolicina
                FROM StavkaNarudzbe
                WHERE id_narudzba = ?
                `,
                [narudzbaId]
            );

        for (const item of stavke) {

            await conn.query(
                `
                UPDATE Zaliha
                SET
                    kolicina =
                        kolicina + ?,
                    datum_zadnje_azuriranje =
                        NOW()
                WHERE id_proizvod = ?
                `,
                [
                    Number(item.kolicina),
                    Number(item.id_proizvod),
                ]
            );
        }

        // ========================================================
        // POSTAVI STATUS NA OTKAZANO
        // ========================================================

        await conn.query(
            `
            UPDATE Narudzba
            SET
                id_status_narudzbe = 5,
                datum_azuriranja = NOW()
            WHERE id_narudzba = ?
            `,
            [narudzbaId]
        );

        await conn.commit();

        return res.json({
            success: true,
            message:
                "Narudžba uspješno otkazana.",
        });

    } catch (err) {

        if (conn) {

            try {
                await conn.rollback();
            } catch (rollbackError) {

                console.error(
                    "Rollback greška:",
                    rollbackError
                );
            }
        }

        console.error(
            "Greška pri otkazivanju narudžbe:",
            err
        );

        return res.status(500).json({
            success: false,
            message:
                "Greška pri otkazivanju narudžbe.",
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
};