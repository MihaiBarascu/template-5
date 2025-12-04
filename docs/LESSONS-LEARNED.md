# Lessons Learned - Universal Business Website Template

## Documentație Tehnică și Reguli de Web Design

Acest document conține lecțiile învățate și cele mai importante reguli de web design implementate în proiect.

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

*Documentație actualizată: December 2025*
*Pentru Universal Business Website Template - Payload CMS 3.x + Next.js 15*
