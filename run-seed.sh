#!/bin/sh
# Script pentru rularea seed-ului in container
# Usage: sh run-seed.sh [tip] [with-images]

# Daca nu s-a dat parametru, afiseaza optiunile
if [ -z "$1" ]; then
  echo "========================================="
  echo "Folosire: sh run-seed.sh [tip] [with-images]"
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
  echo "Optiuni:"
  echo "  with-images  Sterge si reimporta toate imaginile"
  echo ""
  echo "Exemple:"
  echo "  sh run-seed.sh frizerie             # refoloseste imaginile existente"
  echo "  sh run-seed.sh frizerie with-images # reimporta toate imaginile"
  echo "========================================="
  exit 0
fi

SEED_TYPE="$1"
WITH_IMAGES=""

# Verifica daca al doilea parametru e with-images
if [ "$2" = "with-images" ]; then
  WITH_IMAGES="--with-images"
  echo "========================================="
  echo "Rulare seed pentru: $SEED_TYPE (cu imagini fresh)"
  echo "========================================="
else
  echo "========================================="
  echo "Rulare seed pentru: $SEED_TYPE (refoloseste imaginile)"
  echo "========================================="
fi

cd /app
SEED_TYPE="$SEED_TYPE" node --no-deprecation node_modules/tsx/dist/cli.mjs src/seed/index.ts $WITH_IMAGES

echo "========================================="
echo "Seed finalizat!"
echo "========================================="
