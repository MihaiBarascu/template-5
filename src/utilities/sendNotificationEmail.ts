import type { Payload } from 'payload'
import { escapeHtml, escapeHtmlWithLineBreaks } from './escapeHtml'

interface NotificationEmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

/**
 * Send notification email using Payload's configured email adapter
 * Uses Resend in production (configured in payload.config.ts)
 */
export async function sendNotificationEmail(
  payload: Payload,
  options: NotificationEmailOptions
): Promise<boolean> {
  try {
    // Check if email is configured
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 Email notification (RESEND_API_KEY not set - email logged only):')
      console.log(`   To: ${options.to}`)
      console.log(`   Subject: ${options.subject}`)
      console.log(`   Content preview: ${options.html.substring(0, 200)}...`)
      return false
    }

    await payload.sendEmail({
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    })

    console.log(`📧 Email sent successfully to: ${options.to}`)
    return true
  } catch (error) {
    console.error('📧 Failed to send email:', error)
    return false
  }
}

/**
 * Get business owner email from BusinessInfo global
 */
export async function getBusinessEmail(payload: Payload): Promise<string | null> {
  try {
    const businessInfo = await payload.findGlobal({
      slug: 'business-info',
    })
    return businessInfo?.email || null
  } catch (error) {
    console.error('Failed to get business email:', error)
    return null
  }
}

/**
 * Format booking notification email HTML
 */
export function formatBookingEmail(booking: {
  clientName: string
  clientEmail: string
  clientPhone?: string | null
  service?: { title?: string | null } | string | null
  teamMember?: { name?: string | null } | string | null
  date?: string | null
  time?: string | null
  notes?: string | null
}): string {
  const serviceName = typeof booking.service === 'object' ? booking.service?.title || 'N/A' : 'N/A'
  const staffName = typeof booking.teamMember === 'object' ? booking.teamMember?.name || 'Oricine disponibil' : 'Oricine disponibil'

  const formattedDate = booking.date ? new Date(booking.date).toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .detail { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .highlight { background: #e8f5e9; border-left: 4px solid #4caf50; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗓️ Programare Nouă!</h1>
        </div>
        <div class="content">
          <p>Ai primit o nouă cerere de programare:</p>

          <div class="detail highlight">
            <div class="label">📅 Data și ora:</div>
            <div class="value" style="font-size: 18px;">${escapeHtml(formattedDate)} la ora ${escapeHtml(booking.time || '')}</div>
          </div>

          <div class="detail">
            <div class="label">👤 Client:</div>
            <div class="value">${escapeHtml(booking.clientName)}</div>
          </div>

          <div class="detail">
            <div class="label">📧 Email:</div>
            <div class="value"><a href="mailto:${encodeURIComponent(booking.clientEmail)}">${escapeHtml(booking.clientEmail)}</a></div>
          </div>

          <div class="detail">
            <div class="label">📱 Telefon:</div>
            <div class="value"><a href="tel:${encodeURIComponent(booking.clientPhone || '')}">${escapeHtml(booking.clientPhone || '')}</a></div>
          </div>

          <div class="detail">
            <div class="label">✂️ Serviciu:</div>
            <div class="value">${escapeHtml(serviceName)}</div>
          </div>

          <div class="detail">
            <div class="label">👨‍💼 Persoana preferată:</div>
            <div class="value">${escapeHtml(staffName)}</div>
          </div>

          ${booking.notes ? `
          <div class="detail">
            <div class="label">📝 Observații:</div>
            <div class="value">${escapeHtmlWithLineBreaks(booking.notes)}</div>
          </div>
          ` : ''}

          <p style="margin-top: 20px;">
            <strong>Acțiuni recomandate:</strong><br>
            • Confirmă programarea telefonic sau prin email<br>
            • Verifică disponibilitatea în calendar<br>
            • Pregătește ce e necesar pentru serviciu
          </p>
        </div>
        <div class="footer">
          Acest email a fost trimis automat de sistemul de programări.<br>
          Nu răspunde direct la acest email.
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Format booking confirmation email to CLIENT
 */
export function formatBookingConfirmationEmail(booking: {
  clientName: string
  service?: { title?: string | null } | string | null
  teamMember?: { name?: string | null } | string | null
  date?: string | null
  time?: string | null
  businessName?: string | null
  businessPhone?: string | null
  businessAddress?: string | null
}): string {
  const serviceName = typeof booking.service === 'object' ? booking.service?.title || 'Serviciu' : 'Serviciu'
  const staffName = typeof booking.teamMember === 'object' ? booking.teamMember?.name || null : null

  const formattedDate = booking.date ? new Date(booking.date).toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #ffffff; border: 1px solid #e5e5e5; }
        .highlight-box { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #22c55e; }
        .detail { margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { color: #111827; font-size: 16px; margin-top: 5px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; background: #f9fafb; border-radius: 0 0 10px 10px; }
        .cta { display: inline-block; background: #1a1a1a; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
        .emoji { font-size: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="emoji">✨</div>
          <h1 style="margin: 10px 0;">Programare Confirmată!</h1>
          <p style="margin: 0; opacity: 0.9;">${booking.businessName || 'Echipa noastră'}</p>
        </div>
        <div class="content">
          <p>Salut <strong>${escapeHtml(booking.clientName)}</strong>! 👋</p>
          <p>Îți mulțumim pentru programare! Am primit cererea ta și te așteptăm cu drag.</p>

          <div class="highlight-box">
            <div style="text-align: center;">
              <div style="font-size: 14px; color: #166534;">📅 DATA ȘI ORA PROGRAMĂRII</div>
              <div style="font-size: 24px; font-weight: bold; color: #166534; margin-top: 10px;">
                ${escapeHtml(formattedDate)}
              </div>
              <div style="font-size: 32px; font-weight: bold; color: #166534;">
                ${escapeHtml(booking.time || '')}
              </div>
            </div>
          </div>

          <div class="detail">
            <div class="label">✂️ Serviciu</div>
            <div class="value">${escapeHtml(serviceName)}</div>
          </div>

          ${staffName ? `
          <div class="detail">
            <div class="label">👨‍💼 Specialist</div>
            <div class="value">${escapeHtml(staffName)}</div>
          </div>
          ` : ''}

          ${booking.businessAddress ? `
          <div class="detail">
            <div class="label">📍 Locație</div>
            <div class="value">${escapeHtml(booking.businessAddress)}</div>
          </div>
          ` : ''}

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <strong>⚠️ Important:</strong><br>
            • Te rugăm să vii cu 5-10 minute înainte<br>
            • Dacă nu poți ajunge, anunță-ne cu cel puțin 2 ore înainte<br>
            ${booking.businessPhone ? `• Telefon contact: <a href="tel:${booking.businessPhone}">${booking.businessPhone}</a>` : ''}
          </div>

          <p style="text-align: center; margin-top: 30px;">
            <strong>Te așteptăm cu drag! 🙏</strong>
          </p>
        </div>
        <div class="footer">
          ${booking.businessName || 'Business Website'}<br>
          Acest email a fost trimis automat ca urmare a programării tale.
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Format contact form notification email HTML
 */
export function formatContactEmail(contact: {
  name: string
  email: string
  phone?: string | null
  subject?: string | null
  service?: { title?: string | null } | string | null
  message?: string | null
}): string {
  const serviceName = typeof contact.service === 'object' ? contact.service?.title || null : contact.service

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .detail { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📩 Mesaj Nou de Contact</h1>
        </div>
        <div class="content">
          <p>Ai primit un mesaj nou prin formularul de contact:</p>

          <div class="detail">
            <div class="label">👤 Nume:</div>
            <div class="value">${escapeHtml(contact.name)}</div>
          </div>

          <div class="detail">
            <div class="label">📧 Email:</div>
            <div class="value"><a href="mailto:${encodeURIComponent(contact.email)}">${escapeHtml(contact.email)}</a></div>
          </div>

          ${contact.phone ? `
          <div class="detail">
            <div class="label">📱 Telefon:</div>
            <div class="value"><a href="tel:${encodeURIComponent(contact.phone)}">${escapeHtml(contact.phone)}</a></div>
          </div>
          ` : ''}

          ${contact.subject ? `
          <div class="detail">
            <div class="label">📋 Subiect:</div>
            <div class="value">${escapeHtml(contact.subject)}</div>
          </div>
          ` : ''}

          ${serviceName ? `
          <div class="detail">
            <div class="label">✂️ Serviciu de interes:</div>
            <div class="value">${escapeHtml(serviceName)}</div>
          </div>
          ` : ''}

          <div class="detail">
            <div class="label">💬 Mesaj:</div>
            <div class="message-box">${escapeHtmlWithLineBreaks(contact.message || '')}</div>
          </div>

          <p style="margin-top: 20px;">
            <strong>Răspunde clientului cât mai curând posibil!</strong>
          </p>
        </div>
        <div class="footer">
          Acest email a fost trimis automat de formularul de contact.<br>
          Răspunde direct la ${contact.email}
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Format contact confirmation email to CLIENT
 */
export function formatContactConfirmationEmail(contact: {
  name: string
  businessName?: string | null
  businessPhone?: string | null
  businessEmail?: string | null
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #ffffff; border: 1px solid #e5e5e5; }
        .info-box { background: #eff6ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; background: #f9fafb; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📩 Am primit mesajul tău!</h1>
        </div>
        <div class="content">
          <p>Salut <strong>${escapeHtml(contact.name)}</strong>! 👋</p>

          <p>Îți mulțumim că ne-ai contactat! Am primit mesajul tău și îți vom răspunde cât de curând posibil.</p>

          <div class="info-box">
            <strong>Ce urmează?</strong><br>
            Echipa noastră va analiza mesajul tău și te va contacta în cel mai scurt timp, de obicei în maxim 24 de ore lucrătoare.
          </div>

          ${contact.businessPhone ? `
          <p>Dacă ai o urgență, ne poți contacta direct la telefon: <a href="tel:${contact.businessPhone}">${contact.businessPhone}</a></p>
          ` : ''}

          <p style="margin-top: 30px;">Cu drag,<br><strong>${contact.businessName || 'Echipa noastră'}</strong></p>
        </div>
        <div class="footer">
          Acest email a fost trimis automat ca urmare a mesajului tău.<br>
          Nu este nevoie să răspunzi la acest email.
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Order item interface for email formatting
 */
interface OrderItem {
  product?: { title?: string } | string
  quantity?: number
  price?: number
  priceAtPurchase?: number
}

/**
 * Format order notification email to BUSINESS OWNER
 */
export function formatOrderEmail(order: {
  orderNumber?: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: OrderItem[]
  total: number
  shippingAddress?: string
  notes?: string
}): string {
  const itemsHtml = order.items.map(item => {
    const productName = typeof item.product === 'object' ? item.product?.title : item.product || 'Produs'
    const price = item.priceAtPurchase || item.price || 0
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(productName || 'Produs')}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${price.toFixed(2)} lei</td>
      </tr>
    `
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 20px; background: #f9f9f9; }
        .detail { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .highlight { background: #ecfdf5; border-left: 4px solid #059669; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f3f4f6; padding: 10px; text-align: left; }
        .total-row { font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 Comandă Nouă!</h1>
          ${order.orderNumber ? `<p style="margin: 5px 0; opacity: 0.9;">Comanda #${order.orderNumber}</p>` : ''}
        </div>
        <div class="content">
          <p>Ai primit o nouă comandă:</p>

          <div class="detail highlight">
            <div class="label">💰 Total comandă:</div>
            <div class="value" style="font-size: 24px; font-weight: bold; color: #059669;">${order.total.toFixed(2)} lei</div>
          </div>

          <div class="detail">
            <div class="label">👤 Client:</div>
            <div class="value">${escapeHtml(order.customerName)}</div>
          </div>

          <div class="detail">
            <div class="label">📧 Email:</div>
            <div class="value"><a href="mailto:${encodeURIComponent(order.customerEmail)}">${escapeHtml(order.customerEmail)}</a></div>
          </div>

          ${order.customerPhone ? `
          <div class="detail">
            <div class="label">📱 Telefon:</div>
            <div class="value"><a href="tel:${encodeURIComponent(order.customerPhone)}">${escapeHtml(order.customerPhone)}</a></div>
          </div>
          ` : ''}

          ${order.shippingAddress ? `
          <div class="detail">
            <div class="label">📍 Adresa livrare:</div>
            <div class="value">${escapeHtmlWithLineBreaks(order.shippingAddress)}</div>
          </div>
          ` : ''}

          <div class="detail">
            <div class="label">📦 Produse comandate:</div>
            <table style="margin-top: 10px;">
              <thead>
                <tr>
                  <th>Produs</th>
                  <th style="text-align: center;">Cantitate</th>
                  <th style="text-align: right;">Preț</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td colspan="2" style="padding: 15px; text-align: right;">TOTAL:</td>
                  <td style="padding: 15px; text-align: right; color: #059669;">${order.total.toFixed(2)} lei</td>
                </tr>
              </tbody>
            </table>
          </div>

          ${order.notes ? `
          <div class="detail">
            <div class="label">📝 Note comandă:</div>
            <div class="value">${escapeHtmlWithLineBreaks(order.notes)}</div>
          </div>
          ` : ''}

          <p style="margin-top: 20px;">
            <strong>Acțiuni recomandate:</strong><br>
            • Confirmă comanda clientului<br>
            • Pregătește produsele pentru livrare<br>
            • Actualizează statusul comenzii în admin
          </p>
        </div>
        <div class="footer">
          Acest email a fost trimis automat de sistemul de comenzi.<br>
          Nu răspunde direct la acest email.
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Format order confirmation email to CLIENT
 */
export function formatOrderConfirmationEmail(order: {
  orderNumber?: string
  customerName: string
  items: OrderItem[]
  total: number
  shippingAddress?: string
  businessName?: string
  businessPhone?: string
  businessEmail?: string
}): string {
  const itemsHtml = order.items.map(item => {
    const productName = typeof item.product === 'object' ? item.product?.title : item.product || 'Produs'
    const price = item.priceAtPurchase || item.price || 0
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(productName || 'Produs')}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${price.toFixed(2)} lei</td>
      </tr>
    `
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #ffffff; border: 1px solid #e5e5e5; }
        .highlight-box { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #059669; text-align: center; }
        .detail { margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; background: #f9fafb; border-radius: 0 0 10px 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; }
        .total-row { font-weight: bold; background: #ecfdf5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="font-size: 48px;">✅</div>
          <h1 style="margin: 10px 0;">Comanda a fost plasată!</h1>
          ${order.orderNumber ? `<p style="margin: 0; opacity: 0.9;">Comanda #${escapeHtml(order.orderNumber)}</p>` : ''}
        </div>
        <div class="content">
          <p>Salut <strong>${escapeHtml(order.customerName)}</strong>! 👋</p>
          <p>Îți mulțumim pentru comandă! Am primit-o și o vom procesa cât mai curând.</p>

          <div class="highlight-box">
            <div style="font-size: 14px; color: #047857;">💰 TOTAL COMANDĂ</div>
            <div style="font-size: 32px; font-weight: bold; color: #047857; margin-top: 5px;">
              ${order.total.toFixed(2)} lei
            </div>
          </div>

          <div class="detail">
            <div class="label">📦 Produsele tale</div>
            <table>
              <thead>
                <tr>
                  <th>Produs</th>
                  <th style="text-align: center;">Cantitate</th>
                  <th style="text-align: right;">Preț</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td colspan="2" style="padding: 15px; text-align: right;">TOTAL:</td>
                  <td style="padding: 15px; text-align: right; color: #059669; font-size: 18px;">${order.total.toFixed(2)} lei</td>
                </tr>
              </tbody>
            </table>
          </div>

          ${order.shippingAddress ? `
          <div class="detail">
            <div class="label">📍 Adresa de livrare</div>
            <div style="margin-top: 5px;">${escapeHtmlWithLineBreaks(order.shippingAddress)}</div>
          </div>
          ` : ''}

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <strong>📋 Ce urmează?</strong><br>
            • Vom procesa comanda ta în cel mai scurt timp<br>
            • Vei primi un email când comanda va fi expediată<br>
            ${order.businessPhone ? `• Pentru întrebări, sună la: <a href="tel:${order.businessPhone}">${order.businessPhone}</a>` : ''}
          </div>

          <p style="text-align: center; margin-top: 30px;">
            <strong>Îți mulțumim pentru încredere! 🙏</strong>
          </p>
        </div>
        <div class="footer">
          ${order.businessName || 'Magazin Online'}<br>
          Acest email a fost trimis automat ca urmare a comenzii tale.
        </div>
      </div>
    </body>
    </html>
  `
}
