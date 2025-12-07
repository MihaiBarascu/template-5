# Lessons Learned - Universal Business Website Template

## Documentație Tehnică și Reguli de Web Design

Acest document conține lecțiile învățate și cele mai importante reguli de web design implementate în proiect.

---

## ⚠️ REGULA FUNDAMENTALĂ - PAYLOAD CMS BEST PRACTICES

### NICIODATĂ NU FACEM LUCRURI DE CAPUL NOSTRU!

**Acest proiect este construit cu Payload CMS și trebuie să respectăm 100% best practices-urile oficiale.**

#### Resurse Oficiale (OBLIGATORIU de consultat înainte de orice modificare):

1. **Documentație Payload CMS**: https://payloadcms.com/docs
2. **Plugin Ecommerce**: https://payloadcms.com/docs/ecommerce/overview
3. **GitHub Payload**: https://github.com/payloadcms/payload
4. **Exemple oficiale**: https://github.com/payloadcms/payload/tree/main/examples
5. **llms-full.txt**: https://payloadcms.com/llms-full.txt (pentru referință AI)

#### Reguli de Aur:

| Regulă | Ce să faci | Ce să NU faci |
|--------|-----------|---------------|
| **Colecții** | Folosește pattern-uri din documentație | Nu inventa structuri noi |
| **Plugin Override** | Spread `defaultCollection.fields` + adaugă câmpuri | Nu înlocui complet fields array |
| **Hooks** | Folosește `req` pentru tranzacții | Nu face operații separate |
| **Access Control** | Folosește pattern-uri oficiale | Nu hardcoda logica |
| **Types** | Generează cu `pnpm generate:types` | Nu scrie tipuri manual |
| **Queries** | Folosește `select` pentru performanță | Nu folosește `depth: 10` |

#### Pattern Corect pentru Plugin Override:

```typescript
// ✅ CORECT - respectă Payload best practices
productsCollectionOverride: ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection.admin,
    // Modificări admin
  },
  fields: [
    // Câmpuri custom ÎNAINTE
    { name: 'title', type: 'text', required: true },
    // Câmpuri DEFAULT din plugin
    ...(defaultCollection.fields || []),
    // Câmpuri custom DUPĂ
    { name: 'brand', type: 'text' },
  ],
})

// ❌ GREȘIT - nu respectă pattern-ul
productsCollectionOverride: ({ defaultCollection }) => ({
  ...defaultCollection,
  fields: [
    // Înlocuiește complet câmpurile fără a păstra defaults
    { name: 'title', type: 'text' },
    { name: 'price', type: 'number' },  // Poate intra în conflict cu plugin
  ],
})
```

#### Înainte de Orice Modificare:

1. ✅ Citește documentația oficială pentru feature-ul respectiv
2. ✅ Verifică dacă există un plugin oficial pentru funcționalitate
3. ✅ Verifică exemplele din GitHub
4. ✅ Folosește pattern-urile din documentația Payload skill
5. ✅ Testează că nu strici funcționalități existente

#### Documentație Locală Payload Skill:

Acest proiect are acces la Payload CMS skill cu referințe pentru:
- `FIELDS.md` - Toate tipurile de câmpuri și opțiuni
- `COLLECTIONS.md` - Pattern-uri colecții, auth, upload, drafts
- `HOOKS.md` - Hooks și context patterns
- `ACCESS-CONTROL.md` - Access control și RBAC
- `QUERIES.md` - Query operators și Local API
- `PLUGIN-DEVELOPMENT.md` - Dezvoltare plugins

**NU UITA: Când nu ești sigur, consultă ÎNTOTDEAUNA documentația oficială Payload CMS!**

---

## 1. Sistemul de Culori cu CSS Variables

### Regula Fundamentală
**NICIODATĂ nu folosi culori hardcodate** (ex: `text-gray-600`, `bg-gray-900`).
**ÎNTOTDEAUNA** folosește variabilele CSS ale temei.

### Mapare Culori

| Culoare Hardcodată (NU) | Variabilă Temă (DA) |
|-------------------------|---------------------|
| `text-gray-900` | `text-theme-text` |
| `text-gray-600` | `text-theme-text-light` |
| `text-gray-500` | `text-theme-text-muted` |
| `text-gray-300` | `text-white/70` (pe fundal întunecat) |
| `bg-gray-50` | `bg-theme-light` |
| `bg-gray-100` | `bg-theme-light` |
| `bg-gray-900` | `bg-theme-dark` |
| `bg-white` | `bg-theme-surface` |
| `border-gray-200` | `border-theme-border` |
| `border-gray-700` | `border-white/10` (pe fundal întunecat) |

### Pattern pentru Fundal Dark/Light

```tsx
const isDark = backgroundColor === 'dark' || backgroundColor === 'primary'

// Text principal
className={isDark ? 'text-white' : 'text-theme-text'}

// Text secundar
className={isDark ? 'text-white/70' : 'text-theme-text-light'}

// Text mut/metadata
className={isDark ? 'text-white/50' : 'text-theme-text-muted'}

// Border-uri
className={isDark ? 'border-white/10' : 'border-theme-border'}

// Carduri/Suprafețe
className={isDark ? 'bg-white/5' : 'bg-white'}
```

---

## 2. Sistemul de Border Radius

### Folosește ÎNTOTDEAUNA variabilele CSS

```tsx
// NU
className="rounded-lg"

// DA
className="rounded-[var(--radius-card)]"
className="rounded-[var(--radius-button)]"
className="rounded-[var(--radius-input)]"
```

### Variabile disponibile:
- `--radius-sm` - elemente mici
- `--radius-md` - elemente medii
- `--radius-lg` - elemente mari
- `--radius-xl` - containere mari
- `--radius-button` - butoane
- `--radius-card` - carduri
- `--radius-input` - input-uri

---

## 3. Sistemul de Spacing (8px Grid)

### Regula
Tot spacing-ul trebuie să fie multiplu de 8px.

```css
py-section  /* folosește --spacing-section */
py-12       /* 48px - secțiune header */
gap-6       /* 24px - gap între carduri */
p-6         /* 24px - padding card */
mb-4        /* 16px - spacing între elemente */
gap-2       /* 8px - spacing mic */
```

### Secțiuni Standard
```tsx
<section className="py-section"> // 80px desktop, 48px mobile
```

---

## 4. Sistemul de Fonturi

### Variante de Temă și Fonturi

| Temă | Heading Font | Body Font | Stil |
|------|--------------|-----------|------|
| `dark-gold` | Playfair Display | Inter | Elegant/Premium |
| `modern-red` | Montserrat | Open Sans | Modern/Bold |
| `classic-blue` | Inter | Inter | Profesional/Clean |
| `fresh-green` | Poppins | Open Sans | Fresh/Friendly |
| `minimal-black` | Inter | Inter | Minimal/Tech |
| `purple-premium` | Playfair Display | Lato | Premium/Luxury |
| `brown-vintage` | Lora | Source Sans Pro | Vintage/Clasic |
| `pink-soft` | Playfair Display | Lato | Soft/Feminin |

### Folosire în CSS

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

body, p, span {
  font-family: var(--font-body);
}
```

---

## 5. Ierarhia Vizuală (Typography)

### Reguli de Font Size

| Element | Desktop | Mobile | Weight |
|---------|---------|--------|--------|
| H1 | 48px (3rem) | 36px | 700 (bold) |
| H2 | 36px (2.25rem) | 30px | 700 (bold) |
| H3 | 24px (1.5rem) | 20px | 600 (semibold) |
| H4 | 20px (1.25rem) | 18px | 600 (semibold) |
| Body | 16px (1rem) | 16px | 400 (normal) |
| Small | 14px (0.875rem) | 14px | 400 |

### Clasele Tailwind

```tsx
// Titlu secțiune (H2)
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">

// Subtitlu secțiune
<p className="text-lg text-theme-text-light max-w-2xl mx-auto">

// Titlu card (H3)
<h3 className="text-xl font-semibold">

// Descriere card
<p className="text-sm text-theme-text-light">
```

---

## 6. Contrastul Text/Background

### Regula WCAG
Raportul de contrast trebuie să fie minim **4.5:1** pentru text normal.

### Combinații Garantate

| Background | Text Principal | Text Secundar |
|------------|---------------|---------------|
| `bg-theme-surface` (alb) | `text-theme-text` | `text-theme-text-light` |
| `bg-theme-light` | `text-theme-text` | `text-theme-text-light` |
| `bg-theme-dark` | `text-white` | `text-white/70` |
| `bg-theme-primary` | `text-white` | `text-white/80` |

---

## 7. Regula 60-30-10 pentru Culori

- **60%** - Culoare dominantă (background, suprafețe) → `bg-theme-surface`, `bg-theme-light`
- **30%** - Culoare secundară (elemente mari) → `bg-theme-dark`, `bg-theme-primary`
- **10%** - Culoare accent (CTA, badges) → `bg-theme-accent`, `text-theme-accent`

---

## 8. Animații și Tranziții

### Timing Standard
- **Fast**: 150ms - micro-interacțiuni
- **Normal**: 300ms - majoritatea tranzițiilor
- **Slow**: 500ms - animații de intrare

### Pattern pentru Entry Animation

```tsx
const [isLoaded, setIsLoaded] = useState(false)

useEffect(() => {
  setIsLoaded(true)
}, [])

<div
  className={cn(
    'transition-all duration-500',
    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  )}
  style={{ transitionDelay: `${index * 75}ms` }}
>
```

---

## 9. Pattern pentru Blocuri

### Structura Standard

```tsx
export function ExampleBlock({
  variant = 'default',
  heading,
  subheading,
  backgroundColor = 'default',
  items = [],
}: ExampleBlockProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const bgClass = {
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-white',
  }[backgroundColor] || 'bg-theme-surface'

  const isDark = backgroundColor === 'dark'

  // Empty state
  if (items.length === 0) {
    return (
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          <div className={cn(
            'text-center py-16 border-2 border-dashed rounded-xl',
            isDark ? 'border-white/20' : 'border-theme-border'
          )}>
            {/* Empty state icon + message */}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('py-section', bgClass)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className={cn(
                'text-3xl md:text-4xl font-bold mb-4',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn(
                'text-lg max-w-2xl mx-auto',
                isDark ? 'text-white/70' : 'text-theme-text-light'
              )}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="grid gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'transition-all duration-500',
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              {/* Item content */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 10. Bug-uri Comune și Soluții

### 1. Badge suprapus peste conținut
**Problemă**: Badge-ul cu poziție absolută se suprapune peste alt element.
**Soluție**: Folosește `inline-flex` și `gap` în loc de poziționare absolută.

```tsx
// NU - poate suprapune
<div className="relative">
  <span className="absolute top-0 right-0">Badge</span>
  <span>Preț</span>
</div>

// DA - sigur nu suprapune
<span className="flex items-center gap-2">
  <span>Titlu</span>
  <span className="inline-flex px-2 py-0.5 text-xs bg-theme-accent text-white rounded">
    Badge
  </span>
</span>
```

### 2. Text invizibil pe fundal
**Problemă**: Text gri pe fundal întunecat.
**Soluție**: Folosește pattern-ul `isDark`.

### 3. Border-uri invizibile pe dark mode
**Problemă**: `border-gray-200` invizibil pe fundal întunecat.
**Soluție**: `isDark ? 'border-white/10' : 'border-theme-border'`

---

## 11. Checklist pentru Block Nou

- [ ] Folosește CSS variables pentru culori
- [ ] Pattern `isDark` pentru fundal dark/light
- [ ] Secțiune cu `py-section`
- [ ] Header cu spacing `mb-12`
- [ ] Animație de entry cu stagger
- [ ] Empty state cu icon și mesaj
- [ ] Border radius cu `var(--radius-*)`
- [ ] Grid responsive (`md:grid-cols-2 lg:grid-cols-3`)
- [ ] Hover effects pe elemente interactive
- [ ] Text contrast verificat (4.5:1 minim)

---

## 12. Fișiere Importante

- `/src/utilities/generateThemeStyles.ts` - Generează CSS din temă
- `/src/providers/ThemeProvider.tsx` - Context pentru temă
- `/src/seed/design-variants.ts` - Variantele de design per business
- `/src/seed/businesses/*.ts` - Conținut specific per business
- `/docs/DESIGN-SYSTEM.md` - Specificații complete design system

---

## 13. Testare

### Build Check
```bash
npm run build
```
Trebuie să treacă fără erori TypeScript.

### Visual QA cu Playwright
```bash
# Navigate to localhost:3010
# Take screenshot full page
# Check contrast și layout pe toate secțiunile
```

---

## 14. Crearea unui Bloc Interactiv (BeforeAfter Slider)

### Pattern pentru Componente Interactive Client-Side

```tsx
'use client'

import React, { useState, useRef, useCallback } from 'react'

function InteractiveSlider({ initialPosition = 50 }) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handler pentru mousemove/touchmove
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const percentage = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(Math.max(percentage, 0), 100))
  }, [])

  // Mouse events
  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }, [isDragging, handleMove])

  // Touch events (mobile)
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }, [handleMove])

  return (
    <div
      ref={containerRef}
      className="relative cursor-col-resize select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Content cu clipPath pentru reveal effect */}
      <div style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {/* Before image */}
      </div>
    </div>
  )
}
```

### Lecții Cheie:
1. **useCallback** pentru handlers de evenimente - previne re-renders inutile
2. **useRef** pentru containerRef - accesează dimensiunile DOM fără re-render
3. **clipPath** pentru reveal effect - mai performant decât width/overflow
4. **Touch events** separate de mouse - suport mobil corect
5. **select-none** și **cursor-col-resize** pentru UX mai bun

---

## 15. Props Interface vs Payload Types

### Problema
Payload generează tipuri cu `blockType` ca proprietate required, dar când pasăm props la component, nu avem nevoie de `blockType`.

### Soluția: Creare Props Interface Separată

```tsx
import type { BeforeAfterBlock as BeforeAfterBlockType, Media } from '@/payload-types'

// NU folosi direct tipul Payload (include blockType required)
// export function BeforeAfterBlock(props: BeforeAfterBlockType) { ... }

// DA - creează un subset
interface BeforeAfterBlockProps {
  variant?: BeforeAfterBlockType['variant']
  backgroundColor?: BeforeAfterBlockType['backgroundColor']
  heading?: string | null
  subheading?: string | null
  items?: BeforeAfterBlockType['items']
  sliderPosition?: number | null
}

export function BeforeAfterBlock({
  variant = 'slider',
  backgroundColor = 'default',
  ...props
}: BeforeAfterBlockProps) {
  // ...
}
```

### Beneficii:
- Nu mai ai erori TypeScript despre `blockType` missing
- Props interface e mai clară
- Poți adăuga default values mai ușor

---

## 16. Sincronizare Config.ts ↔ Component.tsx ↔ RenderBlocks.tsx

### Checklist când creezi un bloc nou:

1. **config.ts** - definește câmpurile în Payload
   ```typescript
   fields: [
     { name: 'sliderPosition', type: 'number', defaultValue: 50 }
   ]
   ```

2. **Component.tsx** - props trebuie să matcheze config
   ```tsx
   interface Props {
     sliderPosition?: number | null  // Același nume!
   }
   ```

3. **RenderBlocks.tsx** - pasează exact ce vine din block
   ```tsx
   case 'beforeAfter': {
     return (
       <BeforeAfterBlock
         sliderPosition={block.sliderPosition ?? undefined}  // Din config!
       />
     )
   }
   ```

4. **payload-types.ts** - regenerează după schimbări
   ```bash
   npm run generate:types
   ```

### Erori Comune:
- ❌ `initialPosition` în Component dar `sliderPosition` în config
- ❌ `layout` pasat dar nu există în config
- ❌ Type mismatch între Payload types și props interface

---

## 17. Imagini în Payload - Pattern de Extragere URL

### Problema
Payload returnează imagini ca `Media | string` - trebuie gestionat ambele cazuri.

### Helper Function Standard

```tsx
import type { Media } from '@/payload-types'

function getImageUrl(image: Media | string | null | undefined): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.url || null
}

function getImageAlt(image: Media | string | null | undefined): string {
  if (!image || typeof image === 'string') return ''
  return image.alt || ''
}

// Folosire
const imageUrl = getImageUrl(item.beforeImage)
if (!imageUrl) return null

<Image
  src={imageUrl}
  alt={getImageAlt(item.beforeImage)}
  fill
  className="object-cover"
/>
```

---

## 18. Footer - Badges și Payment Icons

### Pattern pentru Afișare Opțională

```tsx
{/* Render doar dacă există date */}
{((data?.badges && data.badges.length > 0) ||
  (data?.showPaymentIcons && data?.paymentMethods?.length > 0)) && (
  <div className="flex flex-wrap justify-center gap-6">
    {/* Badges ANPC */}
    {data?.badges?.map((badge, index) => {
      const imageData = badge.image as Media | null
      const imageUrl = imageData?.url
      if (!imageUrl) return null

      const BadgeImage = (
        <Image
          src={imageUrl}
          alt={badge.alt || 'Badge'}
          width={100}
          height={40}
          className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
        />
      )

      // Cu sau fără link
      return badge.link ? (
        <a key={badge.id || index} href={badge.link} target="_blank" rel="noopener noreferrer">
          {BadgeImage}
        </a>
      ) : (
        <div key={badge.id || index}>{BadgeImage}</div>
      )
    })}
  </div>
)}
```

### Security pentru Link-uri Externe
```tsx
target="_blank"
rel="noopener noreferrer"  // OBLIGATORIU pentru link-uri externe
```

---

## 19. Floating Components (Social Icons)

### Pattern pentru Componente Floating pe Hero

```tsx
// SocialFloat component - poziție absolută în Hero
<div className={cn(
  'fixed top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3',
  position === 'left' ? 'left-4' : 'right-4'
)}>
  {/* Icons */}
</div>

// În Hero - trebuie pasate datele sociale
<RenderHero
  type={pageData.heroType}
  data={pageData.hero}
  social={businessInfo?.social || null}  // Din business-info global
/>

// În RenderHero - render condiționat
{showSocialIcons && social && (
  <SocialFloat
    social={social}
    position={socialIconsPosition || 'left'}
    variant="glass"
  />
)}
```

### Fetch Business Info în Paralel
```tsx
const [pageResult, businessInfo] = await Promise.all([
  payload.find({ collection: 'pages', ... }),
  payload.findGlobal({ slug: 'business-info' }).catch(() => null),
])
```

---

## 20. Variante de Block - Când Să Folosești Ce

### Slider (Interactiv)
- Când utilizatorul vrea să compare activ
- Pentru before/after dramatic
- Single item focus

### Grid (Side-by-Side)
- Când vrei să afișezi multiple comparații simultan
- Pentru browsing rapid
- Hover effects pe fiecare item

### Carousel
- Pentru multe items într-un spațiu limitat
- Când vrei navigație controlată
- Cu slider în fiecare slide pentru interactivitate

---

## 21. Seed Data - Probleme Comune și Soluții

### 21.1 Imagini Corupte (HTML salvat ca .jpg)

**Problema:** Unele imagini descărcate de pe internet sunt pagini de eroare HTML (403/404) salvate cu extensie .jpg/.png.

**Simptome:**
```
ValidationError: File buffer returned no detectable MIME type
```

**Diagnostic rapid:**
```bash
# Verifică toate imaginile din proiect
find public/images -name "*.jpg" -exec file {} \; | grep -v "JPEG"
find public/images -name "*.png" -exec file {} \; | grep -v "PNG"

# Găsește fișiere HTML mascate ca imagini
find public/images -type f \( -name "*.jpg" -o -name "*.png" \) \
  -exec sh -c 'file "$1" | grep -q "HTML" && echo "$1"' _ {} \;
```

**Soluție:**
1. Șterge fișierele corupte
2. Actualizează `src/seed/seed-data.ts` să nu mai referențieze imaginile lipsă
3. Sau descarcă imagini noi valide

---

### 21.2 Extensie Greșită (.jpg pentru PNG)

**Problema:** Fișiere PNG salvate cu extensie .jpg (sau invers).

**Diagnostic:**
```bash
file public/images/auto-service/team/mechanic-2.jpg
# Output: PNG image data... (dar extensia e .jpg)
```

**Soluție:**
```bash
mv public/images/auto-service/team/mechanic-2.jpg \
   public/images/auto-service/team/mechanic-2.png
```
Apoi actualizează `seed-data.ts`:
```typescript
{ filename: 'auto-service/team/mechanic-2.png', alt: 'Mecanic auto' },
```

---

### 21.3 Email Validation în Payload CMS

**Problema:** Payload validează email-urile și respinge `@example.com` (domeniu rezervat RFC 2606).

**Simptome:**
```
ValidationError: The following field is invalid: email
```

**Soluție pentru seed data:**
Folosește domenii de test acceptate:
- `@mailinator.com` ✅
- `@test.com` ✅
- `@yopmail.com` ✅

**Schimbare în masă:**
```bash
sed -i "s/@example\.com/@mailinator.com/g" src/seed/businesses/*.ts
```

**NU folosi:**
- `@example.com` ❌
- `@test.test` ❌

---

### 21.4 Checklist Imagini Noi

Înainte de a adăuga imagini noi în `public/images/`:

- [ ] Verifică cu `file imagine.jpg` că formatul real matchează extensia
- [ ] Verifică dimensiunea (minim 100KB pentru hero, 50KB pentru gallery)
- [ ] Verifică că nu e o pagină de eroare HTML
- [ ] Actualizează `seed-data.ts` cu calea corectă

---

### 21.5 Structura Seed Data

```
src/seed/
├── index.ts              # Entry point, detectează SEED_TYPE
├── seed-data.ts          # Definițiile imaginilor per business
├── helpers.ts            # uploadLocalSeedImages, seedServices, etc.
└── businesses/
    ├── frizerie.ts
    ├── dentist.ts
    ├── avocat.ts
    ├── restaurant.ts
    ├── auto-service.ts
    ├── constructii.ts
    ├── salon.ts
    ├── pensiune.ts
    ├── magazin.ts
    ├── fitness.ts
    ├── curatenie.ts
    ├── transport.ts
    ├── foto-video.ts
    └── producator.ts
```

---

### 21.6 Template pentru Imagini în seed-data.ts

```typescript
export const nouBusinessImages = {
  hero: [
    { filename: 'nou-business/hero/hero-main.jpg', alt: 'Descriere' },
  ],
  team: [
    { filename: 'nou-business/team/person-1.jpg', alt: 'Nume Prenume' },
  ],
  gallery: [
    // Doar imaginile care EXISTĂ în public/images/
    { filename: 'nou-business/gallery/gallery-1.jpg', alt: 'Descriere' },
    // Nu include imagini care lipsesc sau sunt corupte!
  ],
  services: [
    { filename: 'nou-business/services/service-1.jpg', alt: 'Serviciu' },
  ],
}
```

---

### 21.7 Comenzi de Test Rapide

```bash
# Seed un business specific
pnpm seed:dentist

# Test rapid pentru site-ul curent (fără re-seed)
pnpm test:quick

# Seed + test pentru un business
pnpm seed:dentist && pnpm test:quick

# Test complet toate variantele (~10-15 min)
pnpm test:e2e tests/e2e/smoke.spec.ts

# Vezi ce variante sunt disponibile
pnpm variants:info
```

---

### 21.8 Erori Comune și Soluții Rapide

| Eroare | Cauză | Soluție |
|--------|-------|---------|
| `File buffer returned no detectable MIME type` | Imagine coruptă/HTML | Verifică cu `file`, șterge și actualizează seed-data.ts |
| `File not found: .../image.jpg` | Imagine lipsă | Adaugă imaginea sau elimină din seed-data.ts |
| `The following field is invalid: email` | Email invalid | Schimbă @example.com în @mailinator.com |
| `ECONNREFUSED 127.0.0.1:3000` | Server nu rulează | Pornește `pnpm dev` înainte de teste |
| `Resend API error` | Rate limit/API key | Normal în teste, ignoră sau configurează RESEND_API_KEY |

---

### 21.9 Workflow pentru Adăugare Business Nou

**Pas 1:** Pregătește imaginile
```bash
mkdir -p public/images/nou-business/{hero,team,gallery,services}
# Adaugă imaginile și verifică formatul
find public/images/nou-business -type f -exec file {} \;
```

**Pas 2:** Adaugă în seed-data.ts
```typescript
export const nouBusinessImages = { /* ... */ }
```

**Pas 3:** Creează fișierul de seed
```bash
cp src/seed/businesses/frizerie.ts src/seed/businesses/nou-business.ts
# Editează pentru noul business
```

**Pas 4:** Adaugă script în package.json
```json
"seed:nou-business": "cross-env SEED_TYPE=nou-business NODE_OPTIONS=--no-deprecation tsx --env-file=.env src/seed/index.ts"
```

**Pas 5:** Adaugă în index.ts
```typescript
case 'nou-business':
  await seedNouBusiness(payload)
  break
```

**Pas 6:** Testează
```bash
pnpm seed:nou-business
pnpm test:quick
```

---

### 21.10 Debugging Tips

**Vezi ce imagini sunt încărcate în DB:**
```bash
# În mongo shell sau Compass
db.media.find({}, {filename: 1, mimeType: 1})
```

**Verifică dacă toate paginile există:**
```bash
curl -s http://localhost:3000/api/pages | jq '.docs[].slug'
```

**Curăță cache-ul dacă ai probleme:**
```bash
rm -rf .next/cache
pnpm dev
```

---

### 21.11 Avertismente Non-Critice (de ignorat)

Acestea apar normal în timpul seed-ului și nu afectează funcționalitatea:

1. **Email validation pentru newsletter** - subscribers sunt creați oricum
2. **Resend API rate limits** - normal când trimiți multe emailuri de bun venit
3. **Hydration warnings** - temporare, dispar la refresh

---

## 22. CI/CD și Testare Automată

### GitHub Actions Workflow

Fișier: `.github/workflows/test.yml`

- **Smoke test**: rulează la fiecare push (doar frizerie, ~15 min)
- **Full test**: rulează pe main branch (toate 8 business-uri, ~60 min)
- **MongoDB**: service container cu mongo:7

### Testare Locală Completă

```bash
# Rulează toate testele pentru toate business-urile
for business in frizerie dentist avocat restaurant auto-service constructii salon magazin; do
  echo "Testing $business..."
  pnpm seed:$business
  pnpm test:quick
done
```

---

## 23. Checklist Pre-Deploy

- [ ] Toate seed-urile rulează fără erori
- [ ] `pnpm test:quick` trece
- [ ] Imaginile sunt optimizate (nu >2MB)
- [ ] Email-urile sunt configurate corect (nu @example.com în prod)
- [ ] Environment variables setate (.env.production)
- [ ] `pnpm build` trece fără erori
- [ ] RESEND_API_KEY configurat pentru producție

---

## 24. Content Block cu Nested Blocks

### Pattern pentru Blocuri în Coloane

Content Block-ul poate conține alte blocuri în fiecare coloană, permițând layout-uri complexe (ex: Contact info + Form pe 2 coloane).

### 24.1 Config.ts - Adăugare Suport pentru Nested Blocks

```typescript
// În /src/blocks/Content/config.ts
{
  name: 'contentType',
  type: 'select',
  defaultValue: 'richText',
  options: [
    { label: 'Rich Text', value: 'richText' },
    { label: 'Imagine', value: 'image' },
    { label: 'Video', value: 'video' },
    { label: 'Blocuri', value: 'blocks' },  // NOU!
  ],
},
{
  name: 'blocks',
  type: 'blocks',
  label: 'Blocuri',
  blocks: [FormBlock, ContactBlock, MapBlock, CTABlock],  // Ce blocuri permit
  admin: {
    condition: (_, siblingData) => siblingData?.contentType === 'blocks',
  },
},
```

### 24.2 Component.tsx - Renderare Nested Blocks

```tsx
// Import RenderBlocks
import { RenderBlocks } from '../RenderBlocks'

// Componentă ASYNC pentru a suporta RenderBlocks
export const ContentBlock: React.FC<ContentBlockProps> = async ({ columns = [] }) => {
  return (
    <section>
      {await Promise.all(columns.map(async (column, index) => (
        <div key={column.id || index}>
          {/* Alte tipuri de content... */}

          {column.contentType === 'blocks' && column.blocks && column.blocks.length > 0 && (
            <div className="[&>*:first-child]:mt-0 [&>section]:py-0">
              <RenderBlocks blocks={column.blocks as LayoutBlock[]} />
            </div>
          )}
        </div>
      )))}
    </section>
  )
}
```

### 24.3 CSS Important pentru Nested Blocks

```css
/* Elimină margin-top de pe primul bloc nested */
[&>*:first-child]:mt-0

/* Elimină padding vertical de pe secțiuni nested */
[&>section]:py-0
```

---

## 25. Helper Functions pentru Seeder Layouts

### Pattern pentru Layout-uri Reutilizabile

Când ai layout-uri identice în multiple seeders, creează helper functions.

### 25.1 Exemplu: createContactPageLayout()

```typescript
// În /src/seed/helpers.ts
export function createContactPageLayout(
  contactFormId: string | undefined,
  options?: {
    heading?: string
    subheading?: string
    showMap?: boolean
  }
) {
  return [
    {
      blockType: 'content' as const,
      columns: [
        {
          width: 'half' as const,
          contentType: 'blocks' as const,
          blocks: [
            {
              blockType: 'contact' as const,
              heading: options?.heading || 'Informații de Contact',
              // ... alte props
            }
          ],
        },
        {
          width: 'half' as const,
          contentType: 'blocks' as const,
          blocks: contactFormId ? [
            {
              blockType: 'form' as const,
              form: contactFormId,
              variant: 'card' as const,
            }
          ] : [],
        },
      ],
    },
    // Map block opțional...
  ]
}
```

### 25.2 Folosire în Seeders

```typescript
// În orice business seeder
import { createContactPageLayout } from '../helpers'

const pages = [
  {
    slug: 'contact',
    title: 'Contact',
    layout: createContactPageLayout(contactFormId, {
      heading: 'Contactează-ne',
      showMap: true,
    }),
  },
]
```

### Beneficii:
- **DRY** - Nu mai duplici cod în 9+ fișiere
- **Mentenanță ușoară** - Schimbi într-un singur loc
- **Consistență** - Toate paginile de contact arată la fel

---

## 26. FormBlock Variants

### Variante Disponibile

| Variant | Descriere | Use Case |
|---------|-----------|----------|
| `standard` | Form simplu, fără styling | Când e deja într-un card |
| `card` | Form cu background, shadow, border | Standalone forms |
| `centered` | Card centrat cu max-width | Landing pages |
| `minimal` | Fără background, doar border subtle | Forms în sidebars |

### Regula pentru Consistență

**ÎNTOTDEAUNA** folosește aceeași variantă pentru formulare similare:
- Booking form: `card`
- Contact form: `card` (NU `standard`!)
- Newsletter: `minimal`

### Exemplu Config în Seeder

```typescript
{
  blockType: 'form' as const,
  form: formId,
  variant: 'card' as const,  // ← Consistent cu alte forms
  heading: 'Trimite-ne un mesaj',
}
```

---

## 27. Prevenirea Submitărilor Multiple

### Pattern pentru Forms cu Loading State

```tsx
'use client'

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return  // IMPORTANT: Previne click-uri multiple

    setIsSubmitting(true)

    try {
      await fetch('/api/submit', { /* ... */ })
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'btn',
          isSubmitting && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Se trimite...' : 'Trimite'}
      </button>
    </form>
  )
}
```

### Reguli:
1. **Check la început** - `if (isSubmitting) return`
2. **Disable button** - `disabled={isSubmitting}`
3. **Visual feedback** - Opacity redusă, cursor-not-allowed
4. **Text feedback** - "Se trimite..." în loc de "Trimite"

---

## 28. Greșeli de Evitat

### ❌ 28.1 setTimeout pentru Loading State

**GREȘIT:**
```tsx
const [isLoaded, setIsLoaded] = useState(false)

useEffect(() => {
  setTimeout(() => setIsLoaded(true), 100)  // ❌ Arbitrar, nesigur
}, [])
```

**CORECT:**
```tsx
useEffect(() => {
  setIsLoaded(true)  // ✅ Imediat după mount
}, [])

// SAU cu requestAnimationFrame pentru animații
useEffect(() => {
  requestAnimationFrame(() => setIsLoaded(true))
}, [])
```

### ❌ 28.2 Cod Duplicat în Seeders

**GREȘIT:** Copy-paste aceleași 50 linii de layout în 9 fișiere.

**CORECT:** Creează helper function în `helpers.ts`.

### ❌ 28.3 Uitarea Actualizării Tuturor Seeders

**GREȘIT:** Modifici layout-ul paginii de contact într-un seeder și uiți celelalte 8.

**CORECT:**
1. Folosește helper functions
2. SAU: Grep pentru toate locurile:
```bash
grep -r "slug: 'contact'" src/seed/businesses/
```

### ❌ 28.4 Styling Inconsistent pentru Formulare

**GREȘIT:**
- Booking form cu `variant: 'card'`
- Contact form cu `variant: 'standard'`

**CORECT:** Folosește aceeași variantă pentru toate formularele standalone.

### ❌ 28.5 Nested Blocks fără CSS Reset

**GREȘIT:**
```tsx
<RenderBlocks blocks={column.blocks} />  // Padding/margin nedorite
```

**CORECT:**
```tsx
<div className="[&>*:first-child]:mt-0 [&>section]:py-0">
  <RenderBlocks blocks={column.blocks} />
</div>
```

### ❌ 28.6 Componente Sync cu RenderBlocks

**GREȘIT:**
```tsx
export const ContentBlock: React.FC<Props> = ({ columns }) => {
  // RenderBlocks poate fi async
  return <RenderBlocks blocks={...} />  // ❌ Eroare
}
```

**CORECT:**
```tsx
export const ContentBlock: React.FC<Props> = async ({ columns }) => {
  return await Promise.all(columns.map(async (col) => (
    <RenderBlocks blocks={...} />  // ✅ Componentă async
  )))
}
```

---

## 29. Quick Reference - Content Block cu Nested Blocks

### Workflow pentru Adăugare Nested Block Nou

1. **Adaugă în config imports:**
```typescript
import { NewBlock } from '../NewBlock/config'
```

2. **Adaugă în blocks array:**
```typescript
blocks: [FormBlock, ContactBlock, MapBlock, CTABlock, NewBlock],
```

3. **Regenerează types:**
```bash
npm run generate:types
```

4. **Testează în admin:**
   - Creează o pagină
   - Adaugă Content Block
   - Adaugă o coloană cu contentType: "Blocuri"
   - Verifică că noul bloc apare în opțiuni

---

---

## 30. Ecommerce Plugin - Access Control și 404 Errors

### 30.1 Problema: 404 pe `/api/payments/manual/initiate`

**Simptome:**
- `curl` către endpoint funcționează (returnează 400 validation error)
- Cereri din browser (cu cookies) returnează 404 "Cart not found"
- Comanda nu poate fi plasată

**Cauza Rădăcină:**

Pluginul `@payloadcms/plugin-ecommerce` folosește `overrideAccess: false` în endpoint-urile de payment:

```javascript
// node_modules/@payloadcms/plugin-ecommerce/dist/endpoints/initiatePayment.js
cart = await payload.findByID({
    id: cartID,
    collection: 'carts',
    overrideAccess: false,  // RESPECTĂ access control!
    user
});
if (!cart) {
    return Response.json({ message: `Cart not found` }, { status: 404 });
}
```

Dacă access control-ul colecției `carts` nu permite citirea, `findByID` returnează `null` și pluginul returnează 404.

**Configurația GREȘITĂ:**

```typescript
carts: {
  cartsCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    access: {
      ...defaultCollection.access,
      create: () => true,
      update: () => true,
      // ❌ LIPSEȘTE: read access
    },
  }),
},
```

**Configurația CORECTĂ:**

```typescript
carts: {
  cartsCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    access: {
      ...defaultCollection.access,
      create: () => true,
      update: () => true,
      read: () => true,  // ✅ NECESAR pentru checkout
    },
  }),
},
```

### 30.2 Access Control pentru Ecommerce Plugin

**Regula de Aur:** Când override-ui access control-ul unei colecții din plugin, trebuie să incluzi TOATE operațiunile necesare:

| Colecție | Operațiuni Necesare | Motiv |
|----------|---------------------|-------|
| `carts` | `create`, `update`, `read` | Payment endpoints citesc coșul |
| `orders` | `create` (pentru guest checkout) | Permit comenzi fără autentificare |
| `transactions` | Plugin le gestionează intern | Nu override-ui fără motiv |

### 30.3 Debugging Access Control Issues

**Pas 1:** Test direct cu curl (fără autentificare):
```bash
curl -X POST http://localhost:3010/api/payments/manual/initiate \
  -H "Content-Type: application/json" \
  -d '{"cartID": "test"}'
```
Dacă returnează 400 (validation error), endpoint-ul există.

**Pas 2:** Test acces direct la colecție:
```bash
curl http://localhost:3010/api/carts/{cart-id} \
  -H "Cookie: payload-token=..."
```
Dacă returnează 403 sau "not allowed", e problemă de access control.

**Pas 3:** Verifică plugin source:
```bash
grep -r "overrideAccess: false" node_modules/@payloadcms/plugin-ecommerce/
```

### 30.4 Best Practices pentru Payment Adapters

1. **Manual Adapter** - pentru "plată la livrare":
   - Nu necesită procesare externă
   - Creează direct Transaction și Order
   - Access control trebuie să permită operațiunile

2. **Stripe Adapter** - pentru carduri:
   - Necesită STRIPE_SECRET_KEY și STRIPE_WEBHOOKS_SIGNING_SECRET
   - Webhook-urile gestionează confirmarea plății
   - Orders sunt create de webhook, nu de frontend

3. **Testare:**
   - ÎNTOTDEAUNA testează checkout flow complet cu Playwright
   - Testează atât guest checkout cât și user autentificat
   - Verifică că email-urile sunt trimise

### 30.5 Inventar - Câmpul `inventory` vs `stock`

**IMPORTANT:** Plugin-ul ecommerce folosește câmpul `inventory`, NU `stock`!

**Greșeală frecventă:** Definirea unui câmp `stock` separat în Products.ts când plugin-ul deja adaugă `inventory`.

**Câmpuri corecte:**
- `inventory` - câmpul standard al plugin-ului ecommerce (folosește acest câmp!)
- Nu defini câmpuri custom pentru stoc

**Decrementarea inventarului:**

**IMPORTANT:** Payload plugin-ul ecommerce face **DECREMENTARE AUTOMATĂ** a inventarului!

**Unde se face decrementarea:**
- **NU** în `paymentMethod.confirmOrder()` (adaptorul Stripe/Manual)
- **DA** în `confirmOrderHandler` din `/endpoints/confirmOrder.js` (handler-ul endpoint-ului)

**Fluxul corect:**
1. Frontend apelează `/api/payments/{method}/confirm`
2. Handler-ul (`confirmOrderHandler`) apelează `paymentMethod.confirmOrder()`
3. Adaptorul creează order + transaction și returnează `transactionID`
4. **După succes**, handler-ul decrementează inventarul:

```javascript
// Din /endpoints/confirmOrder.js (liniile 101-127)
if (paymentResponse.transactionID) {
  const transaction = await payload.findByID({...})
  for (const item of transaction.items) {
    if (item.variant) {
      await payload.db.updateOne({
        id,
        collection: variantsSlug,
        data: { inventory: { $inc: item.quantity * -1 } }
      })
    } else if (item.product) {
      await payload.db.updateOne({
        id,
        collection: productsSlug,
        data: { inventory: { $inc: item.quantity * -1 } }
      })
    }
  }
}
```

**Concluzie pentru adaptorul nostru manual:**
- NU decrementăm inventar în `confirmOrder.ts` (adapterul nostru)
- Payload handler-ul face automat decrementarea după ce primește `transactionID`
- Varianta noastră clean este corectă!

---

## 31. Componente Ecommerce

### Locație: `src/components/ecommerce/`

| Componentă | Descriere | Utilizare |
|------------|-----------|-----------|
| `Breadcrumbs` | Navigare ierarhică | Pagini produs, categorii |
| `ProductCard` | Card produs cu badge-uri, hover | Liste produse, grile |
| `ProductSort` | Dropdown sortare URL-based | Toolbar pagini categorii |
| `ProductFilters` | Sidebar filtre cu checkbox-uri și range | Pagini categorii |

### Pattern-uri Respectate:
1. **Sistemul de teme** - Folosesc variabile CSS (`text-theme-text`, `bg-theme-light`)
2. **Touch targets** - Toate butoanele au minim 44x44px
3. **URL state** - Filtrele și sortarea folosesc query params (bookmarkable)
4. **Accessibility** - ARIA labels, focus-visible, keyboard navigation
5. **Server/Client Separation** - Funcțiile helper (ex: `getSortParams`) sunt în fișiere separate de componente client

### ⚠️ Server/Client Separation (Next.js App Router)

**IMPORTANT:** În Next.js App Router, funcțiile exportate din fișiere cu `'use client'` NU pot fi folosite pe server.

**Structură corectă:**
```
src/components/ecommerce/
├── sortUtils.ts          # Server-compatible helpers (getSortParams, SortOption)
├── ProductSort.tsx       # 'use client' - componentă UI
├── ProductCard.tsx       # 'use client' - componentă UI
└── index.ts              # Re-export din fișierele potrivite
```

**Greșeală frecventă:**
```typescript
// ❌ GREȘIT - funcție în fișier 'use client'
// ProductSort.tsx
'use client'
export function getSortParams(sort) { ... }  // Nu poate fi importată pe server!
```

**Pattern corect:**
```typescript
// ✅ CORECT - funcție în fișier separat (fără 'use client')
// sortUtils.ts
export function getSortParams(sort: SortOption): string { ... }

// ProductSort.tsx
'use client'
import type { SortOption } from './sortUtils'  // Doar tipuri sunt OK
```

### Exemplu Utilizare ProductCard:

```tsx
<ProductCard
  product={{
    id: 'product-1',
    slug: 'produs-exemplu',
    title: 'Produs Exemplu',
    price: 100,
    salePrice: 80,
    imageUrl: '/image.jpg',
    tags: [{ id: 't1', name: 'Nou', color: '#22c55e' }],
    stock: 10,
    brand: 'Brand Exemplu',
  }}
  showQuickView={false}
  showWishlist={false}
/>
```

### Exemplu Utilizare Breadcrumbs:

```tsx
<Breadcrumbs
  items={[
    { label: 'Categorii', href: '/categorii' },
    { label: 'Electronice', href: '/categorii/electronice' },
    { label: 'Produsul Curent' },  // Fără href = current page
  ]}
/>
```

---

---

## 32. Testarea Completă a Tuturor Seed-urilor (9 Business Types)

### 32.1 Rezultatele Testării E2E cu Playwright

Am testat toate cele 9 tipuri de business disponibile în template, rulând fiecare seed și verificând site-ul generat cu Playwright MCP.

| # | SEED_TYPE | Brand | Temă CSS | Status |
|---|-----------|-------|----------|--------|
| 1 | `magazin` | EcoShop | `dark-gold` | ✅ PASS |
| 2 | `frizerie` | Urban Barber | `dark-gold` | ✅ PASS |
| 3 | `salon` | Beauty Studio | `pink-soft` | ✅ PASS |
| 4 | `fitness` | Transilvania Fitness | `fitness-orange` | ✅ PASS |
| 5 | `restaurant` | La Copac Restaurant | `warm-orange` | ✅ PASS |
| 6 | `dentist` | DentalMed Clinic | `teal-modern` | ✅ PASS |
| 7 | `avocat` | Cabinet Avocat Ionescu | `classic-blue` (Navy & Gold) | ✅ PASS |
| 8 | `auto-service` | AutoPro | `modern-red` | ✅ PASS |
| 9 | `constructii` | BuildPro | `warm-orange` (Industrial) | ✅ PASS |

### 32.2 Comanda pentru Testare Seed

```bash
# Pattern general
PAYLOAD_SECRET=universal-business-secret-key-2024 \
DATABASE_URI="mongodb://admin:password123@localhost:27017/template5?authSource=admin" \
SEED_TYPE=<business_type> \
npx tsx src/seed/index.ts

# Exemplu pentru fitness
SEED_TYPE=fitness npx tsx src/seed/index.ts

# După seed, restart server
pkill -f "next dev"; rm -rf .next && PORT=3010 pnpm dev &
```

### 32.3 Elemente Comune Verificate în Toate Site-urile

| Element | Descriere | Prezent în toate |
|---------|-----------|------------------|
| **Hero Section** | Imagine, titlu, descriere, CTA-uri | ✅ |
| **Announcement Bar** | Banner cu ofertă specială | ✅ |
| **Servicii/Produse** | Grid cu prețuri și descrieri | ✅ |
| **Echipă** | Membri cu experiență și specializări | ✅ (exceptie: magazin) |
| **Testimoniale** | Review-uri de la clienți | ✅ |
| **FAQ** | Întrebări frecvente cu accordion | ✅ |
| **Galerie/Portofoliu** | Imagini proiecte/lucrări | ✅ |
| **Blog** | 3 articole relevante per nișă | ✅ |
| **Program de lucru** | Ore deschidere configurabile | ✅ |
| **Locații** | Adresă, telefon, rating Google | ✅ |
| **Statistici** | Ani experiență, clienți, etc. | ✅ |
| **Footer** | Navigație, contact, legal | ✅ |
| **WhatsApp Button** | Floating contact button | ✅ |
| **Newsletter** | Formular abonare | ✅ |

### 32.4 Elemente Specifice per Business Type

#### Magazin (EcoShop)
- **Tip**: E-commerce complet
- **Specific**: Produse, coș, checkout, categorii
- **Componente**: ProductCard, AddToCart, CartModal, CheckoutPage

#### Frizerie / Salon / Dentist
- **Tip**: Servicii cu programare
- **Specific**: Booking form, lista servicii cu prețuri și durată
- **Componente**: BookingForm, ServiceCard, TeamMember

#### Fitness
- **Tip**: Abonamente
- **Specific**: Clase fitness, orar, abonamente (Basic/Standard/Premium/Anual)
- **Componente**: ScheduleTable, PricingTable, TrainerCard

#### Restaurant
- **Tip**: Meniu + rezervări
- **Specific**: Categorii meniu, bucătari, program zilnic detaliat
- **Componente**: MenuCategory, ChefCard, ReservationForm

#### Avocat
- **Tip**: Servicii profesionale
- **Specific**: Domenii de practică, timeline firmă, rata de succes
- **Componente**: PracticeAreaCard, TimelineBlock, StatisticsBlock

#### Auto-Service
- **Tip**: Service auto
- **Specific**: Servicii cu prețuri fixe, mecanici cu specializări
- **Componente**: ServiceCard (cu durată), MechanicCard, ProcessSteps

#### Constructii
- **Tip**: Proiecte la comandă
- **Specific**: Portofoliu proiecte, timeline companie, devize
- **Componente**: PortfolioGallery, TimelineBlock, ProcessSteps

### 32.5 Erori Non-Critice Întâlnite

| Eroare | Cauză | Impact | Soluție |
|--------|-------|--------|---------|
| `401 validation_error - API key is invalid` | Resend API key lipsă/invalid | Newsletter emails nu se trimit | Configurează RESEND_API_KEY |
| `Could not revalidate /path` | Seed rulează fără Next.js context | Niciun impact | Ignoră, e normal în seed |
| `duration-[8000ms] is ambiguous` | Warning Tailwind CSS | Niciun impact vizual | Poate fi fixat în config |

### 32.6 Workflow Complet de Testare

```bash
# 1. Pornește MongoDB (dacă nu rulează)
docker-compose up -d mongodb

# 2. Loop prin toate business-urile
for business in magazin frizerie salon fitness restaurant dentist avocat auto-service constructii; do
  echo "🧪 Testing: $business"

  # Rulează seed
  SEED_TYPE=$business npx tsx src/seed/index.ts

  # Restart server
  pkill -f "next dev" 2>/dev/null
  rm -rf .next
  PORT=3010 pnpm dev &

  # Așteaptă server
  sleep 20

  # Verifică API
  curl -s http://localhost:3010/api/globals/business-info | grep -o '"name":"[^"]*"'

  # Testează cu Playwright (opțional)
  # pnpm exec playwright test tests/e2e/smoke.spec.ts

  echo "✅ $business done"
done
```

### 32.7 Checklist Pre-Lansare per Business

- [ ] Seed rulează fără erori fatale
- [ ] Homepage se încarcă corect
- [ ] Toate secțiunile sunt populate (hero, servicii, echipă, etc.)
- [ ] Navigația funcționează
- [ ] Formulare se pot trimite (contact, booking, newsletter)
- [ ] Imagini se încarcă (nu broken images)
- [ ] Mobile responsive funcționează
- [ ] Footer conține toate link-urile
- [ ] WhatsApp button apare

### 32.8 Teme CSS Disponibile per Business

| Business | Temă | Culori Principale |
|----------|------|-------------------|
| magazin | `dark-gold` | Gold pe fundal întunecat |
| frizerie | `dark-gold` | Gold pe fundal întunecat |
| salon | `pink-soft` | Roz pastel, feminin |
| fitness | `fitness-orange` | Portocaliu energic |
| restaurant | `warm-orange` | Portocaliu cald, brown accente |
| dentist | `teal-modern` | Teal/turcoaz, clean medical |
| avocat | `classic-blue` | Navy albastru, gold accente |
| auto-service | `modern-red` | Roșu pe fundal întunecat |
| constructii | `warm-orange` | Portocaliu industrial |

### 32.9 Timp Estimat per Seed

| Etapă | Durată |
|-------|--------|
| Clear existing data | ~2 sec |
| Upload images (10-12) | ~5-10 sec |
| Create services/products | ~1 sec |
| Create team members | ~1 sec |
| Create pages | ~2 sec |
| Create blog posts | ~1 sec |
| **Total seed** | **~15-20 sec** |
| **Server restart + compile** | **~20-30 sec** |
| **Homepage first load** | **~5-10 sec** |

### 32.10 Tips pentru Debugging Seed-uri

1. **Verifică dacă MongoDB rulează:**
   ```bash
   docker ps | grep mongo
   ```

2. **Verifică conexiunea:**
   ```bash
   mongosh "mongodb://admin:password123@localhost:27017/template5?authSource=admin" --eval "db.stats()"
   ```

3. **Vezi log-urile seed-ului:**
   - Fiecare etapă afișează ce creează
   - Erorile sunt afișate în roșu
   - Warnings în galben

4. **Reset complet database:**
   ```bash
   mongosh "mongodb://admin:password123@localhost:27017/template5?authSource=admin" --eval "db.dropDatabase()"
   ```

5. **Verifică imaginile:**
   ```bash
   curl -I http://localhost:3010/api/media/file/hero-main.jpg
   # Trebuie să returneze 200 OK
   ```

---

*Documentație actualizată: December 2025*
*Pentru Universal Business Website Template - Payload CMS 3.x + Next.js 15*
