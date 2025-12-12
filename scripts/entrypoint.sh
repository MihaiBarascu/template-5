#!/bin/sh
set -e

# Replace placeholder values with actual environment variables at runtime
# This fixes the Next.js 15.3+/16 bug where NEXT_PUBLIC_* vars don't work in client components
# with standalone output + experimental-build-mode compile

echo "Replacing environment variables at runtime..."

# Replace NEXT_PUBLIC_SERVER_URL placeholder
if [ -n "$NEXT_PUBLIC_SERVER_URL" ]; then
  find .next -type f \( -name "*.js" -o -name "*.json" \) -exec sed -i "s~__NEXT_PUBLIC_SERVER_URL__~${NEXT_PUBLIC_SERVER_URL}~g" {} + 2>/dev/null || true
  echo "NEXT_PUBLIC_SERVER_URL set to: $NEXT_PUBLIC_SERVER_URL"
fi

echo "Starting server..."
exec node server.js
