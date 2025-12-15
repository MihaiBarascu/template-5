import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * HTTP Basic Auth Proxy (fost Middleware în Next.js < 16)
 *
 * Protejează site-ul cu user/parolă în staging/development.
 * Se activează automat dacă BASIC_AUTH_USER și BASIC_AUTH_PASS sunt setate în .env
 *
 * Configurare în .env:
 *   BASIC_AUTH_USER=admin
 *   BASIC_AUTH_PASS=parola-secreta
 *
 * Pentru a dezactiva: șterge sau comentează variabilele din .env
 */
export function proxy(request: NextRequest) {
  // Auth-ul e activat doar dacă AMBELE variabile sunt setate
  const authUser = process.env.BASIC_AUTH_USER
  const authPass = process.env.BASIC_AUTH_PASS

  if (!authUser || !authPass) {
    return NextResponse.next()
  }

  // Exclude anumite rute de la auth (API-uri, imagini, etc.)
  const { pathname } = request.nextUrl
  const excludedPaths = [
    '/api/',
    '/_next/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ]

  if (excludedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Verifică header-ul Authorization
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorizedResponse()
  }

  // Decodează credențialele
  try {
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    const [user, pass] = credentials.split(':')

    if (user === authUser && pass === authPass) {
      return NextResponse.next()
    }
  } catch {
    // Credențiale invalide
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
