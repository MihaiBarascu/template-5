import type { CollectionConfig } from 'payload'
import type { Booking, Service, Team } from '@/payload-types'
import { authenticated } from '@/access'
import {
  sendNotificationEmail,
  getBusinessEmail,
  formatBookingEmail,
  formatBookingConfirmationEmail,
} from '@/utilities/sendNotificationEmail'

interface PopulatedBooking extends Omit<Booking, 'service' | 'teamMember'> {
  service?: Service | string
  teamMember?: Team | string | null
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: 'Programare',
    plural: 'Programari',
  },
  access: {
    create: () => true, // Anyone can create a booking
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Only send email for new bookings
        if (operation !== 'create') return doc

        try {
          const businessEmail = getBusinessEmail()

          if (!businessEmail) {
            req.payload.logger.warn('No business email configured - skipping booking notification')
            return doc
          }

          // Populate service and team member if they are IDs
          const populatedDoc: PopulatedBooking = { ...doc }

          if (doc.service && typeof doc.service === 'string') {
            const service = await req.payload.findByID({
              collection: 'services',
              id: doc.service,
              req, // Threading req for transaction safety (Payload best practice)
            })
            populatedDoc.service = service
          }

          if (doc.teamMember && typeof doc.teamMember === 'string') {
            const teamMember = await req.payload.findByID({
              collection: 'team',
              id: doc.teamMember,
              req, // Threading req for transaction safety (Payload best practice)
            })
            populatedDoc.teamMember = teamMember
          }

          const emailHtml = formatBookingEmail({
            clientName: populatedDoc.clientName,
            clientEmail: populatedDoc.clientEmail,
            clientPhone: populatedDoc.clientPhone,
            service: populatedDoc.service,
            serviceName: doc.serviceName, // Fallback text field
            teamMember: populatedDoc.teamMember,
            date: populatedDoc.date,
            time: populatedDoc.time,
            notes: populatedDoc.notes,
          })

          // Email 1: Către proprietar
          await sendNotificationEmail(req.payload, {
            to: businessEmail,
            subject: `🗓️ Programare nouă: ${populatedDoc.clientName}`,
            html: emailHtml,
            replyTo: populatedDoc.clientEmail,
          })

          req.payload.logger.info(`Booking notification sent to ${businessEmail}`)

          // Email 2: Către CLIENT - confirmare programare
          if (populatedDoc.clientEmail) {
            // Get business info for client email
            const businessInfo = await req.payload.findGlobal({
              slug: 'business-info',
              req, // Threading req for transaction safety (Payload best practice)
            })

            const clientEmailHtml = formatBookingConfirmationEmail({
              clientName: populatedDoc.clientName,
              service: populatedDoc.service,
              serviceName: doc.serviceName, // Fallback text field
              teamMember: populatedDoc.teamMember,
              date: populatedDoc.date,
              time: populatedDoc.time,
              businessName: businessInfo?.name || undefined,
              businessPhone: businessInfo?.phone || undefined,
              businessAddress: businessInfo?.address
                ? `${businessInfo.address.street || ''}, ${businessInfo.address.city || ''}`
                : undefined,
            })

            // Use service title if linked, otherwise use serviceName field
            const serviceTitle =
              typeof populatedDoc.service === 'object'
                ? populatedDoc.service?.title
                : doc.serviceName || 'Serviciu'

            await sendNotificationEmail(req.payload, {
              to: populatedDoc.clientEmail,
              subject: `✅ Confirmare programare - ${serviceTitle}`,
              html: clientEmailHtml,
              replyTo: businessEmail,
            })

            req.payload.logger.info(`Booking confirmation sent to client: ${populatedDoc.clientEmail}`)
          }
        } catch (error) {
          req.payload.logger.error({ err: error, msg: 'Failed to send booking notification' })
        }

        return doc
      },
    ],
  },
  admin: {
    defaultColumns: ['clientName', 'service', 'date', 'time', 'status'],
    useAsTitle: 'clientName',
    group: 'Operatiuni',
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      label: 'Nume client',
      required: true,
    },
    {
      name: 'clientEmail',
      type: 'email',
      label: 'Email',
      required: true,
      index: true, // Index for faster email lookups
    },
    {
      name: 'clientPhone',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Serviciu (legat)',
      admin: {
        description: 'Legatura la serviciul din catalog (optional)',
      },
    },
    {
      name: 'serviceName',
      type: 'text',
      label: 'Serviciu solicitat',
      admin: {
        description: 'Numele serviciului ales din formular',
      },
    },
    {
      name: 'teamMember',
      type: 'relationship',
      relationTo: 'team',
      label: 'Persoana preferata',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Data',
          required: true,
          index: true, // Index for faster date-based queries
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'time',
          type: 'text',
          label: 'Ora',
          required: true,
          admin: {
            width: '50%',
            description: 'Ex: 14:00',
          },
        },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Durata estimata',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Observatii client',
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Note interne',
      admin: {
        description: 'Vizibile doar pentru personal',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      index: true, // Index for faster status filtering
      options: [
        { label: 'In asteptare', value: 'pending' },
        { label: 'Confirmat', value: 'confirmed' },
        { label: 'In desfasurare', value: 'in-progress' },
        { label: 'Finalizat', value: 'completed' },
        { label: 'Anulat', value: 'cancelled' },
        { label: 'Neprezentare', value: 'no-show' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Sursa programare',
      defaultValue: 'website',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Telefon', value: 'phone' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'In persoana', value: 'walkin' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
