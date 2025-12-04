import type { CollectionConfig } from 'payload'
import type { ContactSubmission, Service } from '@/payload-types'
import { authenticated } from '@/access'
import {
  sendNotificationEmail,
  getBusinessEmail,
  formatContactEmail,
  formatContactConfirmationEmail,
} from '@/utilities/sendNotificationEmail'

interface PopulatedContactSubmission extends Omit<ContactSubmission, 'service'> {
  service?: Service | string | null
}

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Mesaj contact',
    plural: 'Mesaje contact',
  },
  access: {
    create: () => true, // Anyone can submit
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Only send email for new contact submissions
        if (operation !== 'create') return doc

        try {
          const businessEmail = await getBusinessEmail(req.payload)

          if (!businessEmail) {
            console.log('⚠️ No business email configured - skipping contact notification')
            return doc
          }

          // Populate service if it's an ID
          const populatedDoc: PopulatedContactSubmission = { ...doc }

          if (doc.service && typeof doc.service === 'string') {
            const service = await req.payload.findByID({
              collection: 'services',
              id: doc.service,
              req, // Threading req for transaction safety (Payload best practice)
            })
            populatedDoc.service = service
          }

          const emailHtml = formatContactEmail({
            name: populatedDoc.name,
            email: populatedDoc.email,
            phone: populatedDoc.phone,
            subject: populatedDoc.subject,
            service: populatedDoc.service,
            message: populatedDoc.message,
          })

          // Email 1: Către proprietar
          await sendNotificationEmail(req.payload, {
            to: businessEmail,
            subject: `📩 Mesaj nou de contact: ${populatedDoc.name}`,
            html: emailHtml,
            replyTo: populatedDoc.email,
          })

          console.log(`✅ Contact notification sent to ${businessEmail}`)

          // Email 2: Către CLIENT - confirmare mesaj primit
          if (populatedDoc.email) {
            // Get business info for client email
            const businessInfo = await req.payload.findGlobal({
              slug: 'business-info',
              req, // Threading req for transaction safety (Payload best practice)
            })

            const clientEmailHtml = formatContactConfirmationEmail({
              name: populatedDoc.name,
              businessName: businessInfo?.name || undefined,
              businessPhone: businessInfo?.phone || undefined,
              businessEmail: businessInfo?.email || undefined,
            })

            await sendNotificationEmail(req.payload, {
              to: populatedDoc.email,
              subject: `✅ Am primit mesajul tău - ${businessInfo?.name || 'Echipa noastră'}`,
              html: clientEmailHtml,
            })

            console.log(`✅ Contact confirmation sent to client: ${populatedDoc.email}`)
          }
        } catch (error) {
          console.error('❌ Failed to send contact notification:', error)
        }

        return doc
      },
    ],
  },
  admin: {
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
    useAsTitle: 'name',
    group: 'Operatiuni',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Subiect',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Mesaj',
      required: true,
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Serviciu de interes',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      options: [
        { label: 'Nou', value: 'new' },
        { label: 'Citit', value: 'read' },
        { label: 'Raspuns trimis', value: 'replied' },
        { label: 'Rezolvat', value: 'resolved' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Note interne',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Pagina sursa',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
