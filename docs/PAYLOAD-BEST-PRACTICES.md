# PAYLOAD CMS BEST PRACTICES - FIȘIER CRUCIAL

**ACEST FIȘIER ESTE OBLIGATORIU DE RESPECTAT ÎN TOT PROIECTUL!**

Documentează cum lucrează experții Payload CMS și trebuie urmat întocmai.

---

## 1. REGULI TYPESCRIPT STRICTE

### NICIODATĂ `any`!

```typescript
// ❌ GREȘIT - INTERZIS
const handleClick = (data: any) => { ... }
const blocks: any[] = []

// ✅ CORECT - Folosește tipurile generate
import type { Page, Post, Media, Service } from '@/payload-types'

const handleClick = (data: Page) => { ... }
const blocks: Page['layout'][0][] = []
```

### Importă tipurile din `payload-types.ts`

```typescript
// ✅ CORECT
import type {
  Page,
  Post,
  Media,
  Service,
  Team,
  Testimonial
} from '@/payload-types'

// Pentru blocuri
import type {
  HeroBlock,
  ServicesBlock,
  // etc.
} from '@/payload-types'
```

### Generare tipuri

```bash
# Rulează MEREU după modificări în colecții/blocuri
pnpm generate:types
```

---

## 2. STRUCTURA BLOCURILOR (Pattern Oficial)

### Fiecare bloc are 2 fișiere:

```
src/blocks/
├── Hero/
│   ├── config.ts      # Configurația Payload (fields, labels)
│   └── Component.tsx  # Componenta React pentru frontend
├── Services/
│   ├── config.ts
│   └── Component.tsx
└── RenderBlocks.tsx   # Randează dinamic toate blocurile
```

### config.ts - Configurația blocului

```typescript
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock', // Pentru tipuri TypeScript
  labels: {
    singular: 'Hero',
    plural: 'Hero Blocks',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Left Aligned', value: 'left-aligned' },
        { label: 'Split', value: 'split' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'link',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
            {
              name: 'appearance',
              type: 'select',
              options: ['primary', 'secondary', 'outline'],
            },
          ],
        },
      ],
    },
  ],
}
```

### Component.tsx - Componenta React

```tsx
import React from 'react'
import type { HeroBlock as HeroBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'

// Props = tipul din Payload + props adiționale
type Props = HeroBlockProps & {
  className?: string
}

export const HeroBlock: React.FC<Props> = ({
  variant,
  heading,
  subheading,
  media,
  links,
  className,
}) => {
  return (
    <section className={cn('relative', className)}>
      {/* Verifică mereu dacă datele există */}
      {heading && <h1>{heading}</h1>}
      {subheading && <p>{subheading}</p>}

      {/* Pentru media - verifică și tipul */}
      {media && typeof media === 'object' && (
        <Media resource={media} />
      )}

      {/* Pentru arrays - verifică length */}
      {links && links.length > 0 && (
        <div className="flex gap-4">
          {links.map((item, i) => (
            <a key={i} href={item.link?.url}>
              {item.link?.label}
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
```

---

## 3. RENDER BLOCKS - Pattern Oficial

```tsx
// src/blocks/RenderBlocks.tsx
import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'

// Importă toate componentele blocurilor
import { HeroBlock } from './Hero/Component'
import { ServicesBlock } from './Services/Component'
import { TeamBlock } from './Team/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { GalleryBlock } from './Gallery/Component'
import { ContactBlock } from './Contact/Component'
import { FAQBlock } from './FAQ/Component'
import { PricingBlock } from './Pricing/Component'
import { CTABlock } from './CTA/Component'
import { StatsBlock } from './Stats/Component'

// Mapare blockType -> Component
const blockComponents = {
  hero: HeroBlock,
  services: ServicesBlock,
  team: TeamBlock,
  testimonials: TestimonialsBlock,
  gallery: GalleryBlock,
  contact: ContactBlock,
  faq: FAQBlock,
  pricing: PricingBlock,
  cta: CTABlock,
  stats: StatsBlock,
} as const

type Props = {
  blocks: Page['layout'][0][]
}

export const RenderBlocks: React.FC<Props> = ({ blocks }) => {
  // Validare
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        // Verifică dacă avem componentă pentru acest tip
        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType as keyof typeof blockComponents]

          return (
            <div key={index} className="my-16">
              {/* @ts-expect-error - Block props vary by type */}
              <Block {...block} />
            </div>
          )
        }

        return null
      })}
    </Fragment>
  )
}
```

---

## 4. COMPONENTA MEDIA - Pattern Oficial

```tsx
// src/components/Media/index.tsx
import React from 'react'
import type { Media as MediaType } from '@/payload-types'
import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

type Props = {
  resource: MediaType | string | null | undefined
  className?: string
  imgClassName?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  // Pentru lightbox
  onClick?: () => void
  enableLightbox?: boolean
}

export const Media: React.FC<Props> = (props) => {
  const { resource, onClick, enableLightbox } = props

  // Verifică dacă avem resursă validă
  if (!resource || typeof resource === 'string') {
    return null
  }

  // Detectează tipul media
  const isVideo = resource.mimeType?.includes('video')

  if (isVideo) {
    return <VideoMedia {...props} resource={resource} />
  }

  return (
    <ImageMedia
      {...props}
      resource={resource}
      onClick={onClick}
      enableLightbox={enableLightbox}
    />
  )
}
```

---

## 5. ACCES CONTROL - Pattern Oficial

```typescript
// src/access/index.ts
import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

// Oricine poate citi
export const anyone: Access = () => true

// Doar utilizatori autentificați
export const authenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

// Doar admini
export const admin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

// Publicat sau admin
export const publishedOrAdmin: Access = ({ req: { user } }) => {
  if (user?.role === 'admin') return true

  return {
    _status: { equals: 'published' },
  }
}

// Field access - doar admin poate edita
export const adminFieldAccess: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'admin'
}
```

---

## 6. HOOKS - Best Practices

### beforeChange Hook

```typescript
import type { CollectionBeforeChangeHook } from 'payload'

export const populateSlug: CollectionBeforeChangeHook = async ({
  data,
  operation,
}) => {
  if (operation === 'create' && data.title && !data.slug) {
    data.slug = slugify(data.title)
  }
  return data
}
```

### afterChange Hook cu Revalidare

```typescript
import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePost: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  // Previne loop infinit
  if (context.skipRevalidation) return doc

  // Revalidează doar în producție
  if (process.env.NODE_ENV === 'production') {
    revalidatePath(`/blog/${doc.slug}`)
    revalidateTag('posts')
  }

  return doc
}
```

### Hook cu Tranzacții (IMPORTANT!)

```typescript
// ✅ CORECT - Transmite req pentru aceeași tranzacție
export const cascadeDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  await req.payload.delete({
    collection: 'related-items',
    where: { parent: { equals: doc.id } },
    req, // OBLIGATORIU pentru tranzacție atomică!
  })
}
```

---

## 7. LOCAL API - Reguli Critice

### IMPORTANT: `overrideAccess`

```typescript
// ❌ PERICOL DE SECURITATE - Access control ignorat!
const posts = await payload.find({
  collection: 'posts',
  user: someUser, // User transmis DAR access control IGNORAT!
})

// ✅ CORECT - Aplică access control
const posts = await payload.find({
  collection: 'posts',
  user: someUser,
  overrideAccess: false, // OBLIGATORIU pentru a aplica regulile
})

// ✅ CORECT - Operație de sistem (seeder, cron)
const posts = await payload.create({
  collection: 'posts',
  data: { ... },
  overrideAccess: true, // OK pentru operații de sistem trusted
})
```

---

## 8. QUERY-URI - Patterns

```typescript
// Selectare câmpuri specifice
const posts = await payload.find({
  collection: 'posts',
  select: {
    title: true,
    slug: true,
    excerpt: true,
    // Relații populate
    author: {
      name: true,
      avatar: true,
    },
  },
})

// Filtrare complexă
const services = await payload.find({
  collection: 'services',
  where: {
    and: [
      { featured: { equals: true } },
      { _status: { equals: 'published' } },
      {
        or: [
          { category: { equals: categoryId } },
          { 'category.slug': { equals: 'popular' } },
        ],
      },
    ],
  },
  sort: '-order',
  limit: 10,
  depth: 2, // Populează relații
})
```

---

## 9. COMPONENTE FRONTEND - Patterns

### Server Component (Default în App Router)

```tsx
// app/(frontend)/services/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Service } from '@/payload-types'

export default async function ServicesPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: services } = await payload.find({
    collection: 'services',
    where: { _status: { equals: 'published' } },
    sort: 'order',
    depth: 1,
  })

  return (
    <main>
      {services.map((service: Service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </main>
  )
}
```

### Client Component (pentru interactivitate)

```tsx
'use client'

import { useState } from 'react'
import type { Media as MediaType } from '@/payload-types'
import { Lightbox } from '@/components/Lightbox'

type Props = {
  images: MediaType[]
}

export const Gallery: React.FC<Props> = ({ images }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const openLightbox = (index: number) => {
    setActiveIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="cursor-pointer"
          >
            <img src={image.url || ''} alt={image.alt || ''} />
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          activeIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
```

---

## 10. SKILL PAYLOAD - OBLIGATORIU!

**MEREU activează skill-ul Payload înainte de a lucra:**

```
/payload
```

Skill-ul oferă:
- Documentație actualizată
- Patterns pentru hooks, access control, queries
- Exemple de cod corecte
- Referințe pentru field types

---

## 11. CHECKLIST ÎNAINTE DE COMMIT

- [ ] Niciun `any` în cod
- [ ] Tipuri importate din `@/payload-types`
- [ ] `pnpm generate:types` rulat după modificări schema
- [ ] Hooks transmit `req` pentru tranzacții
- [ ] Access control setat corect pe colecții
- [ ] `overrideAccess: false` când operezi pe behalf of user
- [ ] Componente verifică existența datelor înainte de render
- [ ] Media component folosit pentru imagini
- [ ] Lightbox funcțional pentru galerii

---

## 12. RESURSE OFICIALE

- [Payload Documentation](https://payloadcms.com/docs)
- [Website Template GitHub](https://github.com/payloadcms/payload/tree/main/templates/website)
- [TypeScript Types](https://payloadcms.com/docs/typescript/generating-types)
- [Performance Best Practices](https://payloadcms.com/docs/performance/overview)
- [Payload Discord](https://discord.com/invite/payload)

---

## 13. WIDGET-URI DE IMPLEMENTAT (Din cercetare site-uri)

### Frizerie/Barbershop
- [ ] Lista prețuri cu linii punctate (2 coloane)
- [ ] WhatsApp floating button cu "Programări"
- [ ] Video YouTube embed
- [ ] Top bar cu social + telefon + adresă
- [ ] Testimoniale carousel elegant

### Dentist/Medical
- [ ] Formular programare inline (doctor, serviciu, dată)
- [ ] Video tabs (multiple video-uri în tab-uri)
- [ ] Carduri servicii cu iconițe și hover
- [ ] Echipa cu social links și specializări
- [ ] Newsletter signup
- [ ] Galerie with lightbox

### Restaurant
- [ ] Meniu digital cu categorii și prețuri
- [ ] Carousel preparate cu imagini
- [ ] Formular rezervare (persoane, dată, cerințe)
- [ ] Evenimente carousel
- [ ] Secțiune Happy Hour / Oferte
- [ ] Testimoniale cu rating (stele)

### Auto Service
- [ ] Calculator preț servicii
- [ ] Mărci auto deservite (logo grid)
- [ ] Galerie lucrări before/after
- [ ] Status programare

### Salon Beauty
- [ ] Before/After gallery slider
- [ ] Booking cu selectare stilist
- [ ] Instagram feed embed
- [ ] Gift cards / Pachete

### Avocat
- [ ] Arii practică cu iconițe
- [ ] CV echipă detaliat
- [ ] Articole juridice / Blog
- [ ] Consultație online formular

---

---

## 14. DIN SKILL-UL PAYLOAD (REFERINȚĂ OFICIALĂ)

### Quick Reference Table

| Task                     | Solution                                  |
| ------------------------ | ----------------------------------------- |
| Auto-generate slugs      | `slugField()` helper                      |
| Restrict content by user | Access control with query                 |
| Local API user ops       | `user` + `overrideAccess: false`          |
| Draft/publish workflow   | `versions: { drafts: true }`              |
| Computed fields          | `virtual: true` with afterRead            |
| Conditional fields       | `admin.condition`                         |
| Custom field validation  | `validate` function                       |
| Filter relationship list | `filterOptions` on field                  |
| Select specific fields   | `select` parameter                        |
| Auto-set author/dates    | beforeChange hook                         |
| Prevent hook loops       | `req.context` check                       |
| Cascading deletes        | beforeDelete hook                         |
| Reverse relationships    | `join` field type                         |
| Next.js revalidation     | Context control in afterChange            |

### Field Types Disponibile

```typescript
// Toate tipurile de field-uri
type: 'text' | 'textarea' | 'email' | 'number' | 'checkbox' |
      'select' | 'radio' | 'date' | 'richText' | 'upload' |
      'relationship' | 'array' | 'blocks' | 'group' | 'tabs' |
      'row' | 'collapsible' | 'point' | 'json' | 'code' | 'ui'
```

### Slug Field Helper (FOLOSEȘTE MEREU!)

```typescript
import { slugField } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({
      fieldToUse: 'title',
      // Generează automat slug din title
    }),
  ],
}
```

### Blocks cu interfaceName (OBLIGATORIU pentru tipuri!)

```typescript
const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock', // OBLIGATORIU - generează tip TypeScript
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'background', type: 'upload', relationTo: 'media' },
  ],
}
```

### Virtual Fields (Computed)

```typescript
// Calculat din alte câmpuri
const fullNameField: TextField = {
  name: 'fullName',
  type: 'text',
  virtual: true,
  hooks: {
    afterRead: [
      ({ siblingData }) => `${siblingData.firstName} ${siblingData.lastName}`
    ],
  },
}

// Din relationship path
const authorNameField: TextField = {
  name: 'authorName',
  type: 'text',
  virtual: 'author.name', // Populează automat
}
```

### Conditional Fields

```typescript
// Arată câmpul doar dacă type e 'highImpact' sau 'mediumImpact'
const mediaField: UploadField = {
  name: 'media',
  type: 'upload',
  relationTo: 'media',
  admin: {
    condition: (_, { type } = {}) =>
      ['highImpact', 'mediumImpact'].includes(type),
  },
}
```

### Hook Patterns

```typescript
// beforeValidate - formatare date
// beforeChange - business logic, auto-set fields
// afterChange - side effects, revalidare
// afterRead - computed fields
// beforeDelete - cleanup, validare

// IMPORTANT: Transmite mereu `req` pentru tranzacții!
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        req, // OBLIGATORIU pentru tranzacție atomică
      })
    },
  ]
}
```

### Context pentru Prevenire Loop Infinit

```typescript
hooks: {
  afterChange: [
    async ({ doc, req, context }) => {
      // Verifică flag-ul
      if (context.skipRevalidation) return doc

      // Setează flag-ul pentru operații nested
      await req.payload.update({
        collection: 'posts',
        id: doc.id,
        data: { views: doc.views + 1 },
        context: { skipRevalidation: true },
        req,
      })
    },
  ]
}
```

### Next.js Revalidation Pattern

```typescript
import { revalidatePath } from 'next/cache'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      payload.logger.info(`Revalidating page at path: ${path}`)
      revalidatePath(path)
    }
  }
  return doc
}
```

### Versioning & Drafts

```typescript
export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
    maxPerDoc: 100,
  },
  fields: [/* ... */],
}

// Query doar published pentru public
const publicAccess: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
```

### Access Control Patterns

```typescript
// Reusable access functions
export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

export const admins: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin')
}

export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true
  return { id: { equals: user?.id } }
}
```

### Query Operators

```typescript
// Toți operatorii disponibili
equals, not_equals, greater_than, greater_than_equal,
less_than, less_than_equal, contains, like, in, not_in,
exists, near, within, intersects

// Exemplu complex
const query: Where = {
  and: [
    { status: { equals: 'published' } },
    {
      or: [
        { featured: { equals: true } },
        { 'author.role': { equals: 'admin' } },
      ],
    },
  ],
}
```

### Upload Collection Pattern

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
    { name: 'caption', type: 'text', localized: true },
  ],
}
```

### Global Config Pattern

```typescript
export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Settings' },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'nav',
      type: 'array',
      fields: [
        { name: 'link', type: 'relationship', relationTo: 'pages' },
        { name: 'label', type: 'text' },
      ],
    },
  ],
}
```

---

## 15. ÎNAINTE DE ORICE LUCRU - ACTIVEAZĂ SKILL-UL!

```
/payload
```

**MEREU folosește skill-ul Payload când lucrezi cu:**
- Colecții și câmpuri
- Hooks și access control
- Queries și Local API
- Blocuri și componente

---

**ACEST DOCUMENT TREBUIE RESPECTAT ÎNTOTDEAUNA!**
