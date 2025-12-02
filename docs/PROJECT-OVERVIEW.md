# Universal Business Website Platform

## Viziune

O platforma Payload CMS unificata din care se pot crea site-uri pentru ORICE tip de afacere prin rularea unui singur seeder. Sistemul contine toate colectiile, blocurile si componentele necesare pentru orice business, iar la final se curata ce nu e folosit.

## Workflow

```
1. Clonezi proiectul
2. Rulezi: pnpm seed:frizerie (sau dentist, avocat, restaurant, etc.)
3. Site-ul e gata cu design, continut demo si imagini
4. Personalizezi din admin panel
5. Stergi MANUAL din cod colectiile/blocurile nefolosite (optional)
6. Deploy
```

**IMPORTANT**: Sistemul contine TOATE colectiile si blocurile pentru orice tip de business.
Tu decizi ce pastrezi si ce stergi manual din cod pentru clientul final.

## Tipuri de Business Suportate

### Servicii Auto
- Vulcanizari
- Mecanica auto
- Tinichigerie / vopsitorii
- Electricieni auto

### Cabinete Medicale
- Stomatologi
- Dermatologi
- ORL
- Fizioterapie
- Psihologi

### Restaurante si Cafenele
- Restaurante mici
- Cafenele de cartier
- Cofetarii / patiserii

### Frizerii / Saloane
- Saloane de coafat
- Manichiura/pedichiura
- Barber shop

### Firme de Constructii
- Amenajari interioare
- Finisaje
- Zugraveli
- Montaj gips-carton

### Contabilitate
- Birouri de contabilitate
- Contabili autorizati

### Firme de Transport
- Transport marfa
- Transport persoane
- Curierat local

### Ateliere
- Croitorii
- Ateliere de tamplarie
- Fier forjat

### Magazine Locale
- Magazine de animale
- Magazine cu piese auto
- Magazine de mobila

### Turism
- Pensiuni mici rurale
- Apartamente in regim hotelier

### Juridic
- Notariate
- Avocati si mediatori

### Curatenie
- Firme de curatenie

### Evenimente
- Foto-video
- DJ
- Decoratori

### Producatori Locali
- Miere
- Branzeturi
- Produse artizanale

## Arhitectura Tehnica

### Stack Tehnologic
- **CMS**: Payload CMS 3.x (latest)
- **Frontend**: Next.js 15 + React 19
- **Styling**: TailwindCSS + CSS Variables
- **Database**: MongoDB (Docker local pentru development)
- **Storage**: Local (dev) / Cloudflare R2 (prod)
- **Testing**: Playwright + Vitest

### Structura Directoare

```
template-5/
├── src/
│   ├── app/
│   │   ├── (frontend)/          # Site-ul public
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── [slug]/          # Pagini dinamice
│   │   │   ├── services/        # Lista servicii
│   │   │   ├── products/        # Catalog produse
│   │   │   ├── team/            # Echipa
│   │   │   ├── portfolio/       # Portofoliu
│   │   │   ├── blog/            # Blog/Stiri
│   │   │   ├── contact/         # Contact
│   │   │   └── booking/         # Programari
│   │   └── (payload)/           # Admin panel
│   ├── collections/             # Colectii Payload
│   │   ├── Pages/
│   │   ├── Posts/
│   │   ├── Services/
│   │   ├── Products/
│   │   ├── ProductCategories/
│   │   ├── Team/
│   │   ├── Portfolio/
│   │   ├── Testimonials/
│   │   ├── PricePackages/
│   │   ├── Bookings/
│   │   ├── FAQ/
│   │   ├── Documents/
│   │   ├── Media/
│   │   ├── Categories/
│   │   └── Users/
│   ├── globals/
│   │   ├── Theme/
│   │   ├── BusinessInfo/
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Logo/
│   ├── blocks/
│   │   ├── Hero/
│   │   ├── Services/
│   │   ├── Products/
│   │   ├── Team/
│   │   ├── Portfolio/
│   │   ├── Testimonials/
│   │   ├── Pricing/
│   │   ├── FAQ/
│   │   ├── Contact/
│   │   ├── Map/
│   │   ├── Gallery/
│   │   ├── CTA/
│   │   ├── Stats/
│   │   ├── Features/
│   │   └── Content/
│   ├── components/
│   ├── fields/
│   ├── hooks/
│   ├── access/
│   ├── utilities/
│   ├── endpoints/
│   │   └── seed/
│   │       ├── index.ts
│   │       ├── businesses/      # Seedere per business
│   │       │   ├── frizerie.ts
│   │       │   ├── dentist.ts
│   │       │   ├── avocat.ts
│   │       │   ├── restaurant.ts
│   │       │   ├── auto-service.ts
│   │       │   ├── constructii.ts
│   │       │   ├── pensiune.ts
│   │       │   ├── magazin.ts
│   │       │   └── ...
│   │       └── cleanup.ts       # Script cleanup
│   └── payload.config.ts
├── public/
├── tests/
│   ├── e2e/                     # Teste Playwright
│   └── int/                     # Teste integrare
├── docker-compose.yml
├── Dockerfile
└── docs/
```

## Colectii Universale

### Services (Servicii)
Pentru: frizerii, cabinete medicale, service auto, constructii, etc.
- title, slug, description, image
- price, duration, category
- features (array)
- cta link

### Products (Produse)
Pentru: magazine, producatori locali, etc.
- title, slug, description
- price, salePrice, sku
- images (array)
- category, stock
- featured

### ProductCategories
- title, slug, description
- image, order, featured

### Team (Echipa)
Pentru: antrenori, doctori, avocati, frizeri, agenti, etc.
- name, slug, role/position
- image, bio, experience
- specializations (array)
- contact (email, phone, whatsapp)
- social media links
- schedule (program)

### Portfolio (Portofoliu)
Pentru: constructii, foto-video, design, etc.
- title, slug, description
- images (gallery)
- category
- client, date
- testimonial

### Testimonials (Recenzii)
- name, role/company
- content, rating
- image, featured

### PricePackages (Pachete/Abonamente)
Pentru: fitness, saloane, cabinete, etc.
- title, subtitle, description
- price, period, oldPrice
- features (array cu included boolean)
- highlighted, highlightLabel
- cta, order

### Bookings (Programari)
Pentru: saloane, cabinete, service auto, etc.
- client info (name, email, phone)
- service (relationship)
- team member (relationship)
- date, time, duration
- status, notes

### FAQ
- question, answer
- category, order

### Documents
Pentru: formulare, documente, etc.
- title, description
- file (upload)
- category

## Globals

### Theme
Culorile si stilul vizual (configurabil din admin):
- primaryColor
- secondaryColor
- accentColor
- darkColor
- lightColor
- textColor
- surfaceColor
- borderColor

### BusinessInfo
- name, tagline, description
- address, phone, email, whatsapp
- social media links
- workingHours (array)
- googleMapsEmbed, googleMapsLink
- statistics (array: label, value)

### Header
- logo
- navItems (cu submeniuri)
- showSearch, showCart, showBooking
- ctaButton

### Footer
- columns (cu linkuri)
- socialLinks
- contactInfo
- copyright, legalLinks
- paymentIcons

### Logo
- logoType: text | image | both
- logoText, logoImage

## Sistem de Teme / Preseturi

Fiecare tip de business poate avea 2-3 preseturi de design:

```typescript
// Exemplu: Frizerie
const frizeiePresets = {
  modern: {
    primaryColor: '#000000',
    accentColor: '#c9a962',
    style: 'minimal'
  },
  classic: {
    primaryColor: '#8b4513',
    accentColor: '#d4af37',
    style: 'vintage'
  },
  vibrant: {
    primaryColor: '#e91e63',
    accentColor: '#ffffff',
    style: 'bold'
  }
}
```

## Seedere

Fiecare seeder va:
1. Seta tema/culorile potrivite
2. Crea continut demo relevant
3. Configura navigatia corespunzatoare
4. Incarca imagini din GitHub repo
5. Crea pagini cu blocuri relevante

### Comezi disponibile:
```bash
pnpm seed:frizerie
pnpm seed:dentist
pnpm seed:avocat
pnpm seed:restaurant
pnpm seed:auto-service
pnpm seed:constructii
pnpm seed:pensiune
pnpm seed:magazin
pnpm seed:fitness
pnpm seed:curatenie
pnpm seed:transport
pnpm seed:foto-video
pnpm seed:producator
# ... etc
```

### Curatare Manuala

Dupa ce rulezi seederul pentru tipul de business dorit, poti sterge MANUAL din cod:
- Colectiile nefolosite din `src/collections/`
- Blocurile nefolosite din `src/blocks/`
- Rutele nefolosite din `src/app/(frontend)/`
- Inregistrarile din `payload.config.ts`

Aceasta curatare e OPTIONALA - sistemul functioneaza si cu tot codul prezent.

## Best Practices Payload

1. **Access Control**: Folosim authenticated/authenticatedOrPublished
2. **Hooks**: beforeChange, afterChange, revalidare cache
3. **Versioning**: Drafts pentru Pages si Posts
4. **SEO**: Plugin SEO pentru meta tags
5. **Media**: Dimensiuni multiple pentru responsive
6. **Transactions**: Folosim req pentru atomicitate
7. **Context**: Folosim context pentru a preveni loop-uri infinite

## Development Local

```bash
# Start Docker (MongoDB)
docker compose up -d

# Install dependencies
pnpm install

# Generate types
pnpm generate:types

# Start dev server
pnpm dev

# Seed database
pnpm seed:frizerie
```

## Testing

```bash
# Run all tests
pnpm test

# Playwright E2E
pnpm test:e2e

# Integration tests
pnpm test:int
```
