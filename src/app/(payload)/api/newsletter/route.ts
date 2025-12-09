import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from '@/utilities/rateLimit'

/**
 * Newsletter Subscription API Endpoint
 *
 * Following Payload CMS best practices:
 * - Using getPayload() to get the Payload instance
 * - Using Local API with overrideAccess for trusted server operations
 * - Rate limiting to prevent spam
 * - Input validation with email regex
 * - GDPR compliance: storing IP and user agent
 *
 * @see https://payloadcms.com/docs/local-api/overview
 * @see https://payloadcms.com/docs/email/overview
 */

export async function POST(request: Request) {
  // Rate limiting: 3 subscriptions per minute per IP (prevent spam)
  const clientIP = getClientIP(request)
  const rateLimit = checkRateLimit(`newsletter:${clientIP}`, 3, 60000)

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Prea multe incercari. Te rugam asteapta un minut.',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.reset),
        },
      }
    )
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const body = await request.json()

    const { email, source = 'website' } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email-ul este obligatoriu' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Adresa de email nu este valida' },
        { status: 400 }
      )
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim()

    // Check if already subscribed
    // overrideAccess: true - trusted server operation for public lookup
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: {
        email: { equals: normalizedEmail },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      const subscriber = existing.docs[0]

      // If previously unsubscribed, reactivate
      if (subscriber.status === 'unsubscribed') {
        await payload.update({
          collection: 'newsletter-subscribers',
          id: subscriber.id,
          data: {
            status: 'active',
            source,
          },
          overrideAccess: true,
        })

        return NextResponse.json({
          success: true,
          message: 'Te-am reabonat cu succes la newsletter!',
          resubscribed: true,
        })
      }

      // Already active subscriber
      return NextResponse.json({
        success: true,
        message: 'Esti deja abonat la newsletter-ul nostru.',
        alreadySubscribed: true,
      })
    }

    // Get user agent for GDPR compliance
    const userAgent = request.headers.get('user-agent') || undefined

    // Create new subscriber using Local API
    // overrideAccess: true is required because create is public but we want to set all fields
    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email: normalizedEmail,
        status: 'active',
        source,
        ipAddress: clientIP,
        userAgent,
      },
      overrideAccess: true,
    })

    // The afterChange hook in the collection will send the welcome email

    return NextResponse.json({
      success: true,
      message: 'Multumim! Te-ai abonat cu succes la newsletter.',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)

    // Handle duplicate email error (unique constraint)
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json({
        success: true,
        message: 'Esti deja abonat la newsletter-ul nostru.',
        alreadySubscribed: true,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'A aparut o eroare. Te rugam incearca din nou.',
      },
      { status: 500 }
    )
  }
}

/**
 * Unsubscribe endpoint
 */
export async function DELETE(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email-ul este obligatoriu' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Find subscriber
    // overrideAccess: true - trusted server operation for public lookup
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: {
        email: { equals: normalizedEmail },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Email-ul nu a fost gasit in lista de abonati.',
      })
    }

    // Update status to unsubscribed
    await payload.update({
      collection: 'newsletter-subscribers',
      id: existing.docs[0].id,
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Te-ai dezabonat cu succes de la newsletter.',
    })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'A aparut o eroare. Te rugam incearca din nou.',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint - returns info about the newsletter API
 */
export async function GET() {
  return NextResponse.json({
    message: 'Newsletter API',
    endpoints: {
      subscribe: 'POST /api/newsletter with { email, source? }',
      unsubscribe: 'DELETE /api/newsletter?email=...',
    },
  })
}
