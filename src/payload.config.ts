import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { manualAdapter } from '@/payments'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import {
  isAdmin,
  isDocumentOwner,
  adminOnlyFieldAccess,
  adminOrPublishedStatus,
  customerOnlyFieldAccess,
} from '@/access'

import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest, CollectionConfig } from 'payload'
import type { CollectionAfterChangeHook } from 'payload'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Services } from './collections/Services'
// Products is created by ecommerce plugin with productsCollectionOverride
import { ProductTags } from './collections/ProductTags'
import { Team } from './collections/Team'
import { Portfolio } from './collections/Portfolio'
import { Testimonials } from './collections/Testimonials'
// PricePackages removed - use Subscriptions instead
import { Bookings } from './collections/Bookings'
import { FAQ } from './collections/FAQ'
// ContactSubmissions removed - use Form Builder plugin's form-submissions instead
import { ProductCategories } from './collections/ProductCategories'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
// Classes collection removed - use Services with serviceType: 'class' instead
import { Subscriptions } from './collections/Subscriptions'
import { SubscriptionOrders } from './collections/SubscriptionOrders'

// Globals
import { SiteTheme } from './globals/SiteTheme'
import { BusinessInfo } from './globals/BusinessInfo'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Logo } from './globals/Logo'
import { ShopSettings } from './globals/ShopSettings'
import { SystemPages } from './globals/SystemPages'

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

// Order item interface
interface OrderItem {
  product?: string | { id?: string; title?: string }
  priceAtPurchase?: number
  price?: number
  quantity?: number
}

// Order email notification hook
const orderEmailHook: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
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
      req, // Threading req for transaction safety (Payload best practice)
    })

    // Populate items with product titles
    let populatedItems: OrderItem[] = doc.items || []
    if (Array.isArray(populatedItems)) {
      populatedItems = await Promise.all(
        populatedItems.map(async (item: OrderItem) => {
          if (item.product && typeof item.product === 'string') {
            try {
              const product = await req.payload.findByID({
                collection: 'products',
                id: item.product,
                req, // Threading req for transaction safety (Payload best practice)
              })
              return { ...item, product }
            } catch (_e) {
              return item
            }
          }
          return item
        })
      )
    }

    // Get customer info from plugin schema fields
    // For guest orders: use doc.shippingAddress and doc.customerEmail
    // For authenticated orders: use doc.customer relationship
    let customerName = 'Client'
    let customerEmail = doc.customerEmail || ''
    let customerPhone = doc.shippingAddress?.phone || ''

    // Build customer name from shipping address
    if (doc.shippingAddress?.firstName || doc.shippingAddress?.lastName) {
      customerName = [doc.shippingAddress?.firstName, doc.shippingAddress?.lastName]
        .filter(Boolean)
        .join(' ') || 'Client'
    }

    // If there's a customer relationship, try to get more info
    if (doc.customer && typeof doc.customer === 'string') {
      try {
        const customer = await req.payload.findByID({
          collection: 'users',
          id: doc.customer,
          req, // Threading req for transaction safety (Payload best practice)
        }) as { name?: string | null; email?: string | null; phone?: string | null }
        customerName = customer?.name || customerName
        customerEmail = customer?.email || customerEmail
        customerPhone = customer?.phone || customerPhone
      } catch (e) {
        console.log('Could not fetch customer:', e)
      }
    } else if (doc.customer && typeof doc.customer === 'object') {
      const customer = doc.customer as { name?: string | null; email?: string | null; phone?: string | null }
      customerName = customer?.name || customerName
      customerEmail = customer?.email || customerEmail
      customerPhone = customer?.phone || customerPhone
    }

    // Build formatted shipping address from plugin schema fields
    const shippingAddressFormatted = [
      doc.shippingAddress?.addressLine1,
      doc.shippingAddress?.addressLine2,
      doc.shippingAddress?.city,
      doc.shippingAddress?.state,
      doc.shippingAddress?.postalCode,
      doc.shippingAddress?.country,
    ].filter(Boolean).join(', ')

    // Get total from plugin's amount field
    const total = doc.amount || populatedItems.reduce((sum: number, item: OrderItem) => {
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
      shippingAddress: shippingAddressFormatted,
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
        shippingAddress: shippingAddressFormatted,
        businessName: businessInfo?.name ?? undefined,
        businessPhone: businessInfo?.phone ?? undefined,
        businessEmail: businessInfo?.email ?? undefined,
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
    adminOnlyFieldAccess,
    adminOrPublishedStatus,
    customerOnlyFieldAccess,
    isAdmin,
    isDocumentOwner,
  },
  customers: { slug: 'users' },
  // Enable addresses collection for saved shipping/billing addresses
  addresses: true,
  // Allow guest carts for unauthenticated users
  carts: {
    cartsCollectionOverride: ({ defaultCollection }: { defaultCollection: CollectionConfig }) => ({
      ...defaultCollection,
      access: {
        ...defaultCollection.access,
        // Allow anyone to create and update carts (for guest checkout)
        create: () => true,
        update: () => true,
        // Allow reading carts - needed for checkout payment flow
        // The plugin's initiatePayment uses overrideAccess: false
        read: () => true,
      },
    }),
  },
  currencies: {
    defaultCurrency: 'RON',
    supportedCurrencies: [
      { code: 'RON', symbol: 'lei', decimals: 2, label: 'Leu Romanesc' },
    ],
  },
  products: {
    // Following Payload ecommerce plugin best practices:
    // https://payloadcms.com/docs/ecommerce/overview
    // Pattern: spread defaultCollection.fields first, then add custom fields
    productsCollectionOverride: ({ defaultCollection }: { defaultCollection: CollectionConfig }) => ({
      ...defaultCollection,
      admin: {
        ...defaultCollection.admin,
        group: 'Shop',
        useAsTitle: 'title',
        defaultColumns: ['title', 'prices', 'inventory', 'category', 'featured'],
      },
      fields: [
        // Custom fields FIRST (before plugin defaults)
        { name: 'title', type: 'text', label: 'Nume Produs', required: true },
        { name: 'slug', type: 'text', label: 'Slug', required: true, unique: true, index: true },
        { name: 'shortDescription', type: 'textarea', label: 'Descriere Scurtă', admin: { description: 'Afișată în lista de produse și pe card' } },
        { name: 'description', type: 'richText', label: 'Descriere Detaliată', editor: lexicalEditor() },
        { name: 'images', type: 'array', label: 'Imagini', minRows: 1, fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
        { name: 'category', type: 'relationship', relationTo: 'product-categories', label: 'Categorie' },
        { name: 'sku', type: 'text', label: 'Cod Produs (SKU)', index: true },
        // Plugin default fields FIRST (inventory, priceInRON from plugin)
        // Plugin provides: inventory, priceInRONEnabled, priceInRON
        ...(Array.isArray(defaultCollection.fields) ? defaultCollection.fields.filter(Boolean) : []),
        // Custom fields for filtering and categorization AFTER plugin defaults
        {
          name: 'brand',
          type: 'text',
          label: 'Brand',
          index: true,
          admin: { position: 'sidebar' },
        },
        {
          name: 'tags',
          type: 'relationship',
          relationTo: 'product-tags' as const,
          hasMany: true,
          label: 'Tag-uri',
          admin: {
            position: 'sidebar',
            description: 'Nou, Promoție, Bestseller, etc.',
          },
        },
        {
          name: 'relatedProducts',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          maxRows: 4,
          label: 'Produse Similare',
          filterOptions: ({ id }) => {
            if (!id) return true
            return { id: { not_equals: id } }
          },
          admin: { description: 'Selectează până la 4 produse similare' },
        },
        // Specifications array
        {
          name: 'specifications',
          type: 'array',
          label: 'Specificații',
          fields: [
            { name: 'name', type: 'text', label: 'Nume', required: true },
            { name: 'value', type: 'text', label: 'Valoare', required: true },
          ],
        },
        { name: 'badge', type: 'text', label: 'Badge', admin: { position: 'sidebar', description: 'Text scurt afișat pe card (ex: -20%)' } },
        { name: 'featured', type: 'checkbox', label: 'Produs Recomandat', defaultValue: false, admin: { position: 'sidebar' } },
        { name: 'order', type: 'number', label: 'Ordine Afișare', defaultValue: 0, admin: { position: 'sidebar' } },
      ],
    }),
  },
  orders: {
    ordersCollectionOverride: ({ defaultCollection }: { defaultCollection: CollectionConfig }) => ({
      ...defaultCollection,
      access: {
        ...defaultCollection.access,
        // Allow guest checkout - anyone can create orders
        create: () => true,
      },
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
  // Payment methods configuration
  // Manual adapter for "cash on delivery" (plată la livrare)
  // To add Stripe: import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'
  payments: {
    paymentMethods: [
      manualAdapter({ label: 'Plată la livrare' }),
      // Add Stripe when configured:
      // stripeAdapter({
      //   secretKey: process.env.STRIPE_SECRET_KEY!,
      //   webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
      // }),
    ],
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
    Bookings,
    FAQ,
    // ContactSubmissions removed - use Form Builder plugin's form-submissions
    ProductCategories,
    ProductTags,
    NewsletterSubscribers,
    Subscriptions,
    SubscriptionOrders,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteTheme, Logo, BusinessInfo, ShopSettings, SystemPages],
  plugins: [
    ...plugins,
    // Ecommerce plugin cu Orders email notifications
    ecommercePlugin(ecommerceConfig),
    // Nested docs plugin for hierarchical pages (e.g., /clase/yoga, /servicii/consultatie)
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    // Cloudflare R2 Storage (via S3-compatible API)
    // Local: fara R2_BUCKET -> foloseste ./media folder
    // Productie: fiecare afacere are propriul R2 bucket pe Dokploy
    ...(process.env.R2_BUCKET
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.R2_BUCKET,
            config: {
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
              },
              region: 'auto',
              endpoint: process.env.R2_ENDPOINT,
            },
          }),
        ]
      : []),
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
