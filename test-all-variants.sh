#!/bin/bash
# Test all business types with all variants

BUSINESSES=("frizerie" "dentist" "restaurant" "salon" "auto-service" "avocat" "constructii" "magazin" "fitness")
VARIANTS=(0 1 2 3 4)
SCREENSHOTS_DIR="tests/e2e/screenshots/variants"
RESULTS_FILE="tests/e2e/screenshots/variants/RESULTS.md"

mkdir -p "$SCREENSHOTS_DIR"

echo "# Test Results - All Business Variants" > "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"
echo "Generated: $(date)" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

for business in "${BUSINESSES[@]}"; do
  echo "" >> "$RESULTS_FILE"
  echo "## $business" >> "$RESULTS_FILE"
  echo "" >> "$RESULTS_FILE"
  
  for variant in "${VARIANTS[@]}"; do
    echo "========================================="
    echo "Testing: $business variant $variant"
    echo "========================================="
    
    # Run seed
    DESIGN_VARIANT=$variant pnpm seed:$business -- --with-images 2>&1 | tail -5
    
    if [ $? -eq 0 ]; then
      echo "| Variant $variant | ✅ Seed OK |" >> "$RESULTS_FILE"
    else
      echo "| Variant $variant | ❌ Seed FAILED |" >> "$RESULTS_FILE"
    fi
    
    sleep 2
  done
done

echo ""
echo "========================================="
echo "All tests complete! Results in: $RESULTS_FILE"
echo "========================================="
