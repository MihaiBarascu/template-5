import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
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

    // Find service by title if provided
    let serviceId: string | undefined
    if (service) {
      const services = await payload.find({
        collection: 'services',
        where: { title: { contains: service.split(' - ')[0] } },
        limit: 1,
      })
      if (services.docs.length > 0) {
        serviceId = services.docs[0].id
      }
    }

    // Find team member by name if provided
    let teamMemberId: string | undefined
    if (staff && staff !== 'Fara preferinta') {
      const teamMembers = await payload.find({
        collection: 'team',
        where: { name: { contains: staff.split(' - ')[0] } },
        limit: 1,
      })
      if (teamMembers.docs.length > 0) {
        teamMemberId = teamMembers.docs[0].id
      }
    }

    // Save to bookings collection
    // @ts-expect-error - Payload type inference issue
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
      },
    })

    // Optionally send email notification
    try {
      const businessInfo = await payload.findGlobal({ slug: 'business-info' })

      if (businessInfo?.email) {
        await payload.sendEmail({
          to: businessInfo.email,
          subject: `Cerere noua de programare - ${name}`,
          html: `
            <h2>Cerere noua de programare</h2>
            <p><strong>Client:</strong> ${name}</p>
            <p><strong>Telefon:</strong> ${phone}</p>
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
            ${service ? `<p><strong>Serviciu:</strong> ${service}</p>` : ''}
            ${staff ? `<p><strong>Specialist preferat:</strong> ${staff}</p>` : ''}
            ${date ? `<p><strong>Data preferata:</strong> ${date}</p>` : ''}
            ${time ? `<p><strong>Ora preferata:</strong> ${time}</p>` : ''}
            ${notes ? `<p><strong>Mentiuni:</strong> ${notes}</p>` : ''}
            <hr>
            <p><em>Te rugam sa contactezi clientul pentru confirmare.</em></p>
          `,
        })
      }
    } catch (emailError) {
      console.warn('Could not send booking notification email:', emailError)
    }

    return NextResponse.json(
      { success: true, message: 'Cererea de programare a fost trimisa!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'A aparut o eroare la trimiterea cererii.' },
      { status: 500 }
    )
  }
}
