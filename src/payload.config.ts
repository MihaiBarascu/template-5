import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'

import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Services } from './collections/Services'
// Products is created by ecommerce plugin with productsCollectionOverride
import { Team } from './collections/Team'
import { Portfolio } from './collections/Portfolio'
import { Testimonials } from './collections/Testimonials'
import { PricePackages } from './collections/PricePackages'
import { Bookings } from './collections/Bookings'
import { FAQ } from './collections/FAQ'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { ProductCategories } from './collections/ProductCategories'

// Globals
import { Theme } from './globals/Theme'
import { BusinessInfo } from './globals/BusinessInfo'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Logo } from './globals/Logo'
import { ShopSettings } from './globals/ShopSettings'
import { DesignVariant } from './globals/DesignVariant'

// Blocks
import { blocks } from './blocks'

// Plugins and utilities
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

// Email notification utilities for orders
import {
  sendNotificationEmail,
  getBusinessEmail,
  formatOrderEmail,
  formatOrderConfirmationEmail,
} from './utilities/sendNotificationEmail'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Override Pages collection to include blocks
const PagesWithBlocks = {
  ...Pages,
  fields: Pages.fields.map((field) => {
    if ('name' in field && field.name === 'layout') {
      return {
        ...field,
        blocks,
      }
    }
    return field
  }),
}

// Order email notification hook
const orderEmailHook = async ({ doc, operation, req }: any) => {
  // Only send email for new orders
  if (operation !== 'create') return doc

  try {
    const businessEmail = await getBusinessEmail(req.payload)

    if (!businessEmail) {
      console.log('No business email configured - skipping order notification')
      return doc
    }

    // Get business info for client email
    const businessInfo = await req.payload.findGlobal({
      slug: 'business-info',
    })

    // Populate items with product titles
    let populatedItems = doc.items || []
    if (Array.isArray(populatedItems)) {
      populatedItems = await Promise.all(
        populatedItems.map(async (item: any) => {
          if (item.product && typeof item.product === 'string') {
            try {
              const product = await req.payload.findByID({
                collection: 'products',
                id: item.product,
              })
              return { ...item, product }
            } catch (e) {
              return item
            }
          }
          return item
        })
      )
    }

    // Get customer info
    let customerName = 'Client'
    let customerEmail = ''
    let customerPhone = ''

    if (doc.customer && typeof doc.customer === 'string') {
      try {
        const customer = await req.payload.findByID({
          collection: 'users',
          id: doc.customer,
        })
        customerName = customer?.name || customer?.email || 'Client'
        customerEmail = customer?.email || ''
        customerPhone = customer?.phone || ''
      } catch (e) {
        console.log('Could not fetch customer:', e)
      }
    } else if (doc.customer) {
      customerName = doc.customer?.name || doc.customer?.email || 'Client'
      customerEmail = doc.customer?.email || ''
      customerPhone = doc.customer?.phone || ''
    }

    // Calculate total
    const total = doc.totals?.total || doc.total || populatedItems.reduce((sum: number, item: any) => {
      const price = item.priceAtPurchase || item.price || 0
      return sum + (price * (item.quantity || 1))
    }, 0)

    // Email 1: To business owner
    const ownerEmailHtml = formatOrderEmail({
      orderNumber: doc.orderNumber || doc.id,
      customerName,
      customerEmail,
      customerPhone,
      items: populatedItems,
      total,
      shippingAddress: doc.shippingAddress?.formatted || '',
      notes: doc.notes,
    })

    await sendNotificationEmail(req.payload, {
      to: businessEmail,
      subject: `Comanda noua: #${doc.orderNumber || doc.id}`,
      html: ownerEmailHtml,
      replyTo: customerEmail || undefined,
    })

    console.log(`Order notification sent to ${businessEmail}`)

    // Email 2: To customer - confirmation
    if (customerEmail) {
      const clientEmailHtml = formatOrderConfirmationEmail({
        orderNumber: doc.orderNumber || doc.id,
        customerName,
        items: populatedItems,
        total,
        shippingAddress: doc.shippingAddress?.formatted || '',
        businessName: businessInfo?.name,
        businessPhone: businessInfo?.phone,
        businessEmail: businessInfo?.email,
      })

      await sendNotificationEmail(req.payload, {
        to: customerEmail,
        subject: `Comanda #${doc.orderNumber || doc.id} a fost plasata - ${businessInfo?.name || 'Magazin Online'}`,
        html: clientEmailHtml,
      })

      console.log(`Order confirmation sent to client: ${customerEmail}`)
    }
  } catch (error) {
    console.error('Failed to send order notification:', error)
  }

  return doc
}

// Build ecommerce plugin config
const ecommerceConfig: Parameters<typeof ecommercePlugin>[0] = {
  access: {
    adminOnly: ({ req }: { req: any }) => {
      const user = req.user
      if (user && 'role' in user) return user.role === 'admin'
      return false
    },
    adminOnlyFieldAccess: ({ req }: { req: any }) => {
      const user = req.user
      if (user && 'role' in user) return user.role === 'admin'
      return false
    },
    adminOrCustomerOwner: ({ req }: { req: any }) => {
      const user = req.user
      if (user && 'role' in user && user.role === 'admin') return true
      return { customer: { equals: req.user?.id } }
    },
    adminOrPublishedStatus: ({ req }: { req: any }) => {
      const user = req.user
      if (user && 'role' in user && user.role === 'admin') return true
      return { _status: { equals: 'published' } }
    },
    customerOnlyFieldAccess: ({ req }: { req: any }) => Boolean(req.user),
  },
  customers: { slug: 'users' },
  currencies: {
    defaultCurrency: 'RON',
    supportedCurrencies: [
      { code: 'RON', symbol: 'lei', decimals: 2, label: 'Leu Romanesc' },
    ],
  },
  products: {
    productsCollectionOverride: ({ defaultCollection }: { defaultCollection: any }) => ({
      ...defaultCollection,
      admin: {
        ...defaultCollection.admin,
        group: 'Shop',
        useAsTitle: 'title',
      },
      fields: [
        { name: 'title', type: 'text', label: 'Nume Produs', required: true },
        { name: 'slug', type: 'text', label: 'Slug', required: true, unique: true, index: true },
        { name: 'description', type: 'richText', label: 'Descriere', editor: lexicalEditor() },
        { name: 'images', type: 'array', label: 'Imagini', fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
        { name: 'category', type: 'relationship', relationTo: 'product-categories', label: 'Categorie' },
        // Simple price fields for easy frontend usage
        { name: 'price', type: 'number', label: 'Pret (RON)', required: true, min: 0 },
        { name: 'salePrice', type: 'number', label: 'Pret Redus (RON)', min: 0 },
        ...(Array.isArray(defaultCollection.fields) ? defaultCollection.fields.filter(Boolean) : []),
        { name: 'badge', type: 'text', label: 'Badge' },
        { name: 'featured', type: 'checkbox', label: 'Featured', defaultValue: false },
      ],
    }),
  },
  orders: {
    ordersCollectionOverride: ({ defaultCollection }: { defaultCollection: any }) => ({
      ...defaultCollection,
      admin: {
        ...defaultCollection.admin,
        group: 'Shop',
        defaultColumns: ['customer', 'status', 'createdAt'],
      },
      labels: {
        singular: 'Comanda',
        plural: 'Comenzi',
      },
      hooks: {
        ...defaultCollection.hooks,
        afterChange: [
          ...(defaultCollection.hooks?.afterChange || []),
          orderEmailHook,
        ],
      },
    }),
  },
}

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    meta: {
      titleSuffix: ' | Admin Panel',
    },
  },
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [
    PagesWithBlocks,
    Posts,
    Media,
    Categories,
    Users,
    Services,
    // Products is created by ecommerce plugin
    Team,
    Portfolio,
    Testimonials,
    PricePackages,
    Bookings,
    FAQ,
    ContactSubmissions,
    ProductCategories,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, Theme, Logo, BusinessInfo, ShopSettings, DesignVariant],
  plugins: [
    ...plugins,
    // Ecommerce plugin cu Orders email notifications
    ecommercePlugin(ecommerceConfig),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  // Email configuration (Resend) - pentru notificari booking, contact, comenzi
  email: resendAdapter({
    defaultFromAddress: 'onboarding@resend.dev',
    defaultFromName: 'Business Website',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
