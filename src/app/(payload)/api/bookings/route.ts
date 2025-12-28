import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from '@/utilities/rateLimit'
import { escapeHtml } from '@/utilities/escapeHtml'
import { getTenantIdByDomain, normalizeDomain, getEffectiveTenantDomain } from '@/utilities/getTenantGlobal'

/**
 * Bookings API Endpoint - Public endpoint for creating bookings
 *
 * Following Payload CMS best practices:
 * - Using getPayload() to get the Payload instance
 * - Using Local API with overrideAccess: true for trusted server operations
 * - Rate limiting to prevent spam
 * - Input validation
 * - Multi-tenant: automatically assigns tenant from Host header
 *
 * Note: The Bookings collection has `create: () => true` for public access,
 * but we use overrideAccess: true explicitly for clarity and to ensure
 * all fields can be set (including status and source).
 *
 * @see https://payloadcms.com/docs/local-api/overview
 */
export async function POST(request: Request) {
  // Rate limiting: 5 bookings per minute per IP
  const clientIP = getClientIP(request)
  const rateLimit = checkRateLimit(`bookings:${clientIP}`, 5, 60000)

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
    const { name, phone, email, service, staff, date, time, notes } = body

    // Validate required fields
    if (!name || !phone || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Toate campurile obligatorii trebuie completate.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Get tenant from Host header for multi-tenant isolation
    // Uses getEffectiveTenantDomain for localhost fallback (returns first tenant)
    const host = request.headers.get('host') || ''
    const normalizedDomain = normalizeDomain(host)
    const effectiveDomain = await getEffectiveTenantDomain(normalizedDomain)
    const tenantId = await getTenantIdByDomain(effectiveDomain)

    if (!tenantId) {
      console.warn(`[bookings] No tenant found for domain: ${effectiveDomain}`)
      return NextResponse.json(
        { error: 'Configurare invalida. Te rugam contacteaza administratorul.' },
        { status: 500 }
      )
    }

    // Find service by title if provided (filter by tenant for security)
    // overrideAccess: true - trusted server operation for public lookup
    let serviceId: string | undefined
    if (service) {
      const services = await payload.find({
        collection: 'services',
        where: {
          and: [
            { title: { contains: service.split(' - ')[0] } },
            // Multi-tenant: only match services from this tenant (tenantId is always set)
            { tenant: { equals: tenantId } },
          ],
        },
        limit: 1,
        overrideAccess: true,
      })
      if (services.docs.length > 0) {
        serviceId = services.docs[0].id
      }
    }

    // Find team member by name if provided (filter by tenant for security)
    // overrideAccess: true - trusted server operation for public lookup
    let teamMemberId: string | undefined
    if (staff && staff !== 'Fara preferinta') {
      const teamMembers = await payload.find({
        collection: 'team',
        where: {
          and: [
            { name: { contains: staff.split(' - ')[0] } },
            // Multi-tenant: only match team members from this tenant (tenantId is always set)
            { tenant: { equals: tenantId } },
          ],
        },
        limit: 1,
        overrideAccess: true,
      })
      if (teamMembers.docs.length > 0) {
        teamMemberId = teamMembers.docs[0].id
      }
    }

    // Save to bookings collection
    // overrideAccess: true - trusted server operation to set all fields including status/source
    // tenant: automatically assigned from Host header for multi-tenant isolation
    await payload.create({
      collection: 'bookings',
      data: {
        clientName: name,
        clientPhone: phone,
        clientEmail: email,
        service: serviceId,
        teamMember: teamMemberId,
        date: date,
        time: time,
        notes: notes || undefined,
        status: 'pending',
        source: 'website',
        // Multi-tenant: assign to correct tenant (always required)
        tenant: tenantId,
      },
      overrideAccess: true,
    })

    // Optionally send email notification
    try {
      // Get business info for this tenant
      const businessInfoResult = tenantId
        ? await payload.find({
            collection: 'tenant-business-info',
            where: { tenant: { equals: tenantId } },
            limit: 1,
          })
        : null
      const businessInfo = businessInfoResult?.docs?.[0]

      if (businessInfo?.email) {
        await payload.sendEmail({
          to: businessInfo.email,
          subject: `Cerere noua de programare - ${escapeHtml(name)}`,
          html: `
            <h2>Cerere noua de programare</h2>
            <p><strong>Client:</strong> ${escapeHtml(name)}</p>
            <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
            ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ''}
            ${service ? `<p><strong>Serviciu:</strong> ${escapeHtml(service)}</p>` : ''}
            ${staff ? `<p><strong>Specialist preferat:</strong> ${escapeHtml(staff)}</p>` : ''}
            ${date ? `<p><strong>Data preferata:</strong> ${escapeHtml(date)}</p>` : ''}
            ${time ? `<p><strong>Ora preferata:</strong> ${escapeHtml(time)}</p>` : ''}
            ${notes ? `<p><strong>Mentiuni:</strong> ${escapeHtml(notes)}</p>` : ''}
            <hr>
            <p><em>Te rugam sa contactezi clientul pentru confirmare.</em></p>
          `,
        })
      }
    } catch (emailError) {
      payload.logger.warn({ err: emailError, msg: 'Could not send booking notification email' })
    }

    return NextResponse.json(
      { success: true, message: 'Cererea de programare a fost trimisa!' },
      { status: 200 }
    )
  } catch (error) {
    // Note: payload instance is scoped inside try block, not available here
    // console.error is acceptable for API route error logging
    console.error('Booking API error:', error)
    return NextResponse.json(
      { error: 'A aparut o eroare la trimiterea cererii.' },
      { status: 500 }
    )
  }
}
