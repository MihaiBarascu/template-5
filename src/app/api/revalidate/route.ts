import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route to trigger cache revalidation from external processes (like seed)
 *
 * POST /api/revalidate
 * Body: { secret?: string, tags?: string[], paths?: string[] }
 *
 * In development, no secret is required.
 * In production, set REVALIDATE_SECRET env var for security.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { secret, tags, paths } = body as {
      secret?: string
      tags?: string[]
      paths?: string[]
    }

    // In production, require a secret
    if (process.env.NODE_ENV === 'production') {
      const expectedSecret = process.env.REVALIDATE_SECRET
      if (expectedSecret && secret !== expectedSecret) {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
      }
    }

    const revalidated: { tags: string[]; paths: string[] } = { tags: [], paths: [] }

    // Revalidate specific tags if provided
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag, 'max')
        revalidated.tags.push(tag)
      }
    }

    // Revalidate specific paths if provided
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path, 'layout')
        revalidated.paths.push(path)
      }
    }

    // If no specific tags/paths, revalidate all common globals and root
    if ((!tags || tags.length === 0) && (!paths || paths.length === 0)) {
      // Revalidate all global cache tags
      const globalTags = [
        'global_site-theme',
        'global_header',
        'global_footer',
        'global_logo',
        'global_business-info',
        'global_shop-settings',
        'global_system-pages',
      ]

      for (const tag of globalTags) {
        revalidateTag(tag, 'max')
        revalidated.tags.push(tag)
      }

      // Revalidate entire site layout
      revalidatePath('/', 'layout')
      revalidated.paths.push('/')
    }

    console.log('[Revalidate API] Revalidated:', revalidated)

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Revalidate API] Error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed', details: String(error) },
      { status: 500 }
    )
  }
}

// Also support GET for simple browser testing in dev
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'GET only allowed in development' }, { status: 403 })
  }

  // Revalidate everything
  const globalTags = [
    'global_site-theme',
    'global_header',
    'global_footer',
    'global_logo',
    'global_business-info',
  ]

  for (const tag of globalTags) {
    revalidateTag(tag, 'max')
  }
  revalidatePath('/', 'layout')

  return NextResponse.json({
    success: true,
    message: 'All globals and layout revalidated',
    timestamp: new Date().toISOString(),
  })
}
