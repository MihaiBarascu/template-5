import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { authenticated } from '@/access'

/**
 * Subscription Orders Collection
 *
 * Stores subscription/membership orders submitted through forms.
 * Uses consistent status values like the ecommerce plugin Orders.
 *
 * Status flow: pending → succeeded → completed / cancelled / refunded
 */

// Send notification emails for new orders
const sendOrderNotifications: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  try {
    // Get business info
    const businessInfo = await req.payload.findGlobal({
      slug: 'business-info',
      req,
    })

    const businessEmail = businessInfo?.email
    const businessName = businessInfo?.name || 'Website'

    if (!businessEmail) {
      console.log('No business email configured - skipping order notification')
      return doc
    }

    // Get subscription details if linked
    let subscriptionTitle = doc.subscriptionName || 'Abonament'
    if (doc.subscription && typeof doc.subscription === 'string') {
      try {
        const subscription = await req.payload.findByID({
          collection: 'subscriptions',
          id: doc.subscription,
          req,
        })
        subscriptionTitle = subscription?.title || subscriptionTitle
      } catch {
        // Subscription might not exist anymore
      }
    }

    // Email to business owner
    await req.payload.sendEmail({
      to: businessEmail,
      replyTo: doc.clientEmail,
      subject: `[${businessName}] Comanda noua abonament: ${subscriptionTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #ffc107; padding-bottom: 10px;">
            Comanda noua de abonament
          </h2>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Abonament:</strong> ${subscriptionTitle}</p>
            ${doc.subscriptionPrice ? `<p style="margin: 5px 0;"><strong>Pret:</strong> ${doc.subscriptionPrice} RON</p>` : ''}
          </div>

          <h3>Detalii client:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Nume</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${doc.clientName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${doc.clientEmail}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefon</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${doc.clientPhone || '-'}</td></tr>
          </table>

          ${doc.notes ? `<p style="margin-top: 15px;"><strong>Observatii:</strong> ${doc.notes}</p>` : ''}

          <p style="margin-top: 20px;">
            <a href="mailto:${doc.clientEmail}" style="background: #ffc107; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contacteaza clientul</a>
          </p>
        </body>
        </html>
      `,
    })

    console.log(`Subscription order notification sent to ${businessEmail}`)

    // Confirmation email to client
    if (doc.clientEmail) {
      await req.payload.sendEmail({
        to: doc.clientEmail,
        subject: `Confirmare comanda - ${businessName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Multumim pentru comanda!</h2>

            <p>Buna ${doc.clientName},</p>

            <p>Am primit comanda ta pentru abonamentul <strong>${subscriptionTitle}</strong>.</p>

            <p>Te vom contacta in curand pentru finalizarea comenzii si detaliile de plata.</p>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>Abonament:</strong> ${subscriptionTitle}</p>
              ${doc.subscriptionPrice ? `<p style="margin: 5px 0;"><strong>Pret:</strong> ${doc.subscriptionPrice} RON</p>` : ''}
            </div>

            <p>Daca ai intrebari, ne poti contacta oricand.</p>

            <p>Cu respect,<br>${businessName}</p>
          </body>
          </html>
        `,
      })

      console.log(`Subscription order confirmation sent to ${doc.clientEmail}`)
    }
  } catch (error) {
    console.error('Failed to send subscription order notifications:', error)
  }

  return doc
}

export const SubscriptionOrders: CollectionConfig = {
  slug: 'subscription-orders',
  labels: {
    singular: 'Comanda Abonament',
    plural: 'Comenzi Abonamente',
  },
  access: {
    create: () => true, // Anyone can place an order via form
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  hooks: {
    afterChange: [sendOrderNotifications],
  },
  admin: {
    defaultColumns: ['clientName', 'subscriptionName', 'status', 'createdAt'],
    useAsTitle: 'clientName',
    group: 'Operatiuni',
    description: 'Comenzi de abonamente primite prin formulare',
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
    },
    {
      name: 'clientPhone',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'subscriptions',
      label: 'Abonament (legat)',
      admin: {
        description: 'Legatura la abonamentul din catalog (optional)',
      },
    },
    {
      name: 'subscriptionName',
      type: 'text',
      label: 'Nume abonament',
      admin: {
        description: 'Numele abonamentului ales (din formular)',
      },
    },
    {
      name: 'subscriptionPrice',
      type: 'number',
      label: 'Pret',
      admin: {
        description: 'Pretul la momentul comenzii',
      },
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
    // Status consistent cu ecommerce plugin Orders
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'In asteptare', value: 'pending' },
        { label: 'Platit', value: 'succeeded' },
        { label: 'Esuat', value: 'failed' },
        { label: 'Anulat', value: 'cancelled' },
        { label: 'Expirat', value: 'expired' },
        { label: 'Rambursat', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Metoda de plata',
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'Card', value: 'card' },
        { label: 'Transfer bancar', value: 'transfer' },
        { label: 'Online', value: 'online' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Sursa comanda',
      defaultValue: 'website',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Telefon', value: 'phone' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'In persoana', value: 'walkin' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Data inceput',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Data expirare',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
  timestamps: true,
}
