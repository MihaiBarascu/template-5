# Plan de Integrare Design plasturifototerapeutici.ro

**Data:** 2025-12-20
**Status:** COMPLET - Analiză și Plan
**Obiectiv:** Îmbogățirea sistemului multiwebsite pentru a reproduce design-ul plasturi exact prin seeder

---

## 1. ANALIZĂ COMPLETĂ SITE PLASTURI

### 1.1 Design System Identificat

| Element | Valoare | Notă |
|---------|---------|------|
| **Font Headings** | `lulo-clean-w01-one-bold, sans-serif` | Bold display font |
| **Font Body** | `prompt, sans-serif` | Clean sans-serif |
| **Font Weight** | 400 (normal) pentru TOATE | Chiar și headings! |
| **Primary Color** | `#116DFF` (rgb 17, 109, 255) | Albastru |
| **Accent Color** | `#AD50F2` (rgb 173, 80, 242) | Purple |
| **Button Radius** | 24px (pill) sau 0px (square) | 2 stiluri |
| **Card Shadows** | NONE | Design flat |
| **Border Radius** | 0px general, 24px butoane | Minimalist |

### 1.2 Structura Header

```
┌─────────────────────────────────────────────────────────────────┐
│ [Social Icons: YT, FB]  "Mesaj de recomandat"                   │ ← Top Bar
├─────────────────────────────────────────────────────────────────┤
│ [Logo Pink Flowers]  Nav: Home | Blog | Despre | Alavida | ...  │ ← Main Nav
│                                                    [Coș: 0]      │
└─────────────────────────────────────────────────────────────────┘
```

**Elemente Header:**
- Top bar cu social icons (YouTube, Facebook)
- Mesaj "Te rugăm să te întorci la persoana care te-a recomandat!"
- Logo imagine (floare roz)
- Navigație horizontală (6 iteme)
- Buton coș cu counter dinamic

### 1.3 Structura Footer

```
┌─────────────────────────────────────────────────────────────────┐
│  Column 1: Company Info        │  Column 2: Link-uri Utile     │
│  - Firmă: UNIQUE LIGHT...      │  - Politica confidentialitate │
│  - Sediu social: București...  │  - Politica cookie-uri        │
│  - Nr. registru comerț         │  - Protectia datelor          │
│                                │  - Termeni si conditii        │
│                                │  - Politica livrare/anulare   │
├────────────────────────────────┴────────────────────────────────┤
│  [Netopia Payments]    [ANPC SOL]    [ANPC SAL]                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Blocuri Homepage Identificate

| # | Block Tip | Descriere | Status în Template |
|---|-----------|-----------|-------------------|
| 1 | **Video Hero** | Fullscreen video + overlay + text | ✅ VideoHero |
| 2 | **Video + Text (2-col)** | Video stânga, text dreapta | ⚠️ Parțial |
| 3 | **Process Steps** | Zigzag layout cu pași | ✅ ProcessSteps |
| 4 | **Accordion FAQ** | Expandable items | ✅ FAQ |
| 5 | **Video Gallery** | Grid de video-uri | ✅ VideoGallery |
| 6 | **Stats Section** | Cifre cu descrieri | ✅ Stats |
| 7 | **Timeline** | Vertical alternating | ✅ Timeline |
| 8 | **Pricing Kits** | Cards cu preț și features | ✅ PricingKits |
| 9 | **Newsletter** | Email subscribe form | ✅ Newsletter |
| 10 | **CTA Section** | Final call to action | ✅ CTA |
| 11 | **Video Testimonials** | Carousel video | ⚠️ VideoGallery |
| 12 | **Download Links** | PDF download buttons | ❌ LIPSEȘTE |
| 13 | **Floating CTA** | Sticky "Aboneaza-te" button | ❌ LIPSEȘTE |

### 1.5 Pagina Blog

| Element | Descriere |
|---------|-----------|
| **Categorii** | Horizontal scrollable list (14+ categorii) |
| **Blog Cards** | Imagine + Titlu + Excerpt + Autor + Data + Read time |
| **Layout** | Grid 2-3 coloane |
| **Author Info** | Avatar + Nume + Link profil |
| **Metadata** | Data + "X min de citit" |

### 1.6 Pagina Shop

| Element | Descriere |
|---------|-----------|
| **Product Card** | Imagine + Badge NEW + Titlu + Preț |
| **Layout** | Flex grid responsive |
| **Sort** | Dropdown "Sortează după" |
| **Breadcrumb** | Start > All Products |
| **Product Page** | Galerie 4 img + Titlu + Preț + Qty + Add to Cart + Share |

### 1.7 Pagini Secundare Analizate

#### Despre Companie
- Hero cu imagine full-width
- About + Stats în 2 coloane
- Founder section cu imagine
- Awards grid (2 coloane)
- Video interview embed

#### My Alavida (Produs)
- Wave patterns decorative
- Benefits grid (6 icons)
- Product showcase (4 produse)
- Before/After carousel
- Ingredients accordion
- Science section cu stats

#### Sport de Performanță
- Video hero fullscreen
- Benefits cards (3 coloane)
- Expert testimonials carousel
- Athletes grid (8 profile)
- Protocol download section
- Anti-doping certifications

---

## 2. COMPARAȚIE: CE AVEM vs CE LIPSEȘTE

### 2.1 Blocuri Existente (AVEM)

| Block | Variante | Potrivire Plasturi |
|-------|----------|-------------------|
| VideoHero | fullscreen, medium | ✅ Perfect |
| ProcessSteps | zigzag, grid | ✅ Perfect |
| Timeline | vertical-alternating | ✅ Perfect |
| VideoGallery | grid-3, carousel | ✅ Perfect |
| Stats | grid-4 | ✅ Perfect |
| Newsletter | centered | ✅ Perfect |
| CTA | centered | ✅ Perfect |
| FAQ | accordion | ✅ Perfect |
| PricingKits | cards | ✅ Perfect |
| Team | featured, grid | ✅ Perfect |
| Testimonials | carousel, masonry | ✅ Perfect |
| BeforeAfter | slider | ✅ Perfect |
| TrustBadges | grid | ⚠️ Adaptabil |
| LatestPosts | grid | ⚠️ Adaptabil |

### 2.2 Blocuri/Componente LIPSĂ

| Element | Prioritate | Descriere |
|---------|------------|-----------|
| **DownloadLinks Block** | MEDIE | Grid de butoane download (PDF, DOCX) |
| **FloatingCTA** | MEDIE | Sticky button lateral |
| **VideoTextSection** | ÎNALTĂ | 2 coloane: Video + Text (alternând) |
| **AthleteGrid** | JOASĂ | Grid de profile sportivi |
| **IngredientsAccordion** | JOASĂ | Lista ingrediente expandabilă |
| **WaveDecorator** | JOASĂ | Ornamente SVG între secțiuni |
| **BlogCategoryNav** | MEDIE | Navigare categorii blog orizontală |
| **ProductCard Variant** | MEDIE | Card produs stil Wix |
| **SocialTopBar** | ÎNALTĂ | Header top bar cu social + mesaj |

### 2.3 Extensii Design System Necesare

| Element | Ce trebuie adăugat |
|---------|-------------------|
| **Header Variants** | `with-topbar` - include social bar + mesaj |
| **Footer Variants** | `compliance` - cu badge-uri ANPC, Netopia |
| **Button Styles** | `pill` (radius 24px), `square` (radius 0) |
| **Font Presets** | Adăugare font "Prompt" și "Lulo Clean" |
| **Shadow Styles** | `flat` preset (no shadows) |
| **Heading Weight** | Support pentru headings cu weight 400 |

---

## 3. PLAN DE IMPLEMENTARE

### FAZA 1: Design System Enhancements (CRITICĂ)

#### 1.1 Header cu TopBar

**Fișier:** `src/globals/Header.ts`

```typescript
// Adaugă în Header config:
{
  name: 'topBar',
  type: 'group',
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    { name: 'message', type: 'text' },
    { name: 'socialLinks', type: 'array', fields: [
      { name: 'platform', type: 'select', options: ['youtube', 'facebook', 'instagram', 'tiktok'] },
      { name: 'url', type: 'text' }
    ]},
    { name: 'backgroundColor', type: 'select', options: ['transparent', 'light', 'dark', 'primary'] },
  ]
}
```

#### 1.2 Footer cu Compliance Badges

**Fișier:** `src/globals/Footer.ts`

```typescript
// Adaugă în Footer config:
{
  name: 'complianceBadges',
  type: 'group',
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    { name: 'paymentBadge', type: 'upload', relationTo: 'media' },
    { name: 'paymentLink', type: 'text' },
    { name: 'anpcBadges', type: 'array', fields: [
      { name: 'image', type: 'upload', relationTo: 'media' },
      { name: 'link', type: 'text' },
      { name: 'alt', type: 'text' }
    ]}
  ]
}
```

#### 1.3 SiteTheme - Button Styles

**Fișier:** `src/globals/SiteTheme.ts`

```typescript
// Adaugă în tab Buttons:
{
  name: 'buttonRounding',
  type: 'select',
  defaultValue: 'default',
  options: [
    { label: 'None (0px)', value: 'none' },
    { label: 'Small (4px)', value: 'small' },
    { label: 'Default (8px)', value: 'default' },
    { label: 'Large (12px)', value: 'large' },
    { label: 'Pill (24px)', value: 'pill' },
  ]
},
{
  name: 'buttonTextTransform',
  type: 'select',
  defaultValue: 'none',
  options: [
    { label: 'None', value: 'none' },
    { label: 'Uppercase', value: 'uppercase' },
    { label: 'Capitalize', value: 'capitalize' },
  ]
}
```

### FAZA 2: Blocuri Noi

#### 2.1 VideoTextSection Block

**Scop:** 2 coloane cu video și text, alternabile

```typescript
// src/blocks/VideoTextSection/config.ts
export const VideoTextSectionBlock: Block = {
  slug: 'videoTextSection',
  interfaceName: 'VideoTextSection',
  fields: [
    { name: 'variant', type: 'select', options: ['video-left', 'video-right'] },
    { name: 'videoSource', type: 'select', options: ['youtube', 'vimeo', 'upload', 'url'] },
    { name: 'videoUrl', type: 'text' },
    { name: 'videoFile', type: 'upload', relationTo: 'media' },
    { name: 'videoPoster', type: 'upload', relationTo: 'media' },
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'text' },
    { name: 'content', type: 'richText' },
    { name: 'ctaButton', type: 'group', fields: [...] },
    { name: 'badge', type: 'text' }, // Ex: "~1:30 minute"
    { name: 'backgroundColor', type: 'select' },
  ]
}
```

#### 2.2 DownloadLinks Block

**Scop:** Grid de butoane pentru descărcări

```typescript
// src/blocks/DownloadLinks/config.ts
export const DownloadLinksBlock: Block = {
  slug: 'downloadLinks',
  interfaceName: 'DownloadLinks',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'links', type: 'array', fields: [
      { name: 'label', type: 'text' },
      { name: 'file', type: 'upload', relationTo: 'media' },
      { name: 'externalUrl', type: 'text' },
      { name: 'icon', type: 'select', options: ['Download', 'PDF', 'Document', 'External'] },
      { name: 'variant', type: 'select', options: ['primary', 'secondary', 'outline'] }
    ]},
    { name: 'layout', type: 'select', options: ['inline', 'stacked', 'grid-2', 'grid-3'] },
    { name: 'backgroundColor', type: 'select' }
  ]
}
```

#### 2.3 FloatingCTA Component

**Scop:** Buton sticky lateral (nu block, componentă globală)

```typescript
// src/globals/BusinessInfo.ts - adaugă în config:
{
  name: 'floatingCTA',
  type: 'group',
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    { name: 'label', type: 'text', defaultValue: 'Contactează-ne' },
    { name: 'link', type: 'text' },
    { name: 'position', type: 'select', options: ['left', 'right'] },
    { name: 'style', type: 'select', options: ['vertical', 'horizontal'] },
    { name: 'showOnMobile', type: 'checkbox', defaultValue: true }
  ]
}
```

### FAZA 3: Actualizare Seeder terapii-energetice

#### 3.1 Configurare Header cu TopBar

```typescript
// În seedHeader():
await seedHeader(payload, {
  variant: 'standard',
  topBar: {
    enabled: true,
    message: 'Te rugăm să te întorci la persoana care te-a recomandat!',
    socialLinks: [
      { platform: 'youtube', url: 'https://youtube.com/...' },
      { platform: 'facebook', url: 'https://facebook.com/...' }
    ],
    backgroundColor: 'transparent'
  },
  navItems: [...],
  ctaButton: { enabled: true, label: 'Programează-te', link: '/contact' }
})
```

#### 3.2 Configurare Footer cu Compliance

```typescript
// În seedFooter():
await seedFooter(payload, {
  variant: 'columns-2',
  complianceBadges: {
    enabled: true,
    paymentBadge: netopiaImageId,
    paymentLink: 'https://netopia-payments.com/',
    anpcBadges: [
      { image: anpcSolId, link: 'https://ec.europa.eu/consumers/odr', alt: 'ANPC SOL' },
      { image: anpcSalId, link: 'https://anpc.ro/ce-este-sal/', alt: 'ANPC SAL' }
    ]
  },
  columns: [...]
})
```

#### 3.3 Configurare Theme pentru Plasturi Style

```typescript
// În seedSiteTheme():
await seedSiteTheme(payload, {
  variant: 'plasturi-inspired',
  // Typography
  headingFont: 'Prompt', // Sau font similar
  bodyFont: 'Prompt',
  headingWeight: 'normal', // 400 - IMPORTANT!

  // Colors - Gold & Navy (terapii) sau Blue & Purple (plasturi)
  useCustomColors: true,
  colors: {
    primary: '#F5C518',      // Gold (terapii) sau '#116DFF' (plasturi)
    secondary: '#1a1a2e',    // Navy
    accent: '#AD50F2',       // Purple accent
  },

  // Buttons
  buttonRounding: 'pill',    // 24px
  buttonTextTransform: 'none',

  // Shadows
  shadows: 'flat',           // No shadows - stil plasturi

  // Spacing
  sectionSpacing: 'spacious',
})
```

---

## 4. FONTURI RECOMANDATE

### 4.1 Alternative Gratuite pentru "Lulo Clean"

| Font Original | Alternative Gratuite |
|---------------|---------------------|
| Lulo Clean | **Bebas Neue**, **Oswald**, **Archivo Black** |
| Prompt | **Prompt** (Google Fonts - disponibil!) |

### 4.2 Configurare în proiect

```typescript
// src/theme/fonts.ts - adaugă:
import { Prompt, Bebas_Neue } from 'next/font/google'

export const prompt = Prompt({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-prompt',
})

export const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
})
```

---

## 5. CHECKLIST IMPLEMENTARE

### Faza 1: Design System
- [ ] Adaugă `topBar` în Header config
- [ ] Adaugă `complianceBadges` în Footer config
- [ ] Adaugă `buttonRounding` și `buttonTextTransform` în SiteTheme
- [ ] Adaugă `headingWeight` în SiteTheme
- [ ] Adaugă font Prompt în theme/fonts.ts
- [ ] Actualizează `generateThemeStyles.ts` pentru noile variabile

### Faza 2: Componente Header/Footer
- [ ] Implementează TopBar component în Header
- [ ] Implementează ComplianceBadges în Footer
- [ ] Testează pe seeder existent

### Faza 3: Blocuri Noi (Opțional)
- [ ] Creează VideoTextSection block (dacă e necesar)
- [ ] Creează DownloadLinks block (dacă e necesar)
- [ ] Adaugă FloatingCTA în BusinessInfo

### Faza 4: Actualizare Seeder
- [ ] Actualizează `terapii-energetice.ts` cu header topBar
- [ ] Actualizează cu footer compliance badges
- [ ] Actualizează theme cu stiluri plasturi
- [ ] Testează cu `SEED_TYPE=terapii-energetice pnpm seed`

### Faza 5: Verificare
- [ ] Compară vizual cu plasturifototerapeutici.ro
- [ ] Verifică responsive (mobile, tablet, desktop)
- [ ] Verifică toate paginile
- [ ] Build test: `pnpm build`

---

## 6. ESTIMARE EFORT

| Task | Complexitate | Prioritate |
|------|--------------|------------|
| Header TopBar | Medie | ÎNALTĂ |
| Footer Compliance | Simplă | ÎNALTĂ |
| Theme Button Styles | Simplă | ÎNALTĂ |
| Theme Heading Weight | Simplă | ÎNALTĂ |
| Font Prompt | Simplă | MEDIE |
| VideoTextSection | Medie | MEDIE |
| DownloadLinks | Simplă | JOASĂ |
| FloatingCTA | Simplă | JOASĂ |
| Seeder Update | Medie | ÎNALTĂ |

---

## 7. SCREENSHOTS CAPTURATE

Toate screenshot-urile sunt salvate în:
```
/home/evr/Desktop/website-templates/template-5/.playwright-mcp/
```

| Fișier | Conținut |
|--------|----------|
| `plasturi-homepage-full.png` | Homepage complet |
| `plasturi-blog-page.png` | Pagina Blog |
| `shop-page-full.png` | Shop All Products |
| `shop-products.png` | Product listing |
| `product-page-full.png` | Pagină produs individual |
| `shop-tablet.png` | Shop la 768px |
| `shop-mobile.png` | Shop la 375px |
| `despre-companie.png` | Pagina Despre |
| `my-alavida.png` | Pagina Alavida |
| `sport-performanta.png` | Sport de Performanță |

---

*Plan creat pe baza analizei complete a site-ului plasturifototerapeutici.ro*
*Pregătit pentru implementare în template-5 multiwebsite*
