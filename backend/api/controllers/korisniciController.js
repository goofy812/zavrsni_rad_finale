const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
  const { ime, prezime, korisnicko_ime, lozinka, email, privatni_racun } = req.body;
  if (!korisnicko_ime || !lozinka || !email) return res.status(400).json({ success: false, message: "Korisničko ime, email i lozinka su obavezni." });
  let conn;
  try {
    conn = await pool.getConnection();
    const hash = await bcrypt.hash(lozinka, 12);
    const result = await conn.query(
      `INSERT INTO Korisnik (ime, prezime, korisnicko_ime, lozinka, email, privatni_racun, tip_korisnika, razina_prava, datum_kreiranja)
       VALUES (?, ?, ?, ?, ?, ?, 'kupac', 0, NOW())`,
      [ime || null, prezime || null, korisnicko_ime, hash, email, privatni_racun ? 1 : 0],
    );
    res.status(201).json({ success: true, id_korisnik: result.insertId });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  finally { if (conn) conn.release(); }
};

exports.getAll = async (req, res) => {
  let conn;
  try {
    const { korisnicko_ime } = req.query;
    let query = `SELECT id_korisnik, ime, prezime, korisnicko_ime, email, tip_korisnika, razina_prava, privatni_racun, datum_kreiranja FROM Korisnik`;
    const params = [];
    if (korisnicko_ime) { query += " WHERE korisnicko_ime LIKE ?"; params.push(`%${korisnicko_ime}%`); }
    query += " ORDER BY korisnicko_ime";
    conn = await pool.getConnection();
    res.json(await conn.query(query, params));
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  finally { if (conn) conn.release(); }
};

exports.getOne = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(
      `
      SELECT
        id_korisnik,
        ime,
        prezime,
        korisnicko_ime,
        email,
        tip_korisnika,
        razina_prava,
        privatni_racun,
        datum_kreiranja
      FROM Korisnik
      WHERE id_korisnik = ?
      `,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Korisnik nije pronađen."
      });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("Greška pri dohvaćanju korisnika:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  } finally {
    if (conn) {
      conn.release();
    }
  }
};

exports.update = async (req, res) => {
  const {
    ime,
    prezime,
    korisnicko_ime,
    lozinka,
    email,
    privatni_racun,
  } = req.body;

  let conn;

  try {
    conn = await pool.getConnection();

    // Prvo dohvatimo postojećeg korisnika
    const rows = await conn.query(
      `
      SELECT
        ime,
        prezime,
        korisnicko_ime,
        email,
        privatni_racun
      FROM Korisnik
      WHERE id_korisnik = ?
      `,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Korisnik nije pronađen.",
      });
    }

    const stariKorisnik = rows[0];

    // Ako frontend nešto ne pošalje,
    // zadržavamo postojeću vrijednost.
    const novoIme =
      ime !== undefined ? ime : stariKorisnik.ime;

    const novoPrezime =
      prezime !== undefined
        ? prezime
        : stariKorisnik.prezime;

    const novoKorisnickoIme =
      korisnicko_ime !== undefined
        ? korisnicko_ime
        : stariKorisnik.korisnicko_ime;

    const noviEmail =
      email !== undefined
        ? email
        : stariKorisnik.email;

    const privatni =
      privatni_racun !== undefined
        ? (privatni_racun ? 1 : 0)
        : stariKorisnik.privatni_racun;


    // ============================================================
    // AKO SE MIJENJA LOZINKA
    // ============================================================

    if (lozinka && lozinka.trim() !== "") {

      const hash = await bcrypt.hash(
        lozinka,
        12
      );

      await conn.query(
        `
        UPDATE Korisnik
        SET
          ime = ?,
          prezime = ?,
          korisnicko_ime = ?,
          lozinka = ?,
          email = ?,
          privatni_racun = ?
        WHERE id_korisnik = ?
        `,
        [
          novoIme || null,
          novoPrezime || null,
          novoKorisnickoIme,
          hash,
          noviEmail,
          privatni,
          req.params.id,
        ]
      );

    } else {

      // ============================================================
      // BEZ PROMJENE LOZINKE
      // ============================================================

      await conn.query(
        `
        UPDATE Korisnik
        SET
          ime = ?,
          prezime = ?,
          korisnicko_ime = ?,
          email = ?,
          privatni_racun = ?
        WHERE id_korisnik = ?
        `,
        [
          novoIme || null,
          novoPrezime || null,
          novoKorisnickoIme,
          noviEmail,
          privatni,
          req.params.id,
        ]
      );
    }

    res.json({
      success: true,
      message: "Korisnik uspješno ažuriran.",
    });

  } catch (err) {

    console.error(
      "GREŠKA UPDATE KORISNIKA:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Greška pri ažuriranju korisnika.",
      error: err.message,
    });

  } finally {

    if (conn) {
      conn.release();
    }
  }
};

exports.delete = async (req, res) => {
  let conn;
  try { conn = await pool.getConnection(); await conn.query("DELETE FROM Korisnik WHERE id_korisnik = ?", [req.params.id]); res.json({ success: true, message: "Korisnik obrisan." }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
  finally { if (conn) conn.release(); }
};

exports.getAdmins = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(`
      SELECT
        id_korisnik,
        ime,
        prezime,
        korisnicko_ime,
        email,
        tip_korisnika,
        razina_prava,
        privatni_racun,
        datum_kreiranja
      FROM Korisnik
      WHERE tip_korisnika = 'admin'
         OR razina_prava = 1
      ORDER BY korisnicko_ime
    `);

    res.json(rows);

  } catch (err) {
    console.error("Greška pri dohvaćanju administratora:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  } finally {
    if (conn) {
      conn.release();
    }
  }
};

exports.checkAdmin = async (req, res) => {
  let conn;
  try { conn = await pool.getConnection(); const rows = await conn.query("SELECT id_korisnik FROM Korisnik WHERE id_korisnik=? AND (tip_korisnika='admin' OR razina_prava=1)", [req.params.id]); res.json({ isAdmin: rows.length > 0 }); }
  catch (err) { res.status(500).json({ success: false, error: err.message, isAdmin: false }); }
  finally { if (conn) conn.release(); }
};

exports.addAdmin = async (req, res) => {
  let conn;
  try { conn = await pool.getConnection(); await conn.query("UPDATE Korisnik SET tip_korisnika='admin', razina_prava=1 WHERE id_korisnik=?", [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
  finally { if (conn) conn.release(); }
};

exports.removeAdmin = async (req, res) => {
  let conn;
  try { conn = await pool.getConnection(); await conn.query("UPDATE Korisnik SET tip_korisnika='kupac', razina_prava=0 WHERE id_korisnik=?", [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
  finally { if (conn) conn.release(); }
};
