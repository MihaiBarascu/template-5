# Multi-Tenant Official Reference

**Versiuni folosite:**
- Next.js: 16.1.0
- Payload CMS: 3.68.5
- Plugin: @payloadcms/plugin-multi-tenant

**Surse oficiale:**
- Payload Docs: https://payloadcms.com/docs/plugins/multi-tenant
- Payload Example: https://github.com/payloadcms/payload/tree/main/examples/multi-tenant
- Next.js Rewrites: https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites

---

## 1. Next.js Rewrites (ADAPTAT PENTRU NEXT.JS 16)

**Pattern oficial Payload (Next.js 15):**
```ts
source: '/((?!admin|api)):path*'  // NU funcționează în Next.js 16!
```

**Pattern adaptat pentru Next.js 16.1.0 (CE FOLOSIM):**

```ts
// next.config.js
async rewrites() {
  return {
    // afterFiles: rulează DUPĂ verificarea filesystem-ului
    // Astfel /admin și /api sunt servite de rutele lor existente
    afterFiles: [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<tenantDomain>.*)',
          },
        ],
        destination: '/:tenantDomain/:path*',
      },
    ],
  };
}
```

**De ce `afterFiles`:**
- Next.js 16 nu suportă negative lookahead în source pattern
- `afterFiles` rulează DUPĂ ce Next.js verifică filesystem-ul
- Rutele `/admin` și `/api` există în filesystem → sunt servite direct
- Restul rutelor sunt rewrite-uite cu tenant din Host header

**Ce face:**
- `source: '/((?!admin|api)):path*'` - Match toate rutele EXCEPTÂND `/admin` și `/api`
- `:path*` - Capturează restul path-ului
- `has: [{ type: 'host', value: '(?<tenantDomain>.*)' }]` - Capturează Host header în `tenantDomain`
- `destination: '/:tenantDomain/:path*'` - Pune tenant-ul ca prim segment

**Exemplu:**
```
Request: frizerie.local/servicii
  → Host header: frizerie.local
  → Intern devine: /frizerie.local/servicii
  → Rută: app/(frontend)/[tenantDomain]/servicii/page.tsx
  → Params: { tenantDomain: 'frizerie.local' }
```

---

## 2. Folder Structure (OFFICIAL PATTERN)

**Din exemplul oficial Payload:**

```
src/app/
├── (app)/                          # Route group
│   ├── tenant-domains/             # Pentru domain-based routing
│   │   └── [tenant]/               # Dynamic segment pentru tenant
│   │       ├── page.tsx
│   │       ├── login/page.tsx
│   │       └── [...slug]/page.tsx
│   └── tenant-slugs/               # Pentru slug-based routing
│       └── [tenant]/
│           └── ...
└── (payload)/                      # Admin routes
```

**Pentru noi (adaptat):**

```
src/app/
├── (frontend)/
│   └── [tenantDomain]/             # Dynamic segment pentru tenant
│       ├── layout.tsx              # Validează tenant, încarcă theme
│       ├── page.tsx                # Homepage
│       ├── [...slug]/page.tsx      # Dynamic pages
│       ├── blog/page.tsx
│       ├── blog/[slug]/page.tsx
│       ├── produse/page.tsx
│       └── ...
└── (payload)/                      # Admin routes (NESCHIMBAT)
```

---

## 3. Page Component Pattern (OFFICIAL)

**Din exemplul oficial:**

```tsx
// src/app/(app)/tenant-domains/[tenant]/[...slug]/page.tsx
import type { Where } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

export default async function Page({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string }>
}) {
  const params = await paramsPromise
  const { tenant } = params

  const payload = await getPayload({ config: configPromise })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  // 1. Validează tenant-ul
  const tenantsQuery = await payload.find({
    collection: 'tenants',
    where: {
      domain: { equals: tenant },
    },
  })

  if (tenantsQuery.docs.length === 0) {
    redirect('/login')
  }

  // 2. Query pagină cu tenant filter
  const pageQuery = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { 'tenant.domain': { equals: tenant } },
        { slug: { equals: params.slug?.join('/') || 'home' } },
      ],
    },
  })

  if (!pageQuery.docs[0]) {
    return notFound()
  }

  return <RenderPage data={pageQuery.docs[0]} />
}
```

---

## 4. Frontend Query Pattern (OFFICIAL)

**Din documentația Payload:**

```tsx
const pagesBySlug = await payload.find({
  collection: 'pages',
  depth: 1,
  draft: false,
  limit: 1000,
  overrideAccess: false,
  where: {
    'tenant.slug': { equals: 'gold' },
    // SAU
    'tenant.domain': { equals: 'frizerie.local' },
  },
})
```

---

## 5. Tenants Collection (OFFICIAL FIELDS)

```ts
{
  slug: 'tenants',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'domain', type: 'text', required: true },  // Pentru domain-based routing
  ],
}
```

---

## 6. Plugin Configuration (OFFICIAL)

```ts
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

plugins: [
  multiTenantPlugin<Config>({
    collections: {
      pages: {},
      posts: {},
      services: {},
      // isGlobal: true pentru collections care au 1 doc per tenant
      navigation: { isGlobal: true },
    },
  }),
]
```

---

## CHECKLIST DE IMPLEMENTARE

- [ ] **Faza 1:** Adaugă rewrites EXACT ca în documentație
- [ ] **Faza 2:** Creează folder `[tenantDomain]` în `app/(frontend)/`
- [ ] **Faza 3:** Creează `[tenantDomain]/layout.tsx` care validează tenant-ul
- [ ] **Faza 4:** Mută paginile în `[tenantDomain]/`
- [ ] **Faza 5:** Actualizează query-urile să folosească `tenant.domain`
- [ ] **Faza 6:** Testează cu multiple domenii

---

## ERORI FRECVENTE DE EVITAT

1. **NU** modifica rutele `/admin` sau `/api` - sunt excluse din rewrites
2. **NU** folosi `getTenantDomain()` din headers - folosește `params.tenantDomain`
3. **ÎNTOTDEAUNA** validează că tenant-ul există în DB înainte de a afișa pagina
4. **ÎNTOTDEAUNA** filtrează query-urile cu `'tenant.domain': { equals: tenantDomain }`

---

## REFERENCE LINKS

- [Payload Multi-Tenant Docs](https://payloadcms.com/docs/plugins/multi-tenant)
- [Payload Multi-Tenant Example](https://github.com/payloadcms/payload/tree/main/examples/multi-tenant)
- [Next.js Rewrites Docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)
