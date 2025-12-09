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

## 33. Arhitectura Blocurilor de Contact (Refactorizare)

### 33.1 Problema Identificată

Blocul Contact era prea monolitic - combina:
- Date de contact (adresă, telefon, email, program, social)
- Formular de contact
- Hartă Google Maps

Acest design făcea dificilă compunerea flexibilă în layout-uri diferite.

### 33.2 Soluția - Blocuri Composable

Am separat funcționalitatea în blocuri specializate care pot fi compuse independent:

| Bloc | Scop | Locație |
|------|------|---------|
| **ContactInfo** | Date contact (adresă, telefon, email, ore, social) | `src/blocks/Contact/` |
| **Map** | Hartă Google Maps standalone | `src/blocks/Map/` |
| **Form** | Formular cu variante | `src/blocks/Form/` |
| **Content** | Container cu coloane pentru compunere | `src/blocks/Content/` |

### 33.3 Variante ContactInfo (nou)

```typescript
// Variantele disponibile pentru blocul Contact simplificat:
'standard'  // Lista verticală cu icoane (default)
'cards'     // Carduri pentru fiecare tip de informație
'compact'   // O linie cu icoane
'minimal'   // Doar text, fără icoane
```

### 33.4 Cum se Compun Blocuri pentru Contact Page

#### Layout Side-by-Side (Contact Info + Form):

```typescript
{
  blockType: 'content',
  backgroundColor: 'light',
  columns: [
    {
      width: 'half',
      contentType: 'blocks',
      blocks: [
        {
          blockType: 'contact',
          variant: 'standard',
          heading: 'Informatii de Contact',
          contactInfoItems: {
            showAddress: true,
            showPhone: true,
            showEmail: true,
            showWorkingHours: true,
            showSocial: true,
          },
        },
      ],
    },
    {
      width: 'half',
      contentType: 'blocks',
      blocks: [
        {
          blockType: 'formBlock',
          form: contactFormId,
          variant: 'card',
        },
      ],
    },
  ],
}
// + Map block separat dedesubt
{
  blockType: 'map',
  variant: 'contained',
  heading: 'Unde ne gasesti',
  source: 'businessInfo',
  height: 'medium',
}
```

### 33.5 Helper Function pentru Seeding

```typescript
// În src/seed/helpers.ts
createContactPageLayout(contactFormId, {
  heading: 'Contacteaza-ne',
  subheading: 'Suntem aici pentru tine',
  showMap: true,
  layout: 'side-by-side', // sau 'stacked', 'form-only', 'info-only'
  mapHeading: 'Locatia noastra',
})
```

### 33.6 Beneficii

1. **Flexibilitate** - Poți pune Contact Info oriunde în pagină
2. **Reutilizare** - Același bloc Contact Info poate fi folosit în Footer, Homepage, etc.
3. **Claritate** - Fiecare bloc face un singur lucru
4. **Compunere** - Folosești Content block cu coloane pentru layout-uri complexe
5. **Mentenanță** - Mai ușor de întreținut și testat

### 33.7 Migrare de la Vechiul Format

**Vechi (deprecated):**
```typescript
{
  blockType: 'contact',
  variant: 'with-map',
  showMap: true,
  mapPosition: 'side',
  // ... toate într-un singur bloc
}
```

**Nou (recomandat):**
```typescript
// Content block cu coloane
{
  blockType: 'content',
  columns: [
    { blocks: [{ blockType: 'contact' }] },
    { blocks: [{ blockType: 'formBlock', form: id }] },
  ],
}
// Map separat
{ blockType: 'map' }
```

---

## 34. Contact Page Layout Improvements (40%/60%)

### 34.1 Problema Originală

Layout-ul vechi folosea coloane egale (50%/50%) care nu era optimal pentru:
- Contact info (nevoie mai puțin spațiu)
- Formular de contact (nevoie mai mult spațiu)

### 34.2 Soluția - Layout 40%/60%

Am actualizat Content block să suporte lățimi procentuale și am modificat `createContactPageLayout()` pentru layout asimetric:

```typescript
// În helpers.ts - createContactPageLayout()
columns: [
  {
    width: '40',  // 40% pentru info contact
    contentType: 'blocks',
    blocks: [{ blockType: 'contact', ... }],
  },
  {
    width: '60',  // 60% pentru formular
    contentType: 'blocks',
    blocks: [{ blockType: 'formBlock', ... }],
  },
],
```

### 34.3 Lățimi Procentuale Disponibile

```typescript
// Content/config.ts - opțiuni width
'100' | '90' | '80' | '75' | '70' | '66' | '60' | '50' | '40' | '33' | '30' | '25' | '20'

// Plus legacy values pentru backwards compatibility
'full' | 'three-quarters' | 'two-thirds' | 'half' | 'one-third' | 'one-quarter'
```

### 34.4 CSS Classes pentru Width

```typescript
// Content/Component.tsx
const percentageWidthClasses: Record<string, string> = {
  '100': 'w-full',
  '90': 'w-full lg:w-[90%]',
  '80': 'w-full lg:w-4/5',
  '75': 'w-full lg:w-3/4',
  '70': 'w-full lg:w-[70%]',
  '66': 'w-full lg:w-2/3',
  '60': 'w-full lg:w-[60%]',
  '50': 'w-full lg:w-1/2',
  '40': 'w-full lg:w-[40%]',
  '33': 'w-full lg:w-1/3',
  '30': 'w-full lg:w-[30%]',
  '25': 'w-full lg:w-1/4',
  '20': 'w-full lg:w-1/5',
}
```

### 34.5 Mobile Responsive

**Important:** Toate coloanele devin `w-full` pe mobile (sub `lg` breakpoint).

Layout-ul se transformă astfel:
- **Desktop (lg+)**: 40% + 60% side-by-side
- **Mobile (<lg)**: 100% stacked (contact info sus, form jos)

### 34.6 Map Block Standalone

Map-ul a fost separat ca bloc independent:

```typescript
// Map block folosește businessInfo pentru embed URL
{
  blockType: 'map',
  variant: 'full-width',
  heading: 'Unde ne gasesti',
  source: 'businessInfo',  // Preia googleMapsEmbed din business-info global
  height: 'medium',
  showDirectionsButton: true,
}
```

### 34.7 Fix Bug: `googleMapsEmbed` vs `mapEmbed`

**Problemă:** Map block nu se afișa pentru că folosea câmp greșit.

**Fix în Map/Component.tsx:**
```typescript
// GREȘIT (înainte)
businessInfo?: {
  mapEmbed?: string | null  // Câmp inexistent
}

// CORECT (după)
businessInfo?: {
  googleMapsEmbed?: string | null  // Câmp din business-info global
}
```

### 34.8 Testate pe Toate Business Types

| Business Type | Layout 40%/60% | Map Block | Mobile Stack |
|---------------|----------------|-----------|--------------|
| frizerie | ✅ | ✅ | ✅ |
| fitness | ✅ | ✅ | ✅ |
| magazin | ✅ | ✅ | ✅ |
| restaurant | ✅ | ✅ | ✅ |

### 34.9 Comandă pentru Testare Rapidă

```bash
# Test un business type specific
rm -rf database.sqlite media/* && SEED_TYPE=frizerie pnpm seed
PORT=3015 pnpm dev &
# Navigate to http://localhost:3015/contact
```

---

## 35. Verificare Conformitate Cod vs Documentație

### 35.1 Checklist Rapid pentru Audit

Când verifici dacă codul respectă documentația, verifică:

```bash
# 1. Culori hardcodate în blocuri (trebuie să fie 0)
grep -r "text-gray-\|bg-gray-" src/blocks/ --include="*.tsx" | wc -l

# 2. interfaceName în toate config.ts
for f in src/blocks/*/config.ts; do
  grep -q "interfaceName" "$f" || echo "LIPSĂ: $f"
done

# 3. saveToJWT pe role în Users
grep -A2 "name: 'role'" src/collections/Users.ts | grep saveToJWT

# 4. Carts read access pentru checkout
grep -A5 "cartsCollectionOverride" src/payload.config.ts | grep "read:"
```

### 35.2 Înlocuire Culori Hardcodate - Mapare Completă

| Hardcodat | Tematic (light bg) | Tematic (dark bg) |
|-----------|-------------------|-------------------|
| `text-gray-900` | `text-theme-text` | `text-white` |
| `text-gray-600` | `text-theme-text-light` | `text-white/70` |
| `text-gray-500` | `text-theme-text-muted` | `text-white/60` |
| `text-gray-400` | `text-theme-text-muted` | `text-white/50` |
| `text-gray-300` | - | `text-white/70` |
| `bg-gray-50` | `bg-theme-light` | - |
| `bg-gray-100` | `bg-theme-light` | - |
| `bg-gray-200` | `bg-theme-light` | - |
| `bg-gray-700` | - | `bg-white/10` |
| `bg-gray-800` | - | `bg-white/5` |
| `bg-gray-900` | `bg-theme-dark` | - |
| `border-gray-200` | `border-theme-border` | - |
| `border-gray-300` | `border-theme-border` | `border-white/10` |

### 35.3 Când Adaugi Bloc Nou - Checklist

- [ ] `config.ts` are `interfaceName: 'NumeBlock'`
- [ ] `Component.tsx` folosește culori tematice (NU gray-*)
- [ ] Pattern `isDark` pentru fundal dark/light
- [ ] Export adăugat în `RenderBlocks.tsx`
- [ ] Rulat `pnpm generate:types`

### 35.4 Playwright MCP pentru Verificare Vizuală

După modificări în blocuri, verifică rapid cu Playwright:

```
1. mcp__playwright__browser_navigate -> http://localhost:3010
2. mcp__playwright__browser_snapshot (verifică structura)
3. mcp__playwright__browser_take_screenshot (verifică vizual)
4. Navighează pe pagini cheie: /produse, /contact, /checkout
```

### 35.5 ⚠️ IMPORTANT: Cache Next.js pentru Imagini

**Problema:** După rularea unui seed nou, imaginile vechi pot rămâne vizibile în browser chiar și cu Ctrl+Shift+R.

**Cauza:** Next.js cache-ează imaginile optimizate în `.next/cache/images/` (poate ajunge la 100MB+).

**Soluție - După fiecare seed:**
```bash
# Șterge cache-ul de imagini Next.js
rm -rf .next/cache/images

# SAU curățare completă (recomandat)
rm -rf .next && pnpm dev
```

**Workflow corect pentru schimbare seed:**
```bash
# 1. Oprește serverul (Ctrl+C)
# 2. Rulează seed-ul nou
pnpm seed:frizerie

# 3. Curăță cache-ul
rm -rf .next/cache/images

# 4. Repornește serverul
pnpm dev

# 5. Hard refresh în browser (Ctrl+Shift+R)
```

**De ce se întâmplă:**
- Next.js Image Optimization cache-ează imaginile procesate
- Filename-urile rămân aceleași între seeduri (ex: `hero-main.jpg`)
- Next.js servește imaginea din cache bazat pe filename, nu pe conținut

---

---

## 36. TVA/VAT pentru E-commerce România

### 36.1 Cerințe Legale B2C România

**OBLIGATORIU:** Prețurile afișate consumatorilor TREBUIE să includă TVA (preț final).

| Cotă | Rată | Aplicare |
|------|------|----------|
| **Standard** | 21% | Majoritatea produselor |
| **Redusă** | 11% | Alimente, cărți, medicamente |
| **Scutit** | 0% | Produse exceptate |

> **Notă:** Ratele s-au modificat în august 2025 (de la 19%/9%)

### 36.2 Configurare în Admin

**Locație:** Shop Settings > TVA

| Setare | Descriere | Recomandat B2C |
|--------|-----------|----------------|
| `vatEnabled` | Activează calculul TVA | ✅ ON |
| `pricesIncludeVat` | Prețurile introduse includ TVA | ✅ ON |
| `displayPricesWithVat` | Afișează cu TVA pe site | ✅ ON (obligatoriu legal) |
| `vatRates.standard` | Cota standard | 21 |
| `vatRates.reduced` | Cota redusă | 11 |
| `showVatBreakdown` | Arată detalii în checkout | ✅ ON |

### 36.3 Flux Prețuri (Recomandat pentru B2C)

```
Admin introduce: 100 lei (cu TVA)
       ↓
DB salvează: 100 lei
       ↓
Client vede: 100 lei
```

**Avantaj:** Ce introduci = ce se salvează = ce vede clientul. Simplu și fără erori.

### 36.4 Flux Alternativ (Pentru B2B sau Flexibilitate)

Dacă preferi să lucrezi cu prețuri nete (fără TVA):

1. Debifează `pricesIncludeVat` în admin
2. Introdu prețuri fără TVA (ex: 82.64 lei)
3. Sistemul calculează automat: 82.64 + 21% = 100 lei afișat

### 36.5 taxCategory per Produs

Fiecare produs are câmpul **"Categorie TVA"** în sidebar:

```typescript
// Opțiuni disponibile
'standard' → 21%  (default)
'reduced'  → 11%
'zero'     → 0%
```

### 36.6 Fișiere Relevante

| Fișier | Conține |
|--------|---------|
| `src/globals/ShopSettings.ts` | Tab TVA cu toate setările |
| `src/utilities/tax.ts` | Funcții calcul: `getDisplayPrice()`, `addVat()`, `removeVat()` |
| `src/blocks/RenderBlocks.tsx` | `getProducts()` aplică TVA la afișare |
| `src/payload.config.ts` | `taxCategory` field în products override |

### 36.7 Funcții Helper Disponibile

```typescript
import { getDisplayPrice, addVat, removeVat, calculateCartTotals } from '@/utilities/tax'

// Calculează preț de afișat
const displayPrice = getDisplayPrice(priceFromDb, 'standard', taxSettings)

// Adaugă TVA manual
const priceWithVat = addVat(100, 21)  // 121

// Elimină TVA
const priceNet = removeVat(121, 21)  // 100

// Calculează totaluri coș
const totals = calculateCartTotals(cartItems, taxSettings)
// { subtotal: 100, vatAmount: 21, total: 121, vatBreakdown: [...] }
```

### 36.8 Debugging TVA

```bash
# Verifică setările în DB
curl http://localhost:3010/api/globals/shop-settings | jq '.vatEnabled, .vatRates'

# Verifică prețul unui produs
curl http://localhost:3010/api/products?limit=1 | jq '.docs[0].priceInRON, .docs[0].taxCategory'
```

### 36.9 ⚠️ e-Factura (Obligatoriu din 2025)

**IMPORTANT:** România obligă e-facturare B2C prin sistemul RO e-Factura.

Această funcționalitate NU este implementată în template. Pentru producție, integrează cu:
- SmartBill
- Factura Online
- ObexPro

### 36.10 Checklist Pre-Lansare TVA

- [ ] `vatEnabled: true` în Shop Settings
- [ ] `displayPricesWithVat: true` (obligatoriu legal B2C)
- [ ] Rate TVA actualizate: 21% standard, 11% redus
- [ ] Toate produsele au `taxCategory` setat (default: standard)
- [ ] Checkout afișează breakdown TVA
- [ ] Testat calcule cu produse mixed (standard + redus)

---

## 37. SEO și JSON-LD Structured Data

### 37.1 Schema-uri Implementate

Template-ul include schema-uri JSON-LD pentru Google Rich Results:

| Schema | Locație | Descriere |
|--------|---------|-----------|
| **LocalBusiness** | `layout.tsx` | Pe toate paginile, din BusinessInfo global |
| **Product** | `produse/[slug]/page.tsx` | Pe paginile de produs |
| **Article** | `blog/[slug]/page.tsx` | Pe paginile de blog |
| **BreadcrumbList** | `produse/[slug]/page.tsx`, `blog/[slug]/page.tsx` | Navigare ierarhică |
| **FAQPage** | `RenderBlocks.tsx` (case 'faq') | Automat pe orice pagină cu FAQ block |

### 37.2 Pattern pentru JSON-LD în Next.js + Payload

**IMPORTANT:** JSON-LD se implementează în **Server Components** (`page.tsx`), NU în componente client.

```tsx
// ✅ CORECT - În page.tsx (Server Component)
export default async function ProductPage({ params }) {
  const payload = await getPayload({ config: configPromise })
  const product = await payload.find({ collection: 'products', ... })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    // ... alte câmpuri
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails product={product} />
    </>
  )
}

// ❌ GREȘIT - În componentă 'use client'
// JSON-LD nu va fi indexat corect de Google
```

### 37.3 LocalBusiness Schema (Automat)

Schema LocalBusiness e adăugată automat în `layout.tsx` și include:
- name, description, url
- telephone, email
- address (PostalAddress)
- geo (GeoCoordinates) - dacă există coordinates
- openingHours - din workingHours array
- sameAs - link-uri social media

**Date preluate din:** Global `business-info`

### 37.4 BreadcrumbList Schema

Pattern pentru breadcrumbs cu categorie opțională:

```tsx
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Acasă',
      item: serverUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Produse',
      item: `${serverUrl}/produse`,
    },
    // Categorie opțională (dacă există)
    ...(category ? [{
      '@type': 'ListItem',
      position: 3,
      name: category.title,
      item: `${serverUrl}/produse?categorie=${category.slug}`,
    }] : []),
    // Pagina curentă (fără item URL)
    {
      '@type': 'ListItem',
      position: category ? 4 : 3,
      name: productData.title,
    },
  ],
}
```

### 37.5 FAQPage Schema (Automat în RenderBlocks)

Schema FAQPage se generează automat când o pagină conține un FAQ block:

```tsx
// În RenderBlocks.tsx, case 'faq':
const faqJsonLd = faqs.length > 0 ? {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: extractTextFromLexical(faq.answer),  // Helper pentru Lexical rich text
    },
  })),
} : null
```

### 37.6 Open Graph Tags

OG tags sunt gestionate de `generateMeta.ts` și `mergeOpenGraph.ts`:

| Tag | Valoare | Sursa |
|-----|---------|-------|
| `og:locale` | `ro_RO` | Default |
| `og:site_name` | `Site Business` | Default |
| `og:type` | `article` / `website` | Bazat pe colecție |
| `og:image` | OG-sized image | Din meta.image |
| `og:title`, `og:description` | Din document | SEO plugin |
| `article:published_time` | Post publishedAt | Pentru articole |
| `article:modified_time` | Post updatedAt | Pentru articole |
| `article:author` | Author name | Pentru articole |

### 37.7 Testare SEO

```bash
# Verifică schema-urile cu Google Rich Results Test
https://search.google.com/test/rich-results?url=https://site.ro/produse/nume-produs

# Verifică meta tags în terminal
curl -s http://localhost:3010/produse/produs-1 | grep -E '<script type="application/ld\+json">|og:|<title>'
```

### 37.8 Checklist SEO Pre-Lansare

- [ ] LocalBusiness schema conține date corecte (verifică în BusinessInfo)
- [ ] Toate produsele au shortDescription (pentru schema Product)
- [ ] Toate articolele au excerpt și author
- [ ] FAQ collection are întrebări și răspunsuri
- [ ] Testat cu Google Rich Results Test
- [ ] Open Graph images sunt 1200x630px
- [ ] Canonical URLs setate corect

### 37.9 Note Importante

1. **Payload nu are opinie despre JSON-LD** - e responsabilitatea frontend-ului (Next.js)
2. **Schema-urile se generează server-side** - pentru ca Google să le poată indexa
3. **Multiple schema-uri pe pagină** - e OK și recomandat (Product + BreadcrumbList)
4. **Extragere text din Lexical** - folosește helper `extractTextFromLexical()` din RenderBlocks

---

## 38. White-Label Admin Panel (Payload CMS)

### 38.1 Problema

Payload CMS afișează logo-ul propriu în admin panel (`/admin`). Pentru soluții white-label, trebuie înlocuit cu branding-ul clientului.

### 38.2 Soluția - Custom Logo și Icon Components

**Pas 1:** Creează componentele custom în `src/components/admin/`

```typescript
// src/components/admin/Logo.tsx
'use client'

import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 0',
    }}>
      {/* Icon cu gradient */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: '12px',
      }}>
        MW
      </div>
      {/* Text logo */}
      <span style={{
        fontSize: '1.125rem',
        fontWeight: 600,
        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        MultiWebsite
      </span>
    </div>
  )
}

export default Logo
```

```typescript
// src/components/admin/Icon.tsx
'use client'

import React from 'react'

export const Icon: React.FC = () => {
  return (
    <div style={{
      width: '24px',
      height: '24px',
      borderRadius: '6px',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 700,
      fontSize: '10px',
    }}>
      MW
    </div>
  )
}

export default Icon
```

**Pas 2:** Configurează în `payload.config.ts`

```typescript
admin: {
  components: {
    beforeLogin: ['@/components/BeforeLogin'],
    beforeDashboard: ['@/components/BeforeDashboard'],
    graphics: {
      // Înlocuiește logo-ul Payload pentru white-label
      Logo: '@/components/admin/Logo',
      Icon: '@/components/admin/Icon',
    },
  },
  // ... restul configurației
},
```

### 38.3 Ce face fiecare componentă

| Componentă | Locație în Admin | Dimensiune |
|------------|------------------|------------|
| **Logo** | Sidebar, Login page | ~32x32px icon + text |
| **Icon** | Navbar (favicon area) | ~24x24px |

### 38.4 Stilizare

**Recomandări:**
- Folosește `style={{}}` inline pentru simplitate (nu e nevoie de CSS extern)
- `'use client'` e OBLIGATORIU (componentele admin sunt client-side)
- Gradient CSS pentru look modern: `background: linear-gradient(135deg, #color1, #color2)`
- Pentru text cu gradient: `WebkitBackgroundClip: 'text'` + `WebkitTextFillColor: 'transparent'`

### 38.5 Verificare

După modificări:
```bash
pnpm build  # Verifică că nu sunt erori TypeScript
pnpm dev
# Navighează la http://localhost:3000/admin
```

### 38.6 Note

- Frontend-ul site-ului (nu admin) este deja white-label by default
- Payload nu afișează "Powered by Payload" pe site-ul public
- Doar admin panel-ul necesită această configurare

---

## 39. Verificarea Testelor E2E (Sunt Fresh sau Cached?)

### 39.1 Problema

Cum verifici că testele E2E rulează efectiv și nu sunt cached/vechi?

### 39.2 Metode de Verificare

**1. Verifică timestamp-urile fișierelor de test:**
```bash
ls -la tests/e2e/*.spec.ts
# Arată modificare recentă? Testele au fost editate recent

stat tests/e2e/payload-api.spec.ts
# Access/Modify time recente = testat recent
```

**2. Verifică conținutul testelor (sunt aserții reale):**
```bash
grep -A5 "expect(" tests/e2e/payload-api.spec.ts
# Trebuie să vezi aserții ca:
# expect(response.ok()).toBeTruthy()
# expect(data.docs).toBeDefined()
```

**3. Verifică dacă testează date reale:**
```bash
grep -E "toBeDefined|toBeTruthy|toContain|toHaveLength" tests/e2e/*.spec.ts | wc -l
# Număr mare = teste cu verificări reale
```

**4. Rulează un test specific cu verbose:**
```bash
pnpm test:e2e tests/e2e/smoke.spec.ts --reporter=line
# Vezi output detaliat pentru fiecare test
```

### 39.3 Anatomia unui Test Real vs Fake

**Test REAL (bun):**
```typescript
test('API returns products', async ({ request }) => {
  const response = await request.get('/api/products')
  expect(response.ok()).toBeTruthy()  // ✅ Verifică status

  const data = await response.json()
  expect(data.docs).toBeDefined()      // ✅ Verifică structură
  expect(data.docs.length).toBeGreaterThan(0)  // ✅ Verifică date
})
```

**Test FAKE (de evitat):**
```typescript
test('API works', async () => {
  expect(true).toBe(true)  // ❌ Nu testează nimic real
})
```

### 39.4 Output Playwright - Ce să cauți

```
Running 199 tests using 4 workers

  ✓ payload-api.spec.ts:15:5 › API tests › GET /api/pages returns pages (234ms)
  ✓ payload-api.spec.ts:25:5 › API tests › GET /api/products returns products (156ms)
  ...

  199 passed (15.9m)
```

**Semne că testele sunt reale:**
- Timp de execuție variabil per test (234ms, 156ms) - nu toate instant
- Timp total semnificativ (15.9m pentru 199 teste)
- Workers multipli (4 workers)

### 39.5 Debugging Failed Tests

```bash
# Vezi doar testele failed
pnpm test:e2e --reporter=list 2>&1 | grep -E "✓|✗|failed"

# Rulează cu screenshots pentru debugging
pnpm test:e2e --screenshot=on

# HTML report
pnpm test:e2e --reporter=html
npx playwright show-report
```

---

## 40. Optimizarea Imaginilor pentru SEO (sizes attribute + Media Component)

### 40.1 Problema

Next.js Image component fără `sizes` attribute generează avertismente și afectează LCP (Largest Contentful Paint):

```
Image with src "/media/hero.jpg" was detected as the Largest Contentful Paint (LCP).
Please add the "priority" property if this image is above the fold.
```

Mai mult, fără `sizes`, browser-ul nu știe ce dimensiune de imagine să descarce pentru fiecare viewport.

### 40.2 Soluția: Atributul `sizes`

**Ce face `sizes`:**
- Spune browser-ului ce lățime va avea imaginea pe diferite viewports
- Browser-ul alege automat cea mai potrivită imagine din srcset
- Reduce bandwidth și îmbunătățește LCP

**Exemple de sizes pentru cazuri comune:**

```typescript
// Imagine full-width
sizes="100vw"

// Card într-un grid de 4 coloane
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"

// Thumbnail fix
sizes="80px"

// Hero cu container
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"

// Grid responsive 3 coloane
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

### 40.3 Pattern Media Component (din Payload Template Oficial)

Template-ul oficial Payload folosește un Media component centralizat care:
1. Auto-generează `sizes` bazat pe breakpoints
2. Suportă override pentru cazuri speciale
3. Adaugă blur placeholder pentru CLS
4. Include cache busting cu `updatedAt`

**Structură fișiere:**

```
src/components/Media/
├── index.tsx        # Wrapper (detectează video vs image)
├── ImageMedia/
│   └── index.tsx    # Logica pentru imagini
├── VideoMedia/
│   └── index.tsx    # Logica pentru video
└── types.ts         # Props interface
```

**Props interface cu size override:**

```typescript
// types.ts
export interface Props {
  resource?: MediaType | string | number | null
  size?: string  // ← Override pentru sizes custom
  fill?: boolean
  priority?: boolean
  imgClassName?: string
  // ...
}
```

**Auto-generated sizes cu override:**

```typescript
// ImageMedia/index.tsx
const sizes = sizeFromProps    // dacă e dat explicit
  ? sizeFromProps
  : Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
      .join(', ')
```

### 40.4 Când să folosești Media vs Image

| Situație | Folosește | De ce |
|----------|-----------|-------|
| Obiect Media complet din Payload | `<Media resource={image} />` | Are width/height/updatedAt |
| URL string simplu | `<Image src={url} sizes="..." />` | Nu are metadata |
| Imagine externă | `<Image src={url} sizes="..." />` | Nu e în Payload |

**Exemplu conversie la Media:**

```typescript
// ÎNAINTE (Image cu metadata manuală)
<Image
  src={image?.url || ''}
  alt={image?.alt || ''}
  width={image?.width || 400}
  height={image?.height || 300}
  className="object-cover"
/>

// DUPĂ (Media cu metadata automată)
<Media
  resource={image}
  fill
  size="(max-width: 768px) 100vw, 33vw"
  imgClassName="object-cover"
/>
```

### 40.5 Componente Actualizate

**Convertite la Media component:**
- `ServiceDetail` - hero, compact variant, team avatar, related services
- `TeamMemberDetail` - profile image
- `SubscriptionCards` - card images, overlay variant
- `Services` - service card images

**Cu sizes attribute adăugat:**
- `Cart` - `sizes="80px"` (thumbnails)
- `Checkout` - `sizes="48px"` (mini thumbnails)
- `Content` - `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"`
- `Products` - `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"`
- `Gallery` - varies by variant (grid vs instagram)
- `Testimonials` - `sizes="64px"` (avatars)
- `VideoEmbed` - `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"`

### 40.6 Beneficii Implementate

1. **LCP îmbunătățit** - Browser descarcă exact dimensiunea necesară
2. **Blur placeholder** - Reduce CLS (Cumulative Layout Shift)
3. **Cache busting** - Via `?updatedAt=timestamp` în URL
4. **Type safety** - Props tipizate corect
5. **Override capability** - Auto sizes + override pentru cazuri speciale

### 40.7 Breakpoints Configuration

```typescript
// src/cssVariables.ts
export const cssVariables = {
  breakpoints: {
    '3xl': 1920,
    '2xl': 1536,
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
  },
}
```

Aceste breakpoints se aliniază cu Tailwind pentru consistență.

---

## 41. Testare E2E pentru Imagini cu Playwright (Best Practices)

### 41.1 Problema

Cum verifici că imaginile se încarcă corect în teste E2E? `img.complete === true` NU e suficient - imaginile broken (404) tot returnează `complete = true`.

### 41.2 Soluția Oficială Playwright

**Metoda recomandată** (din GitHub Playwright Issues):

```typescript
// Pentru o singură imagine
await expect(page.locator('img')).toHaveJSProperty('complete', true);
await expect(page.locator('img')).not.toHaveJSProperty('naturalWidth', 0);

// Pentru multiple imagini
for (const img of await page.getByRole('img').all()) {
  await expect(img).toHaveJSProperty('complete', true, { timeout: 5000 });
  await expect(img).not.toHaveJSProperty('naturalWidth', 0, { timeout: 5000 });
}
```

**De ce ambele verificări:**
- `complete === true` - imaginea a terminat încărcarea (dar poate fi broken)
- `naturalWidth !== 0` - imaginea are dimensiuni reale (confirmă că s-a încărcat corect)

### 41.3 Tratarea Lazy Loading

Next.js Image folosește lazy loading by default. Imaginile sub fold nu se încarcă până nu sunt în viewport.

**Soluție: Scroll prin pagină înainte de verificare:**

```typescript
// Scroll slow pentru a triggera lazy loading
await page.evaluate(async () => {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  for (let i = 0; i < document.body.scrollHeight; i += 300) {
    window.scrollTo(0, i);
    await delay(200); // Delay între scroll-uri
  }
  // Scroll înapoi pentru a triggera imagini în ambele direcții
  for (let i = document.body.scrollHeight; i >= 0; i -= 500) {
    window.scrollTo(0, i);
    await delay(100);
  }
});

// Așteaptă încărcarea imaginilor
await page.waitForTimeout(5000);
```

### 41.4 Evitarea Timeout-urilor cu networkidle

**Problema:** `waitUntil: 'networkidle'` poate cauza timeout dacă există:
- Long-polling connections
- WebSocket connections
- Analytics scripts

**Soluție:** Folosește `domcontentloaded` + wait manual:

```typescript
// ❌ Poate cauza timeout
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

// ✅ Mai sigur
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000); // Așteaptă render inițial
```

### 41.5 Detectarea Imaginilor Broken (404)

```typescript
const brokenImages: string[] = [];

page.on('response', (response) => {
  const url = response.url();
  if (
    (url.includes('/media/') || url.includes('/_next/image')) &&
    response.status() >= 400
  ) {
    brokenImages.push(`${response.status()}: ${url}`);
  }
});

// După navigare
expect(brokenImages).toHaveLength(0);
```

### 41.6 Verificarea Next.js Image Optimization

```typescript
const nextImages = await page.evaluate(() => {
  const images = Array.from(document.querySelectorAll('img'));
  return images.filter(
    (img) =>
      img.src.includes('/_next/image') ||
      img.hasAttribute('data-nimg') ||
      img.srcset?.includes('/_next/image')
  ).length;
});

expect(nextImages).toBeGreaterThan(0);
```

### 41.7 Verificarea Atributului sizes (SEO)

```typescript
const imagesWithSizes = await page.evaluate(() => {
  const images = Array.from(document.querySelectorAll('img'));
  return images.filter((img) => img.sizes && img.sizes.length > 0).length;
});

expect(imagesWithSizes).toBeGreaterThan(0);
```

### 41.8 Comenzi Teste Imagini

```bash
# Verificare rapidă (fără reseed) - ~40s
pnpm test:images:quick

# Teste complete (reseed automat cu --with-images) - ~10min
pnpm test:images

# Rulează un singur test
pnpm exec playwright test tests/e2e/images-loaded.spec.ts -g "Playwright official method"
```

### 41.9 Surse

- [Playwright Issue #6046 - Wait for image to load](https://github.com/microsoft/playwright/issues/6046)
- [karlhorky/playwright-image-loading-tests-with-next-js](https://github.com/karlhorky/playwright-image-loading-tests-with-next-js)
- [Payload CMS Testing Best Practices](https://github.com/payloadcms/payload/discussions/2644)

---

*Documentație actualizată: December 2025*
*Pentru Universal Business Website Template - Payload CMS 3.x + Next.js 15*
