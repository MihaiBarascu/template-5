# Plan: Multi-Website Agency Seed

> **ACTUALIZAT:** Decembrie 2024 - Reflect starea curentă a proiectului

## Rezumat

Crearea unui seed pentru **website de agenție web** care prezintă serviciul de creare site-uri și afișează demo-urile live ca portofoliu.

**Principiu:** Toate blocurile noi vor fi **generice și reutilizabile** pentru orice tip de afacere.

---

## Stare Curentă Proiect

### Ce avem implementat:

| Component | Status | Detalii |
|-----------|--------|---------|
| **Seed System** | ✅ Complet | 9 business-uri, flag `--with-images`, design variants |
| **Blocuri** | ✅ 36 blocuri | Vezi lista completă mai jos |
| **Colecții** | ✅ 16+ colecții | Users, Media, Pages, Posts, Services, Products, etc. |
| **Globals** | ✅ 7 globals | SiteTheme, BusinessInfo, Header, Footer, Logo, ShopSettings, SystemPages |
| **Plugin-uri** | ✅ 8 plugin-uri | SEO, Search, Forms, Redirects, Ecommerce, S3, etc. |
| **Design System** | ✅ 10+ variante | 5 variante per business type |
| **Storage** | ✅ R2 + Local | Cloudflare R2 cu fallback local |
| **Email** | ✅ Notificări | Comenzi + formulare via Resend |

---

## Seed System

### Comportament

```bash
# Container (Dokploy)
sh run-seed.sh frizerie             # Refolosește imaginile existente
sh run-seed.sh frizerie with-images # Șterge și reimportă toate imaginile

# Local (development)
pnpm seed                    # Refolosește imaginile existente
pnpm seed -- --with-images   # Șterge și reimportă toate imaginile
```

### Business Types Disponibile (9)

| Tip | Slug | Design Variants |
|-----|------|-----------------|
| Frizerie/Barbershop | `frizerie` | Classic Dark & Gold, Modern Blue, Bold Black, Minimal Clean, Elegant Premium |
| Cabinet Stomatologic | `dentist` | Professional Blue, Clean White, Modern Teal, Warm Beige, Bold Black |
| Cabinet Avocat | `avocat` | Classic Blue, Professional Gray, Modern Dark, Elegant Burgundy, Minimalist White |
| Restaurant | `restaurant` | Warm Rustic, Modern Black, Fresh Green, Elegant Gold, Vibrant Red |
| Service Auto | `auto-service` | Professional Blue, Industrial Dark, Modern Silver, Bold Red, Clean Minimalist |
| Construcții | `constructii` | Professional Blue, Industrial Gray, Modern Orange, Bold Black, Minimalist Clean |
| Salon Beauty | `salon` | Luxury Gold, Modern Pink, Clean Minimalist, Bold Purple, Elegant Peach |
| Magazin Online | `magazin` | Modern Blue, Warm Gold, Fresh Green, Bold Purple, Clean Minimalist |
| Fitness/Gym | `fitness` | Orange Energy, Bold Black, Vibrant Blue, Minimalist White, Modern Gray |

### Fișiere Seed

```
src/seed/
├── index.ts              # Orchestrator principal
├── helpers.ts            # 40+ funcții helper (1933 linii)
├── design-variants.ts    # 5 variante per business (1939 linii)
└── businesses/
    ├── frizerie.ts
    ├── dentist.ts
    ├── avocat.ts
    ├── restaurant.ts
    ├── auto-service.ts
    ├── constructii.ts
    ├── salon.ts
    ├── magazin.ts
    └── fitness.ts
```

---

## Blocuri Existente (36)

### Blocuri Active

| Bloc | Variante | Scop |
|------|----------|------|
| Hero | minimal, centered, fullscreen, split, withImage, video, slider | Landing section |
| Services | grid-3, grid-4, list, cards, pricing | Servicii business |
| Team | grid, carousel, list | Echipa |
| Testimonials | carousel, grid, masonry | Recenzii clienți |
| Portfolio | grid, masonry, carousel | Portofoliu lucrări |
| FAQ | accordion, grid, simple | Întrebări frecvente |
| Contact | standard, cards, split | Info contact + formular |
| CTA | simple, split, banner | Call to action |
| Gallery | grid, masonry, carousel | Galerie imagini |
| Stats | grid, inline, cards | Statistici/numere |
| Content | richtext, columns | Conținut flexibil |
| Products | grid, carousel, featured | Produse e-commerce |
| Map | contained, fullwidth | Google Maps embed |
| Booking | form, calendar | Programări |
| Cart | standard | Coș cumpărături |
| Checkout | standard | Finalizare comandă |
| VideoEmbed | youtube, vimeo | Video embed |
| PriceListDotted | standard | Listă prețuri cu dots |
| BeforeAfter | slider | Comparație înainte/după |
| Newsletter | simple, card | Abonare newsletter |
| TrustBadges | inline, grid | Badge-uri încredere |
| HowItWorks | timeline, steps, cards | Proces/pași |
| LogoCloud | grid, carousel | Logo-uri parteneri |
| LatestPosts | grid, list, carousel | Articole recente |
| OpeningHours | table, cards | Program funcționare |
| Locations | grid, map | Locații multiple |
| BrandLogos | grid, carousel | Logo-uri branduri |
| Timeline | vertical, horizontal | Cronologie |
| AnnouncementBar | simple | Anunț top page |
| SubscriptionCards | grid | Carduri abonamente |
| ScheduleTable | table | Orar clase/servicii |
| TeamMemberDetail | standard | Pagină membru echipă |
| ServiceDetail | standard | Pagină serviciu detaliat |
| FormBlock | card, inline | Formular dinamic (Form Builder) |

### Blocuri Neexportate (disponibile dar inactive)

- Banner
- MediaBlock
- ExpertiseAreas
- NewsEvents
- RestaurantMenu
- Categories

---

## Colecții

### Colecții Principale

| Colecție | Slug | Scop |
|----------|------|------|
| Users | `users` | Utilizatori admin + clienți |
| Media | `media` | Imagini, PDF-uri |
| Pages | `pages` | Pagini cu layout blocks |
| Posts | `posts` | Articole blog |
| Services | `services` | Servicii business |
| Team | `team` | Membri echipă |
| Portfolio | `portfolio` | Proiecte portofoliu |
| Testimonials | `testimonials` | Recenzii clienți |
| FAQ | `faq` | Întrebări frecvente |
| Bookings | `bookings` | Programări |
| Subscriptions | `subscriptions` | Abonamente |
| SubscriptionOrders | `subscription-orders` | Comenzi abonamente |
| NewsletterSubscribers | `newsletter-subscribers` | Abonați newsletter |
| Categories | `categories` | Categorii blog |
| ProductCategories | `product-categories` | Categorii produse |
| ProductTags | `product-tags` | Tag-uri produse |

### Colecții din Plugin-uri

| Colecție | Plugin | Scop |
|----------|--------|------|
| Products | Ecommerce | Produse magazin |
| Orders | Ecommerce | Comenzi |
| Carts | Ecommerce | Coșuri |
| Addresses | Ecommerce | Adrese livrare/facturare |
| Forms | Form Builder | Formulare dinamice |
| form-submissions | Form Builder | Submisii formulare |

---

## Globals

| Global | Scop |
|--------|------|
| **SiteTheme** | Design system: culori, fonturi, spacing, shadows, animații |
| **BusinessInfo** | Info business: nume, telefon, email, adresă, program, social, WhatsApp |
| **Header** | Navigație: variante, meniu, CTA button |
| **Footer** | Footer: coloane, links, copyright, background |
| **Logo** | Brand: text/imagine/ambele, dimensiuni |
| **ShopSettings** | E-commerce: Stripe, currency, metode plată |
| **SystemPages** | Labels: produse, coș, checkout, cont |

---

## Plugin-uri Active (8)

| Plugin | Scop |
|--------|------|
| **SEO Plugin** | Meta tags auto-generate pentru pages, posts, products, services |
| **Search Plugin** | Full-text search pentru posts |
| **Form Builder** | Formulare dinamice: contact, newsletter, booking, order |
| **Redirects Plugin** | URL redirects pentru SEO |
| **Nested Docs** | Pagini ierarhice: /clase/yoga, /servicii/consultatie |
| **Import/Export** | Backup și migrare date |
| **S3 Storage** | Cloudflare R2 (cloud) + local fallback |
| **Ecommerce** | Produse, comenzi, coșuri, plăți |

---

## Storage Configuration

### Local Development
- Folder: `./media`
- Nu necesită configurare

### Production (Dokploy)
- Cloudflare R2 (S3-compatible)
- Prefix: `media`
- Fiecare afacere are propriul bucket

```env
R2_BUCKET=bucket-restaurant
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
```

---

## Email & Notificări

### Configurare
- Adapter: Resend
- API Key: `RESEND_API_KEY`

### Notificări Active
1. **Order emails** - La plasare comandă (business + client)
2. **Form submissions** - La trimitere formular (către business-info email)
3. **Newsletter** - Confirmare abonare

---

## Ce Lipsește pentru Agency Seed

### Blocuri Noi Necesare

#### 1. Showcase Block
**Scop:** Grid/carousel pentru proiecte, portofoliu, case studies

```typescript
// Variante necesare:
- 'featured-grid'  // 2 mari + 4 mici
- 'grid-3'         // 3 coloane
- 'grid-4'         // 4 coloane
- 'masonry'        // Layout masonry
- 'carousel'       // Slider
- 'bento'          // Bento grid (modern)

// Fields:
- heading, subheading
- items[]: title, category, description, image, externalUrl, detailPageLink, tags[], featured
- showTags, showCategory
- ctaButton
- backgroundColor
```

#### 2. IframeEmbed Block
**Scop:** Embed site-uri live, preview-uri cu device frames

```typescript
// Variante necesare:
- 'default'        // Iframe simplu
- 'device-frame'   // Cu frame MacBook/iPhone
- 'browser-frame'  // Cu bara browser Chrome
- 'responsive'     // Cu device switcher
- 'fullscreen'     // Full width

// Fields:
- heading, subheading
- url (required)
- fallbackImage
- aspectRatio, height
- deviceFrame: 'none' | 'macbook' | 'imac' | 'iphone' | 'ipad' | 'browser'
- showDeviceSwitcher
- allowFullscreen
- lazyLoad
```

#### 3. ComparisonTable Block (opțional)
**Scop:** Comparație pachete/prețuri

---

## Seeder Agency (multiweb.ts)

### Business Info

```typescript
{
  name: 'MultiWebsite',
  tagline: 'Website-uri profesionale pentru afacerea ta',
  phone: '0722 456 789',
  email: 'contact@multiwebsite.org',
  address: 'București, România',
  stats: [
    { value: '9+', label: 'Template-uri disponibile' },
    { value: '100%', label: 'Personalizabil' },
    { value: '24/7', label: 'Suport' },
  ]
}
```

### Pagini

| Pagina | URL | Blocuri |
|--------|-----|---------|
| Home | `/` | Hero, TrustBadges, Stats, Showcase, Services, HowItWorks, Testimonials, FAQ, CTA |
| Portofoliu | `/portofoliu` | Hero (minimal), Showcase (grid), CTA |
| Servicii | `/servicii` | Hero, Services (detailed), FAQ, CTA |
| Cum Funcționează | `/cum-functioneaza` | Hero, HowItWorks (timeline), CTA |
| Blog | `/blog` | Hero, LatestPosts |
| Contact | `/contact` | Contact (split), Map |
| Demo Individual | `/portofoliu/[slug]` | IframeEmbed, Content, Showcase (related), CTA |

### Demo Websites

```typescript
demoWebsites: [
  { title: 'Barber Shop Premium', type: 'Frizerie', url: 'https://a.multiwebsite.org', featured: true },
  { title: 'DentalMed Clinic', type: 'Cabinet Stomatologic', url: 'https://b.multiwebsite.org', featured: true },
  { title: 'Cabinet Avocat', type: 'Cabinet Juridic', url: 'https://c.multiwebsite.org', featured: false },
  { title: 'AutoPro Service', type: 'Service Auto', url: 'https://d.multiwebsite.org', featured: false },
  { title: 'Restaurant La Copac', type: 'Restaurant', url: 'https://e.multiwebsite.org', featured: true },
  { title: 'EcoShop', type: 'Magazin Online', url: 'https://f.multiwebsite.org', featured: true },
  { title: 'Beauty Studio', type: 'Salon Beauty', url: 'https://g.multiwebsite.org', featured: false },
  { title: 'BuildPro Construct', type: 'Construcții', url: 'https://h.multiwebsite.org', featured: false },
  { title: 'FitZone Gym', type: 'Fitness', url: 'https://i.multiwebsite.org', featured: false },
]
```

### Design Theme

```typescript
// Violet/Purple theme
colors: {
  primary: '#8B5CF6',     // Violet 500
  secondary: '#A78BFA',   // Violet 400
  accent: '#C4B5FD',      // Violet 300
  dark: '#1E1B4B',        // Indigo 950
  light: '#F5F3FF',       // Violet 50
}
// Gradient: from-violet-600 via-purple-600 to-indigo-600
```

---

## Pași Implementare

### Faza 1: Blocuri Noi
- [ ] Creare **Showcase** block (config.ts + Component.tsx)
- [ ] Creare **IframeEmbed** block (config.ts + Component.tsx)
- [ ] Export în blocks/index.ts
- [ ] Test în admin panel

### Faza 2: Seeder Agency
- [ ] Creare `src/seed/businesses/multiweb.ts`
- [ ] Adăugare în seeders (index.ts)
- [ ] Screenshot-uri demo-uri cu Playwright
- [ ] Design variant violet/purple

### Faza 3: Testare
- [ ] Test toate paginile
- [ ] Test responsive
- [ ] Test iframe previews
- [ ] Performance check

---

## Decizii

### Confirmate
- **Nume:** `multiweb` sau `agency`
- **Culori:** Violet/Purple gradient
- **Echipă:** Nu se afișează
- **Blog:** Da, articole despre web development

### De făcut
- [ ] Screenshots demo-uri
- [ ] Decidere model business (abonament vs unic)
- [ ] Pagină prețuri (ulterior)
