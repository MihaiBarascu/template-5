#!/bin/sh
set -e

# Replace placeholder values with actual environment variables at runtime
# This fixes the Next.js 15.3+/16 bug where NEXT_PUBLIC_* vars don't work in client components
# with standalone output + experimental-build-mode compile

echo "Replacing environment variables at runtime..."

# Replace NEXT_PUBLIC_SERVER_URL placeholder (using valid URL placeholder to pass next.config.js validation)
PLACEHOLDER="http://PLACEHOLDER_URL_REPLACE_AT_RUNTIME.local"

if [ -n "$NEXT_PUBLIC_SERVER_URL" ] && [ "$NEXT_PUBLIC_SERVER_URL" != "$PLACEHOLDER" ]; then
  echo "Replacing placeholder with: $NEXT_PUBLIC_SERVER_URL"
  find .next -type f \( -name "*.js" -o -name "*.json" \) -exec sed -i "s~${PLACEHOLDER}~${NEXT_PUBLIC_SERVER_URL}~g" {} + 2>/dev/null || true
  # Also replace in server.js if it exists
  [ -f server.js ] && sed -i "s~${PLACEHOLDER}~${NEXT_PUBLIC_SERVER_URL}~g" server.js 2>/dev/null || true
  echo "NEXT_PUBLIC_SERVER_URL set to: $NEXT_PUBLIC_SERVER_URL"
else
  echo "WARNING: NEXT_PUBLIC_SERVER_URL not set or same as placeholder!"
fi

echo "Starting server..."
exec node server.js
