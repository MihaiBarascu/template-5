---
status: ACTIVE
type: guide
created: 2025-12-01
updated: 2025-12-08
related:
  - ../../_ARCHITECTURE.md#adr-004
  - ../practices/payload-cms.md
  - ../practices/design-system.md
tags: [blocks, payload, components, react]
---

# Ghid Creare Blocuri Payload

> **Pattern:** Fiecare bloc = 2 fisiere (config.ts + Component.tsx)
> **Regula:** INTOTDEAUNA adauga `interfaceName` in config!

---

## 1. Structura Fisiere

```
src/blocks/
├── Hero/
│   ├── config.ts       # Configuratia Payload (fields, labels)
│   └── Component.tsx   # Componenta React pentru frontend
├── Services/
│   ├── config.ts
│   └── Component.tsx
└── RenderBlocks.tsx    # Randeaza dinamic toate blocurile
```

---

## 2. config.ts (Template)

```typescript
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',  // OBLIGATORIU pentru TypeScript!
  labels: { singular: 'Hero', plural: 'Hero Blocks' },
  imageURL: '/blocks/hero.svg',  // Thumbnail in admin
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Titlu',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine',
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Primary', value: 'primary' },
      ],
    },
  ],
}
```

---

## 3. Component.tsx (Template)

```tsx
import type { HeroBlock as HeroBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'

export const HeroBlock: React.FC<HeroBlockProps> = ({
  heading,
  subheading,
  media,
  backgroundColor = 'default',
}) => {
  const isDark = backgroundColor === 'dark' || backgroundColor === 'primary'

  return (
    <section
      className={cn(
        'py-16 md:py-20',
        backgroundColor === 'dark' && 'bg-theme-dark',
        backgroundColor === 'light' && 'bg-theme-light',
        backgroundColor === 'primary' && 'bg-theme-primary',
      )}
    >
      <div className="container mx-auto px-4">
        {heading && (
          <h1
            className={cn(
              'text-4xl md:text-5xl font-bold mb-4',
              isDark ? 'text-white' : 'text-theme-text'
            )}
          >
            {heading}
          </h1>
        )}

        {subheading && (
          <p
            className={cn(
              'text-lg max-w-2xl',
              isDark ? 'text-white/70' : 'text-theme-text-light'
            )}
          >
            {subheading}
          </p>
        )}

        {media && typeof media === 'object' && (
          <Media resource={media} className="mt-8 rounded-lg" />
        )}
      </div>
    </section>
  )
}
```

---

## 4. Inregistrare Bloc

### In blocks/index.ts
```typescript
export * from './Hero/config'
export { HeroBlock as HeroBlockComponent } from './Hero/Component'
```

### In RenderBlocks.tsx
```tsx
import { HeroBlockComponent } from '@/blocks'
import type { Page } from '@/payload-types'

const blockComponents = {
  hero: HeroBlockComponent,
  // ... alte blocuri
}

export const RenderBlocks: React.FC<{ blocks: Page['layout'] }> = ({ blocks }) => {
  return (
    <>
      {blocks?.map((block, index) => {
        const Block = blockComponents[block.blockType]
        if (!Block) return null
        return <Block key={index} {...block} />
      })}
    </>
  )
}
```

### In payload.config.ts (sau colectia Pages)
```typescript
import { HeroBlock } from '@/blocks'

// In Pages collection fields:
{
  name: 'layout',
  type: 'blocks',
  blocks: [HeroBlock, /* ... */],
}
```

---

## 5. Blocuri Existente

| Bloc | Slug | Variante | Descriere |
|------|------|----------|-----------|
| Hero | `hero` | simple, with-image, split | Sectiune hero |
| Services | `services` | grid, list, cards | Servicii |
| Team | `team` | grid, carousel | Echipa |
| Testimonials | `testimonials` | slider, grid | Recenzii |
| Contact | `contact` | form, info, split | Contact |
| FAQ | `faq` | accordion, grid | Intrebari |
| Gallery | `gallery` | grid, masonry | Galerie |
| OpeningHours | `openingHours` | simple, with-image, card | Program |
| Locations | `locations` | cards, list-map | Locatii |
| BrandLogos | `brandLogos` | row, grid, slider | Logo-uri |
| Timeline | `timeline` | vertical, horizontal | Istorie |
| AnnouncementBar | `announcementBar` | simple, countdown | Anunturi |
| Content | `content` | default | Rich text |
| Map | `map` | embed | Google Maps |

---

## 6. Tipuri de Campuri Comune

### Upload Media
```typescript
{
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  required: true,
}
```

### Select cu Optiuni
```typescript
{
  name: 'variant',
  type: 'select',
  defaultValue: 'default',
  options: [
    { label: 'Default', value: 'default' },
    { label: 'Alternativ', value: 'alt' },
  ],
}
```

### Array (Repeater)
```typescript
{
  name: 'items',
  type: 'array',
  minRows: 1,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
  ],
}
```

### Grup
```typescript
{
  name: 'ctaButton',
  type: 'group',
  fields: [
    { name: 'label', type: 'text', defaultValue: 'Afla mai mult' },
    { name: 'link', type: 'text' },
  ],
}
```

### Conditie (Admin)
```typescript
{
  name: 'customSchedule',
  type: 'array',
  admin: {
    condition: (data) => data?.source === 'custom',
  },
  fields: [/* ... */],
}
```

---

## 7. Pattern isDark

OBLIGATORIU pentru toate blocurile cu `backgroundColor`:

```tsx
const isDark = backgroundColor === 'dark' || backgroundColor === 'primary'

// Text
className={isDark ? 'text-white' : 'text-theme-text'}

// Borders
className={isDark ? 'border-white/10' : 'border-theme-border'}

// Cards
className={isDark ? 'bg-white/5' : 'bg-white'}
```

---

## 8. Checklist Bloc Nou

- [ ] Creat `config.ts` cu `interfaceName`
- [ ] Creat `Component.tsx` cu tipuri corecte
- [ ] Adaugat in `blocks/index.ts`
- [ ] Adaugat in `RenderBlocks.tsx`
- [ ] Adaugat in colectia Pages
- [ ] Rulat `pnpm generate:types`
- [ ] Pattern `isDark` implementat
- [ ] Design system respectat
- [ ] Testat in admin panel
- [ ] Thumbnail SVG creat (optional)

---

*Consolidat din: BLOCKS.md*
*Verificat: 2025-12-08*
