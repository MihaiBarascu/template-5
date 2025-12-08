---
status: REFERENCE
type: catalog
created: 2025-12-01
tags: [payblocks, payload, blocks, catalog]
---

# PayBlocks - Blocuri Payload-Ready

> **Sursa:** https://payblocks.trieb.work/
> **Total:** 70+ blocuri

---

## Despre PayBlocks

Template premium Payload CMS + Next.js + shadcn/ui cu blocuri convertite pentru Payload admin panel.

---

## Arhitectura Bloc PayBlocks

```
BlockCategory/
├── config.ts          # Configuratia Payload
├── Component.tsx      # Routing la variante
├── variant1.tsx       # Varianta 1
├── variant2.tsx       # Varianta 2
└── variant-custom.tsx # Variante custom
```

### Pattern designVersion

```typescript
export const FeatureBlock: Block = {
  slug: 'feature',
  interfaceName: 'FeatureBlock',
  fields: [
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      defaultValue: 'FEATURE1',
      options: [
        { label: 'Feature Grid', value: 'FEATURE1' },
        { label: 'Feature Bento', value: 'FEATURE2' },
        { label: 'Feature Cards', value: 'FEATURE3' },
      ],
    },
  ],
}
```

---

## Blocuri Disponibile

| Bloc | Variante | Descriere |
|------|----------|-----------|
| Hero | 5+ | Banner principal |
| Feature | 4+ | Functionalitati |
| Gallery | 3+ | Galerie |
| Pricing | 3+ | Preturi |
| Testimonial | 4+ | Recenzii |
| CTA | 3+ | Call-to-action |
| FAQ | 2+ | Intrebari |
| Team | 3+ | Echipa |
| Logos | 3+ | Parteneri |
| Contact | 2+ | Formular |
| Stats | 2+ | Statistici |

---

## Pattern Component cu Routing

```typescript
import Feature1 from './feature1'
import Feature2 from './feature2'

const variants = {
  FEATURE1: Feature1,
  FEATURE2: Feature2,
}

export const FeatureBlock: React.FC<Props> = (props) => {
  const { designVersion = 'FEATURE1' } = props
  const SelectedVariant = variants[designVersion] || Feature1
  return <SelectedVariant {...props} />
}
```

---

*Document de referinta - nu modifica*
