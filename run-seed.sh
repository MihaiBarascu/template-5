#!/bin/sh
# Script pentru rularea seed-ului in container
# Usage: sh run-seed.sh [tip]

# Daca nu s-a dat parametru, afiseaza optiunile
if [ -z "$1" ]; then
  echo "========================================="
  echo "Folosire: sh run-seed.sh [tip]"
  echo "========================================="
  echo ""
  echo "Tipuri disponibile:"
  echo "  frizerie"
  echo "  dentist"
  echo "  avocat"
  echo "  restaurant"
  echo "  auto-service"
  echo "  constructii"
  echo "  salon"
  echo "  pensiune"
  echo "  magazin"
  echo "  fitness"
  echo "  curatenie"
  echo "  transport"
  echo "  foto-video"
  echo "  producator"
  echo ""
  echo "Exemplu: sh run-seed.sh frizerie"
  echo "========================================="
  exit 0
fi

SEED_TYPE="$1"

echo "========================================="
echo "Rulare seed pentru: $SEED_TYPE"
echo "========================================="

cd /app
SEED_TYPE="$SEED_TYPE" node --no-deprecation node_modules/tsx/dist/cli.mjs src/seed/index.ts

echo "========================================="
echo "Seed finalizat!"
echo "========================================="
