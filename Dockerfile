# Dockerfile for Payload CMS + Next.js
# Source: Official Payload CMS template
# IMPORTANT: Requires output: 'standalone' in next.config.js

FROM node:22.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager (auto-detect)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time arguments for Payload
ARG PAYLOAD_SECRET
ARG DATABASE_URI
ARG NEXT_PUBLIC_SERVER_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

# Build with detected package manager
# Using --webpack because Next.js 16 defaults to Turbopack but Payload CMS requires webpack for production builds
# Using TWO-STEP build to fix Next.js 15.3+/16 bug with NEXT_PUBLIC_* vars:
# Step 1: --experimental-build-mode compile (compiles code, no DB needed)
# Step 2: --experimental-build-mode generate-env (inlines NEXT_PUBLIC_* vars, no DB needed)
# See: https://payloadcms.com/docs/production/building-without-a-db-connection
RUN \
  if [ -f yarn.lock ]; then \
    yarn cross-env NODE_OPTIONS=--no-deprecation next build --webpack --experimental-build-mode compile && \
    yarn cross-env NODE_OPTIONS=--no-deprecation next build --webpack --experimental-build-mode generate-env; \
  elif [ -f package-lock.json ]; then \
    npx cross-env NODE_OPTIONS=--no-deprecation next build --webpack --experimental-build-mode compile && \
    npx cross-env NODE_OPTIONS=--no-deprecation next build --webpack --experimental-build-mode generate-env; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && \
    pnpm exec cross-env NODE_OPTIONS=--no-deprecation next build --webpack --experimental-build-mode compile && \
    pnpm exec cross-env NODE_OPTIONS=--no-deprecation next build --webpack --experimental-build-mode generate-env; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy files for manual seeding (run-seed.sh)
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/run-seed.sh ./run-seed.sh
RUN chmod +x ./run-seed.sh

# Copy entrypoint script for runtime env var replacement (fixes Next.js 16 bug)
COPY --from=builder --chown=nextjs:nodejs /app/scripts/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# For uploads (media files)
RUN mkdir -p media && chown -R nextjs:nodejs media
RUN mkdir -p temp-uploads && chown -R nextjs:nodejs temp-uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use entrypoint to replace NEXT_PUBLIC_* placeholders at runtime
ENTRYPOINT ["./entrypoint.sh"]
