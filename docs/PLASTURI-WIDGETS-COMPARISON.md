# Comparație Completă: Plasturi.ro Widgets vs Template-5 vs TerapiiEnergetice.ro

Acest document prezintă analiza completă a widgeturilor din plasturifototerapeutici.ro, cum au fost implementate în template-5, și cum sunt utilizate în seeder-ul pentru terapiienergetice.ro.

## 1. Widgeturi Plasturi.ro vs Blocuri Template-5

| Widget Plasturi.ro | Block Template-5 | Status | Variante Disponibile |
|-------------------|------------------|--------|---------------------|
| **Video Hero Fullscreen** | `VideoHeroBlock` | ✅ Complet | url/upload, height: fullscreen/large/medium |
| **Trust Badge (Money-Back)** | `TrustBadgesBlock` | ✅ Complet | presets: certified, non-invasive, money-back-30, patented |
| **Process Steps (3 pași)** | `ProcessStepsBlock` | ✅ Complet | zigzag, timeline, horizontal, grid, carousel |
| **Download PDFs** | `DownloadLinksBlock` | ✅ Complet | buttons, list, grid |
| **Video Gallery** | `VideoGalleryBlock` | ✅ Complet | grid-2, grid-3, carousel |
| **Benefits Carousel** | `ProcessStepsBlock (carousel)` | ✅ Complet | Scroll orizontal cu snap |
| **Pricing Kits (4 tiers)** | `PricingKitsBlock` | ✅ Complet | cards, cards-image, compact, highlighted |
| **Timeline Results** | `TimelineBlock` | ✅ Complet | vertical, horizontal, vertical-alternating |
| **Newsletter GDPR** | `NewsletterBlock` | ✅ Complet | requireConsent, consentText |
| **Floating CTA** | `FloatingCTA` (component) | ✅ Complet | shape: pill/rectangle, position: 5 opțiuni |
| **Top Bar Social** | `Header (with-topbar)` | ✅ Complet | Configurat din seedHeader |
| **Footer Columns** | `Footer` | ✅ Complet | columns-4 cu links |

### Implementări Premium (Plasturi Design)

Toate blocurile "premium" sunt în `/src/blocks/`:
- `VideoHero/` - Hero video fullscreen cu overlay
- `ProcessSteps/` - 5 variante pentru pași/beneficii
- `PricingKits/` - Carduri de prețuri cu badges
- `DownloadLinks/` - Butoane de descărcare PDF
- `TrustBadges/` - Badge-uri de încredere cu iconițe
- `Timeline/` - Timeline cu evenimente
- `Newsletter/` - Cu checkbox GDPR

## 2. Conținut TerapiiEnergetice.ro vs Seeder

| Secțiune Original | Implementat în Seeder | Block Folosit |
|-------------------|----------------------|---------------|
| Slider Hero | ✅ | `VideoHeroBlock` (video local) |
| Despre Noi | ✅ | `TeamBlock` variant featured |
| Terapii Grid (6) | ✅ | `ServicesBlock` grid-3 |
| Cursuri (2) | ✅ | `ServicesBlock` list-alternating |
| Contact Form | ✅ | `ContactBlock` + `FormBlock` |
| Newsletter Footer | ✅ | `NewsletterBlock` with-pattern |
| Footer 4 Columns | ✅ | `Footer` columns-4 |
| Testimoniale | ✅ | `TestimonialsBlock` carousel |
| FAQ | ✅ | `FAQBlock` accordion |
| Media Video | ✅ | `VideoGalleryBlock` grid-3 |

### Pagini Create în Seeder

1. **Homepage** (`/`)
   - VideoHero fullscreen
   - TrustBadges (certified, non-invasive, money-back-30)
   - TeamBlock featured
   - ProcessSteps zigzag (Cum Funcționează)
   - DownloadLinks (PDF-uri)
   - ServicesBlock grid-3 (Terapii)
   - StatsBlock (statistici)
   - TimelineBlock (Experiența mea)
   - TestimonialsBlock carousel
   - VideoGalleryBlock (testimoniale video)
   - ServicesBlock list-alternating (Cursuri)
   - FAQBlock accordion
   - ContactBlock
   - ProcessSteps carousel (Beneficii)
   - NewsletterBlock GDPR
   - CTABlock

2. **Terapii** (`/terapii`)
   - VideoHero medium
   - TrustBadges
   - ProcessSteps zigzag
   - ServicesBlock grid-3
   - FAQBlock
   - CTABlock

3. **Cursuri** (`/cursuri`)
   - VideoHero medium
   - TrustBadges
   - ServicesBlock list-alternating
   - VideoGalleryBlock
   - TestimonialsBlock
   - NewsletterBlock GDPR
   - CTABlock

4. **Despre** (`/despre`)
   - VideoHero medium
   - TrustBadges
   - TeamBlock featured
   - StatsBlock
   - TimelineBlock (Călătoria mea)
   - ProcessSteps grid (Certificări)
   - TestimonialsBlock
   - CTABlock

5. **Media** (`/media`)
   - Hero minimal
   - VideoGalleryBlock

6. **Testimoniale** (`/testimoniale`)
   - Hero minimal
   - TestimonialsBlock masonry

7. **Contact** (`/contact`)
   - Hero minimal
   - ContactBlock full

## 3. Configurații BusinessInfo (Plasturi Design)

```typescript
// FloatingCTA configuration
floatingCta: {
  enabled: true,
  text: 'Abonează-te Acum',
  href: '/contact',
  variant: 'gradient',
  icon: 'arrow',
  position: 'bottom-right', // sau 'right-center' pentru vertical
  shape: 'rectangle', // Plasturi style
  showOnMobile: true,
  pulseAnimation: true,
  dismissible: false,
  showAfterScroll: 300,
}

// Header with TopBar (Plasturi style)
header: {
  variant: 'with-topbar',
  isTransparent: true,
  transparentTextColor: 'white',
  topBar: {
    backgroundColor: 'dark',
    layout: 'social-left',
    showPhone: true,
    showEmail: true,
    showSocial: true,
    customText: 'Te rugăm să te întorci la persoana care te-a recomandat!',
  }
}

// Theme (Plasturi fonts + pill buttons)
theme: {
  headingFont: 'Prompt',
  bodyFont: 'Open_Sans',
  headingWeight: '400', // Light weight pentru aspect flat
  buttonRounding: 'pill',
  shadows: 'none', // Flat design
}
```

## 4. Ce NU este Folosit în Seeder (dar Există)

| Block | Motiv |
|-------|-------|
| `PricingKitsBlock` | TerapiiEnergetice.ro nu vinde kituri de produse |
| `BeforeAfterBlock` | Nu au imagini before/after |
| `ScheduleTableBlock` | Nu au program fix pe zile |
| `ProductsBlock` | Nu e magazin online |
| `CartBlock` / `CheckoutBlock` | Nu e ecommerce |

### Când să Folosești PricingKitsBlock

PricingKitsBlock este ideal pentru:
- Business-uri care vând pachete (ex: kituri LifeWave)
- Planuri de abonament cu features diferite
- Comparație între mai multe opțiuni de preț

```typescript
{
  blockType: 'pricing-kits',
  variant: 'cards-image', // Cu imagini de produs
  heading: 'Kituri și Prețuri',
  subheading: 'DISCOUNT 30-50%',
  kits: [
    {
      name: 'Kit Core',
      price: 1645,
      priceLabel: 'lei (TVA inclus)',
      description: 'Kit de bază pentru o singură persoană',
      badge: 'popular',
      features: [
        { text: '3 pachete X39', included: true },
        { text: 'Transport DHL 1-2 zile', included: true },
        { text: 'Garanție 30 de zile', included: true },
      ],
      cta: { label: 'Comandă', link: '/comanda/kit-core' },
      image: kitCoreImageId,
    },
    // ... alte kituri
  ],
  backgroundColor: 'light',
}
```

## 5. Fișiere Cheie

### Blocuri Premium (Plasturi)
- `src/blocks/VideoHero/` - Component + Config
- `src/blocks/ProcessSteps/` - Component + Config
- `src/blocks/PricingKits/` - Component + Config
- `src/blocks/DownloadLinks/` - Component + Config
- `src/blocks/TrustBadges/` - Component + Config

### Componente
- `src/components/ui/FloatingCTA.tsx` - CTA flotant cu 5 poziții
- `src/components/Header/index.tsx` - Header cu topbar transparent

### Seeder
- `src/seed/businesses/terapii-energetice.ts` - Seeder principal
- `src/seed/terapii-energetice-data.ts` - Datele de conținut
- `src/seed/helpers.ts` - Funcții helper pentru seeding

### Configurație Globală
- `src/globals/BusinessInfo.ts` - FloatingCTA, WhatsApp, AnnouncementBar
- `src/globals/Header.ts` - TopBar, transparent header
- `src/globals/SiteTheme.ts` - Fonts, button rounding, colors

## 6. Verificare Finală

### Build și Test
```bash
# Build production
pnpm build

# Start production server
pnpm start  # Port 3100

# Seed database
SEED_TYPE=terapii-energetice pnpm seed
```

### Playwright Test Checklist
- [x] Homepage loads without console errors
- [x] VideoHero plays correctly
- [x] TrustBadges display with icons
- [x] ProcessSteps carousel scrolls
- [x] Newsletter form validates email
- [x] GDPR checkbox works
- [x] FloatingCTA appears after scroll
- [x] All pages navigate correctly

## 7. Concluzie

**100% IMPLEMENTAT** - Toate widgeturile din plasturi.ro au corespondent în template-5:
- VideoHero cu overlay și CTA
- TrustBadges cu presets predefinite
- ProcessSteps cu 5 variante (inclusiv carousel)
- DownloadLinks pentru PDF-uri
- PricingKits pentru pachete de produse
- Timeline pentru experiență/rezultate
- Newsletter cu GDPR checkbox
- FloatingCTA cu shape rectangle/pill
- Header transparent cu TopBar

Seeder-ul pentru terapii-energetice folosește aceste blocuri pentru a crea un site complet, similar cu designul plasturi.ro dar adaptat pentru servicii de terapii energetice.
