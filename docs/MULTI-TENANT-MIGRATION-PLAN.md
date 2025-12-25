# Plan Complet Migrare Multi-Tenant

**Data**: 2025-12-23
**Status**: PLANIFICAT
**Estimare**: 15-20 zile de lucru

---

## Cuprins

1. [De ce Multi-Tenant?](#1-de-ce-multi-tenant)
2. [Arhitectura Finală](#2-arhitectura-finală)
3. [Inventar Modificări](#3-inventar-modificări)
4. [Faze de Implementare](#4-faze-de-implementare)
5. [Probleme Cunoscute](#5-probleme-cunoscute)
6. [Decizii Tehnice](#6-decizii-tehnice)

---

## 1. De ce Multi-Tenant?

### Comparație Costuri (10 clienți)

| Metric | Site-uri Individuale | Multi-Tenant |
|--------|---------------------|--------------|
| MongoDB | 10 instanțe = ~500€/lună | 1 instanță = ~50€/lună |
| Containere Docker | 10 x 400MB RAM | 1 x 600MB RAM |
| Build time la update | 10 x 15min = 150min | 1 x 15min = 15min |
| Timp onboarding client | 3-4 ore | 13 minute |
| Efort bug fix | 10 deployments | 1 deployment |
| **Cost total infrastructură** | **~800€/lună** | **~150€/lună** |

### Beneficii Operaționale

- **Un singur codebase** - bug fix o dată, toți clienții actualizați
- **Seed în 13 minute** - client nou = doar `pnpm seed`
- **Update securitate instant** - Payload/Next.js update pentru toți
- **Monitorizare centralizată** - un singur dashboard
- **Backup unificat** - o singură strategie

---

## 2. Arhitectura Finală

```
┌─────────────────────────────────────────────────────────────┐
│                    MULTI-TENANT PLATFORM                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Tenant A   │  │   Tenant B   │  │   Tenant C   │  ...  │
│  │   Frizerie   │  │   Dentist    │  │    Salon     │       │
│  │              │  │              │  │              │       │
│  │ frizerie.ro  │  │ dentist.ro   │  │  salon.ro    │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └─────────────────┼─────────────────┘                │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │   Payload   │                          │
│                    │  CMS + API  │                          │
│                    │  (1 instanță)│                         │
│                    └──────┬──────┘                          │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  MongoDB    │                          │
│                    │ (1 instanță)│                          │
│                    │             │                          │
│                    │ tenants     │                          │
│                    │ pages       │ ← toate cu tenant field  │
│                    │ services    │                          │
│                    │ products    │                          │
│                    └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

### Routing Strategy

**Opțiunea aleasă: Path-based + Domain mapping**

```
# Development
http://localhost:3000/frizerie/
http://localhost:3000/dentist/

# Production (cu domain mapping via middleware)
https://frizerie-elegance.ro → rewrites to /frizerie/*
https://dentist-premium.ro → rewrites to /dentist/*
```

---

## 3. Inventar Modificări

### 3.1 Colecții care primesc Tenant Field (19 total)

| Colecție | Slug | Prioritate | Note |
|----------|------|------------|------|
| Pages | `pages` | CRITICAL | Paginile site-ului |
| Posts | `posts` | HIGH | Blog articles |
| Services | `services` | HIGH | Servicii oferite |
| Team | `team` | HIGH | Membri echipă |
| Portfolio | `portfolio` | MEDIUM | Portofoliu |
| Testimonials | `testimonials` | MEDIUM | Recenzii clienți |
| FAQ | `faq` | MEDIUM | Întrebări frecvente |
| Bookings | `bookings` | HIGH | Programări |
| Subscriptions | `subscriptions` | MEDIUM | Abonamente |
| SubscriptionOrders | `subscription-orders` | MEDIUM | Comenzi abonamente |
| NewsletterSubscribers | `newsletter-subscribers` | LOW | Lista newsletter |
| Media | `media` | CRITICAL | Imagini/video |
| Categories | `categories` | LOW | Categorii blog |
| ServiceCategories | `service-categories` | LOW | Categorii servicii |
| TestimonialCategories | `testimonial-categories` | LOW | Categorii testimoniale |
| ProductCategories | `product-categories` | MEDIUM | Categorii produse |
| ProductTags | `product-tags` | LOW | Tag-uri produse |
| Products | `products` | HIGH | Produse (ecommerce) |
| Orders | `orders` | HIGH | Comenzi (ecommerce) |

### 3.2 Globals → Collections cu isGlobal (7 total)

| Global Actual | Fișier | Prioritate |
|--------------|--------|------------|
| BusinessInfo | `/src/globals/BusinessInfo.ts` | CRITICAL |
| Header | `/src/globals/Header.ts` | CRITICAL |
| Footer | `/src/globals/Footer.ts` | CRITICAL |
| Logo | `/src/globals/Logo.ts` | CRITICAL |
| SiteTheme | `/src/globals/SiteTheme.ts` | CRITICAL |
| ShopSettings | `/src/globals/ShopSettings.ts` | HIGH |
| SystemPages | `/src/globals/SystemPages.ts` | MEDIUM |

### 3.3 Funcții Access Control de Creat

```typescript
// Noi funcții necesare în /src/access/index.ts

// Super admin - acces la toți tenants
export const isSuperAdmin = (user: User | null): boolean => {
  return Boolean(user?.roles?.includes('super-admin'))
}

// Extrage tenant IDs din user
export const getUserTenantIDs = (user: User | null): string[] => {
  return user?.tenants?.map(t =>
    typeof t.tenant === 'string' ? t.tenant : t.tenant.id
  ).filter(Boolean) || []
}

// Verifică dacă user e membru al tenant-ului
export const isTenantMember = (user: User | null, tenantId: string): boolean => {
  return getUserTenantIDs(user).includes(tenantId)
}

// Access control tenant-aware
export const tenantAccess: Access = ({ req }) => {
  if (isSuperAdmin(req.user)) return true
  const tenantIDs = getUserTenantIDs(req.user)
  if (tenantIDs.length === 0) return false
  return { tenant: { in: tenantIDs } }
}
```

### 3.4 Frontend Routes de Modificat

```
ACTUAL:                          DUPĂ MIGRARE:
/(frontend)/                     /(frontend)/[tenant]/
├── [...slug]/                   ├── [...slug]/
├── blog/                        ├── blog/
├── categorii/                   ├── categorii/
├── checkout/                    ├── checkout/
├── cont/                        ├── cont/
├── cos/                         ├── cos/
├── echipa/                      ├── echipa/
└── produse/                     └── produse/
```

### 3.5 Utilities de Actualizat

| Fișier | Modificare |
|--------|------------|
| `/src/utilities/getGlobals.ts` | Adaugă `getTenantGlobal(tenantId, slug)` |
| `/src/utilities/sendNotificationEmail.ts` | Acceptă `tenantId` parameter |
| `/src/app/(frontend)/layout.tsx` | Extrage tenant din URL/domain |

### 3.6 Seeders de Actualizat (11 fișiere)

Toate fișierele din `/src/seed/businesses/`:
- `frizerie.ts`
- `dentist.ts`
- `avocat.ts`
- `restaurant.ts`
- `auto-service.ts`
- `constructii.ts`
- `salon.ts`
- `magazin.ts`
- `fitness.ts`
- `multiweb.ts`
- `terapii-energetice.ts`

**Schimbare**: Primesc `tenantId` și îl atașează la toate documentele create.

---

## 4. Faze de Implementare

### Faza 1: Infrastructură (3-4 zile)

**Obiectiv**: Setup plugin + colecție Tenants

- [ ] Instalare `@payloadcms/plugin-multi-tenant`
- [ ] Creare colecție `Tenants` cu fields:
  ```typescript
  {
    name: string        // "Frizerie Elegance"
    slug: string        // "frizerie-elegance" (index)
    domains: string[]   // ["frizerie-elegance.ro"]
    status: 'active' | 'suspended' | 'trial'
    plan: 'basic' | 'pro' | 'enterprise'
    owner: relationship → users
    createdAt, updatedAt
  }
  ```
- [ ] Actualizare colecție `Users` cu tenant relationship:
  ```typescript
  {
    tenants: [{
      tenant: relationship → tenants
      roles: ['tenant-admin', 'editor', 'viewer']
    }]
    lastLoggedInTenant: relationship → tenants
  }
  ```
- [ ] Configurare plugin în `payload.config.ts`
- [ ] Creare funcții access control tenant-aware

**Fișiere modificate**:
- `/src/payload.config.ts`
- `/src/collections/Users.ts` (sau nou)
- `/src/collections/Tenants.ts` (nou)
- `/src/access/index.ts`

### Faza 2: Migrare Globals (2-3 zile)

**Obiectiv**: Convertire globals → collections cu isGlobal

- [ ] Convertire `BusinessInfo` → collection
- [ ] Convertire `Header` → collection
- [ ] Convertire `Footer` → collection
- [ ] Convertire `Logo` → collection
- [ ] Convertire `SiteTheme` → collection
- [ ] Convertire `ShopSettings` → collection
- [ ] Convertire `SystemPages` → collection
- [ ] Creare utility `getTenantGlobal()`
- [ ] Actualizare `getCachedGlobal()` pentru backward compatibility

**Exemplu conversie**:
```typescript
// ÎNAINTE: /src/globals/BusinessInfo.ts
export const BusinessInfo: GlobalConfig = {
  slug: 'business-info',
  fields: [...]
}

// DUPĂ: /src/collections/BusinessInfo.ts
export const BusinessInfo: CollectionConfig = {
  slug: 'business-info',
  admin: { hidden: true }, // Ascuns din sidebar
  fields: [
    // tenant field adăugat automat de plugin
    ...existingFields
  ]
}

// În plugin config:
collections: {
  'business-info': { isGlobal: true }
}
```

### Faza 3: Tenant Scope pe Colecții (3-4 zile)

**Obiectiv**: Adăugare tenant field pe toate colecțiile

- [ ] Configurare plugin pentru toate cele 19 colecții
- [ ] Update access control pe fiecare colecție
- [ ] Testare izolare date între tenants
- [ ] Verificare relații (ex: Page → Media să fie din același tenant)

**Plugin config**:
```typescript
multiTenantPlugin({
  userHasAccessToAllTenants: (user) => isSuperAdmin(user),
  collections: {
    // Content collections
    pages: {},
    posts: {},
    services: {},
    team: {},
    portfolio: {},
    testimonials: {},
    faq: {},
    bookings: {},
    subscriptions: {},
    'subscription-orders': {},
    'newsletter-subscribers': {},
    media: {},
    categories: {},
    'service-categories': {},
    'testimonial-categories': {},
    'product-categories': {},
    'product-tags': {},

    // Globals as collections
    'business-info': { isGlobal: true },
    header: { isGlobal: true },
    footer: { isGlobal: true },
    logo: { isGlobal: true },
    'site-theme': { isGlobal: true },
    'shop-settings': { isGlobal: true },
    'system-pages': { isGlobal: true },
  },
})
```

### Faza 4: Frontend Routing (2-3 zile)

**Obiectiv**: Rutare dinamică per tenant

- [ ] Adăugare segment `[tenant]` în app router
- [ ] Creare `TenantProvider` context
- [ ] Update layout.tsx pentru tenant detection
- [ ] Middleware pentru domain → tenant mapping
- [ ] Update toate paginile să folosească tenant context

**Structură nouă**:
```
/src/app/(frontend)/[tenant]/
├── layout.tsx          # Încarcă globals pentru tenant
├── page.tsx            # Homepage
├── [...slug]/page.tsx  # Dynamic pages
├── blog/
├── produse/
├── cos/
├── checkout/
└── cont/
```

**TenantLayout**:
```typescript
// /src/app/(frontend)/[tenant]/layout.tsx
export default async function TenantLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant: tenantSlug } = await params

  // Găsește tenant
  const tenant = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: tenantSlug } },
    limit: 1
  })

  if (!tenant.docs[0]) notFound()

  // Încarcă globals pentru acest tenant
  const [businessInfo, header, footer, siteTheme] = await Promise.all([
    getTenantGlobal('business-info', tenant.docs[0].id),
    getTenantGlobal('header', tenant.docs[0].id),
    getTenantGlobal('footer', tenant.docs[0].id),
    getTenantGlobal('site-theme', tenant.docs[0].id),
  ])

  return (
    <TenantProvider tenant={tenant.docs[0]}>
      <ThemeProvider siteTheme={siteTheme}>
        <Header data={header} />
        <main>{children}</main>
        <Footer data={footer} businessInfo={businessInfo} />
      </ThemeProvider>
    </TenantProvider>
  )
}
```

### Faza 5: Migrare Seeders (2-3 zile)

**Obiectiv**: Seeders creează tenant + conținut

- [ ] Creare funcție `seedTenant(config)`
- [ ] Update toate cele 11 seeders să primească tenantId
- [ ] Script pentru seed all tenants
- [ ] Testare cu multiple tenants simultan

**Nou flow seed**:
```typescript
// /src/seed/seedTenant.ts
export async function seedTenant(config: {
  type: 'frizerie' | 'dentist' | ...
  name: string
  slug: string
  domain?: string
  adminEmail: string
}) {
  // 1. Creează tenant
  const tenant = await payload.create({
    collection: 'tenants',
    data: {
      name: config.name,
      slug: config.slug,
      domains: config.domain ? [{ domain: config.domain }] : [],
      status: 'active',
    }
  })

  // 2. Creează admin user
  await payload.create({
    collection: 'users',
    data: {
      email: config.adminEmail,
      password: 'changeme123',
      tenants: [{ tenant: tenant.id, roles: ['tenant-admin'] }]
    }
  })

  // 3. Seed content pentru acest tenant
  const seeder = seeders[config.type]
  await seeder(payload, tenant.id)

  return tenant
}
```

**Comandă nouă**:
```bash
# Seed un tenant specific
SEED_TYPE=frizerie TENANT_SLUG=frizerie-test pnpm seed

# Seed toate tipurile (demo)
pnpm seed:all-tenants
```

### Faza 6: Integrare Ecommerce (2-3 zile)

**Obiectiv**: Cart/Orders tenant-aware

- [ ] Configurare ecommerce plugin cu multi-tenant
- [ ] Update payment hooks cu tenant context
- [ ] Email notifications cu branding per tenant
- [ ] Testare guest checkout per tenant

**Ordinea plugin-urilor (CRITICĂ)**:
```typescript
plugins: [
  // 1. Multi-tenant PRIMUL
  multiTenantPlugin({ ... }),

  // 2. Ecommerce DUPĂ
  ecommercePlugin({ ... }),

  // 3. Alte plugin-uri
  formBuilderPlugin({ ... }),
]
```

### Faza 7: Testing & Polish (2-3 zile)

- [ ] E2E tests pentru multi-tenant flows
- [ ] Test izolare date între tenants
- [ ] Test admin panel cu tenant switching
- [ ] Performance testing cu 10+ tenants
- [ ] Security audit (cross-tenant access)
- [ ] Documentație admin panel

---

## 5. Probleme Cunoscute

### Issues Active din GitHub

| Issue | Problemă | Workaround |
|-------|----------|------------|
| [#13589](https://github.com/payloadcms/payload/issues/13589) | Admin UI nu respectă `userHasAccessToAllTenants` | API funcționează corect |
| [#11240](https://github.com/payloadcms/payload/issues/11240) | Versions + Multi-tenant conflict | Dezactivează versions pe colecții MT |
| [#13518](https://github.com/payloadcms/payload/issues/13518) | Folders plugin incompatibil | Nu folosi folders cu MT |
| [#14005](https://github.com/payloadcms/payload/issues/14005) | Cookie `payload-tenant` nu se setează la auto-login | Manual set cookie |

### Limitări Plugin

1. **Separate databases NU sunt suportate** - folosim shared DB cu tenant field
2. **Globals tradiționale nu sunt tenant-aware** - le convertim în collections cu isGlobal
3. **Versions poate avea probleme** - testează înainte de activare

---

## 6. Decizii Tehnice

### DT-001: Routing Strategy

**Decizie**: Path-based cu domain mapping via middleware

**Motivare**:
- Nu necesită wildcard DNS
- SEO consolidat pe un domeniu principal
- Mai simplu de testat local
- Domain mapping adăugat ulterior prin middleware

### DT-002: Media Storage

**Decizie**: Shared bucket cu prefix per tenant

```typescript
// Upload path: /media/{tenantSlug}/{filename}
beforeOperation: [
  ({ args, operation }) => {
    if (operation === 'create') {
      const tenant = getTenantFromRequest(args.req)
      args.data.prefix = tenant.slug
    }
  }
]
```

**Motivare**:
- Cost eficient (un singur bucket S3/R2)
- Izolare logică prin path prefix
- Ușor de migrat/backup per tenant

### DT-003: User Roles

**Decizie**: Rol global + rol per tenant

```typescript
// Global roles
roles: ['super-admin', 'admin', 'user']

// Per-tenant roles (în tenants array)
tenants: [{
  tenant: 'tenant-id',
  roles: ['tenant-admin', 'editor', 'viewer']
}]
```

**Motivare**:
- Super-admin poate gestiona toți tenants
- Tenant-admin are acces complet la un singur tenant
- Un user poate fi admin la un tenant și viewer la altul

### DT-004: Email Configuration

**Decizie**: Email settings per tenant

**Motivare**:
- Fiecare business vrea propriul branding
- FROM email diferit per tenant
- Posibilitate SMTP dedicat pentru enterprise

---

## Resurse

### Documentație Oficială
- [Payload Multi-Tenant Plugin](https://payloadcms.com/docs/plugins/multi-tenant)
- [Official Example](https://github.com/payloadcms/payload/tree/main/examples/multi-tenant)
- [Localized Multi-Tenant](https://github.com/payloadcms/localized-multitenant)

### Articole Utile
- [How to Build Multi-Tenant App](https://payloadcms.com/posts/blog/how-to-build-a-multi-tenant-app-with-payload)
- [Globals with Multi-Tenant](https://www.buildwithmatija.com/blog/how-to-configure-globals-with-multi-tenant-plugin-in-payload-cms)
- [Tenant State Management](https://www.buildwithmatija.com/blog/payload-cms-multi-tenant-state-management)

### GitHub Issues de Urmărit
- [Multi-tenant issues](https://github.com/payloadcms/payload/issues?q=multi-tenant)

---

## Timeline Estimat

| Fază | Durată | Dependențe |
|------|--------|------------|
| 1. Infrastructură | 3-4 zile | - |
| 2. Migrare Globals | 2-3 zile | Faza 1 |
| 3. Tenant Scope Colecții | 3-4 zile | Faza 2 |
| 4. Frontend Routing | 2-3 zile | Faza 3 |
| 5. Migrare Seeders | 2-3 zile | Faza 4 |
| 6. Integrare Ecommerce | 2-3 zile | Faza 5 |
| 7. Testing & Polish | 2-3 zile | Faza 6 |
| **TOTAL** | **15-20 zile** | |

---

*Document creat: 2025-12-23*
*Bazat pe: Payload CMS 3.68 + @payloadcms/plugin-multi-tenant*
