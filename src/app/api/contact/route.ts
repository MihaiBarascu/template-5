import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from '@/utilities/rateLimit'

export async function POST(request: Request) {
  // Rate limiting: 5 requests per minute per IP
  const clientIP = getClientIP(request)
  const rateLimit = checkRateLimit(`contact:${clientIP}`, 5, 60000)

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Prea multe cereri. Va rugam asteptati un minut.' },
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
    const body = await request.json()
    const { name, email, phone, subject, service, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Numele, email-ul si mesajul sunt obligatorii.' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresa de email nu este valida.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Save to contact-submissions collection
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        phone: phone || undefined,
        subject: subject || undefined,
        service: service || undefined,
        message,
        status: 'new',
      },
    })

    // Optionally send email notification (if email adapter is configured)
    try {
      const businessInfo = await payload.findGlobal({ slug: 'business-info' })

      if (businessInfo?.email) {
        await payload.sendEmail({
          to: businessInfo.email,
          subject: `Mesaj nou de la ${name}${subject ? ` - ${subject}` : ''}`,
          html: `
            <h2>Mesaj nou de contact</h2>
            <p><strong>Nume:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
            ${subject ? `<p><strong>Subiect:</strong> ${subject}</p>` : ''}
            ${service ? `<p><strong>Serviciu:</strong> ${service}</p>` : ''}
            <p><strong>Mesaj:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        })
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.warn('Could not send email notification:', emailError)
    }

    return NextResponse.json(
      { success: true, message: 'Mesajul a fost trimis cu succes!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'A aparut o eroare la trimiterea mesajului.' },
      { status: 500 }
    )
  }
}
