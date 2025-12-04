# Plan de Implementare - Widget-uri și Blocuri Specifice per Nișă

## Sumar

Bazat pe cercetarea a 90+ screenshot-uri de la site-uri profesionale românești, acest plan detaliază implementarea blocurilor Payload CMS necesare pentru diferențierea site-urilor per nișă.

---

## FAZA 1: Blocuri Comune (Critice)

### 1.1 WhatsAppFloat
**Descriere:** Buton floating WhatsApp în colțul ecranului
**Prioritate:** CRITICĂ (prezent pe 90% din site-uri analizate)

```typescript
// src/blocks/common/WhatsAppFloat/config.ts
{
  slug: 'whatsAppFloat',
  interfaceName: 'WhatsAppFloatBlock',
  fields: [
    { name: 'phoneNumber', type: 'text', required: true },
    { name: 'defaultMessage', type: 'textarea' },
    { name: 'position', type: 'select', options: ['bottom-right', 'bottom-left'] },
    { name: 'showOnMobile', type: 'checkbox', defaultValue: true },
  ]
}
```

### 1.2 SocialProofStats
**Descriere:** Statistici animate (ani experiență, clienți, proiecte)

```typescript
// src/blocks/common/SocialProofStats/config.ts
{
  slug: 'socialProofStats',
  interfaceName: 'SocialProofStatsBlock',
  fields: [
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text' }, // "+", "k", "%"
        { name: 'label', type: 'text', required: true },
        { name: 'icon', type: 'select', options: [...] },
      ]
    },
    { name: 'animateOnScroll', type: 'checkbox', defaultValue: true },
    { name: 'backgroundColor', type: 'text' },
  ]
}
```

### 1.3 ImageLightbox (Gallery Update)
**Descriere:** Galerie cu lightbox click pentru vizualizare mărită

### 1.4 GoogleMapEmbed
**Descriere:** Hartă Google cu locație și marker personalizat

---

## FAZA 2: Blocuri per Nișă

### 2.1 FRIZERIE

#### PriceListDotted
```typescript
{
  slug: 'priceListDotted',
  interfaceName: 'PriceListDottedBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'categories',
      type: 'array',
      fields: [
        { name: 'categoryName', type: 'text' },
        {
          name: 'services',
          type: 'array',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'description', type: 'text' },
            { name: 'price', type: 'number', required: true },
            { name: 'duration', type: 'text' }, // "30 min"
          ]
        }
      ]
    }
  ]
}
```

#### BarberCards
```typescript
{
  slug: 'barberCards',
  interfaceName: 'BarberCardsBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'barbers',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'specialties', type: 'array', fields: [{ name: 'specialty', type: 'text' }] },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'instagram', type: 'text' },
      ]
    }
  ]
}
```

### 2.2 DENTIST

#### DoctorCards
```typescript
{
  slug: 'doctorCards',
  interfaceName: 'DoctorCardsBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'doctors',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'title', type: 'text' }, // "Dr."
        { name: 'specialization', type: 'text' },
        { name: 'experience', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'linkedin', type: 'text' },
      ]
    }
  ]
}
```

#### BookingInline
```typescript
{
  slug: 'bookingInline',
  interfaceName: 'BookingInlineBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'showServices', type: 'checkbox', defaultValue: true },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'submitButtonText', type: 'text', defaultValue: 'Programează-te' },
    { name: 'successMessage', type: 'text' },
  ]
}
```

### 2.3 RESTAURANT

#### MenuCategories
```typescript
{
  slug: 'menuCategories',
  interfaceName: 'MenuCategoriesBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'downloadPdfUrl', type: 'text' },
    {
      name: 'categories',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'price', type: 'number' },
            { name: 'isVegetarian', type: 'checkbox' },
            { name: 'isSpicy', type: 'checkbox' },
            { name: 'allergens', type: 'text' },
          ]
        }
      ]
    }
  ]
}
```

#### ReservationForm
```typescript
{
  slug: 'reservationForm',
  interfaceName: 'ReservationFormBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'minGuests', type: 'number', defaultValue: 1 },
    { name: 'maxGuests', type: 'number', defaultValue: 20 },
    { name: 'availableTimeSlots', type: 'array', fields: [{ name: 'time', type: 'text' }] },
    { name: 'submitButtonText', type: 'text', defaultValue: 'Rezervă' },
  ]
}
```

### 2.4 SERVICE AUTO

#### ServiceCategories
```typescript
{
  slug: 'serviceCategories',
  interfaceName: 'ServiceCategoriesBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'categories',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'select', options: ['engine', 'tire', 'oil', 'brake', 'battery', 'ac'] },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text' },
      ]
    },
    { name: 'layout', type: 'select', options: ['grid', 'list', 'carousel'] },
  ]
}
```

### 2.5 SALON BEAUTY

#### TreatmentSlider
```typescript
{
  slug: 'treatmentSlider',
  interfaceName: 'TreatmentSliderBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'treatments',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'price', type: 'number' },
        { name: 'duration', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text' },
      ]
    },
    { name: 'autoplay', type: 'checkbox', defaultValue: true },
  ]
}
```

#### MonthlyOffer
```typescript
{
  slug: 'monthlyOffer',
  interfaceName: 'MonthlyOfferBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'richText' },
    { name: 'originalPrice', type: 'number' },
    { name: 'salePrice', type: 'number', required: true },
    { name: 'endDate', type: 'date' },
    { name: 'showCountdown', type: 'checkbox', defaultValue: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'ctaText', type: 'text', defaultValue: 'Profită acum' },
    { name: 'ctaLink', type: 'text' },
  ]
}
```

#### LocationSelector
```typescript
{
  slug: 'locationSelector',
  interfaceName: 'LocationSelectorBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'locations',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'address', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'hours', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'mapUrl', type: 'text' },
      ]
    }
  ]
}
```

### 2.6 AVOCAT

#### PracticeAreas
```typescript
{
  slug: 'practiceAreas',
  interfaceName: 'PracticeAreasBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'areas',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'select', options: ['scale', 'gavel', 'building', 'family', 'briefcase'] },
        { name: 'link', type: 'text' },
      ]
    },
    { name: 'layout', type: 'select', options: ['grid', 'list'] },
  ]
}
```

#### LawyerProfiles
```typescript
{
  slug: 'lawyerProfiles',
  interfaceName: 'LawyerProfilesBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'lawyers',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'title', type: 'text' },
        { name: 'specializations', type: 'array', fields: [{ name: 'area', type: 'text' }] },
        { name: 'bio', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'linkedin', type: 'text' },
        { name: 'email', type: 'email' },
      ]
    }
  ]
}
```

### 2.7 CONSTRUCȚII

#### ProjectPortfolio
```typescript
{
  slug: 'projectPortfolio',
  interfaceName: 'ProjectPortfolioBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'categories',
      type: 'array',
      fields: [{ name: 'name', type: 'text' }]
    },
    {
      name: 'projects',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'location', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'year', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
      ]
    },
    { name: 'showFilter', type: 'checkbox', defaultValue: true },
  ]
}
```

#### CertificationsBar
```typescript
{
  slug: 'certificationsBar',
  interfaceName: 'CertificationsBarBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'certifications',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text' },
      ]
    },
    { name: 'layout', type: 'select', options: ['carousel', 'grid'] },
  ]
}
```

### 2.8 MAGAZIN ONLINE

#### PromoBanner
```typescript
{
  slug: 'promoBanner',
  interfaceName: 'PromoBannerBlock',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    { name: 'discountPercent', type: 'number' },
    { name: 'endDate', type: 'date' },
    { name: 'showCountdown', type: 'checkbox', defaultValue: true },
    { name: 'backgroundColor', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'ctaText', type: 'text' },
    { name: 'ctaLink', type: 'text' },
  ]
}
```

#### BenefitsBar
```typescript
{
  slug: 'benefitsBar',
  interfaceName: 'BenefitsBarBlock',
  fields: [
    {
      name: 'benefits',
      type: 'array',
      fields: [
        { name: 'icon', type: 'select', options: ['truck', 'shield', 'refresh', 'credit-card', 'gift'] },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
      ]
    },
    { name: 'scrollAnimation', type: 'checkbox', defaultValue: false },
  ]
}
```

---

## FAZA 3: Actualizare Seedere

### Structura Seeder per Nișă

```typescript
// seed/businesses/index.ts
export const businessConfigs = {
  frizerie: {
    blocks: ['hero', 'priceListDotted', 'barberCards', 'gallery', 'testimonials', 'faq', 'contactForm'],
    floatingWidgets: ['whatsappFloat'],
    theme: { primary: '#000000', secondary: '#C9A227', accent: '#8B0000' }
  },
  dentist: {
    blocks: ['heroWithBooking', 'doctorCards', 'services', 'treatmentProcess', 'testimonials', 'faq', 'contactForm'],
    floatingWidgets: ['whatsappFloat'],
    theme: { primary: '#0066CC', secondary: '#FFFFFF', accent: '#00CC99' }
  },
  restaurant: {
    blocks: ['heroVideo', 'menuCategories', 'reservationForm', 'gallery', 'chefCards', 'testimonials'],
    floatingWidgets: ['whatsappFloat'],
    theme: { primary: '#8B4513', secondary: '#FFF8DC', accent: '#FF6B35' }
  },
  'auto-service': {
    blocks: ['hero', 'serviceCategories', 'socialProofStats', 'gallery', 'testimonials', 'faq', 'contactForm'],
    floatingWidgets: ['whatsappFloat'],
    theme: { primary: '#CC0000', secondary: '#333333', accent: '#FF6600' }
  },
  salon: {
    blocks: ['heroSlider', 'treatmentSlider', 'monthlyOffer', 'locationSelector', 'testimonials', 'instagramFeed'],
    floatingWidgets: ['whatsappFloat'],
    theme: { primary: '#E91E8C', secondary: '#FFF0F5', accent: '#B8860B' }
  },
  avocat: {
    blocks: ['hero', 'practiceAreas', 'lawyerProfiles', 'socialProofStats', 'testimonials', 'faq', 'contactForm'],
    floatingWidgets: ['whatsappFloat'],
    theme: { primary: '#1A365D', secondary: '#FFFFFF', accent: '#C9A227' }
  },
  constructii: {
    blocks: ['heroVideo', 'socialProofStats', 'projectPortfolio', 'certificationsBar', 'careersSection', 'contactForm'],
    floatingWidgets: ['whatsappFloat'],
    theme: { primary: '#FF6600', secondary: '#1A1A1A', accent: '#4CAF50' }
  },
  magazin: {
    blocks: ['promoBanner', 'categoryGrid', 'productsCarousel', 'benefitsBar', 'testimonials', 'blogPreview'],
    floatingWidgets: ['whatsappFloat'],
    theme: { primary: '#2E7D32', secondary: '#FFFFFF', accent: '#FFC107' }
  }
}
```

---

## TIMELINE IMPLEMENTARE

### Sprint 1: Blocuri Comune
- [ ] WhatsAppFloat
- [ ] SocialProofStats
- [ ] ImageLightbox update
- [ ] GoogleMapEmbed

### Sprint 2: Blocuri Servicii (Frizerie, Dentist, Auto, Salon)
- [ ] PriceListDotted
- [ ] BarberCards
- [ ] DoctorCards
- [ ] BookingInline
- [ ] ServiceCategories
- [ ] TreatmentSlider
- [ ] MonthlyOffer
- [ ] LocationSelector

### Sprint 3: Blocuri Corporate (Restaurant, Avocat, Construcții)
- [ ] MenuCategories
- [ ] ReservationForm
- [ ] PracticeAreas
- [ ] LawyerProfiles
- [ ] ProjectPortfolio
- [ ] CertificationsBar

### Sprint 4: Blocuri eCommerce
- [ ] PromoBanner
- [ ] BenefitsBar
- [ ] ProductBadges

### Sprint 5: Actualizare Seedere
- [ ] Actualizare toate cele 8 seedere
- [ ] Testare vizuală per nișă
- [ ] Documentație admin panel

---

## REGULI IMPLEMENTARE

1. **TypeScript Strict:** Folosește tipuri generate din `@/payload-types`, NICIODATĂ `any`
2. **interfaceName:** Obligatoriu în config pentru generare tipuri
3. **CSS Variables:** Pentru toate culorile - permite tematizare per nișă
4. **Responsive:** Mobile-first design
5. **Accessibility:** ARIA labels, keyboard navigation
6. **Build:** 0 warnings obligatoriu

---

## RESURSE CERCETARE

Screenshot-uri salvate în: `.playwright-mcp/`
- `ro-frizerie-*.png` - Site-uri frizerii
- `ro-dentist-*.png` - Cabinete stomatologice
- `ro-restaurant-*.png` - Restaurante
- `ro-auto-*.png` - Service-uri auto
- `ro-salon-*.png` - Saloane beauty
- `ro-avocat-*.png` - Cabinete avocat
- `ro-constructii-*.png` - Firme construcții
- `ro-magazin-*.png` - Magazine online
