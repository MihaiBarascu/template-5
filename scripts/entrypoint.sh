#!/bin/sh
set -e

# Entrypoint for Payload CMS + Next.js Docker container
# NEXT_PUBLIC_* variables are now properly inlined by generate-env build step
# See: https://payloadcms.com/docs/production/building-without-a-db-connection

echo "========================================"
echo "Starting Payload CMS + Next.js"
echo "========================================"
echo "NEXT_PUBLIC_SERVER_URL: ${NEXT_PUBLIC_SERVER_URL:-not set (inlined at build time)}"
echo "NODE_ENV: ${NODE_ENV:-not set}"
echo "========================================"

exec node server.js
