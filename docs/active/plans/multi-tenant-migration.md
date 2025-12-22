# Plan Migrare Multi-Tenant - Template-5

**Data**: 2025-12-22
**Status**: Planificat
**Bazat pe**: [Payload Multi-Tenant Plugin](https://payloadcms.com/docs/plugins/multi-tenant) + [Official Example](https://github.com/payloadcms/payload/tree/main/examples/multi-tenant)

---

## Cuprins

1. [Overview](#overview)
2. [Structura Monorepo](#structura-monorepo)
3. [Plugin Configuration](#plugin-configuration)
4. [Conversie Globals cu isGlobal](#conversie-globals-cu-isglobal)
5. [Migrare Seeders](#migrare-seeders)
6. [Frontend Routing](#frontend-routing)
7. [Integrare Ecommerce](#integrare-ecommerce)
8. [Timeline Implementare](#timeline-implementare)

---

## Overview

### Scopul Migrării

Transformarea sistemului Template-5 din single-tenant în multi-tenant pentru a permite:
- Un singur deployment să servească multiple business-uri
- Fiecare seeder (frizerie, dentist, salon, etc.) să creeze un nou tenant
- Izolare completă a datelor între tenants
- Admin panel cu tenant switching

### Abordarea Recomandată

**Monorepo cu pnpm workspaces + Turborepo**:
- Cod shared între single-tenant și multi-tenant
- Deployment-uri separate
- Testare independentă

---

## Structura Monorepo

```
template-5-monorepo/
├── package.json              # Root workspace config
├── pnpm-workspace.yaml       # Workspace definitions
├── turbo.json                # Turborepo pipeline
├── packages/
│   ├── shared/               # @template5/shared
│   │   ├── blocks/           # 41 content blocks
│   │   ├── components/       # UI components
│   │   ├── design-system/    # Themes, colors
│   │   ├── utilities/        # Helper functions
│   │   └── package.json
│   ├── payload-config/       # @template5/payload-config
│   │   ├── collections/      # Base collection configs
│   │   ├── globals/          # Global configs (single-tenant)
│   │   ├── fields/           # Shared field definitions
│   │   └── package.json
│   └── ecommerce/            # @template5/ecommerce
│       ├── collections/      # Products, Orders, Cart
│       ├── hooks/            # Payment hooks
│       └── package.json
├── apps/
│   ├── single-tenant/        # Current template-5
│   │   ├── src/
│   │   │   ├── payload.config.ts
│   │   │   └── app/
│   │   └── package.json
│   └── multi-tenant/         # New multi-tenant app
│       ├── src/
│       │   ├── payload.config.ts    # Cu MT plugin
│       │   ├── collections/
│       │   │   └── Tenants/         # Tenant collection
│       │   ├── access/              # MT access control
│       │   └── app/
│       │       └── (frontend)/
│       │           └── [tenant]/    # Dynamic tenant routing
│       └── package.json
└── tooling/
    ├── eslint-config/
    └── typescript-config/
```

### package.json Root

```json
{
  "name": "template-5-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "dev:single": "turbo dev --filter=single-tenant",
    "dev:multi": "turbo dev --filter=multi-tenant",
    "generate:types": "turbo generate:types"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tooling/*'
```

---

## Plugin Configuration

### Instalare

```bash
pnpm add @payloadcms/plugin-multi-tenant
```

### payload.config.ts (Multi-Tenant App)

```typescript
import { buildConfig } from 'payload'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { isSuperAdmin } from './access/isSuperAdmin'
import { getUserTenantIDs } from './utilities/getUserTenantIDs'

// Colecțiile care vor fi tenant-scoped
const TENANT_SCOPED_COLLECTIONS = [
  'pages',
  'posts',
  'media',
  'categories',
  'products',
  'orders',
  'cart',
  'transactions',
  'forms',
  'form-submissions',
  // Colecții convertite din globals (cu isGlobal: true)
  'site-settings',
  'business-info',
  'navigation',
  'social-links',
  'footer',
  'theme-settings',
  'seo-defaults',
]

export default buildConfig({
  // ... base config ...

  plugins: [
    // IMPORTANT: Multi-tenant PRIMUL
    multiTenantPlugin({
      // Colecții gestionate de plugin
      collections: Object.fromEntries(
        TENANT_SCOPED_COLLECTIONS.map(slug => [
          slug,
          slug.endsWith('-settings') ||
          slug === 'business-info' ||
          slug === 'navigation' ||
          slug === 'social-links' ||
          slug === 'footer' ||
          slug === 'seo-defaults'
            ? { isGlobal: true }  // One per tenant
            : {}                   // Multiple per tenant
        ])
      ),

      // Configurare tenant field
      tenantField: {
        access: {
          read: () => true,
          update: ({ req }) => {
            if (isSuperAdmin(req.user)) return true
            return getUserTenantIDs(req.user).length > 0
          },
        },
      },

      // Configurare users tenants array
      tenantsArrayField: {
        includeDefaultField: false,
        arrayFieldAccess: {
          read: ({ req }) => isSuperAdmin(req.user) || !!req.user,
          update: ({ req }) => isSuperAdmin(req.user),
        },
        tenantFieldAccess: {
          read: () => true,
          update: ({ req }) => isSuperAdmin(req.user),
        },
      },

      // Super admin bypass
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),

    // Apoi ecommerce plugin
    // ecommercePlugin({ ... }),
  ],
})
```

### Utilities Necesare

```typescript
// src/access/isSuperAdmin.ts
import type { User } from '@/payload-types'

export const isSuperAdmin = (user: User | null): boolean => {
  return user?.roles?.includes('super-admin') ?? false
}

// src/utilities/getUserTenantIDs.ts
import type { Tenant, User } from '@/payload-types'

export const getUserTenantIDs = (
  user: User | null,
  role?: 'tenant-admin' | 'tenant-user'
): string[] => {
  if (!user?.tenants) return []

  return user.tenants
    .filter(t => !role || t.roles?.includes(role))
    .map(t => typeof t.tenant === 'string' ? t.tenant : t.tenant.id)
    .filter(Boolean)
}

// src/utilities/extractID.ts
export const extractID = <T extends { id: string }>(
  doc: T | string
): string => {
  return typeof doc === 'string' ? doc : doc.id
}
```

---

## Conversie Globals cu isGlobal

### Pattern Official

Folosind `isGlobal: true` în configurația plugin-ului, o colecție devine "one document per tenant" - echivalentul unui global dar tenant-scoped.

### Globals de Convertit

| Global Actual | Colecție Nouă | isGlobal |
|--------------|---------------|----------|
| SiteSettings | site-settings | true |
| BusinessInfo | business-info | true |
| Navigation | navigation | true |
| SocialLinks | social-links | true |
| Footer | footer | true |
| ThemeSettings | theme-settings | true |
| SeoDefaults | seo-defaults | true |

### Exemplu Conversie: SiteSettings

**Înainte (Global)**:
```typescript
// src/globals/SiteSettings.ts
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true },
  fields: [
    { name: 'siteName', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    // ...
  ],
}
```

**După (Collection cu isGlobal)**:
```typescript
// src/collections/SiteSettings.ts
export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',
  admin: {
    useAsTitle: 'siteName',
    // Ascunde din sidebar - accesibil via tenant
    hidden: true,
  },
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: tenantAdminAccess,
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    { name: 'siteName', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    // ... same fields
  ],
}
```

### Utility pentru Acces Global-like

```typescript
// src/utilities/getTenantGlobal.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getTenantGlobal<T>(
  collectionSlug: string,
  tenantId: string
): Promise<T | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: collectionSlug,
    where: {
      tenant: { equals: tenantId }
    },
    limit: 1,
  })

  return result.docs[0] as T || null
}

// Folosire
const siteSettings = await getTenantGlobal<SiteSettings>(
  'site-settings',
  tenantId
)
```

---

## Migrare Seeders

### Structura Seeder Multi-Tenant

```typescript
// src/seed/seedTenant.ts
interface TenantSeedConfig {
  name: string           // "Frizerie Elegance"
  slug: string           // "frizerie-elegance"
  domain?: string        // "frizerie-elegance.ro"
  businessType: string   // "frizerie"
  adminEmail: string     // Admin pentru acest tenant
  data: BusinessData     // Date specifice business-ului
}

export async function seedTenant(config: TenantSeedConfig) {
  const payload = await getPayload({ config: configPromise })

  // 1. Creează tenant
  const tenant = await payload.create({
    collection: 'tenants',
    data: {
      name: config.name,
      slug: config.slug,
      domains: config.domain ? [{ domain: config.domain }] : [],
    },
  })

  // 2. Creează admin user pentru tenant
  const adminUser = await payload.create({
    collection: 'users',
    data: {
      email: config.adminEmail,
      password: 'changeme123',
      tenants: [{
        tenant: tenant.id,
        roles: ['tenant-admin'],
      }],
    },
  })

  // 3. Seed "globals" pentru tenant
  await seedTenantGlobals(payload, tenant.id, config.data)

  // 4. Seed pages
  await seedTenantPages(payload, tenant.id, config.data)

  // 5. Seed media
  await seedTenantMedia(payload, tenant.id, config.data)

  // 6. Seed produse (dacă ecommerce)
  if (config.data.products) {
    await seedTenantProducts(payload, tenant.id, config.data.products)
  }

  return { tenant, adminUser }
}

async function seedTenantGlobals(
  payload: Payload,
  tenantId: string,
  data: BusinessData
) {
  // Site Settings
  await payload.create({
    collection: 'site-settings',
    data: {
      tenant: tenantId,
      siteName: data.siteName,
      logo: data.logoId,
      // ...
    },
  })

  // Business Info
  await payload.create({
    collection: 'business-info',
    data: {
      tenant: tenantId,
      businessName: data.businessName,
      address: data.address,
      phone: data.phone,
      email: data.email,
      schedule: data.schedule,
    },
  })

  // Navigation, Footer, etc...
}
```

### Script Seed Master

```typescript
// src/seed/index.ts
import { seedTenant } from './seedTenant'
import { frizerieData } from './businesses/frizerie'
import { dentistData } from './businesses/dentist'
import { salonData } from './businesses/salon'
// ... alte business-uri

const BUSINESSES = {
  frizerie: frizerieData,
  dentist: dentistData,
  salon: salonData,
  magazin: magazinData,
  restaurant: restaurantData,
  avocat: avocatData,
  fitness: fitnessData,
  constructii: constructiiData,
  'auto-service': autoServiceData,
  'terapii-energetice': terapiiData,
  plasturi: plasturiData,
}

async function seedAll() {
  for (const [type, data] of Object.entries(BUSINESSES)) {
    console.log(`Seeding tenant: ${type}`)
    await seedTenant({
      name: data.businessName,
      slug: type,
      businessType: type,
      adminEmail: `admin@${type}.local`,
      data,
    })
  }
}

// Sau seed individual
async function seedSingle(businessType: string) {
  const data = BUSINESSES[businessType]
  if (!data) throw new Error(`Unknown business type: ${businessType}`)

  await seedTenant({
    name: data.businessName,
    slug: businessType,
    businessType,
    adminEmail: `admin@${businessType}.local`,
    data,
  })
}
```

---

## Frontend Routing

### Structura App Router

```
src/app/
├── (payload)/              # Admin routes (unchanged)
│   └── admin/
├── (frontend)/             # Public routes
│   ├── [tenant]/           # Dynamic tenant segment
│   │   ├── layout.tsx      # Tenant-aware layout
│   │   ├── page.tsx        # Homepage
│   │   ├── [slug]/         # Dynamic pages
│   │   │   └── page.tsx
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   └── shop/           # Ecommerce routes
│   │       ├── page.tsx
│   │       ├── [slug]/
│   │       ├── cart/
│   │       └── checkout/
│   └── api/                # API routes
│       └── [tenant]/
```

### Tenant Layout

```typescript
// src/app/(frontend)/[tenant]/layout.tsx
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TenantProvider } from '@/providers/TenantProvider'

interface Props {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}

export default async function TenantLayout({ children, params }: Props) {
  const { tenant: tenantSlug } = await params
  const payload = await getPayload({ config: configPromise })

  // Găsește tenant după slug
  const tenantQuery = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: tenantSlug } },
    limit: 1,
  })

  const tenant = tenantQuery.docs[0]
  if (!tenant) notFound()

  // Încarcă "globals" pentru tenant
  const [siteSettings, businessInfo, navigation, footer] = await Promise.all([
    getTenantGlobal('site-settings', tenant.id),
    getTenantGlobal('business-info', tenant.id),
    getTenantGlobal('navigation', tenant.id),
    getTenantGlobal('footer', tenant.id),
  ])

  return (
    <TenantProvider
      tenant={tenant}
      siteSettings={siteSettings}
      businessInfo={businessInfo}
    >
      <Header navigation={navigation} />
      <main>{children}</main>
      <Footer footer={footer} />
    </TenantProvider>
  )
}
```

### Dynamic Page

```typescript
// src/app/(frontend)/[tenant]/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/blocks/RenderBlocks'

interface Props {
  params: Promise<{ tenant: string; slug: string }>
}

export default async function Page({ params }: Props) {
  const { tenant: tenantSlug, slug } = await params
  const payload = await getPayload({ config: configPromise })

  // Găsește tenant
  const tenantQuery = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: tenantSlug } },
    limit: 1,
  })
  const tenant = tenantQuery.docs[0]
  if (!tenant) notFound()

  // Găsește pagina pentru acest tenant
  const pageQuery = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { tenant: { equals: tenant.id } },
        { slug: { equals: slug } },
      ],
    },
    limit: 1,
  })

  const page = pageQuery.docs[0]
  if (!page) notFound()

  return <RenderBlocks blocks={page.layout} />
}

// Generate static params pentru toate paginile
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
    depth: 1,
  })

  return pages.docs.map(page => ({
    tenant: typeof page.tenant === 'string'
      ? page.tenant
      : page.tenant.slug,
    slug: page.slug,
  }))
}
```

### Domain-Based Tenant Resolution (Opțional)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Skip admin și API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Detectează tenant din domain
  // frizerie-elegance.ro -> tenant: frizerie
  // dentist-premium.ro -> tenant: dentist
  const tenantSlug = getTenantFromDomain(hostname)

  if (tenantSlug && !pathname.startsWith(`/${tenantSlug}`)) {
    // Rewrite către path-ul cu tenant
    return NextResponse.rewrite(
      new URL(`/${tenantSlug}${pathname}`, request.url)
    )
  }

  return NextResponse.next()
}

function getTenantFromDomain(hostname: string): string | null {
  // Mapping domain -> tenant slug
  const domainMap: Record<string, string> = {
    'frizerie-elegance.ro': 'frizerie',
    'dentist-premium.ro': 'dentist',
    'localhost:3000': 'frizerie', // Default pentru dev
  }

  return domainMap[hostname] || null
}
```

---

## Integrare Ecommerce

### Ordinea Plugin-urilor

```typescript
plugins: [
  // 1. Multi-tenant PRIMUL
  multiTenantPlugin({
    collections: {
      pages: {},
      products: {},
      orders: {},
      cart: {},
      transactions: {},
      // ...
    },
    // ...
  }),

  // 2. Ecommerce DUPĂ
  ecommercePlugin({
    // Configurație existentă
  }),
]
```

### Cart Tenant-Aware

```typescript
// src/collections/Cart.ts
export const Cart: CollectionConfig = {
  slug: 'cart',
  access: {
    read: ({ req }) => {
      if (!req.user) {
        // Guest cart - bazat pe session
        return {
          sessionId: { equals: req.headers.get('x-session-id') },
        }
      }
      return {
        user: { equals: req.user.id },
      }
    },
    // ... alte access rules
  },
  fields: [
    // Tenant field adăugat automat de plugin
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          filterOptions: ({ siblingData, data }) => {
            // Filtrează produse doar din același tenant
            return {
              tenant: { equals: data?.tenant },
            }
          },
        },
        { name: 'quantity', type: 'number', min: 1 },
      ],
    },
    // ...
  ],
}
```

### Guest Checkout cu Tenant Detection

```typescript
// src/app/(frontend)/[tenant]/shop/checkout/page.tsx
export default async function CheckoutPage({ params }: Props) {
  const { tenant: tenantSlug } = await params

  // Tenant-ul e deja cunoscut din URL
  // Guest poate finaliza comanda fără autentificare

  return (
    <CheckoutForm
      tenantSlug={tenantSlug}
      // Session ID pentru guest cart
      sessionId={cookies().get('session-id')?.value}
    />
  )
}
```

### Email Hooks Tenant-Aware

```typescript
// src/collections/Orders/hooks/afterChange.ts
export const sendOrderConfirmation: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create') return doc

  // Obține business info pentru tenant
  const businessInfo = await getTenantGlobal(
    'business-info',
    doc.tenant
  )

  // Trimite email cu branding-ul tenant-ului
  await sendEmail({
    to: doc.customerEmail,
    subject: `Comandă confirmată - ${businessInfo.businessName}`,
    template: 'order-confirmation',
    data: {
      order: doc,
      businessName: businessInfo.businessName,
      businessEmail: businessInfo.email,
      businessPhone: businessInfo.phone,
    },
  })

  return doc
}
```

---

## Timeline Implementare

### Faza 1: Setup Monorepo (2-3 zile)
- [ ] Creare structură monorepo
- [ ] Configurare pnpm workspaces
- [ ] Configurare Turborepo
- [ ] Extragere packages shared

### Faza 2: Multi-Tenant Core (3-4 zile)
- [ ] Instalare plugin multi-tenant
- [ ] Configurare access control
- [ ] Creare Tenants collection
- [ ] Implementare utilities (isSuperAdmin, getUserTenantIDs)

### Faza 3: Conversie Globals (2-3 zile)
- [ ] Convertire SiteSettings -> collection cu isGlobal
- [ ] Convertire BusinessInfo -> collection cu isGlobal
- [ ] Convertire Navigation -> collection cu isGlobal
- [ ] Convertire Footer -> collection cu isGlobal
- [ ] Convertire ThemeSettings -> collection cu isGlobal
- [ ] Convertire SeoDefaults -> collection cu isGlobal
- [ ] Implementare getTenantGlobal utility

### Faza 4: Migrare Seeders (3-4 zile)
- [ ] Creare seedTenant function
- [ ] Adaptare date frizerie pentru MT
- [ ] Adaptare date dentist pentru MT
- [ ] Adaptare date salon pentru MT
- [ ] Adaptare celelalte business-uri
- [ ] Script seed:all

### Faza 5: Frontend Routing (2-3 zile)
- [ ] Implementare [tenant] layout
- [ ] Implementare [tenant]/[slug] page
- [ ] TenantProvider context
- [ ] Middleware pentru domain resolution

### Faza 6: Ecommerce Integration (2-3 zile)
- [ ] Cart tenant-aware
- [ ] Orders tenant-aware
- [ ] Guest checkout cu tenant detection
- [ ] Email hooks cu tenant branding

### Faza 7: Testing & Polish (2-3 zile)
- [ ] E2E tests pentru multi-tenant
- [ ] Test izolare date între tenants
- [ ] Test admin panel cu tenant switching
- [ ] Performance testing

**Total estimat: 15-20 zile**

---

## Known Issues & Workarounds

### Issue #13660: Forms Plugin cu Multi-Tenant
După v3.54.0, plugin-ul forms poate avea probleme.
**Workaround**: Include `forms` și `form-submissions` în configurația MT plugin.

### Issue #11240: Versions cu Tenant
Versioning-ul poate avea probleme cu tenant assignments.
**Workaround**: Dezactivează versions pentru colecțiile MT sau testează cu atenție.

### Best Practices
1. **Versiuni identice** - Toate packagele Payload la aceeași versiune
2. **Plugin order** - Multi-tenant ÎNTOTDEAUNA primul
3. **Test izolare** - Verifică că un tenant nu poate accesa datele altui tenant
4. **Super admin** - Un singur rol pentru management cross-tenant

---

## Resurse

- [Payload Multi-Tenant Docs](https://payloadcms.com/docs/plugins/multi-tenant)
- [Official Multi-Tenant Example](https://github.com/payloadcms/payload/tree/main/examples/multi-tenant)
- [GitHub Issues - Multi-Tenant](https://github.com/payloadcms/payload/issues?q=multi-tenant)

---

## Fișiere Referință din Official Example

Descărcate în: `/home/evr/Desktop/website-templates/multitenant-official-example/`

Key files:
- `src/payload.config.ts` - Plugin configuration
- `src/utilities/getUserTenantIDs.ts` - Extract tenant IDs
- `src/access/isSuperAdmin.ts` - Super admin check
- `src/collections/Tenants/` - Tenants collection
- `src/app/(app)/tenant-slugs/[tenant]/` - Frontend routing
