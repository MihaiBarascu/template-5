# eCommerce Implementation - Template 5

## Overview

Template 5 implementeaza functionalitate eCommerce completa folosind `@payloadcms/plugin-ecommerce` cu suport pentru:
- Cataloage de produse cu categorii
- Cos de cumparaturi (localStorage)
- Checkout cu formulare de livrare
- Comenzi cu notificari email
- Design variants pentru business "magazin"

## Arhitectura

### Stack Tehnic
- **Payload CMS 3.64.0** - Headless CMS
- **Next.js 15** - App Router
- **@payloadcms/plugin-ecommerce** - Plugin oficial pentru eCommerce
- **Resend** - Email notifications
- **MongoDB** - Database

### Structura Fisiere

```
src/
├── payload.config.ts          # Configurare plugin eCommerce
├── app/
│   └── (payload)/
│       └── api/
│           └── orders/
│               └── route.ts   # API custom pentru comenzi
├── blocks/
│   ├── Products/
│   │   ├── config.ts          # Configurare block produse
│   │   └── Component.tsx      # Componenta afisare produse
│   ├── Cart/
│   │   ├── config.ts          # Configurare block cos
│   │   └── Component.tsx      # Componenta cos cumparaturi
│   └── Checkout/
│       ├── config.ts          # Configurare block checkout
│       └── Component.tsx      # Formular checkout complet
├── seed/
│   ├── businesses/
│   │   └── magazin.ts         # Seeder pentru business magazin
│   ├── seed-data.ts           # Date produse, categorii
│   ├── design-variants.ts     # 5 variante design magazin
│   └── helpers.ts             # seedProducts, seedProductCategories
└── collections/
    └── ProductCategories.ts   # Colectie categorii produse
```

## Plugin eCommerce Configuration

### payload.config.ts

```typescript
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'

ecommercePlugin({
  // Access control
  access: {
    adminOnly: ({ req }) => req.user?.role === 'admin',
    adminOnlyFieldAccess: ({ req }) => req.user?.role === 'admin',
    adminOrCustomerOwner: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { customer: { equals: req.user?.id } }
    },
    adminOrPublishedStatus: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { _status: { equals: 'published' } }
    },
    customerOnlyFieldAccess: ({ req }) => Boolean(req.user),
  },

  // Customer collection
  customers: { slug: 'users' },

  // Currency (RON pentru Romania)
  currencies: {
    defaultCurrency: 'RON',
    supportedCurrencies: [
      { code: 'RON', symbol: 'lei', decimals: 2, label: 'Leu Romanesc' },
    ],
  },

  // Products collection override - custom fields
  products: {
    productsCollectionOverride: ({ defaultCollection }) => ({
      ...defaultCollection,
      admin: { group: 'Shop', useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', unique: true, index: true },
        { name: 'description', type: 'richText' },
        { name: 'images', type: 'array', fields: [...] },
        { name: 'category', type: 'relationship', relationTo: 'product-categories' },
        { name: 'price', type: 'number', required: true },      // Pret simplu
        { name: 'salePrice', type: 'number' },                   // Pret redus
        ...defaultCollection.fields,                             // Plugin fields
        { name: 'badge', type: 'text' },
        { name: 'featured', type: 'checkbox' },
      ],
    }),
  },

  // Orders collection override - email hooks
  orders: {
    ordersCollectionOverride: ({ defaultCollection }) => ({
      ...defaultCollection,
      admin: { group: 'Shop' },
      hooks: {
        afterChange: [
          ...defaultCollection.hooks?.afterChange || [],
          orderEmailHook,  // Custom hook pentru email
        ],
      },
    }),
  },
})
```

## Custom Orders API

Pluginul eCommerce are access control restrictiv pe colectia `orders`. Pentru a permite comenzi de la clienti neautentificati, am creat un API custom:

### src/app/(payload)/api/orders/route.ts

```typescript
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const body = await request.json()

  // Validate required fields
  const { customerName, customerEmail, items, total } = body
  if (!customerName || !customerEmail || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const orderData = {
    orderNumber: `ORD-${Date.now()}-${randomId}`,
    customerEmail,
    notes: `Client: ${customerName}\nEmail: ${customerEmail}\n...`,
    items: items.map(item => ({
      product: item.product,
      quantity: item.quantity,
      priceAtPurchase: item.price,
    })),
    totals: { subtotal, shipping, total },
    status: 'processing',  // IMPORTANT: 'processing', nu 'pending'
  }

  // overrideAccess: true - operatie de sistem trusted
  const order = await payload.create({
    collection: 'orders',
    data: orderData,
    overrideAccess: true,
  })

  return NextResponse.json({ success: true, orderNumber, orderId: order.id })
}
```

### Order Status Values

Plugin-ul eCommerce accepta urmatoarele valori pentru status:
- `processing` - Comanda in procesare (default pentru comenzi noi)
- `completed` - Comanda finalizata
- `cancelled` - Comanda anulata
- `refunded` - Comanda returnata

**ATENTIE**: Nu folositi `pending` - aceasta valoare NU exista in schema plugin-ului!

## Frontend Components

### Products Block

Afiseaza produse cu:
- Grid layout (3/4 coloane)
- Imagini, titlu, categorie
- Pret normal si pret redus
- Badge-uri (Reducere, Nou, etc.)
- Buton "Adauga in cos"

```typescript
const handleAddToCart = (product: Product) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  // Add/update item
  cart.push({
    id: product.id,
    title: product.title,
    price: product.salePrice || product.price,
    image: getImageUrl(product),
    quantity: 1,
  })
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent('cartUpdated'))
}
```

### Cart Block

- Afiseaza produse din localStorage
- Selector cantitate (+/-)
- Remove item
- Subtotal, transport (gratuit peste 200 lei)
- Link catre checkout

### Checkout Block

Formular complet cu:
- Informatii contact (nume, email, telefon)
- Adresa livrare (adresa, oras, judet, cod postal)
- Metoda livrare (standard gratuit / express 35 lei)
- Metoda plata (card / ramburs)
- Sumar comanda
- Submit catre `/api/orders`

## Email Notifications

### Order Email Hook

```typescript
const orderEmailHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  const businessEmail = await getBusinessEmail(req.payload)

  // 1. Email catre proprietar
  await sendNotificationEmail(req.payload, {
    to: businessEmail,
    subject: `Comanda noua: #${doc.orderNumber}`,
    html: formatOrderEmail({ orderNumber, customerName, items, total })
  })

  // 2. Email confirmare catre client
  await sendNotificationEmail(req.payload, {
    to: customerEmail,
    subject: `Comanda #${doc.orderNumber} plasata`,
    html: formatOrderConfirmationEmail({ ... })
  })
}
```

## Seeding

### Business Type: magazin

```bash
pnpm seed:magazin
```

Creeaza:
- 5 categorii produse (Cosmetice, Alimentatie Bio, Suplimente, etc.)
- 12 produse cu preturi, badge-uri, featured
- Pagini: Homepage, Produse, Categorii, Despre, Cos, Checkout, Contact
- 5 design variants (Green Eco, Orange Vibrant, Purple Premium, etc.)

### seed-data.ts

```typescript
export const magazinData = {
  productCategories: [
    { title: 'Cosmetice Naturale', order: 1 },
    { title: 'Alimentatie Bio', order: 2 },
    // ...
  ],
  products: [
    {
      title: 'Crema Hidratanta cu Aloe Vera',
      price: 89,
      salePrice: 69,
      badge: 'Reducere',
      featured: true,
      category: 'Cosmetice Naturale',
    },
    // ...
  ],
}
```

## Best Practices (Payload CMS)

### 1. Access Control

```typescript
// Pentru operatii de sistem (seeding, API custom)
await payload.create({
  collection: 'orders',
  data: orderData,
  overrideAccess: true,  // Bypass access control
})

// Pentru operatii pe behalf of user
await payload.create({
  collection: 'orders',
  data: orderData,
  user: someUser,
  overrideAccess: false,  // Enforce access control
})
```

### 2. Transaction Safety in Hooks

```typescript
// CORECT - same transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        req,  // IMPORTANT: pass req for transaction
      })
    },
  ]
}
```

### 3. Context pentru Hook Loops

```typescript
hooks: {
  afterChange: [
    async ({ doc, req, context }) => {
      if (context.skipHooks) return  // Prevent infinite loops

      await req.payload.update({
        collection: 'products',
        id: doc.id,
        data: { views: doc.views + 1 },
        context: { skipHooks: true },
        req,
      })
    },
  ]
}
```

## Testing

### Playwright Flow Test

1. Navigheaza la homepage
2. Click "Adauga in cos" pe produs
3. Navigheaza la /cos
4. Verifica subtotal, transport
5. Click "Finalizeaza Comanda"
6. Completeaza formularul checkout
7. Click "Plaseaza Comanda"
8. Verifica mesaj succes

### API Test

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Ion Popescu",
    "customerEmail": "test@example.com",
    "items": [{"product": "123", "quantity": 1, "price": 69}],
    "total": 69
  }'
```

## Troubleshooting

### Eroare: "ValidationError: Status field invalid"
- Foloseste `status: 'processing'` nu `status: 'pending'`
- Valori valide: processing, completed, cancelled, refunded

### Eroare: 403 Forbidden pe /api/orders
- Plugin-ul are access control restrictiv
- Foloseste API custom cu `overrideAccess: true`

### Produse fara preturi (NaN)
- Asigura-te ca ai adaugat `price` si `salePrice` in productsCollectionOverride
- Re-sedeaza dupa modificarea config-ului

## Resurse

- [Payload eCommerce Plugin](https://payloadcms.com/docs/plugins/ecommerce)
- [Payload Access Control](https://payloadcms.com/docs/access-control)
- [Payload Hooks](https://payloadcms.com/docs/hooks)
- Template 3 - Referinta pentru Stripe integration
