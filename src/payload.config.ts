import {
  adminOnlyFieldAccess,
  adminOrPublishedStatus,
  customerOnlyFieldAccess,
  isAdmin,
  isDocumentOwner,
} from '@/access';
import { manualAdapter } from '@/payments';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { resendAdapter } from '@payloadcms/email-resend';
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce';
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';

import path from 'path';
import type { CollectionAfterChangeHook } from 'payload';
import { buildConfig, CollectionConfig, PayloadRequest } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Collections
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Pages } from './collections/Pages';
import { Posts } from './collections/Posts';
import { Services } from './collections/Services';
import { Users } from './collections/Users';
// Products is created by ecommerce plugin with productsCollectionOverride
import { Portfolio } from './collections/Portfolio';
import { ProductTags } from './collections/ProductTags';
import { Team } from './collections/Team';
import { Testimonials } from './collections/Testimonials';
// PricePackages removed - use Subscriptions instead
import { Bookings } from './collections/Bookings';
import { FAQ } from './collections/FAQ';
// ContactSubmissions removed - use Form Builder plugin's form-submissions instead
import { NewsletterSubscribers } from './collections/NewsletterSubscribers';
import { ProductCategories } from './collections/ProductCategories';
// Classes collection removed - use Services with serviceType: 'class' instead
import { SubscriptionOrders } from './collections/SubscriptionOrders';
import { Subscriptions } from './collections/Subscriptions';

// Globals
import { BusinessInfo } from './globals/BusinessInfo';
import { Footer } from './globals/Footer';
import { Header } from './globals/Header';
import { Logo } from './globals/Logo';
import { ShopSettings } from './globals/ShopSettings';
import { SiteTheme } from './globals/SiteTheme';
import { SystemPages } from './globals/SystemPages';

// Blocks
import { blocks } from './blocks';

// Plugins and utilities
import { defaultLexical } from '@/fields/defaultLexical';
import { plugins } from './plugins';
import { getServerSideURL } from './utilities/getURL';

// Email notification utilities for orders
import {
  formatOrderConfirmationEmail,
  formatOrderEmail,
  getBusinessEmail,
  sendNotificationEmail,
} from './utilities/sendNotificationEmail';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Override Pages collection to include blocks
const PagesWithBlocks = {
  ...Pages,
  fields: Pages.fields.map(field => {
    if ('name' in field && field.name === 'layout') {
      return {
        ...field,
        blocks,
      };
    }
    return field;
  }),
};

// Order item interface - price comes from populated product.priceInRON
// displayPrice is the price with TVA applied for customer display
interface OrderItem {
  product?: string | { id?: string; title?: string; priceInRON?: number | null };
  quantity?: number;
  displayPrice?: number; // Price with TVA for email display
}

// Helper function to calculate display price with TVA
// Mirrors logic from src/providers/ShopSettings.tsx getDisplayPrice()
function calculateDisplayPrice(
  priceInDb: number,
  shopSettings: {
    vatEnabled?: boolean;
    pricesIncludeVat?: boolean;
    vatRates?: { standard?: number; reduced?: number };
    defaultVatRate?: 'standard' | 'reduced' | 'zero';
  } | null,
  taxCategory?: 'standard' | 'reduced' | 'zero'
): number {
  if (!shopSettings || !shopSettings.vatEnabled) {
    return priceInDb;
  }

  // If prices in DB already include VAT, return as-is
  if (shopSettings.pricesIncludeVat) {
    return priceInDb;
  }

  // Get VAT rate for the category
  const category = taxCategory || shopSettings.defaultVatRate || 'standard';
  const vatRates = shopSettings.vatRates || { standard: 21, reduced: 11 };
  const vatRate = category === 'zero' ? 0 : vatRates[category] || vatRates.standard || 21;

  // Prices in DB are without VAT - add VAT for display
  return priceInDb * (1 + vatRate / 100);
}

// Order email notification hook
const orderEmailHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Only send email for new orders
  if (operation !== 'create') return doc;

  try {
    const businessEmail = getBusinessEmail();

    if (!businessEmail) {
      console.log('No business email configured - skipping order notification');
      return doc;
    }

    // Get business info for client email
    const businessInfo = await req.payload.findGlobal({
      slug: 'business-info',
      req, // Threading req for transaction safety (Payload best practice)
    });

    // Get shop settings for TVA calculation
    const shopSettings = await req.payload.findGlobal({
      slug: 'shop-settings',
      req,
    }) as {
      vatEnabled?: boolean;
      pricesIncludeVat?: boolean;
      vatRates?: { standard?: number; reduced?: number };
      defaultVatRate?: 'standard' | 'reduced' | 'zero';
    } | null;

    // Populate items with product titles and calculate display prices with TVA
    let populatedItems: OrderItem[] = doc.items || [];
    if (Array.isArray(populatedItems)) {
      populatedItems = await Promise.all(
        populatedItems.map(async (item: OrderItem) => {
          let populatedItem = item;
          if (item.product && typeof item.product === 'string') {
            try {
              const product = await req.payload.findByID({
                collection: 'products',
                id: item.product,
                req, // Threading req for transaction safety (Payload best practice)
              });
              populatedItem = { ...item, product };
            } catch (_e) {
              // Keep original item
            }
          }

          // Calculate display price with TVA for customer emails
          // Respects product-level taxCategory (e.g., 'zero' for tax-exempt products)
          const product = populatedItem.product;
          const rawPrice = typeof product === 'object' ? product?.priceInRON || 0 : 0;
          const productTaxCategory = typeof product === 'object' ? (product as { taxCategory?: 'standard' | 'reduced' | 'zero' })?.taxCategory : undefined;
          const displayPrice = calculateDisplayPrice(rawPrice, shopSettings, productTaxCategory);

          return { ...populatedItem, displayPrice };
        }),
      );
    }

    // Get customer info from plugin schema fields
    // For guest orders: use doc.shippingAddress and doc.customerEmail
    // For authenticated orders: use doc.customer relationship
    let customerName = 'Client';
    let customerEmail = doc.customerEmail || '';
    let customerPhone = doc.shippingAddress?.phone || '';

    // Build customer name from shipping address
    if (doc.shippingAddress?.firstName || doc.shippingAddress?.lastName) {
      customerName =
        [doc.shippingAddress?.firstName, doc.shippingAddress?.lastName]
          .filter(Boolean)
          .join(' ') || 'Client';
    }

    // If there's a customer relationship, try to get more info
    if (doc.customer && typeof doc.customer === 'string') {
      try {
        const customer = (await req.payload.findByID({
          collection: 'users',
          id: doc.customer,
          req, // Threading req for transaction safety (Payload best practice)
        })) as {
          name?: string | null;
          email?: string | null;
          phone?: string | null;
        };
        customerName = customer?.name || customerName;
        customerEmail = customer?.email || customerEmail;
        customerPhone = customer?.phone || customerPhone;
      } catch (e) {
        console.log('Could not fetch customer:', e);
      }
    } else if (doc.customer && typeof doc.customer === 'object') {
      const customer = doc.customer as {
        name?: string | null;
        email?: string | null;
        phone?: string | null;
      };
      customerName = customer?.name || customerName;
      customerEmail = customer?.email || customerEmail;
      customerPhone = customer?.phone || customerPhone;
    }

    // Build formatted shipping address from plugin schema fields
    const shippingAddressFormatted = [
      doc.shippingAddress?.addressLine1,
      doc.shippingAddress?.addressLine2,
      doc.shippingAddress?.city,
      doc.shippingAddress?.state,
      doc.shippingAddress?.postalCode,
      doc.shippingAddress?.country,
    ]
      .filter(Boolean)
      .join(', ');

    // Calculate subtotal using display prices with TVA
    // Note: doc.amount is the raw DB amount, we need to apply TVA for customer display
    const subtotalWithTva = populatedItems.reduce((sum: number, item: OrderItem) => {
      // Use displayPrice (with TVA applied) for customer emails
      const displayPrice = item.displayPrice || 0;
      return sum + displayPrice * (item.quantity || 1);
    }, 0);

    // Round subtotal to 2 decimal places
    const subtotal = Math.round(subtotalWithTva * 100) / 100;

    // Get shipping cost from order and calculate total
    const shippingCost = doc.shippingCost || 0;
    const total = subtotal + shippingCost;

    // Email 1: To business owner
    const ownerEmailHtml = formatOrderEmail({
      orderNumber: doc.orderNumber || doc.id,
      customerName,
      customerEmail,
      customerPhone,
      items: populatedItems,
      subtotal,
      shippingCost,
      total,
      shippingAddress: shippingAddressFormatted,
      notes: doc.notes,
    });

    await sendNotificationEmail(req.payload, {
      to: businessEmail,
      subject: `Comanda noua: #${doc.orderNumber || doc.id}`,
      html: ownerEmailHtml,
      replyTo: customerEmail || undefined,
    });

    console.log(`Order notification sent to ${businessEmail}`);

    // Email 2: To customer - confirmation
    if (customerEmail) {
      const clientEmailHtml = formatOrderConfirmationEmail({
        orderNumber: doc.orderNumber || doc.id,
        customerName,
        items: populatedItems,
        subtotal,
        shippingCost,
        total,
        shippingAddress: shippingAddressFormatted,
        businessName: businessInfo?.name ?? undefined,
        businessPhone: businessInfo?.phone ?? undefined,
        businessEmail: businessEmail ?? undefined,
      });

      await sendNotificationEmail(req.payload, {
        to: customerEmail,
        subject: `Comanda #${doc.orderNumber || doc.id} a fost plasata - ${businessInfo?.name || 'Magazin Online'}`,
        html: clientEmailHtml,
        replyTo: businessEmail || undefined,
      });

      console.log(`Order confirmation sent to client: ${customerEmail}`);
    }
  } catch (error) {
    console.error('Failed to send order notification:', error);
  }

  return doc;
};

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
    cartsCollectionOverride: ({
      defaultCollection,
    }: {
      defaultCollection: CollectionConfig;
    }) => ({
      ...defaultCollection,
      access: {
        ...defaultCollection.access,
        // Allow anyone to create and update carts (for guest checkout)
        create: () => true,
        update: () => true,
        // Allow reading carts - needed for checkout payment flow
        // The plugin's initiatePayment uses overrideAccess: false
        read: () => true,
        // Note: Don't allow delete - plugin uses purchasedAt to mark completed carts
      },
      hooks: {
        ...defaultCollection.hooks,
        // Ensure taxCategory is populated for each cart item's product
        // This is needed because the plugin might not fetch all custom product fields
        afterRead: [
          ...(defaultCollection.hooks?.afterRead || []),
          async ({ doc, req }) => {
            if (!doc?.items?.length) return doc;

            // Populate taxCategory for each product if not already present
            const populatedItems = await Promise.all(
              doc.items.map(async (item: { product?: string | { id: string; taxCategory?: string }; quantity?: number }) => {
                const product = item.product;
                // If product is populated but missing taxCategory, fetch it
                if (typeof product === 'object' && product && !product.taxCategory) {
                  try {
                    const fullProduct = await req.payload.findByID({
                      collection: 'products',
                      id: product.id,
                      select: { taxCategory: true },
                    });
                    return {
                      ...item,
                      product: { ...product, taxCategory: fullProduct?.taxCategory },
                    };
                  } catch {
                    return item;
                  }
                }
                return item;
              }),
            );

            return { ...doc, items: populatedItems };
          },
        ],
      },
    }),
  },
  currencies: {
    defaultCurrency: 'RON',
    supportedCurrencies: [
      // decimals: 0 because we store prices in lei (whole numbers), not bani
      { code: 'RON', symbol: 'lei', decimals: 0, label: 'Leu Romanesc' },
    ],
  },
  products: {
    // Following Payload ecommerce plugin best practices:
    // https://payloadcms.com/docs/ecommerce/overview
    // Pattern: spread defaultCollection.fields first, then add custom fields
    productsCollectionOverride: ({
      defaultCollection,
    }: {
      defaultCollection: CollectionConfig;
    }) => ({
      ...defaultCollection,
      admin: {
        ...defaultCollection.admin,
        group: 'Shop',
        useAsTitle: 'title',
        defaultColumns: [
          'title',
          'prices',
          'inventory',
          'category',
          'featured',
        ],
      },
      fields: [
        // Custom fields FIRST (before plugin defaults)
        { name: 'title', type: 'text', label: 'Nume Produs', required: true },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: true,
          unique: true,
          index: true,
        },
        {
          name: 'shortDescription',
          type: 'textarea',
          label: 'Descriere Scurtă',
          admin: { description: 'Afișată în lista de produse și pe card' },
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Descriere Detaliată',
          editor: lexicalEditor(),
        },
        {
          name: 'images',
          type: 'array',
          label: 'Imagini',
          minRows: 1,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'product-categories',
          label: 'Categorie',
        },
        { name: 'sku', type: 'text', label: 'Cod Produs (SKU)', index: true },
        // Plugin default fields - set priceInRONEnabled to default true
        ...(Array.isArray(defaultCollection.fields)
          ? defaultCollection.fields.filter(Boolean).map((field) => {
              if ('name' in field && field.name === 'priceInRONEnabled') {
                return { ...field, defaultValue: true } as typeof field
              }
              return field
            })
          : []),
        // TAX/VAT category for this product
        {
          name: 'taxCategory',
          type: 'select',
          label: 'Categorie TVA',
          defaultValue: 'standard',
          admin: {
            position: 'sidebar',
            description: 'Cota TVA aplicată acestui produs',
          },
          options: [
            { label: 'Standard (21%)', value: 'standard' },
            { label: 'Redusă (11%)', value: 'reduced' },
            { label: 'Scutit (0%)', value: 'zero' },
          ],
        },
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
            if (!id) return true;
            return { id: { not_equals: id } };
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
        {
          name: 'badge',
          type: 'text',
          label: 'Badge',
          admin: {
            position: 'sidebar',
            description: 'Text scurt afișat pe card (ex: -20%)',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Produs Recomandat',
          defaultValue: false,
          admin: { position: 'sidebar' },
        },
        {
          name: 'order',
          type: 'number',
          label: 'Ordine Afișare',
          defaultValue: 0,
          admin: { position: 'sidebar' },
        },
      ],
    }),
  },
  orders: {
    ordersCollectionOverride: ({
      defaultCollection,
    }: {
      defaultCollection: CollectionConfig;
    }) => ({
      ...defaultCollection,
      access: {
        ...defaultCollection.access,
        // Allow guest checkout - anyone can create orders
        create: () => true,
      },
      admin: {
        ...defaultCollection.admin,
        group: 'Shop',
        defaultColumns: ['customer', 'status', 'amount', 'createdAt'],
      },
      labels: {
        singular: 'Comanda',
        plural: 'Comenzi',
      },
      fields: [
        ...(Array.isArray(defaultCollection.fields)
          ? defaultCollection.fields
          : []),
        // Custom field for shipping cost
        {
          name: 'shippingCost',
          type: 'number',
          label: 'Cost Transport',
          admin: {
            position: 'sidebar',
            description: 'Costul transportului în RON',
          },
        },
      ],
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
};

export default buildConfig({
  // serverURL is intentionally omitted or empty to prevent URL duplication bug
  // in Payload 3.x when using formatAdminURL. The URL is determined at runtime
  // from NEXT_PUBLIC_SERVER_URL or the request origin.
  // See: https://github.com/payloadcms/payload/issues/12171
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
      graphics: {
        // Replace Payload logo with custom logo for white-label admin
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
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
      titleSuffix: ' | MultiWebsite Admin',
      description: 'Panou de administrare MultiWebsite',
      // Custom favicon și og:image pentru admin
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon.svg',
        },
      ],
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
  globals: [
    Header,
    Footer,
    SiteTheme,
    Logo,
    BusinessInfo,
    ShopSettings,
    SystemPages,
  ],
  plugins: [
    ...plugins,
    // Ecommerce plugin cu Orders email notifications
    ecommercePlugin(ecommerceConfig),
    // Nested docs plugin for hierarchical pages (e.g., /clase/yoga, /servicii/consultatie)
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: docs => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    // Cloudflare R2 Storage (via S3-compatible API)
    // Local: fara R2_BUCKET -> foloseste ./media folder
    // Productie: fiecare afacere are propriul R2 bucket pe Dokploy
    ...(process.env.R2_BUCKET
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
              },
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
  // IMPORTANT: Set RESEND_FROM_EMAIL and RESEND_FROM_NAME in .env for production
  email: resendAdapter({
    defaultFromAddress:
      process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    defaultFromName: process.env.RESEND_FROM_NAME || 'Business Website',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true;
        const authHeader = req.headers.get('authorization');
        return authHeader === `Bearer ${process.env.CRON_SECRET}`;
      },
    },
    tasks: [],
  },
});
