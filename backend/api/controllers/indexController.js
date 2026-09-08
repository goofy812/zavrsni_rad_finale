const pool = require("../config/db");

// Pomoćna funkcija za ispravnu putanju slike
function getImageUrl(slikaUrl) {
  if (!slikaUrl) {
    return "";
  }

  let slika = String(slikaUrl).trim();

  // Ako je već puni URL, ostavi ga
  if (slika.startsWith("http://") || slika.startsWith("https://")) {
    return slika;
  }

  // Windows \ pretvori u /
  slika = slika.replace(/\\/g, "/");

  // Makni eventualni "public/" s početka
  slika = slika.replace(/^public\//, "");

  // Ako već počinje s /images/, samo osiguraj da ima jedan /
  if (slika.startsWith("/images/")) {
    return slika;
  }

  // Ako počinje s images/, dodaj /
  if (slika.startsWith("images/")) {
    return `/${slika}`;
  }

  // Ako je u bazi samo naziv datoteke,
  // dodaj mapu u kojoj se nalaze slike proizvoda
  return `/images/proizvodi/${slika}`;
}

exports.getSummary = async (req, res) => {
  try {
    // Broj aktivnih proizvoda
    const proizvodi = await pool.query(`
      SELECT COUNT(*) AS broj_proizvoda
      FROM Proizvod
      WHERE aktivan = 1
    `);

    // Broj korisnika
    const korisnici = await pool.query(`
      SELECT COUNT(*) AS broj_korisnika
      FROM Korisnik
    `);

    // Broj recenzija
    const recenzije = await pool.query(`
      SELECT COUNT(*) AS broj_recenzija
      FROM Recenzija
    `);

    // Broj narudžbi
    const narudzbe = await pool.query(`
      SELECT COUNT(*) AS broj_narudzbi
      FROM Narudzba
    `);

    // Broj proizvoda s niskom zalihom
    const niskaZaliha = await pool.query(`
      SELECT COUNT(*) AS broj_niska_zaliha
      FROM Zaliha
      WHERE kolicina <= 5
    `);

    // Proizvod koji se prikazuje na početnoj stranici
    const proizvod = await pool.query(`
      SELECT
        id_proizvod,
        naziv,
        opis,
        cijena,
        slika_url
      FROM Proizvod
      WHERE aktivan = 1
      ORDER BY id_proizvod DESC
      LIMIT 1
    `);

    const imaProizvod = proizvod.length > 0;

    res.json({
      success: true,

      broj_proizvoda: Number(proizvodi[0].broj_proizvoda),
      broj_korisnika: Number(korisnici[0].broj_korisnika),
      broj_recenzija: Number(recenzije[0].broj_recenzija),
      broj_narudzbi: Number(narudzbe[0].broj_narudzbi),
      niska_zaliha: Number(niskaZaliha[0].broj_niska_zaliha),

      naziv_proizvoda: imaProizvod
        ? proizvod[0].naziv
        : null,

      opis: imaProizvod
        ? proizvod[0].opis
        : null,

      cijena: imaProizvod
        ? `${Number(proizvod[0].cijena).toFixed(2)} € / kom`
        : null,

      id_proizvoda: imaProizvod
        ? Number(proizvod[0].id_proizvod)
        : null,

      slika_url: imaProizvod
        ? getImageUrl(proizvod[0].slika_url)
        : ""
    });

  } catch (error) {
    console.error("Greška dashboard:", error);

    res.status(500).json({
      success: false,
      message: "Greška pri dohvaćanju podataka dashboarda"
    });
  }
};