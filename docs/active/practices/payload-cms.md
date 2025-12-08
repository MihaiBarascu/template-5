---
status: ACTIVE
type: practice
created: 2025-12-01
updated: 2025-12-08
version: "Payload 3.x"
related:
  - ../../_ARCHITECTURE.md
  - ../guides/blocks.md
tags: [payload, cms, best-practices, typescript, hooks]
---

# Payload CMS Best Practices

> **VERSIUNE:** Acest document e pentru Payload CMS 3.x
> **SURSE OFICIALE:**
> - https://payloadcms.com/docs
> - https://github.com/payloadcms/payload
> - https://payloadcms.com/llms-full.txt (LLM context)
>
> **CLAUDE CODE:** Foloseste `/payload` skill pentru referinta completa!

---

## REGULA FUNDAMENTALA

**NICIODATĂ NU FACEM LUCRURI DE CAPUL NOSTRU!**

Inainte de orice modificare:
1. Citeste documentatia oficiala
2. Verifica daca exista plugin oficial
3. Verifica exemplele din GitHub
4. Testeaza ca nu strici functionalitati existente

---

## 1. TypeScript Strict

### NICIODATA `any`!

```typescript
// GRESIT
const handleClick = (data: any) => { ... }

// CORECT
import type { Page, Post, Media } from '@/payload-types'
const handleClick = (data: Page) => { ... }
```

### Generare tipuri

```bash
# Ruleaza MEREU dupa modificari in colectii/blocuri
pnpm generate:types
```

---

## 2. Structura Blocuri (2 fisiere)

```
src/blocks/
├── Hero/
│   ├── config.ts      # Configuratia Payload
│   └── Component.tsx  # Componenta React
└── RenderBlocks.tsx   # Randeaza dinamic
```

### config.ts

```typescript
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',  // OBLIGATORIU pentru TypeScript
  labels: { singular: 'Hero', plural: 'Hero Blocks' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'media', type: 'upload', relationTo: 'media' },
  ],
}
```

### Component.tsx

```tsx
import type { HeroBlock as HeroBlockProps } from '@/payload-types'

export const HeroBlock: React.FC<HeroBlockProps> = ({ heading, media }) => {
  return (
    <section>
      {heading && <h1>{heading}</h1>}
      {media && typeof media === 'object' && (
        <Media resource={media} />
      )}
    </section>
  )
}
```

---

## 3. Access Control

### IMPORTANT: Trei Layer-uri

| Layer | Scope | Returns |
|-------|-------|---------|
| **Collection Access** | create, read, update, delete, admin | boolean \| Where query |
| **Field Access** | create, read, update | **boolean ONLY** (no queries!) |
| **Global Access** | read, update | boolean \| Where query |

### Functii reutilizabile

```typescript
// src/access/index.ts
import type { Access, FieldAccess } from 'payload'

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin')
}

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

export const isDocumentOwner: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true
  if (user?.id) return { customer: { equals: user.id } }
  return false
}

// Admin panel visibility
export const adminPanelAccess: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin') || user?.roles?.includes('editor')
}
```

### RBAC Pattern (Roles)

```typescript
// Payload NU are roles built-in - trebuie sa le adaugi!
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true,  // IMPORTANT: Include in JWT token!
      access: {
        update: ({ req: { user } }) => user?.roles?.includes('admin'),
      },
    },
  ],
}
```

### Field Access (DOAR boolean!)

```typescript
// ❌ GRESIT - Field access NU suporta queries!
access: {
  read: ({ req }) => ({ author: { equals: req.user?.id } })
}

// ✅ CORECT - Doar boolean
const salaryReadAccess: FieldAccess = ({ req: { user }, doc }) => {
  if (user?.id === doc?.id) return true  // Self
  return user?.roles?.includes('admin')   // Admin
}

{
  name: 'salary',
  type: 'number',
  access: {
    read: salaryReadAccess,
    update: ({ req: { user } }) => user?.roles?.includes('admin'),
  },
}
```

### Access Function Arguments

```typescript
// Collection create
create: ({ req, data }) => boolean | Where

// Collection read
read: ({ req, id }) => boolean | Where

// Collection update
update: ({ req, id, data }) => boolean | Where

// Field access - mai multi parametri!
access: {
  read: ({ req, id, doc, siblingData }) => boolean
  update: ({ req, id, data, doc, siblingData }) => boolean
}
```

---

## 4. Hooks - Best Practices

### Hook Arguments (Complet)

```typescript
hooks: {
  beforeChange: [
    async ({ data, req, operation, originalDoc }) => {
      // data - datele care vor fi salvate
      // req - request object (TRANSMITE-L!)
      // operation - 'create' | 'update'
      // originalDoc - documentul original (la update)
      return data
    },
  ],
  afterChange: [
    async ({ doc, req, operation, previousDoc, context }) => {
      // doc - documentul salvat
      // previousDoc - documentul inainte de salvare
      // context - obiect partajat intre hooks
      return doc
    },
  ],
}
```

### Transaction Safety (OBLIGATORIU!)

```typescript
// ❌ DATA CORRUPTION RISK: Separate transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        // Missing req - runs in separate transaction!
      })
    },
  ]
}

// ✅ ATOMIC: Same transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        req,  // OBLIGATORIU - Maintains atomicity!
      })
    },
  ]
}
```

### Prevenire Loop Infinit

```typescript
// ❌ INFINITE LOOP
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.update({
        collection: 'posts',
        id: doc.id,
        data: { views: doc.views + 1 },
        req,
      }) // Triggers afterChange again!
    },
  ]
}

// ✅ SAFE: Use context flag
hooks: {
  afterChange: [
    async ({ doc, req, context }) => {
      if (context.skipHooks) return doc

      await req.payload.update({
        collection: 'posts',
        id: doc.id,
        data: { views: doc.views + 1 },
        context: { skipHooks: true },
        req,
      })
    },
  ]
}
```

### Field Hooks

```typescript
import type { FieldHook } from 'payload'

const normalizeEmail: FieldHook = ({ value }) => {
  return value?.trim().toLowerCase()
}

const hideFromNonAdmins: FieldHook = ({ value, req }) => {
  if (!req.user?.role === 'admin') {
    return value.replace(/(.{2})(.*)(@.*)/, '$1***$3')
  }
  return value
}

// Usage
{
  name: 'email',
  type: 'email',
  hooks: {
    beforeValidate: [normalizeEmail],
    afterRead: [hideFromNonAdmins],
  },
}
```

### Next.js Revalidation

```typescript
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc._status === 'published') {
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
    revalidatePath(path)
    revalidateTag('pages-sitemap')
  }
  return doc
}
```

---

## 5. Local API

### IMPORTANT: `overrideAccess`

```typescript
// PERICOL - Access control IGNORAT by default!
const posts = await payload.find({
  collection: 'posts',
  user: someUser,
})

// CORECT - Aplica access control
const posts = await payload.find({
  collection: 'posts',
  user: someUser,
  overrideAccess: false,  // OBLIGATORIU pentru user ops
})

// OK pentru operatii de sistem (seeder, cron)
const posts = await payload.create({
  collection: 'posts',
  data: { ... },
  overrideAccess: true,
})
```

---

## 6. Query Patterns

### Query Operators (Complet)

```typescript
import type { Where } from 'payload'

// Equals / Not equals
{ status: { equals: 'published' } }
{ status: { not_equals: 'draft' } }

// Comparatie numerica
{ price: { greater_than: 100 } }
{ age: { less_than_equal: 65 } }

// Text search
{ title: { contains: 'payload' } }  // case-insensitive
{ description: { like: 'cms headless' } }  // all words present

// Arrays
{ category: { in: ['tech', 'news'] } }
{ tags: { not_in: ['spam'] } }

// Exists
{ image: { exists: true } }

// Geolocation (point fields)
{ location: { near: '-122.4194,37.7749,10000' } }
```

### AND/OR Logic

```typescript
const complexQuery: Where = {
  or: [
    { color: { equals: 'mint' } },
    {
      and: [
        { color: { equals: 'white' } },
        { featured: { equals: false } }
      ],
    },
  ],
}
```

### Nested Properties (Relationships)

```typescript
// Query prin relationship
{ 'author.role': { equals: 'editor' } }
{ 'author.name': { contains: 'john' } }
{ 'meta.featured': { exists: true } }
```

### Select specific fields

```typescript
const posts = await payload.find({
  collection: 'posts',
  select: {
    title: true,
    slug: true,
    author: { name: true },
  },
})
```

### Filtrare complexa

```typescript
const services = await payload.find({
  collection: 'services',
  where: {
    and: [
      { featured: { equals: true } },
      { _status: { equals: 'published' } },
    ],
  },
  sort: '-createdAt',  // - pentru descending
  limit: 10,
  page: 1,
  depth: 2,  // Populates relationships (default is 2)
})
```

---

## 7. Plugin Override Pattern

```typescript
// CORECT - spread defaultCollection + adauga campuri
productsCollectionOverride: ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: { ...defaultCollection.admin, group: 'Shop' },
  fields: [
    // Campuri custom INAINTE
    { name: 'title', type: 'text', required: true },
    // Campuri DEFAULT din plugin
    ...(defaultCollection.fields || []),
    // Campuri custom DUPA
    { name: 'brand', type: 'text' },
  ],
})

// GRESIT - inlocuieste complet campurile
productsCollectionOverride: ({ defaultCollection }) => ({
  ...defaultCollection,
  fields: [
    // Pierde campurile plugin-ului!
    { name: 'title', type: 'text' },
  ],
})
```

---

## 8. Versioning & Drafts

### Config complet

```typescript
export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: {
    drafts: {
      autosave: true,           // Auto-save while editing
      schedulePublish: true,    // Schedule future publish
      validate: false,          // Don't validate drafts (default)
    },
    maxPerDoc: 100,  // Keep last 100 versions (0 = unlimited)
  },
}
```

### Draft API Usage

```typescript
// Create as draft (skips required field validation)
await payload.create({
  collection: 'posts',
  data: { title: 'Draft Post' },
  draft: true,
})

// Read with drafts (returns newest draft if exists)
const post = await payload.findByID({
  collection: 'posts',
  id: '123',
  draft: true,
})

// Access control pentru drafts
read: ({ req: { user } }) => {
  if (!user) return { _status: { equals: 'published' } }
  return true
}
```

### Document Status Values

| Status | Descriere |
|--------|-----------|
| `draft` | Never published |
| `published` | Published, no newer drafts |
| `changed` | Published but has newer unpublished drafts |

---

## 8b. Globals

Globals = single-instance documents (not collections).

```typescript
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.roles?.includes('admin'),
  },
  fields: [
    { name: 'siteName', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'link', type: 'relationship', relationTo: 'pages' },
      ],
    },
  ],
}

// Usage
const settings = await payload.findGlobal({ slug: 'site-settings' })
await payload.updateGlobal({
  slug: 'site-settings',
  data: { siteName: 'New Name' },
})
```

---

## 9. Upload Collection

```typescript
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 768, height: 1024 },
      { name: 'hero', width: 1920, height: 1080 },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
}
```

---

## 10. Advanced Field Patterns

### Conditional Fields (Show/Hide based on data)

```typescript
{
  name: 'showCustomSchedule',
  type: 'checkbox',
},
{
  name: 'customSchedule',
  type: 'array',
  admin: {
    condition: (data) => data?.showCustomSchedule === true,
  },
  fields: [/* ... */],
}

// Conditional based on select value
{
  name: 'paymentType',
  type: 'select',
  options: ['card', 'cash'],
},
{
  name: 'cardDetails',
  type: 'group',
  admin: {
    condition: (data) => data?.paymentType === 'card',
  },
  fields: [/* ... */],
}
```

### Virtual Fields (Computed, not in DB)

```typescript
{
  name: 'fullName',
  type: 'text',
  virtual: true,  // Not stored in database
  hooks: {
    afterRead: [
      ({ siblingData }) => {
        return `${siblingData.firstName} ${siblingData.lastName}`
      },
    ],
  },
}
```

### Join Fields (Reverse relationships)

```typescript
// In Posts collection - get comments that reference this post
{
  name: 'comments',
  type: 'join',
  collection: 'comments',
  on: 'post',  // Field in comments that references posts
}
```

### Field Types Reference

```typescript
type: 'text' | 'textarea' | 'email' | 'number' | 'checkbox' |
      'select' | 'radio' | 'date' | 'richText' | 'upload' |
      'relationship' | 'array' | 'blocks' | 'group' | 'tabs' |
      'row' | 'collapsible' | 'point' | 'json' | 'code' | 'ui' |
      'join'  // Reverse relationships (new in 3.x)
```

---

## 11. Security Pitfalls (CRITICE!)

### 1. Local API Access Control
```typescript
// ❌ SECURITY BUG: Access control BYPASSED by default!
await payload.find({
  collection: 'posts',
  user: someUser,  // Ignora permissions!
})

// ✅ SECURE: Enforces permissions
await payload.find({
  collection: 'posts',
  user: someUser,
  overrideAccess: false,  // REQUIRED!
})
```

### 2. Transaction Failures
```typescript
// ❌ DATA CORRUPTION: Separate transaction
await req.payload.create({ collection: 'logs', data: {...} })

// ✅ ATOMIC: Same transaction
await req.payload.create({ collection: 'logs', data: {...}, req })
```

### 3. Infinite Loops
```typescript
// ❌ INFINITE: Hook triggers itself
afterChange: [async ({ doc, req }) => {
  await req.payload.update({ collection: 'posts', id: doc.id, data: {...}, req })
}]

// ✅ SAFE: Use context flag
afterChange: [async ({ doc, req, context }) => {
  if (context.skipHooks) return
  await req.payload.update({ ..., context: { skipHooks: true }, req })
}]
```

---

## 12. Checklist Pre-Commit

- [ ] Niciun `any` in cod
- [ ] Tipuri importate din `@/payload-types`
- [ ] `pnpm generate:types` rulat dupa modificari schema
- [ ] Hooks transmit `req` pentru tranzactii atomice
- [ ] Access control setat corect
- [ ] `overrideAccess: false` pentru user operations
- [ ] `context` folosit pentru prevenire loops
- [ ] Componente verifica existenta datelor
- [ ] `interfaceName` setat pe toate blocurile

---

## 13. Resurse Oficiale

- [Payload Documentation](https://payloadcms.com/docs)
- [Payload llms-full.txt](https://payloadcms.com/llms-full.txt) - Context complet pentru LLMs
- [Access Control](https://payloadcms.com/docs/access-control/overview)
- [Hooks](https://payloadcms.com/docs/hooks/overview)
- [TypeScript](https://payloadcms.com/docs/typescript/overview)
- [GitHub Examples](https://github.com/payloadcms/payload/tree/main/examples)
- [GitHub Templates](https://github.com/payloadcms/payload/tree/main/templates)

---

*Consolidat din: PAYLOAD-BEST-PRACTICES.md*
*Verificat cu Payload Skill si documentatia oficiala: 2025-12-08*
*Conforma cu: payloadcms.com/llms-full.txt*
