#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "=============================================="
echo "       TeraBuild - instalacija sustava"
echo "=============================================="
echo

# ============================================================
# PROVJERA NODE.JS
# ============================================================

if ! command -v node >/dev/null 2>&1; then
    echo "GREŠKA: Node.js nije instaliran."
    echo "Instalirajte Node.js prije pokretanja ove skripte."
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "GREŠKA: npm nije instaliran."
    exit 1
fi

echo "Node.js verzija:"
node --version

echo "npm verzija:"
npm --version

echo

# ============================================================
# PROVJERA STRUKTURE PROJEKTA
# ============================================================

if [ ! -d "backend/api" ]; then
    echo "GREŠKA: Nije pronađen backend/api."
    exit 1
fi

if [ ! -d "frontend/quasar-project" ]; then
    echo "GREŠKA: Nije pronađen frontend/quasar-project."
    exit 1
fi

if [ ! -d "backend/db" ]; then
    echo "GREŠKA: Nije pronađen backend/db."
    exit 1
fi

# ============================================================
# PODACI ZA BAZU
# ============================================================

echo "=============================================="
echo "       Postavljanje baze podataka"
echo "=============================================="
echo

read -p "Ime servera baze [ucka.veleri.hr]: " DB_HOST
DB_HOST=${DB_HOST:-ucka.veleri.hr}

read -p "Ime baze: " DB_NAME
read -p "Korisničko ime baze: " DB_USER
read -s -p "Lozinka baze: " DB_PASS
echo
echo

# ============================================================
# GENERIRANJE JWT TAJNE
# ============================================================

if command -v openssl >/dev/null 2>&1; then
    JWT_SECRET=$(openssl rand -hex 32)
else
    JWT_SECRET="promijeni-ovo-u-dugi-slucajni-string"
fi

# ============================================================
# KREIRANJE .env DATOTEKE
# ============================================================

echo "Kreiram backend/api/.env ..."

cat > backend/api/.env <<ENV
DB_HOST=$DB_HOST
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASS=$DB_PASS

PORT=3000

JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:9000,http://localhost:5173
ENV

echo ".env je uspješno kreiran."
echo

# ============================================================
# INSTALACIJA BACKEND PAKETA
# ============================================================

echo "=============================================="
echo "       Instalacija backend paketa"
echo "=============================================="
echo

cd backend/api
npm install
cd "$ROOT_DIR"

echo
echo "Backend paketi uspješno instalirani."
echo

# ============================================================
# INSTALACIJA FRONTEND PAKETA
# ============================================================

echo "=============================================="
echo "       Instalacija frontend paketa"
echo "=============================================="
echo

cd frontend/quasar-project
npm install
cd "$ROOT_DIR"

echo
echo "Frontend paketi uspješno instalirani."
echo

# ============================================================
# POSTAVLJANJE DOZVOLA
# ============================================================

chmod +x start.sh

if [ -f "backend/db/install.sh" ]; then
    chmod +x backend/db/install.sh
fi

# ============================================================
# BAZA PODATAKA
# ============================================================

echo "=============================================="
echo "       Baza podataka"
echo "=============================================="
echo

echo "Postojeća baza nije automatski mijenjana."
echo
echo "Ako koristite postojeću TeraBuild bazu, instalacija"
echo "SQL skripte nije potrebna."
echo
echo "Za novu/praznu bazu možete izvršiti:"
echo
echo "  backend/db/install.sql"
echo
echo "putem HeidiSQL-a ili MariaDB klijenta."
echo

# ============================================================
# GOTOVO
# ============================================================

echo "=============================================="
echo "       TeraBuild je spreman!"
echo "=============================================="
echo

echo "Za pokretanje aplikacije koristite:"
echo
echo "  ./start.sh"
echo

echo "Frontend:"
echo "  http://localhost:9000"
echo

echo "Backend API:"
echo "  http://localhost:3000"
echo

echo "=============================================="