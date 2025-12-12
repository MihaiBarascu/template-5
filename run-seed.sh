#!/bin/sh
# Script pentru rularea seed-ului in container
# Usage: sh run-seed.sh [tip] [variant] [with-images]

# Daca nu s-a dat parametru, afiseaza optiunile
if [ -z "$1" ]; then
  echo "========================================="
  echo "Folosire: sh run-seed.sh [tip] [variant] [with-images]"
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
  echo "Variante design (0-4):"
  echo "  0 = Prima varianta (default)"
  echo "  1 = A doua varianta"
  echo "  2 = A treia varianta"
  echo "  3 = A patra varianta"
  echo "  4 = A cincea varianta (daca exista)"
  echo ""
  echo "Optiuni:"
  echo "  with-images  Sterge si reimporta toate imaginile"
  echo ""
  echo "Exemple:"
  echo "  sh run-seed.sh frizerie                   # varianta 0, refoloseste imaginile"
  echo "  sh run-seed.sh frizerie 2                 # varianta 2, refoloseste imaginile"
  echo "  sh run-seed.sh frizerie 1 with-images    # varianta 1, reimporta imaginile"
  echo "  sh run-seed.sh restaurant 3              # restaurant varianta 3 (video hero)"
  echo "========================================="
  exit 0
fi

SEED_TYPE="$1"
DESIGN_VARIANT="0"
WITH_IMAGES=""

# Parseaza parametrii - suporta orice ordine
for arg in "$@"; do
  case "$arg" in
    [0-9]|[0-9][0-9])
      DESIGN_VARIANT="$arg"
      ;;
    with-images)
      WITH_IMAGES="--with-images"
      ;;
  esac
done

echo "========================================="
echo "Rulare seed pentru: $SEED_TYPE"
echo "Design variant: $DESIGN_VARIANT"
if [ -n "$WITH_IMAGES" ]; then
  echo "Imagini: fresh (reimporta toate)"
else
  echo "Imagini: refoloseste existente"
fi
echo "========================================="

cd /app
SEED_TYPE="$SEED_TYPE" DESIGN_VARIANT="$DESIGN_VARIANT" node --no-deprecation node_modules/tsx/dist/cli.mjs src/seed/index.ts $WITH_IMAGES

echo "========================================="
echo "Seed finalizat!"
echo "========================================="
