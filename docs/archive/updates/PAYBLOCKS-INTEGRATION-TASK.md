# Task: Integrare Funcționalități PayBlocks în Proiectul Nostru

## Context

PayBlocks (https://payblocks.trieb.work/) este un template premium Payload CMS + Next.js + shadcn/ui cu 70+ blocuri convertite pentru Payload. Acest document descrie ce funcționalități și blocuri merită integrate în sistemul nostru.

**Surse cercetare:**
- https://payblocks.trieb.work/
- https://demo-payblocks.trieb.work/
- https://www.shadcnblocks.com/payload-cms
- https://docs.shadcnblocks.com/payload/custom-blocks/

---

## 1. Structura Blocurilor PayBlocks (De Copiat)

### Arhitectura Fișierelor per Block

```
BlockCategory/
├── config.ts          # Configurația Payload (fields, interfaceName)
├── Component.tsx      # Componenta principală care face routing la variante
├── variant1.tsx       # Varianta de design 1
├── variant2.tsx       # Varianta de design 2
└── variant-custom.tsx # Variante custom
```

**IMPORTANT:** Fiecare bloc are un câmp `designVersion` care permite alegerea variantei din admin panel.

### Exemplu Config cu Design Versions

```typescript
// src/blocks/Feature/config.ts
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
        { label: 'Feature Alternating', value: 'FEATURE4' },
      ],
    },
    // ... alte field-uri
  ],
}
```

### Exemplu Component cu Routing

```typescript
// src/blocks/Feature/Component.tsx
import Feature1 from './feature1'
import Feature2 from './feature2'
import Feature3 from './feature3'
import Feature4 from './feature4'

const variants: { [key: string]: React.FC<FeatureBlock> } = {
  FEATURE1: Feature1,
  FEATURE2: Feature2,
  FEATURE3: Feature3,
  FEATURE4: Feature4,
}

export const FeatureBlock: React.FC<FeatureBlock> = (props) => {
  const { designVersion = 'FEATURE1' } = props
  const SelectedVariant = variants[designVersion] || Feature1
  return <SelectedVariant {...props} />
}
```

---

## 2. Blocuri Noi de Implementat

### 2.1 LogosBlock (Parteneri/Clienți)

**Descriere:** Bandă cu logo-uri ale partenerilor/clienților, opțional cu scroll automat.

**Variante de design:**
- LOGOS1: Grid simplu de logo-uri
- LOGOS2: Carusel auto-scroll infinit
- LOGOS3: Logo-uri cu hover effect și link

**Config:**

```typescript
export const LogosBlock: Block = {
  slug: 'logos',
  interfaceName: 'LogosBlock',
  fields: [
    {
      name: 'designVersion',
      type: 'select',
      options: ['LOGOS1', 'LOGOS2', 'LOGOS3'],
      defaultValue: 'LOGOS1',
    },
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'logos',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
        { name: 'link', type: 'text' },
      ],
    },
    { name: 'autoScroll', type: 'checkbox', defaultValue: false },
    { name: 'grayscale', type: 'checkbox', defaultValue: true },
  ],
}
```

---

### 2.2 SplitViewBlock (Text + Imagine)

**Descriere:** Secțiune cu text pe o parte și imagine/video pe cealaltă. Foarte versatil.

**Variante:**
- SPLIT1: Text stânga, imagine dreapta
- SPLIT2: Imagine stânga, text dreapta
- SPLIT3: Text cu bullets/checkmarks + imagine
- SPLIT4: Cu video în loc de imagine

**Config:**

```typescript
export const SplitViewBlock: Block = {
  slug: 'splitView',
  interfaceName: 'SplitViewBlock',
  fields: [
    {
      name: 'designVersion',
      type: 'select',
      options: ['SPLIT1', 'SPLIT2', 'SPLIT3', 'SPLIT4'],
      defaultValue: 'SPLIT1',
    },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    { name: 'content', type: 'richText' },
    {
      name: 'features',
      type: 'array',
      fields: [
        { name: 'icon', type: 'select', options: ['check', 'star', 'arrow', 'plus'] },
        { name: 'text', type: 'text', required: true },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'videoUrl', type: 'text' },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'text', type: 'text' },
        { name: 'link', type: 'text' },
        { name: 'variant', type: 'select', options: ['primary', 'secondary', 'outline'] },
      ],
    },
    { name: 'imagePosition', type: 'select', options: ['left', 'right'], defaultValue: 'right' },
    { name: 'backgroundColor', type: 'text' },
  ],
}
```

---

### 2.3 AboutBlock (Despre Noi Extins)

**Descriere:** Secțiune despre companie cu mai multe variante de layout.

**Variante:**
- ABOUT1: Text simplu cu imagine laterală
- ABOUT2: Cu timeline/istorie
- ABOUT3: Cu statistici integrate
- ABOUT4: Cu valori/misiune în cards

**Config:**

```typescript
export const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  fields: [
    {
      name: 'designVersion',
      type: 'select',
      options: ['ABOUT1', 'ABOUT2', 'ABOUT3', 'ABOUT4'],
      defaultValue: 'ABOUT1',
    },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    { name: 'content', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'timeline',
      type: 'array',
      admin: { condition: (data) => data.designVersion === 'ABOUT2' },
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      admin: { condition: (data) => data.designVersion === 'ABOUT3' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'values',
      type: 'array',
      admin: { condition: (data) => data.designVersion === 'ABOUT4' },
      fields: [
        { name: 'icon', type: 'select', options: ['heart', 'target', 'users', 'shield', 'star'] },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
  ],
}
```

---

### 2.4 TimelineBlock (Proces/Etape)

**Descriere:** Afișare pași/proces/etape într-un format vizual.

**Variante:**
- TIMELINE1: Vertical cu linie
- TIMELINE2: Horizontal cu iconițe
- TIMELINE3: Cards numerotate
- TIMELINE4: Zigzag alternant

**Config:**

```typescript
export const TimelineBlock: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  fields: [
    {
      name: 'designVersion',
      type: 'select',
      options: ['TIMELINE1', 'TIMELINE2', 'TIMELINE3', 'TIMELINE4'],
      defaultValue: 'TIMELINE1',
    },
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'steps',
      type: 'array',
      required: true,
      fields: [
        { name: 'number', type: 'number' },
        { name: 'icon', type: 'select', options: ['phone', 'calendar', 'check', 'star', 'clock'] },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

---

### 2.5 ComparisonBlock (Comparație)

**Descriere:** Tabel sau cards de comparație (ex: planuri, before/after features).

**Variante:**
- COMPARISON1: Tabel clasic
- COMPARISON2: Cards side-by-side
- COMPARISON3: Slider before/after (extins)

**Config:**

```typescript
export const ComparisonBlock: Block = {
  slug: 'comparison',
  interfaceName: 'ComparisonBlock',
  fields: [
    {
      name: 'designVersion',
      type: 'select',
      options: ['COMPARISON1', 'COMPARISON2', 'COMPARISON3'],
      defaultValue: 'COMPARISON1',
    },
    { name: 'title', type: 'text' },
    {
      name: 'columns',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'highlighted', type: 'checkbox', defaultValue: false },
        { name: 'price', type: 'text' },
        {
          name: 'features',
          type: 'array',
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'included', type: 'checkbox', defaultValue: true },
          ],
        },
      ],
    },
  ],
}
```

---

## 3. Îmbunătățiri la Blocuri Existente

### 3.1 Hero - Adaugă Variante

Blocul Hero existent trebuie extins cu:

**Variante noi:**
- HERO1: Centered cu CTA (existent)
- HERO2: Split cu imagine dreapta
- HERO3: Video background
- HERO4: Gradient animat
- HERO5: Cu formular inline (booking/newsletter)
- HERO6: Minimal cu doar text

**Câmpuri noi de adăugat:**

```typescript
{
  name: 'designVersion',
  type: 'select',
  options: ['HERO1', 'HERO2', 'HERO3', 'HERO4', 'HERO5', 'HERO6'],
  defaultValue: 'HERO1',
},
{
  name: 'videoUrl',
  type: 'text',
  admin: { condition: (data) => data.designVersion === 'HERO3' },
},
{
  name: 'gradientColors',
  type: 'group',
  admin: { condition: (data) => data.designVersion === 'HERO4' },
  fields: [
    { name: 'from', type: 'text', defaultValue: '#667eea' },
    { name: 'to', type: 'text', defaultValue: '#764ba2' },
  ],
},
{
  name: 'showBookingForm',
  type: 'checkbox',
  admin: { condition: (data) => data.designVersion === 'HERO5' },
},
```

---

### 3.2 Services - Adaugă Variante

**Variante noi:**
- SERVICES1: Grid cards (existent)
- SERVICES2: Lista cu iconițe
- SERVICES3: Tabs cu categorii
- SERVICES4: Acordeon expandabil
- SERVICES5: Bento grid asimetric

---

### 3.3 Team - Adaugă Variante

**Variante noi:**
- TEAM1: Grid cards (existent)
- TEAM2: Carusel
- TEAM3: Cu hover flip card
- TEAM4: Lista simplă cu foto mică

---

### 3.4 Testimonials - Adaugă Variante

**Variante noi:**
- TESTIMONIALS1: Grid cards (existent)
- TESTIMONIALS2: Carusel cu arrows
- TESTIMONIALS3: Masonry layout
- TESTIMONIALS4: Single featured cu rotație automată
- TESTIMONIALS5: Cu video testimonials

---

### 3.5 Gallery - Adaugă Variante

**Variante noi:**
- GALLERY1: Grid uniform (existent)
- GALLERY2: Masonry
- GALLERY3: Carusel fullwidth
- GALLERY4: Cu filtrare pe categorii
- GALLERY5: Bento asimetric

---

### 3.6 Pricing - Adaugă Variante

**Variante noi:**
- PRICING1: Cards verticale (existent)
- PRICING2: Tabel comparativ
- PRICING3: Cu toggle monthly/yearly
- PRICING4: Slider pentru pachete multiple

---

### 3.7 FAQ - Adaugă Variante

**Variante noi:**
- FAQ1: Acordeon simplu (existent)
- FAQ2: Două coloane
- FAQ3: Cu categorii/tabs
- FAQ4: Search integrat

---

### 3.8 Contact - Adaugă Variante

**Variante noi:**
- CONTACT1: Form simplu (existent)
- CONTACT2: Split cu info + form
- CONTACT3: Cu hartă integrată
- CONTACT4: Cards multiple locații

---

## 4. Funcționalități Noi de Implementat

### 4.1 Live Preview (IMPORTANT)

PayBlocks are live preview integrat cu split-view editing.

**Pași implementare:**
1. Configurează `livePreview` în `payload.config.ts`:

```typescript
admin: {
  livePreview: {
    url: ({ data, locale }) => `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/${data.slug}`,
    collections: ['pages'],
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
    ],
  },
},
```

2. Adaugă `RefreshRouteOnSave` component în layout frontend.

---

### 4.2 Drag & Drop Blocks (Opțional)

Payload 3 suportă reordonarea blocurilor prin drag & drop în admin. Verifică că e activat.

---

### 4.3 OG Image Generation

PayBlocks generează automat imagini OG pentru social sharing.

**Implementare:**
- Creează `src/app/api/og/route.tsx` cu `@vercel/og`
- Configurează în SEO plugin să folosească endpoint-ul

---

### 4.4 Redirect Management

Sistem de redirects pentru SEO (util la migrări).

**Collection nouă:**

```typescript
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { group: 'Settings' },
  fields: [
    { name: 'from', type: 'text', required: true, unique: true },
    { name: 'to', type: 'text', required: true },
    { name: 'type', type: 'select', options: ['301', '302'], defaultValue: '301' },
  ],
}
```

---

## 5. Sistem de Variante - Pattern Universal

### Implementare Step-by-Step

Pentru FIECARE bloc din sistemul nostru, aplică acest pattern:

**1. Adaugă câmp `designVersion` în config:**

```typescript
{
  name: 'designVersion',
  type: 'select',
  required: true,
  defaultValue: 'VARIANT1',
  options: [
    { label: 'Nume Descriptiv 1', value: 'VARIANT1' },
    { label: 'Nume Descriptiv 2', value: 'VARIANT2' },
    // ...
  ],
  admin: {
    description: 'Alege stilul vizual pentru acest bloc',
  },
},
```

**2. Creează fișiere pentru variante:**

```
src/blocks/NumeBlock/
├── config.ts
├── Component.tsx      # Router principal
├── variant1.tsx       # Prima variantă
├── variant2.tsx       # A doua variantă
└── styles.css         # Stiluri comune (opțional)
```

**3. Actualizează Component.tsx să ruteze:**

```typescript
const variants = {
  VARIANT1: Variant1,
  VARIANT2: Variant2,
}

export const NumeBlock: React.FC<Props> = (props) => {
  const Component = variants[props.designVersion] || variants.VARIANT1
  return <Component {...props} />
}
```

---

## 6. Ordine Prioritară de Implementare

### Prioritate 1 (Critice)
1. [ ] Sistem designVersion pentru Hero (6 variante)
2. [ ] Sistem designVersion pentru Services (5 variante)
3. [ ] LogosBlock nou (3 variante)
4. [ ] SplitViewBlock nou (4 variante)

### Prioritate 2 (Importante)
5. [ ] Sistem designVersion pentru Team (4 variante)
6. [ ] Sistem designVersion pentru Testimonials (5 variante)
7. [ ] Sistem designVersion pentru Gallery (5 variante)
8. [ ] TimelineBlock nou (4 variante)

### Prioritate 3 (Nice to Have)
9. [ ] AboutBlock nou (4 variante)
10. [ ] ComparisonBlock nou (3 variante)
11. [ ] Sistem designVersion pentru Pricing (4 variante)
12. [ ] Sistem designVersion pentru FAQ (4 variante)
13. [ ] Sistem designVersion pentru Contact (4 variante)

### Prioritate 4 (Opționale)
14. [ ] Live Preview setup
15. [ ] OG Image generation
16. [ ] Redirects collection

---

## 7. Reguli de Implementare

1. **TypeScript Strict**: Folosește tipuri din `@/payload-types`, NICIODATĂ `any`
2. **interfaceName**: Obligatoriu în fiecare config pentru generare tipuri corecte
3. **CSS Variables**: Pentru culori - permite tematizare din Theme global
4. **Responsive**: Mobile-first, toate variantele trebuie să arate bine pe mobil
5. **Accessibility**: ARIA labels, keyboard navigation, contrast suficient
6. **Build Clean**: 0 warnings, 0 errors
7. **Naming Consistent**:
   - Config: `NumeBlock` (PascalCase)
   - slug: `nume` (camelCase)
   - Variante: `NUME1`, `NUME2` (UPPERCASE + number)

---

## 8. Exemplu Complet de Referință

Vezi cum e implementat `PriceListDotted` în proiect pentru un exemplu funcțional:
- `src/blocks/PriceListDotted/config.ts`
- `src/blocks/PriceListDotted/Component.tsx`

Acesta poate fi extins cu variante folosind pattern-ul descris mai sus.

---

## 9. Resurse Adiționale

- PayBlocks Demo: https://demo-payblocks.trieb.work/
- Shadcn Blocks: https://www.shadcnblocks.com/
- Documentație Payload Blocks: https://payloadcms.com/docs/fields/blocks
- Documentație Live Preview: https://payloadcms.com/docs/live-preview

---

**Data cercetării:** 2025-12-03
**Realizat de:** Claude Terminal 2 (Research)
**Pentru:** Claude Terminal 1 (Implementation)
