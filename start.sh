#!/bin/bash

set -e


ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"


echo "=============================================="
echo "        Pokretanje TeraBuild aplikacije"
echo "=============================================="
echo


# ============================================================
# PROVJERA NODE.JS
# ============================================================

if ! command -v node >/dev/null 2>&1; then
    echo "GREŠKA: Node.js nije instaliran."
    exit 1
fi


# ============================================================
# PROVJERA PROJEKTA
# ============================================================

if [ ! -d "backend/api" ]; then
    echo "GREŠKA: Backend nije pronađen."
    exit 1
fi

if [ ! -d "frontend/quasar-project" ]; then
    echo "GREŠKA: Frontend nije pronađen."
    exit 1
fi


# ============================================================
# POKRETANJE BACKENDA
# ============================================================

echo "Pokrećem Express backend..."

(
    cd backend/api
    npm start
) &

API_PID=$!


# ============================================================
# POKRETANJE FRONTENDA
# ============================================================

echo "Pokrećem Quasar frontend..."

(
    cd frontend/quasar-project
    npm run dev
) &

FRONTEND_PID=$!


echo
echo "=============================================="
echo "       TeraBuild je pokrenut!"
echo "=============================================="
echo
echo "Frontend:"
echo "  http://localhost:9000"
echo
echo "Backend:"
echo "  http://localhost:3000"
echo
echo "Za zaustavljanje pritisnite CTRL+C."
echo
echo "=============================================="
echo


# ============================================================
# GAŠENJE OBA PROCESA
# ============================================================

cleanup() {

    echo
    echo "Zaustavljam TeraBuild..."

    kill "$API_PID" "$FRONTEND_PID" 2>/dev/null || true

    wait "$API_PID" "$FRONTEND_PID" 2>/dev/null || true

    echo "TeraBuild je zaustavljen."
}


trap cleanup INT TERM EXIT


# ============================================================
# ČEKAJ DA PROCESI RADE
# ============================================================

wait "$API_PID" "$FRONTEND_PID"