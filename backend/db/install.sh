#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "======================================"
echo "      TeraBuild - instalacija baze"
echo "======================================"
echo

read -p "Ime servera baze [ucka.veleri.hr]: " DB_HOST
DB_HOST=${DB_HOST:-ucka.veleri.hr}

read -p "Ime baze: " DB_NAME
read -p "Korisničko ime: " DB_USER
read -s -p "Lozinka: " DB_PASS
echo
echo

echo "======================================"
echo "Pokretanje install.sql na $DB_HOST..."
echo "======================================"

mysql \
    -h "$DB_HOST" \
    -u "$DB_USER" \
    -p"$DB_PASS" \
    "$DB_NAME" \
    --show-warnings < "$ROOT_DIR/install.sql"

if [ $? -ne 0 ]; then
    echo
    echo "Došlo je do greške pri instalaciji baze!"
    exit 1
fi

echo
echo "======================================"
echo "Baza je uspješno instalirana!"
echo "======================================"