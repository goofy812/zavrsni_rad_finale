-- TeraBuild / MariaDB schema
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS StavkaNarudzbe, Narudzba, ProizvodNaListi, Recenzija, Zaliha,
  Proizvod, Kategorija, Proizvodac, StatusNarudzbe, Korisnik;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE Korisnik (
  id_korisnik INT AUTO_INCREMENT PRIMARY KEY,
  ime VARCHAR(80) NOT NULL,
  prezime VARCHAR(80) NOT NULL,
  korisnicko_ime VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  lozinka VARCHAR(255) NOT NULL,
  tip_korisnika ENUM('kupac','admin') NOT NULL DEFAULT 'kupac',
  razina_prava TINYINT NOT NULL DEFAULT 0,
  privatni_racun BOOLEAN NOT NULL DEFAULT FALSE,
  datum_kreiranja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE Kategorija (
  id_kategorija INT AUTO_INCREMENT PRIMARY KEY,
  naziv VARCHAR(120) NOT NULL UNIQUE,
  opis TEXT,
  id_nadkategorija INT NULL,
  slika_url VARCHAR(500),
  redoslijed INT NOT NULL DEFAULT 0,
  aktivan BOOLEAN NOT NULL DEFAULT TRUE,
  datum_kreiranja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  datum_azuriranja DATETIME NULL,
  CONSTRAINT fk_kategorija_parent FOREIGN KEY (id_nadkategorija) REFERENCES Kategorija(id_kategorija) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE Proizvodac (
  id_proizvodac INT AUTO_INCREMENT PRIMARY KEY,
  naziv VARCHAR(150) NOT NULL UNIQUE,
  kontakt_osoba VARCHAR(150),
  email VARCHAR(150),
  telefon VARCHAR(50),
  web VARCHAR(255),
  aktivan BOOLEAN NOT NULL DEFAULT TRUE,
  datum_kreiranja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  datum_azuriranja DATETIME NULL
) ENGINE=InnoDB;

CREATE TABLE Proizvod (
  id_proizvod INT AUTO_INCREMENT PRIMARY KEY,
  naziv VARCHAR(180) NOT NULL,
  opis TEXT,
  sifra VARCHAR(80) NOT NULL UNIQUE,
  cijena DECIMAL(12,2) NOT NULL DEFAULT 0,
  jedinica_mjere VARCHAR(20) NOT NULL DEFAULT 'kom',
  tezina DECIMAL(10,3),
  dimenzije VARCHAR(120),
  namjena VARCHAR(255),
  slika_url VARCHAR(500),
  id_kategorija INT NOT NULL,
  id_proizvodac INT NOT NULL,
  aktivan BOOLEAN NOT NULL DEFAULT TRUE,
  datum_dodavanja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  datum_azuriranja DATETIME NULL,
  FOREIGN KEY (id_kategorija) REFERENCES Kategorija(id_kategorija),
  FOREIGN KEY (id_proizvodac) REFERENCES Proizvodac(id_proizvodac),
  INDEX idx_proizvod_kategorija (id_kategorija),
  INDEX idx_proizvod_proizvodac (id_proizvodac)
) ENGINE=InnoDB;

CREATE TABLE Zaliha (
  id_zaliha INT AUTO_INCREMENT PRIMARY KEY,
  id_proizvod INT NOT NULL UNIQUE,
  kolicina DECIMAL(12,3) NOT NULL DEFAULT 0,
  minimalna_kolicina DECIMAL(12,3) NOT NULL DEFAULT 0,
  maksimalna_kolicina DECIMAL(12,3) NULL,
  lokacija_skladista VARCHAR(120),
  datum_kreiranja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  datum_zadnje_azuriranje DATETIME NULL,
  FOREIGN KEY (id_proizvod) REFERENCES Proizvod(id_proizvod) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE StatusNarudzbe (
  id_status_narudzbe INT AUTO_INCREMENT PRIMARY KEY,
  naziv VARCHAR(80) NOT NULL UNIQUE,
  opis VARCHAR(255),
  redoslijed INT NOT NULL DEFAULT 0,
  boja VARCHAR(30),
  aktivan BOOLEAN NOT NULL DEFAULT TRUE,
  datum_kreiranja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  datum_azuriranja DATETIME NULL
) ENGINE=InnoDB;

CREATE TABLE Narudzba (
  id_narudzba INT AUTO_INCREMENT PRIMARY KEY,
  id_korisnik INT NOT NULL,
  broj_narudzbe VARCHAR(50) NOT NULL UNIQUE,
  ukupno_bez_pdv DECIMAL(12,2) NOT NULL DEFAULT 0,
  iznos_pdv DECIMAL(12,2) NOT NULL DEFAULT 0,
  ukupno_sa_pdv DECIMAL(12,2) NOT NULL DEFAULT 0,
  id_status_narudzbe INT NOT NULL DEFAULT 1,
  napomena TEXT,
  datum_kreiranja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  datum_azuriranja DATETIME NULL,
  datum_otpreme DATETIME NULL,
  datum_isporuke DATETIME NULL,
  FOREIGN KEY (id_korisnik) REFERENCES Korisnik(id_korisnik),
  FOREIGN KEY (id_status_narudzbe) REFERENCES StatusNarudzbe(id_status_narudzbe),
  INDEX idx_narudzba_korisnik (id_korisnik),
  INDEX idx_narudzba_status (id_status_narudzbe)
) ENGINE=InnoDB;

CREATE TABLE StavkaNarudzbe (
  id_stavka INT AUTO_INCREMENT PRIMARY KEY,
  id_narudzba INT NOT NULL,
  id_proizvod INT NOT NULL,
  kolicina DECIMAL(12,3) NOT NULL,
  cijena_po_jedinici DECIMAL(12,2) NOT NULL,
  ukupno DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (id_narudzba) REFERENCES Narudzba(id_narudzba) ON DELETE CASCADE,
  FOREIGN KEY (id_proizvod) REFERENCES Proizvod(id_proizvod)
) ENGINE=InnoDB;

CREATE TABLE ProizvodNaListi (
  id_korisnik INT NOT NULL,
  id_proizvod INT NOT NULL,
  datum_dodavanja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  biljeska TEXT,
  prioritet ENUM('visok','srednji','nizak') NOT NULL DEFAULT 'srednji',
  datum_azuriranja DATETIME NULL,
  PRIMARY KEY (id_korisnik, id_proizvod),
  FOREIGN KEY (id_korisnik) REFERENCES Korisnik(id_korisnik) ON DELETE CASCADE,
  FOREIGN KEY (id_proizvod) REFERENCES Proizvod(id_proizvod) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Recenzija (
  id_recenzija INT AUTO_INCREMENT PRIMARY KEY,
  id_korisnik INT NOT NULL,
  id_proizvod INT NOT NULL,
  ocjena TINYINT NOT NULL,
  naslov VARCHAR(150),
  komentar TEXT,
  status ENUM('vidljivo','skriveno') NOT NULL DEFAULT 'vidljivo',
  datum_kreiranja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_korisnik) REFERENCES Korisnik(id_korisnik) ON DELETE CASCADE,
  FOREIGN KEY (id_proizvod) REFERENCES Proizvod(id_proizvod) ON DELETE CASCADE,
  CONSTRAINT chk_recenzija_ocjena CHECK (ocjena BETWEEN 1 AND 5)
) ENGINE=InnoDB;

INSERT INTO StatusNarudzbe (naziv, opis, redoslijed, boja) VALUES
('Nova', 'Narudžba je zaprimljena.', 1, 'blue'),
('Potvrđena', 'Narudžba je potvrđena.', 2, 'indigo'),
('Otpremljena', 'Narudžba je poslana kupcu.', 3, 'orange'),
('Isporučena', 'Narudžba je isporučena.', 4, 'green'),
('Otkazana', 'Narudžba je otkazana.', 5, 'red');

INSERT INTO Kategorija (naziv, opis, redoslijed) VALUES
('Građevinski materijal', 'Osnovni građevinski materijali.', 1),
('Alati', 'Ručni i električni alati.', 2),
('Zaštitna oprema', 'Oprema za sigurnost na gradilištu.', 3);

INSERT INTO Proizvodac (naziv, kontakt_osoba) VALUES
('TeraBuild', 'Prodaja'),
('Bosch', 'Prodaja'),
('Makita', 'Prodaja');

-- Demo admin: korisnik admin / lozinka Admin123!
INSERT INTO Korisnik (ime, prezime, korisnicko_ime, email, lozinka, tip_korisnika, razina_prava)
VALUES ('Demo', 'Administrator', 'admin', 'admin@terabuild.local', '$2b$12$eoaNZNn72ry01LjTdJTStuqCnkUGYgSPtk2Gq6C/ebXhtwAuMMH86', 'admin', 1);
