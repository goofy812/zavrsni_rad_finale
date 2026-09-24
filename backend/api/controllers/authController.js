const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET =
  process.env.JWT_SECRET || "promijeni_me_u_jaki_jwt_secret";

const TOKEN_TTL = process.env.JWT_EXPIRES_IN || "7d";

// ============================================================
// JWT
// ============================================================

function signUser(user) {
  return jwt.sign(
    {
      id: Number(user.id_korisnik),

      tip:
        user.tip_korisnika ||
        (Number(user.razina_prava) === 1
          ? "admin"
          : "kupac"),
    },
 
    JWT_SECRET,

    {
      expiresIn: TOKEN_TTL,
    }
  );
}

// ============================================================
// PRIJAVA
// POST /api/auth/prijava
// ============================================================

exports.login = async (req, res) => {
  const {
    korisnicko_ime,
    email,
    lozinka,
  } = req.body || {};

  // Može se prijaviti korisničkim imenom ili emailom
  const login = String(
    korisnicko_ime || email || ""
  ).trim();

  // Provjera podataka
  if (!login || !lozinka) {
    return res.status(400).json({
      success: false,
      message:
        "Korisničko ime/email i lozinka su obavezni.",
    });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    console.log("🔐 Pokušaj prijave:", login);

    // ========================================================
    // Dohvat korisnika
    // ========================================================

    const rows = await conn.query(
      `
      SELECT
        id_korisnik,
        ime,
        prezime,
        korisnicko_ime,
        email,
        lozinka,
        tip_korisnika,
        privatni_racun,
        razina_prava
      FROM Korisnik
      WHERE korisnicko_ime = ?
         OR email = ?
      LIMIT 1
      `,
      [
        login,
        login,
      ]
    );

    console.log(
      "👤 Pronađeno korisnika:",
      rows.length
    );

    // Korisnik ne postoji
    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message:
          "Pogrešno korisničko ime/email ili lozinka.",
      });
    }

    const user = rows[0];

    // ========================================================
    // PROVJERA LOZINKE
    //
    // Lozinka u bazi je bcrypt hash.
    // bcrypt.compare uspoređuje unesenu lozinku
    // s hashom iz baze.
    // ========================================================

    const isPasswordCorrect =
      await bcrypt.compare(
        String(lozinka),
        String(user.lozinka)
      );

    if (!isPasswordCorrect) {
      console.log(
        "❌ Pogrešna lozinka:",
        login
      );

      return res.status(401).json({
        success: false,
        message:
          "Pogrešno korisničko ime/email ili lozinka.",
      });
    }

    // ========================================================
    // Određivanje tipa korisnika
    // ========================================================

    user.tip_korisnika =
      user.tip_korisnika ||
      (Number(user.razina_prava) === 1
        ? "admin"
        : "kupac");

    // ========================================================
    // BigInt -> Number
    // ========================================================

    user.id_korisnik =
      Number(user.id_korisnik);

    // ========================================================
    // Ne šaljemo lozinku frontend-u
    // ========================================================

    delete user.lozinka;

    // ========================================================
    // JWT token
    // ========================================================

    const token = signUser(user);

    console.log(
      "✅ Uspješna prijava:",
      user.korisnicko_ime,
      "| tip:",
      user.tip_korisnika
    );

    // ========================================================
    // Response
    // ========================================================

    return res.json({
      success: true,

      token,

      korisnik: user,
    });

  } catch (err) {
    console.error(
      "❌ Greška pri prijavi:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Greška pri prijavi.",
    });

  } finally {
    if (conn) {
      conn.release();
    }
  }
};

// ============================================================
// REGISTRACIJA
// POST /api/auth/registracija
// ============================================================

exports.register = async (req, res) => {
  const {
    ime,
    prezime,
    korisnicko_ime,
    email,
    lozinka,
  } = req.body || {};

  // ========================================================
  // Provjera obaveznih polja
  // ========================================================

  if (
    !ime ||
    !prezime ||
    !korisnicko_ime ||
    !email ||
    !lozinka
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Sva obavezna polja moraju biti popunjena.",
    });
  }

  // ========================================================
  // Provjera duljine lozinke
  // ========================================================

  if (String(lozinka).length < 6) {
    return res.status(400).json({
      success: false,
      message:
        "Lozinka mora imati najmanje 6 znakova.",
    });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    // ========================================================
    // Provjera postoji li korisničko ime ili email
    // ========================================================

    const existing = await conn.query(
      `
      SELECT
        id_korisnik
      FROM Korisnik
      WHERE korisnicko_ime = ?
         OR email = ?
      LIMIT 1
      `,
      [
        korisnicko_ime,
        email,
      ]
    );

    if (existing.length) {
      return res.status(409).json({
        success: false,
        message:
          "Korisničko ime ili email već postoji.",
      });
    }

    // ========================================================
    // HASH LOZINKE
    // ========================================================

    const hash = await bcrypt.hash(
      String(lozinka),
      12
    );

    // ========================================================
    // Kreiranje korisnika
    // ========================================================

    const result = await conn.query(
      `
      INSERT INTO Korisnik
      (
        ime,
        prezime,
        korisnicko_ime,
        email,
        lozinka,
        tip_korisnika,
        privatni_racun,
        razina_prava,
        datum_kreiranja
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        ?,
        'kupac',
        0,
        0,
        NOW()
      )
      `,
      [
        ime,
        prezime,
        korisnicko_ime,
        email,
        hash,
      ]
    );

    // MariaDB može vratiti BigInt
    const idKorisnik =
      Number(result.insertId);

    console.log(
      "✅ Novi korisnik registriran:",
      korisnicko_ime
    );

    // ========================================================
    // Response
    // ========================================================

    return res.status(201).json({
      success: true,
      message: "Registracija uspješna.",
      id_korisnik: idKorisnik,
    });

  } catch (err) {
    console.error(
      "❌ Greška pri registraciji:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Greška pri registraciji.",
    });

  } finally {
    if (conn) {
      conn.release();
    }
  }
};