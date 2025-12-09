# Plan de Optimizare Performanță - Target 90%+ Lighthouse

**Data:** 2025-12-10
**Scor actual:** 68 (Production)
**Target:** 90%+
**Timp estimat:** 2-3 zile de implementare

---

## Sumar Executiv

Analiza completă a proiectului a identificat **5 categorii principale** de optimizări care vor duce scorul Lighthouse de la 68 la 90%+:

| Categorie | Impact Estimat | Efort | Prioritate |
|-----------|----------------|-------|------------|
| Google Fonts Blocking | +15-20 puncte | Mic | P1 CRITIC |
| Dynamic Imports (JS) | +10-15 puncte | Mediu | P1 CRITIC |
| HTTP Caching Headers | +5-10 puncte | Mic | P2 ÎNALT |
| Image Optimization | +5-10 puncte | Mediu | P2 ÎNALT |
| Data Fetching (Select API) | +3-5 puncte | Mediu | P3 MEDIU |

**Total impact estimat: +38-60 puncte** → Scor final: 90-100

---

## PRIORITATE 1 - CRITIC (Fă PRIMA DATĂ)

### 1.1 Rezolvare Google Fonts Blocking

**Fișier:** `src/app/(frontend)/layout.tsx`
**Linii:** 137-151
**Impact:** +15-20 puncte (FCP, LCP)

**Problema:**
```html
<!-- ACTUAL - BLOCHEAZĂ RENDERAREA -->
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet" />
```

**Soluție:**
```tsx
// ÎNLOCUIEȘTE liniile 137-151 cu:
<link
  rel="preconnect"
  href="https://fonts.googleapis.com"
/>
<link
  rel="preconnect"
  href="https://fonts.gstatic.com"
  crossOrigin="anonymous"
/>
<link
  href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Cormorant+Garamond:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Raleway:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap"
  rel="stylesheet"
  media="print"
  onLoad="this.media='all'"
/>
<noscript>
  <link
    href="https://fonts.googleapis.com/css2?family=..."
    rel="stylesheet"
  />
</noscript>
```

**Test după implementare:**
```bash
pnpm build && pnpm start
# Într-un alt terminal:
pnpm test:lighthouse:quick
```

---

### 1.2 Dynamic Imports pentru Blocuri Grele

**Fișier:** `src/blocks/RenderBlocks.tsx`
**Impact:** +10-15 puncte (TBT, TTI)

**Blocuri de transformat în dynamic imports:**

| Bloc | Linia Import | Dimensiune | Motiv |
|------|--------------|------------|-------|
| Testimonials | 13 | ~15KB | Auto-rotation, animații |
| Gallery | 17 | ~12KB | Lightbox, multe imagini |
| Booking | 19 | ~20KB | Formular complex, date picker |
| Checkout | 22 | ~25KB | Ecommerce, validări |
| Products | 23 | ~18KB | Multiple produse, cart |

**Cod de implementat:**

```tsx
// src/blocks/RenderBlocks.tsx - ÎNLOCUIEȘTE importurile

// ÎNAINTEA - Importuri directe (liniile 13-25)
import { TestimonialsBlock } from './Testimonials/Component'
import { GalleryBlock } from './Gallery/Component'
import { BookingBlock } from './Booking/Component'
import { CheckoutBlock } from './Checkout/Component'
import { ProductsBlock } from './Products/Component'

// DUPĂ - Dynamic imports
import dynamic from 'next/dynamic'

const TestimonialsBlock = dynamic(
  () => import('./Testimonials/Component').then(mod => mod.TestimonialsBlock),
  { loading: () => <div className="h-64 bg-theme-light animate-pulse rounded-lg" /> }
)

const GalleryBlock = dynamic(
  () => import('./Gallery/Component').then(mod => mod.GalleryBlock),
  { loading: () => <div className="h-96 bg-theme-light animate-pulse rounded-lg" /> }
)

const BookingBlock = dynamic(
  () => import('./Booking/Component').then(mod => mod.BookingBlock),
  { loading: () => <div className="h-96 bg-theme-light animate-pulse rounded-lg" /> }
)

const CheckoutBlock = dynamic(
  () => import('./Checkout/Component').then(mod => mod.CheckoutBlock),
  { loading: () => <div className="h-96 bg-theme-light animate-pulse rounded-lg" /> }
)

const ProductsBlock = dynamic(
  () => import('./Products/Component').then(mod => mod.ProductsBlock),
  { loading: () => <div className="h-64 bg-theme-light animate-pulse rounded-lg" /> }
)
```

**IMPORTANT:** Nu afectează funcționalitatea - blocurile se încarcă lazy când apar în viewport.

---

## PRIORITATE 2 - ÎNALT

### 2.1 Adaugă HTTP Caching Headers

**Fișier:** `next.config.js`
**Impact:** +5-10 puncte (TTFB, repeat visits)

**Adaugă după `redirects`:**

```javascript
// next.config.js - adaugă acest bloc
async headers() {
  return [
    // Cache pentru imagini - 1 an
    {
      source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    // Cache pentru fonts - 1 an
    {
      source: '/:all*(woff|woff2|ttf|otf)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    // Cache pentru JS/CSS static - 1 an (hashed)
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    // Cache pentru pagini HTML - ISR compatible
    {
      source: '/:path((?!api|_next|admin).*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
        },
      ],
    },
    // Security headers
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ]
},
```

---

### 2.2 Optimizare Imagini Next.js

**Fișier:** `next.config.js`
**Impact:** +5-10 puncte (LCP, CLS)

**Înlocuiește blocul `images`:**

```javascript
// next.config.js - înlocuiește images config
images: {
  remotePatterns: [
    {
      hostname: url.hostname,
      protocol: url.protocol.replace(':', ''),
    },
  ],
  // ADAUGĂ ACESTEA:
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 31536000, // 1 an
},
```

---

### 2.3 Adaugă Priority pe Hero Images

**Fișier:** `src/heros/RenderHero.tsx`
**Linii:** 185, 395, 538, 596
**Impact:** +3-5 puncte (LCP)

**Caută și înlocuiește:**

```tsx
// Linia 185, 395 - Carousel Hero
// ÎNAINTE:
priority={index === 0}

// DUPĂ:
priority={true}  // Prima imagine din hero e întotdeauna prioritară

// Linia 538 - Split Hero, Linia 596 - Default Hero
// ADAUGĂ priority={true} la Image component
<Image
  {...props}
  priority={true}  // ADAUGĂ ACEASTĂ LINIE
  sizes="..."
/>
```

---

### 2.4 Adaugă Priority pe Logo

**Fișier:** `src/components/Logo/index.tsx`
**Linii:** 40-47, 54-61
**Impact:** +1-2 puncte (FCP)

```tsx
// ADAUGĂ priority={true} la ambele Image components
<Image
  src={imageUrl}
  alt={businessName || 'Logo'}
  width={height * 3}
  height={height}
  priority={true}  // ADAUGĂ
  style={{ height: `${height}px`, width: 'auto' }}
  className="object-contain"
/>
```

---

## PRIORITATE 3 - MEDIU

### 3.1 Optimizare Data Fetching cu Select API

**Impact:** +3-5 puncte (TTFB, server response time)

#### 3.1.1 Products Page - Reduce Data Fetching

**Fișier:** `src/app/(frontend)/produse/page.tsx`
**Linia:** 89-95

```typescript
// ÎNAINTE:
const products = await payload.find({
  collection: 'products',
  where: whereConditions.length > 0 ? { and: whereConditions } : {},
  sort: sortField,
  limit: config.productsPerPage || 24,
  depth: 2,
})

// DUPĂ - cu Select API:
const products = await payload.find({
  collection: 'products',
  where: whereConditions.length > 0 ? { and: whereConditions } : {},
  sort: sortField,
  limit: config.productsPerPage || 24,
  depth: 2,
  select: {
    id: true,
    slug: true,
    title: true,
    priceInRON: true,
    badge: true,
    inventory: true,
    brand: true,
    images: true,
    tags: true,
  }
})
```

#### 3.1.2 Blog Page - Reduce Depth

**Fișier:** `src/app/(frontend)/blog/page.tsx`
**Linia:** 54-69

```typescript
// ÎNAINTE:
depth: 2,

// DUPĂ:
depth: 1,  // Redus de la 2 la 1 - nu avem nevoie de related posts
```

#### 3.1.3 Categories Page - Fix N+1 Query (OPȚIONAL - complex)

**Fișier:** `src/app/(frontend)/categorii/page.tsx`
**Notă:** Această optimizare e mai complexă, poate fi amânată.

---

### 3.2 Adaugă Turbopack pentru Development

**Fișier:** `package.json`
**Impact:** 10x mai rapid în development (nu afectează producția)

```json
// ÎNAINTE:
"dev": "cross-env NODE_OPTIONS=--no-deprecation next dev",

// DUPĂ:
"dev": "cross-env NODE_OPTIONS=--no-deprecation next dev --turbo",
```

---

### 3.3 Elimină Animații CSS Duplicate

**Fișier:** `src/app/(frontend)/globals.css`
**Impact:** -1.5KB CSS

**Șterge aceste @keyframes (sunt duplicate în tailwind.config.mjs):**
- `fadeIn`
- `fadeInDown`
- `fadeInUp`
- `slideInRight`

---

## VERIFICARE - Checklist Implementare

### Înainte de a începe:
- [ ] Rulează `pnpm test:lighthouse:quick` - salvează scorul actual
- [ ] Fă commit cu starea actuală

### După fiecare schimbare:
- [ ] Verifică TypeScript: `pnpm typecheck`
- [ ] Verifică build: `pnpm build`
- [ ] Test rapid: `pnpm test:e2e tests/e2e/quick-check.spec.ts`

### După toate schimbările:
- [ ] Build producție: `pnpm build`
- [ ] Start producție: `pnpm start`
- [ ] Lighthouse final: `pnpm test:lighthouse:quick`
- [ ] Toate testele: `pnpm test:e2e`

---

## NU MODIFICA (Safe List)

Aceste fișiere/funcționalități NU trebuie modificate:

1. **Payload Admin** - `/src/app/(payload)/*` - separate de frontend
2. **Hooks de revalidare** - `/src/hooks/revalidate*.ts` - funcționează corect
3. **ISR Settings** - `revalidate = 60` pe pagini - e corect
4. **Collections** - `/src/collections/*` - nu afectează performanța frontend
5. **API Routes** - `/src/app/(payload)/api/*` - nu afectează Lighthouse

---

## Ordinea Implementării Recomandate

```
Ziua 1 (2-3 ore):
├── 1.1 Google Fonts → Test
├── 1.2 Dynamic Imports → Test
└── Verificare că totul funcționează

Ziua 2 (2-3 ore):
├── 2.1 Caching Headers → Test
├── 2.2 Image Config → Test
├── 2.3 Hero Priority → Test
└── 2.4 Logo Priority → Test

Ziua 3 (1-2 ore):
├── 3.1 Select API (opțional)
├── 3.2 Turbopack
├── 3.3 CSS Cleanup
└── Test Final Complet
```

---

## Metrici de Succes

| Metrică | Actual | Target | După Optimizare |
|---------|--------|--------|-----------------|
| Performance | 68 | 90+ | TBD |
| LCP | ~2.5s | <2.5s | TBD |
| FCP | ~1.8s | <1.8s | TBD |
| TBT | ~500ms | <200ms | TBD |
| CLS | 0.057 | <0.1 | TBD |

---

## Comenzi Utile

```bash
# Verificare rapidă performanță
pnpm test:lighthouse:quick

# Build și test producție
pnpm build && pnpm start

# Verificare că nu s-a stricat nimic
pnpm test:e2e tests/e2e/quick-check.spec.ts

# Verificare SEO (să rămână 100)
pnpm test:seo

# TypeScript check
pnpm typecheck
```

---

## Referințe

- [Payload CMS Performance Docs](https://payloadcms.com/docs/performance/overview)
- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Achieving 95+ Lighthouse in Next.js](https://medium.com/@sureshdotariya/achieving-95-lighthouse-scores-in-next-js-15-modern-web-application-part1-e2183ba25fc1)

---

*Document generat automat din analiza multi-agent în data de 2025-12-10*
