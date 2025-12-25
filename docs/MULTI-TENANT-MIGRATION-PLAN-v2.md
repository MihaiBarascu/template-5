# Plan Migrare Multi-Tenant v2.0

**Data**: 2025-12-23
**Status**: PLANIFICAT
**Estimare Revizuită**: 18-22 zile de lucru
**Bazat pe**: Documentație oficială + Exemplu oficial + Discuții comunitate

---

## Cuprins

1. [Probleme Critice de Evitat](#1-probleme-critice-de-evitat)
2. [Decizii Arhitecturale](#2-decizii-arhitecturale)
3. [Faze de Implementare (Revizuite)](#3-faze-de-implementare)
4. [Patterns din Exemplul Oficial](#4-patterns-din-exemplul-oficial)
5. [Teste Specifice Multi-Tenant](#5-teste-specifice-multi-tenant)
6. [Resurse și Monitorizare](#6-resurse-și-monitorizare)

---

## 1. Probleme Critice de Evitat

### 🔴 BLOCKER: Versions + Multi-Tenant Conflict

**Issue**: [#11071](https://github.com/payloadcms/payload/issues/11071), [#11240](https://github.com/payloadcms/payload/issues/11240)

**Problemă**: Eroare `"Cannot find field for path at tenant"` când folosești `versions: true` cu multi-tenant.

**Acțiune OBLIGATORIE**:
```typescript
// ⚠️ DEZACTIVEAZĂ versions pe TOATE colecțiile înainte de migrare
export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: false,  // Temporar dezactivat
  // versions: { drafts: true }, // RE-ACTIVEAZĂ după fix oficial
}
```

**Colecții afectate în template-5**:
- `pages` - are versions
- `posts` - are versions

---

### 🟠 Folders Plugin Incompatibil

**Issue**: [#13518](https://github.com/payloadcms/payload/issues/13518)

**Problemă**: Plugin-ul folders nu e scoped automat per tenant.

**Soluție**: Nu folosim folders sau implementăm manual tenant field.

---

### 🟠 Admin UI Access Bug

**Issue**: [#13589](https://github.com/payloadcms/payload/issues/13589)

**Problemă**: `userHasAccessToAllTenants` nu e respectat în Admin UI (API funcționează corect).

**Workaround**: Super-admin trebuie să de-selecteze manual filtrul de tenant din dropdown.

---

### 🟠 Relationship Fields Nu Auto-Filtrează

**Issue**: [#10983](https://github.com/payloadcms/payload/issues/10983)

**Problemă**: Dropdowns de relationship arată documente din TOȚI tenants.

**Soluție OBLIGATORIE**:
```typescript
{
  name: 'author',
  type: 'relationship',
  relationTo: 'team',
  // IMPORTANT: Filtrează manual după tenant
  filterOptions: ({ data }) => ({
    tenant: { equals: data?.tenant }
  }),
}
```

---

## 2. Decizii Arhitecturale

### DA-001: Globals → Collections cu isGlobal

**OBLIGATORIU**: Plugin-ul multi-tenant NU suportă globals native.

| Global Actual | → Collection Nouă | isGlobal |
|---------------|-------------------|----------|
| SiteTheme | `site-theme` | `true` |
| BusinessInfo | `business-info` | `true` |
| Header | `header` | `true` |
| Footer | `footer` | `true` |
| Logo | `logo` | `true` |
| ShopSettings | `shop-settings` | `true` |
| SystemPages | `system-pages` | `true` |

**Configurare Plugin**:
```typescript
multiTenantPlugin({
  collections: {
    // Globals convertite
    'site-theme': { isGlobal: true },
    'business-info': { isGlobal: true },
    'header': { isGlobal: true },
    'footer': { isGlobal: true },
    'logo': { isGlobal: true },
    'shop-settings': { isGlobal: true },
    'system-pages': { isGlobal: true },

    // Collections normale
    'pages': {},
    'posts': {},
    'services': {},
    'team': {},
    'media': {},
    // ... toate celelalte
  },
})
```

---

### DA-002: Media Upload Isolation

**Pattern din comunitate** ([Discussion #11967](https://github.com/payloadcms/payload/discussions/11967)):

```typescript
// src/collections/Media.ts
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    // Prefix dinamic per tenant
    adminThumbnail: 'thumbnail',
  },
  fields: [
    // Field ascuns pentru prefix
    {
      name: 'tenantPrefix',
      type: 'text',
      admin: { hidden: true },
    },
  ],
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create') {
          const tenantId = getTenantFromCookie(args.req.headers, 'text')
          if (tenantId && args.data) {
            args.data.tenantPrefix = `tenant-${tenantId}`
          }
        }
        return args
      },
    ],
  },
}
```

**⚠️ Bug cunoscut**: Filename uniqueness check nu respectă prefix ([#14561](https://github.com/payloadcms/payload/issues/14561)).

**Workaround**: Generează filename unic cu timestamp:
```typescript
beforeChange: [
  ({ data }) => {
    if (data.filename) {
      const ext = data.filename.split('.').pop()
      data.filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    }
    return data
  }
]
```

---

### DA-003: Access Control Patterns (din Exemplul Oficial)

**isSuperAdmin** (exact din exemplu):
```typescript
// src/access/isSuperAdmin.ts
import type { User } from '@/payload-types'

export const isSuperAdmin = (user: User | null): boolean => {
  return Boolean(user?.roles?.includes('super-admin'))
}

export const isSuperAdminAccess: Access = ({ req }) => {
  return isSuperAdmin(req.user)
}
```

**getUserTenantIDs** (exact din exemplu):
```typescript
// src/utilities/getUserTenantIDs.ts
import type { Tenant, User } from '@/payload-types'

export const getUserTenantIDs = (
  user: User | null,
  role?: 'tenant-admin' | 'tenant-viewer',
): string[] => {
  if (!user?.tenants) return []

  return user.tenants
    .filter(t => !role || t.roles?.includes(role))
    .map(t => typeof t.tenant === 'string' ? t.tenant : t.tenant.id)
    .filter(Boolean)
}
```

**superAdminOrTenantAdmin** (din exemplu oficial):
```typescript
// src/access/superAdminOrTenantAdmin.ts
export const superAdminOrTenantAdminAccess: Access = ({ req }) => {
  if (!req.user) return false
  if (isSuperAdmin(req.user)) return true

  const adminTenantIDs = getUserTenantIDs(req.user, 'tenant-admin')
  const requestedTenant = req?.data?.tenant

  if (requestedTenant && adminTenantIDs.includes(requestedTenant)) {
    return true
  }

  return false
}
```

**Read Access cu Cookie** (pattern avansat din exemplu):
```typescript
// src/collections/Users/access/read.ts
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'

export const readAccess: Access = ({ req, id }) => {
  if (!req?.user) return false

  // Self access
  if (id === req.user.id) return true

  const superAdmin = isSuperAdmin(req.user)
  const selectedTenant = getTenantFromCookie(req.headers, 'text')
  const adminTenantIDs = getUserTenantIDs(req.user, 'tenant-admin')

  // Dacă e selectat un tenant în cookie
  if (selectedTenant) {
    const hasTenantAccess = adminTenantIDs.includes(selectedTenant)
    if (superAdmin || hasTenantAccess) {
      return {
        'tenants.tenant': { equals: selectedTenant }
      }
    }
  }

  if (superAdmin) return true

  // Fallback: vezi doar userii din tenants unde ești admin
  return {
    or: [
      { id: { equals: req.user.id } },
      { 'tenants.tenant': { in: adminTenantIDs } },
    ],
  }
}
```

---

### DA-004: Tenants Collection (din Exemplu Oficial)

```typescript
// src/collections/Tenants/index.ts
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: isSuperAdminAccess,
    read: ({ req }) => Boolean(req.user),  // Oricine logat
    update: updateAndDeleteAccess,
    delete: updateAndDeleteAccess,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Folosit în URL: /tenant-slug/page-slug',
      },
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Pentru domain-based routing (ex: frizerie.multiwebsite.org)',
      },
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      defaultValue: true,  // Pentru site-uri publice
      admin: {
        description: 'Dacă e bifat, paginile sunt publice fără login.',
        position: 'sidebar',
      },
    },
    // Câmpuri adiționale pentru business
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Activ', value: 'active' },
        { label: 'Trial', value: 'trial' },
        { label: 'Suspendat', value: 'suspended' },
      ],
      defaultValue: 'trial',
      admin: { position: 'sidebar' },
    },
    {
      name: 'plan',
      type: 'select',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Pro', value: 'pro' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
      defaultValue: 'basic',
      admin: { position: 'sidebar' },
    },
  ],
}
```

---

### DA-005: Users Collection cu Tenants Array

```typescript
// src/collections/Users/index.ts
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'

const tenantsField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  arrayFieldAccess: {},
  tenantFieldAccess: {},
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['tenant-viewer'],
      options: [
        { label: 'Admin', value: 'tenant-admin' },
        { label: 'Viewer', value: 'tenant-viewer' },
      ],
      required: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
  ],
})

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: createAccess,
    read: readAccess,
    update: updateAndDeleteAccess,
    delete: updateAndDeleteAccess,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'User', value: 'user' },
      ],
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: { position: 'sidebar' },
    },
    {
      ...tenantsField,
      admin: {
        ...tenantsField.admin,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterLogin: [setCookieBasedOnDomain],
  },
}
```

---

### DA-006: Domain-Based Cookie (din Exemplu)

```typescript
// src/collections/Users/hooks/setCookieBasedOnDomain.ts
import type { CollectionAfterLoginHook } from 'payload'
import { mergeHeaders, generateCookie, getCookieExpiration } from 'payload'

export const setCookieBasedOnDomain: CollectionAfterLoginHook = async ({ req, user }) => {
  const host = req.headers.get('host')

  // Găsește tenant după domain
  const tenantQuery = await req.payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 1,
    where: {
      domain: { equals: host },
    },
  })

  if (tenantQuery.docs.length > 0) {
    const tenantCookie = generateCookie({
      name: 'payload-tenant',
      expires: getCookieExpiration({ seconds: 7200 }),
      path: '/',
      returnCookieAsObject: false,
      value: String(tenantQuery.docs[0].id),
    })

    const newHeaders = new Headers({
      'Set-Cookie': tenantCookie as string,
    })

    req.responseHeaders = req.responseHeaders
      ? mergeHeaders(req.responseHeaders, newHeaders)
      : newHeaders
  }

  return user
}
```

---

## 3. Faze de Implementare (Revizuite)

### FAZA 0: Pre-Migrare și Pregătire (1-2 zile)

**Obiectiv**: Pregătire codebase pentru multi-tenant

- [ ] Audit colecții cu `versions: true` → dezactivează temporar
- [ ] Backup complet database
- [ ] Creare branch: `git checkout -b feature/multi-tenant`
- [ ] Instalare plugin: `pnpm add @payloadcms/plugin-multi-tenant`
- [ ] Verificare compatibilitate versiune Payload

**Fișiere de verificat**:
```bash
grep -r "versions:" src/collections/
grep -r "versions:" src/globals/
```

---

### FAZA 1: Conversie Globals → Collections (3-4 zile)

**Obiectiv**: Transformă toate globals în collections înainte de plugin

**1.1 Creare fișiere noi**:
```
src/collections/
├── SiteTheme.ts      (din src/globals/SiteTheme.ts)
├── BusinessInfo.ts   (din src/globals/BusinessInfo.ts)
├── Header.ts         (din src/globals/Header.ts)
├── Footer.ts         (din src/globals/Footer.ts)
├── Logo.ts           (din src/globals/Logo.ts)
├── ShopSettings.ts   (din src/globals/ShopSettings.ts)
└── SystemPages.ts    (din src/globals/SystemPages.ts)
```

**1.2 Pattern de conversie**:
```typescript
// ÎNAINTE: src/globals/SiteTheme.ts
import { GlobalConfig } from 'payload'

export const SiteTheme: GlobalConfig = {
  slug: 'site-theme',
  access: { read: () => true },
  fields: [/* ... */],
}

// DUPĂ: src/collections/SiteTheme.ts
import { CollectionConfig } from 'payload'

export const SiteTheme: CollectionConfig = {
  slug: 'site-theme',
  admin: {
    useAsTitle: 'id',
    hidden: true,  // Ascunde din sidebar (se accesează via tenant)
  },
  access: {
    read: () => true,
    create: isSuperAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: isSuperAdminAccess,
  },
  fields: [/* SAME FIELDS */],
}
```

**1.3 Creare utility `getTenantGlobal`**:
```typescript
// src/utilities/getTenantGlobal.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getTenantGlobal<T>(
  collectionSlug: string,
  tenantId: string,
): Promise<T | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: collectionSlug,
    where: { tenant: { equals: tenantId } },
    limit: 1,
  })

  return (result.docs[0] as T) || null
}

// Versiune cached
import { unstable_cache } from 'next/cache'

export const getCachedTenantGlobal = <T>(
  collectionSlug: string,
  tenantId: string,
) => {
  return unstable_cache(
    () => getTenantGlobal<T>(collectionSlug, tenantId),
    [`tenant-global-${collectionSlug}-${tenantId}`],
    { tags: [`tenant-${tenantId}`, collectionSlug] },
  )()
}
```

**1.4 Update `payload.config.ts`**:
```typescript
// Mută din globals în collections
import { SiteTheme } from './collections/SiteTheme'
import { BusinessInfo } from './collections/BusinessInfo'
// ... etc

export default buildConfig({
  collections: [
    // ... existing collections
    SiteTheme,
    BusinessInfo,
    Header,
    Footer,
    Logo,
    ShopSettings,
    SystemPages,
  ],
  globals: [], // GOLI - nu mai avem globals
})
```

---

### FAZA 2: Instalare și Configurare Plugin (2-3 zile)

**2.1 Creare Tenants Collection**:
- Copiază din exemplul oficial
- Adaugă câmpuri business (status, plan)

**2.2 Update Users Collection**:
- Adaugă `tenantsArrayField`
- Adaugă hook `setCookieBasedOnDomain`
- Update access control

**2.3 Configurare Plugin**:
```typescript
// src/payload.config.ts
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

export default buildConfig({
  // ... alte configurări

  plugins: [
    // ⚠️ MULTI-TENANT PRIMUL!
    multiTenantPlugin({
      collections: {
        // Globals convertite (isGlobal: true)
        'site-theme': { isGlobal: true },
        'business-info': { isGlobal: true },
        'header': { isGlobal: true },
        'footer': { isGlobal: true },
        'logo': { isGlobal: true },
        'shop-settings': { isGlobal: true },
        'system-pages': { isGlobal: true },

        // Content collections
        'pages': {},
        'posts': {},
        'services': {},
        'team': {},
        'portfolio': {},
        'testimonials': {},
        'faq': {},
        'bookings': {},
        'subscriptions': {},
        'subscription-orders': {},
        'newsletter-subscribers': {},
        'media': {},
        'categories': {},
        'service-categories': {},
        'testimonial-categories': {},
        'product-categories': {},
        'product-tags': {},
      },
      tenantField: {
        access: {
          read: () => true,
          update: ({ req }) => {
            if (isSuperAdmin(req.user)) return true
            return getUserTenantIDs(req.user).length > 0
          },
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),

    // Ecommerce DUPĂ multi-tenant
    ecommercePlugin({ /* config */ }),

    // Alte plugins
  ],
})
```

---

### FAZA 3: Update Access Control (2-3 zile)

**3.1 Creare fișiere access**:
```
src/access/
├── isSuperAdmin.ts
├── superAdminOrTenantAdmin.ts
├── tenantAccess.ts
└── index.ts
```

**3.2 Update fiecare colecție**:
- Înlocuiește `authenticated` cu `tenantAccess`
- Adaugă `filterOptions` pe relationship fields

**3.3 Verificare manuală**:
- Test API cu user din tenant A → nu vede date tenant B
- Test Admin UI cu super-admin → vede tot
- Test Admin UI cu tenant-admin → vede doar tenant-ul lui

---

### FAZA 4: Frontend Routing (3-4 zile)

**4.1 Restructurare App Router**:
```
src/app/(frontend)/
├── [tenant]/                    # NOU: segment dinamic
│   ├── layout.tsx               # TenantLayout
│   ├── page.tsx                 # Homepage
│   ├── [...slug]/page.tsx       # Dynamic pages
│   ├── blog/
│   ├── echipa/
│   ├── produse/
│   ├── cos/
│   ├── checkout/
│   └── cont/
└── page.tsx                     # Redirect sau landing
```

**4.2 TenantLayout** (adaptat din exemplu):
```typescript
// src/app/(frontend)/[tenant]/layout.tsx
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant: tenantSlug } = await params
  const payload = await getPayload({ config: configPromise })

  // Găsește tenant
  const tenantQuery = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: tenantSlug } },
    limit: 1,
  })

  const tenant = tenantQuery.docs[0]
  if (!tenant) notFound()

  // Încarcă "globals" pentru tenant
  const [siteTheme, businessInfo, header, footer, logo] = await Promise.all([
    getCachedTenantGlobal('site-theme', tenant.id),
    getCachedTenantGlobal('business-info', tenant.id),
    getCachedTenantGlobal('header', tenant.id),
    getCachedTenantGlobal('footer', tenant.id),
    getCachedTenantGlobal('logo', tenant.id),
  ])

  return (
    <TenantProvider tenant={tenant}>
      <ThemeProvider siteTheme={siteTheme}>
        <Header data={header} businessInfo={businessInfo} logo={logo} />
        <main>{children}</main>
        <Footer data={footer} businessInfo={businessInfo} logo={logo} />
      </ThemeProvider>
    </TenantProvider>
  )
}
```

**4.3 Middleware pentru Domain Mapping**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DOMAIN_TO_TENANT: Record<string, string> = {
  'frizerie.multiwebsite.org': 'frizerie',
  'dentist.multiwebsite.org': 'dentist',
  'terapii-energetice.multiwebsite.org': 'terapii-energetice',
  // Adaugă mapări noi aici
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Skip admin și API
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Detectează tenant din domain
  const tenantSlug = DOMAIN_TO_TENANT[hostname]

  if (tenantSlug && !pathname.startsWith(`/${tenantSlug}`)) {
    // Rewrite la path-ul cu tenant
    return NextResponse.rewrite(
      new URL(`/${tenantSlug}${pathname}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

### FAZA 5: Migrare Seeders (3-4 zile)

**5.1 Creare `seedTenant` function**:
```typescript
// src/seed/seedTenant.ts
import { Payload } from 'payload'

interface TenantSeedConfig {
  type: string
  name: string
  slug: string
  domain?: string
  adminEmail: string
}

export async function seedTenant(
  payload: Payload,
  config: TenantSeedConfig,
) {
  console.log(`🌱 Seeding tenant: ${config.name}`)

  // 1. Creează tenant
  const tenant = await payload.create({
    collection: 'tenants',
    data: {
      name: config.name,
      slug: config.slug,
      domain: config.domain,
      status: 'active',
      plan: 'basic',
      allowPublicRead: true,
    },
  })

  console.log(`   ✓ Tenant created: ${tenant.id}`)

  // 2. Creează admin user
  const adminUser = await payload.create({
    collection: 'users',
    data: {
      email: config.adminEmail,
      password: 'admin123',
      roles: ['user'],
      tenants: [{
        tenant: tenant.id,
        roles: ['tenant-admin'],
      }],
    },
  })

  console.log(`   ✓ Admin user created: ${adminUser.email}`)

  // 3. Seed content pentru acest tenant
  const seeder = await import(`./businesses/${config.type}`)
  await seeder.default(payload, tenant.id)

  console.log(`   ✓ Content seeded for ${config.type}`)

  return { tenant, adminUser }
}
```

**5.2 Update fiecare seeder** (11 fișiere):
```typescript
// src/seed/businesses/frizerie.ts
export default async function seedFrizerie(
  payload: Payload,
  tenantId: string,  // NOU: primește tenant ID
) {
  // Toate create-urile includ tenant
  await payload.create({
    collection: 'site-theme',
    data: {
      tenant: tenantId,  // OBLIGATORIU
      designVariant: 'classic',
      // ... alte date
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      tenant: tenantId,
      title: 'Acasă',
      slug: 'home',
      // ... layout blocks
    },
  })

  // ... restul seed-ului
}
```

**5.3 Script principal**:
```typescript
// src/seed/index.ts
const SEED_TYPE = process.env.SEED_TYPE || 'multiweb'
const TENANT_SLUG = process.env.TENANT_SLUG || SEED_TYPE

async function seed() {
  const payload = await getPayload({ config: configPromise })

  await seedTenant(payload, {
    type: SEED_TYPE,
    name: getBusinessName(SEED_TYPE),
    slug: TENANT_SLUG,
    domain: `${TENANT_SLUG}.multiwebsite.org`,
    adminEmail: `admin@${TENANT_SLUG}.local`,
  })
}
```

---

### FAZA 6: Integrare Ecommerce (2-3 zile)

**6.1 Ordinea Plugin-urilor** (CRITICĂ):
```typescript
plugins: [
  multiTenantPlugin({ /* config */ }),  // 1. PRIMUL
  ecommercePlugin({ /* config */ }),     // 2. AL DOILEA
  formBuilderPlugin({ /* config */ }),   // 3. DUPĂ
]
```

**6.2 Override collections ecommerce**:
```typescript
// În ecommercePlugin config
collections: {
  products: {
    overrides: ({ defaultCollection }) => ({
      ...defaultCollection,
      // Plugin-ul MT adaugă automat tenant field
    }),
  },
},
```

**6.3 Email hooks cu tenant branding**:
```typescript
// În orderEmailHook
const tenant = order.tenant
const businessInfo = await getTenantGlobal('business-info', tenant.id)

await sendEmail({
  to: order.customerEmail,
  subject: `Comandă confirmată - ${businessInfo.name}`,
  // ... template cu branding tenant
})
```

---

### FAZA 7: Testing și QA (3-4 zile)

Vezi secțiunea [5. Teste Specifice Multi-Tenant](#5-teste-specifice-multi-tenant).

---

## 4. Patterns din Exemplul Oficial

### Frontend Routing (din exemplu):

```typescript
// app/(app)/tenant-slugs/[tenant]/[...slug]/page.tsx
export default async function Page({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string }>
}) {
  const params = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  // Verifică acces la tenant
  const tenantsQuery = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: params.tenant } },
  })

  if (tenantsQuery.docs.length === 0) {
    redirect(`/tenant-slugs/${params.tenant}/login`)
  }

  // Query pagina cu tenant filter
  const pageQuery = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { 'tenant.slug': { equals: params.tenant } },
        { slug: { equals: params.slug?.join('/') || 'home' } },
      ],
    },
  })

  if (!pageQuery.docs[0]) notFound()

  return <RenderPage data={pageQuery.docs[0]} />
}
```

---

## 5. Teste Specifice Multi-Tenant

### Teste Izolare Date

```markdown
- [ ] User Tenant A NU vede datele Tenant B (API)
- [ ] User Tenant A NU vede datele Tenant B (Admin UI)
- [ ] Query direct MongoDB confirmă izolare
- [ ] Media uploads în folder corect per tenant
```

### Teste Super Admin

```markdown
- [ ] Super-admin vede toți tenants în dropdown
- [ ] Super-admin poate switch între tenants
- [ ] Super-admin poate crea tenant nou
- [ ] Super-admin poate crea users în orice tenant
```

### Teste Tenant Admin

```markdown
- [ ] Tenant-admin vede DOAR tenant-ul său
- [ ] Tenant-admin poate edita content propriu
- [ ] Tenant-admin NU poate edita alt tenant
- [ ] Tenant-admin poate crea users în tenant-ul său
```

### Teste Edge Cases

```markdown
- [ ] User fără tenant assignment → eroare clară
- [ ] User cu multiple tenants → filter corect
- [ ] Delete tenant → documentele rămân/se șterg (configurat)
- [ ] Relationship fields filtrează corect
```

### Teste Performance

```markdown
- [ ] Query cu 10+ tenants < 100ms
- [ ] Index pe `tenant` field există
- [ ] List view paginare funcționează
- [ ] Cache invalidation per tenant
```

---

## 6. Resurse și Monitorizare

### Documentație Oficială

- [Multi-Tenant Plugin Docs](https://payloadcms.com/docs/plugins/multi-tenant)
- [Official Example](https://github.com/payloadcms/payload/tree/main/examples/multi-tenant)
- [Localized Multi-Tenant](https://github.com/payloadcms/localized-multitenant)

### Articole Comunitate

- [Globals with Multi-Tenant](https://www.buildwithmatija.com/blog/how-to-configure-globals-with-multi-tenant-plugin-in-payload-cms)
- [Tenant State Management](https://www.buildwithmatija.com/blog/payload-cms-multi-tenant-state-management)
- [MT vs Access Control Decision](https://www.buildwithmatija.com/blog/payload-cms-multi-tenant-vs-access-control-decision-framework)

### GitHub Issues de Monitorizat

| Issue | Problemă | Status |
|-------|----------|--------|
| [#11071](https://github.com/payloadcms/payload/issues/11071) | Versions + MT bug | OPEN |
| [#11240](https://github.com/payloadcms/payload/issues/11240) | Versions cu tenants | OPEN |
| [#13589](https://github.com/payloadcms/payload/issues/13589) | Admin UI access | OPEN |
| [#13518](https://github.com/payloadcms/payload/issues/13518) | Folders incompatibil | OPEN |
| [#10983](https://github.com/payloadcms/payload/issues/10983) | Relationship filter | OPEN |

### Discussions Utile

- [#11967](https://github.com/payloadcms/payload/discussions/11967) - Upload folders per tenant
- [#3112](https://github.com/payloadcms/payload/discussions/3112) - Tenant field guidance
- [#6736](https://github.com/payloadcms/payload/discussions/6736) - Globals by tenant ID

---

## Timeline Final

| Fază | Durată | Risc |
|------|--------|------|
| 0. Pre-Migrare | 1-2 zile | LOW |
| 1. Globals → Collections | 3-4 zile | MEDIUM |
| 2. Plugin Setup | 2-3 zile | MEDIUM |
| 3. Access Control | 2-3 zile | MEDIUM |
| 4. Frontend Routing | 3-4 zile | HIGH |
| 5. Seeders | 3-4 zile | MEDIUM |
| 6. Ecommerce | 2-3 zile | HIGH |
| 7. Testing | 3-4 zile | LOW |
| **TOTAL** | **18-22 zile** | |

---

## Checklist Final Pre-Deploy

- [ ] Toate testele izolare trec
- [ ] Super-admin poate gestiona toți tenants
- [ ] Fiecare seeder creează tenant complet
- [ ] Domain mapping funcționează
- [ ] Emails au branding per tenant
- [ ] Performance acceptabilă (< 100ms queries)
- [ ] Backup strategie documentată
- [ ] Rollback plan pregătit

---

*Document creat: 2025-12-23*
*Versiune: 2.0*
*Bazat pe: Payload CMS 3.68 + @payloadcms/plugin-multi-tenant*
*Exemplu oficial analizat: payload/examples/multi-tenant*
