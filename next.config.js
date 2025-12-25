import { withPayload } from '@payloadcms/next/withPayload';

import redirects from './redirects.js';

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.__NEXT_PRIVATE_ORIGIN ||
    'http://localhost:3010';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Docker deployment
  images: {
    // Local patterns for images with query strings (cache tags)
    localPatterns: [
      {
        pathname: '/api/media/**',
        search: '', // Allow any query string
      },
    ],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map(item => {
        const url = new URL(item);

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        };
      }),
      // YouTube thumbnails for video embeds
      // NOTE: Use specific hostnames instead of wildcards due to Next.js 15 validation bugs
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i2.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i3.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i4.ytimg.com',
      },
    ],
    // Performance optimizations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85], // Next.js 16 requires explicit quality values
    // In dev mode, use short cache to allow image updates during seeding
    // In production, use 1 year cache for performance
    minimumCacheTTL: process.env.NODE_ENV === 'development' ? 0 : 31536000,
  },
  webpack: webpackConfig => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };

    return webpackConfig;
  },
  reactStrictMode: true,
  redirects,
  // Multi-tenant: Uses middleware.ts to rewrite requests
  // Middleware extracts tenant from Host header and rewrites to [tenantDomain] route
  // Reference: docs/MULTI-TENANT-OFFICIAL-REFERENCE.md
  // HTTP Caching Headers for performance
  async headers() {
    return [
      // Cache pentru imagini - 1 an in prod, 0 in dev (pentru seeding)
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              process.env.NODE_ENV === 'development'
                ? 'no-cache, no-store, must-revalidate'
                : 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache pentru fonts - 1 an
      {
        source: '/:all*(woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache pentru JS/CSS static - 1 an (hashed files)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache pentru pagini HTML - ISR compatible
      {
        source: '/:path((?!api|_next|admin).*)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // Security headers
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
