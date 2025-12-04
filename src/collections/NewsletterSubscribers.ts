import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { authenticated } from '@/access'

/**
 * Newsletter Subscribers Collection
 *
 * Following Payload CMS best practices:
 * - Using afterChange hook for sending welcome email (as per official docs)
 * - Email field with unique constraint to prevent duplicates
 * - Admin-only read/update/delete access
 * - Public create access for subscription form
 *
 * @see https://payloadcms.com/docs/email/overview
 * @see https://payloadcms.com/posts/blog/payload-nodemailer-free-and-extensible-email-integration
 */

// Send welcome email after successful subscription
const sendWelcomeEmail: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  // Only send welcome email for new subscriptions
  if (operation !== 'create') return doc

  // Skip if subscriber opted out or is not active
  if (doc.status !== 'active') return doc

  try {
    // Get business info for personalization
    const businessInfo = await req.payload.findGlobal({
      slug: 'business-info',
      req, // Threading req for transaction safety (Payload best practice)
    })

    const businessName = businessInfo?.name || 'Newsletter'

    // Send welcome email using Payload's email adapter (Resend)
    await req.payload.sendEmail({
      to: doc.email,
      subject: `Bine ai venit la newsletter-ul ${businessName}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">${businessName}</h1>
          </div>

          <h2 style="color: #333;">Multumim pentru abonare!</h2>

          <p>Ai fost abonat cu succes la newsletter-ul nostru.</p>

          <p>Vei primi:</p>
          <ul>
            <li>Noutati si oferte exclusive</li>
            <li>Informatii utile din domeniul nostru</li>
            <li>Promotii speciale pentru abonati</li>
          </ul>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            Daca nu te-ai abonat tu, poti ignora acest email sau ne poti contacta.
          </p>
        </body>
        </html>
      `,
    })

    console.log(`Welcome email sent to newsletter subscriber: ${doc.email}`)
  } catch (error) {
    // Log error but don't fail the subscription
    console.error('Failed to send welcome email:', error)
  }

  return doc
}

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: {
    singular: 'Abonat Newsletter',
    plural: 'Abonati Newsletter',
  },
  admin: {
    group: 'Marketing',
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'source', 'subscribedAt'],
    description: 'Gestioneaza abonatii la newsletter',
  },
  access: {
    // Only admins can read subscribers list
    read: authenticated,
    // Public can create (subscribe)
    create: () => true,
    // Only admins can update
    update: authenticated,
    // Only admins can delete
    delete: authenticated,
  },
  hooks: {
    afterChange: [sendWelcomeEmail],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Adresa de email a abonatului',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'active',
      options: [
        { label: 'Activ', value: 'active' },
        { label: 'Dezabonat', value: 'unsubscribed' },
        { label: 'Bounced', value: 'bounced' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Sursa',
      defaultValue: 'website',
      options: [
        { label: 'Website - Footer', value: 'footer' },
        { label: 'Website - Popup', value: 'popup' },
        { label: 'Website - Pagina', value: 'page' },
        { label: 'Website', value: 'website' },
        { label: 'Import', value: 'import' },
        { label: 'Manual', value: 'manual' },
      ],
      admin: {
        position: 'sidebar',
        description: 'De unde s-a abonat',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      label: 'Data abonarii',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ operation }) => {
            if (operation === 'create') {
              return new Date().toISOString()
            }
          },
        ],
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      label: 'Data dezabonarii',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => data?.status === 'unsubscribed',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'Adresa IP',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Pentru conformitate GDPR',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'User Agent',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
