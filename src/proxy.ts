import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Proxy (replaces middleware in Next.js 16+)
 *
 * Handles:
 * 1. HTTP Basic Auth for staging protection
 * 2. Multi-tenant domain routing via URL rewrite
 *
 * Reference: docs/MULTI-TENANT-OFFICIAL-REFERENCE.md
 */

// ═══════════════════════════════════════════════════════════════════════════
// HTTP BASIC AUTH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check HTTP Basic Auth credentials
 */
function checkBasicAuth(request: NextRequest): NextResponse | null {
  const authUser = process.env.BASIC_AUTH_USER
  const authPass = process.env.BASIC_AUTH_PASS

  // Auth disabled if credentials not set
  if (!authUser || !authPass) {
    return null
  }

  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorizedResponse()
  }

  try {
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    const [user, pass] = credentials.split(':')

    if (user === authUser && pass === authPass) {
      return null // Auth passed
    }
  } catch {
    // Invalid credentials
  }

  return unauthorizedResponse()
}

function unauthorizedResponse() {
  return new NextResponse('Autentificare necesară', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Site protejat", charset="UTF-8"',
    },
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PROXY FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

// Paths that bypass tenant routing (served directly from /public or internal routes)
const BYPASS_PATHS = [
  '/api/',
  '/api',
  '/_next/',
  '/admin',
  '/media/',
  '/videos/', // Static video files in /public/videos
  '/images/', // Static image files in /public/images
  '/fonts/',  // Static font files in /public/fonts
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap-0.xml',
  '/manifest.json',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip processing for API, admin, static, etc.
  if (BYPASS_PATHS.some(path => pathname.startsWith(path) || pathname === path)) {
    return NextResponse.next()
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 1. HTTP BASIC AUTH CHECK
  // ─────────────────────────────────────────────────────────────────────────
  const authResponse = checkBasicAuth(request)
  if (authResponse) {
    return authResponse
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. MULTI-TENANT URL REWRITE
  // ─────────────────────────────────────────────────────────────────────────
  // Rewrite /path to /[tenantDomain]/path where tenantDomain comes from Host header
  // This follows the official Payload multi-tenant pattern with params-based routing

  const host = request.headers.get('host') || 'localhost'

  // Rewrite to [tenantDomain] route
  // Example: frizerie.local/servicii -> /frizerie.local/servicii
  const url = request.nextUrl.clone()
  url.pathname = `/${host}${pathname}`

  return NextResponse.rewrite(url)
}

// Aplică proxy pe toate rutele
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
