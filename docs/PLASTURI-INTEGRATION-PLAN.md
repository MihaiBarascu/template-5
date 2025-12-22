# Plan de Integrare Plasturi Design în Template-5 MultiWebsite

## Sinteză din Analiza Completă

**Obiectiv:** Integrarea pattern-urilor de design premium din plasturifototerapeutici.ro în sistemul multi-website template-5, astfel încât ORICE business type să poată beneficia de aceste componente.

---

## FAZA 1: BLOCURI NOI (Payload CMS)

### 1.1 VideoHero Block (PRIORITATE MARE)
**Locație:** `src/blocks/VideoHero/`

**Funcționalitate:**
- Video background full-screen cu autoplay muted
- Overlay semi-transparent configurable (culoare + opacitate)
- Trust badges (imagini) - poziționabile
- Headline + subtitle + CTA buttons
- Social links optional

**Schema Payload:**
```typescript
// src/blocks/VideoHero/config.ts
{
  slug: 'videoHero',
  fields: [
    { name: 'videoUrl', type: 'text', required: true },
    { name: 'videoPoster', type: 'upload', relationTo: 'media' },
    { name: 'overlayColor', type: 'text', defaultValue: 'rgba(2,40,61,0.5)' },
    { name: 'overlayOpacity', type: 'number', min: 0, max: 100, defaultValue: 50 },
    { name: 'headline', type: 'text', required: true },
    { name: 'subheadline', type: 'textarea' },
    { name: 'ctaButtons', type: 'array', fields: [...] },
    { name: 'trustBadges', type: 'array', fields: [
      { name: 'image', type: 'upload' },
      { name: 'alt', type: 'text' }
    ]},
    { name: 'showSocialLinks', type: 'checkbox' },
  ]
}
```

**De ce e important:**
- Creează engagement instant prin mișcare
- Diferențiator major față de hero static
- Perfect pentru: wellness, fitness, tech, restaurant

---

### 1.2 ProcessSteps Block (PRIORITATE MARE)
**Locație:** `src/blocks/ProcessSteps/`

**Funcționalitate:**
- 3-6 pași cu layout zigzag (alternating)
- Fiecare pas: număr, titlu, descriere, imagine
- Connector lines opționale (CSS/SVG)
- Responsive: stack pe mobile

**Schema Payload:**
```typescript
{
  slug: 'processSteps',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'text' },
    { name: 'variant', type: 'select', options: [
      { label: 'Zigzag', value: 'zigzag' },
      { label: 'Vertical Timeline', value: 'timeline' },
      { label: 'Horizontal Cards', value: 'horizontal' },
    ]},
    { name: 'showNumbers', type: 'checkbox', defaultValue: true },
    { name: 'showConnectors', type: 'checkbox', defaultValue: true },
    { name: 'steps', type: 'array', fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'image', type: 'upload', relationTo: 'media' },
      { name: 'icon', type: 'text' }, // icon name fallback
    ]},
    ...sectionWrapperFields,
  ]
}
```

**De ce e important:**
- Explică procesul de lucru clar
- Reduce fricțiunea în decizia de cumpărare
- Perfect pentru: servicii, cursuri, produse complexe

---

### 1.3 Timeline Block (PRIORITATE MEDIE)
**Locație:** `src/blocks/Timeline/`

**Funcționalitate:**
- Timeline vertical cu milestones
- Alternating left/right labels
- Background dark cu text alb
- Quote/conclusion la final (opțional)

**Schema Payload:**
```typescript
{
  slug: 'timeline',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'text' },
    { name: 'milestones', type: 'array', fields: [
      { name: 'timeframe', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'highlight', type: 'checkbox' },
    ]},
    { name: 'showConnectors', type: 'checkbox', defaultValue: true },
    { name: 'conclusion', type: 'group', fields: [
      { name: 'enabled', type: 'checkbox' },
      { name: 'quote', type: 'textarea' },
      { name: 'author', type: 'text' },
      { name: 'role', type: 'text' },
    ]},
    ...sectionWrapperFields,
  ]
}
```

**De ce e important:**
- Arată progresul în timp
- Creează încredere prin rezultate dovedite
- Perfect pentru: medical, fitness, coaching, educație

---

### 1.4 PricingKits Block (PRIORITATE MEDIE)
**Locație:** `src/blocks/PricingKits/`

**Funcționalitate:**
- Grid 2-4 carduri cu pricing
- Feature list cu checkmarks
- Badge "Popular" / "Best Value"
- CTA per card

**Schema Payload:**
```typescript
{
  slug: 'pricingKits',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'text' },
    { name: 'kits', type: 'array', fields: [
      { name: 'name', type: 'text' },
      { name: 'price', type: 'number' },
      { name: 'priceLabel', type: 'text' }, // "lei", "RON/lună"
      { name: 'description', type: 'textarea' },
      { name: 'features', type: 'array', fields: [
        { name: 'text', type: 'text' },
        { name: 'included', type: 'checkbox', defaultValue: true },
      ]},
      { name: 'badge', type: 'select', options: ['none', 'popular', 'best-value', 'new'] },
      { name: 'cta', type: 'group', fields: [
        { name: 'label', type: 'text' },
        { name: 'link', type: 'text' },
      ]},
      { name: 'image', type: 'upload', relationTo: 'media' },
    ]},
    { name: 'columns', type: 'select', options: ['2', '3', '4'], defaultValue: '3' },
    ...sectionWrapperFields,
  ]
}
```

---

### 1.5 TrustBadges Block (PRIORITATE MICĂ)
**Locație:** `src/blocks/TrustBadges/`

**Funcționalitate:**
- Row de badge-uri (imagini)
- Hover effect scale
- Responsive wrap

**Schema:**
```typescript
{
  slug: 'trustBadges',
  fields: [
    { name: 'badges', type: 'array', fields: [
      { name: 'image', type: 'upload' },
      { name: 'alt', type: 'text' },
      { name: 'link', type: 'text' }, // optional link
    ]},
    { name: 'alignment', type: 'select', options: ['left', 'center', 'right'] },
    { name: 'size', type: 'select', options: ['small', 'medium', 'large'] },
  ]
}
```

---

### 1.6 AccordionExpand Block (PRIORITATE MICĂ)
**Existent:** Avem deja FAQ block cu accordion
**Îmbunătățire:** Adaugă variant cu border colored (teal style)

---

## FAZA 2: VARIANTE NOI PENTRU BLOCURI EXISTENTE

### 2.1 Hero Block - Adaugă variant `video-fullscreen`
**Modificări în:** `src/blocks/Hero/config.ts` și `src/blocks/Hero/Component.tsx`

```typescript
// Adaugă în heroTypes:
{
  label: 'Video Fullscreen',
  value: 'video-fullscreen',
}

// Câmpuri noi când heroType === 'video-fullscreen':
{
  name: 'videoUrl',
  type: 'text',
  admin: { condition: (data) => data?.heroType === 'video-fullscreen' }
},
{
  name: 'videoPoster',
  type: 'upload',
  relationTo: 'media',
  admin: { condition: (data) => data?.heroType === 'video-fullscreen' }
},
{
  name: 'overlaySettings',
  type: 'group',
  admin: { condition: (data) => data?.heroType === 'video-fullscreen' },
  fields: [
    { name: 'color', type: 'text', defaultValue: 'rgba(2,40,61,0.5)' },
    { name: 'opacity', type: 'number', defaultValue: 50 },
  ]
}
```

---

### 2.2 HowItWorks Block - Adaugă variant `zigzag-images`
**Modificări în:** `src/blocks/HowItWorks/`

```typescript
// Adaugă variant:
{
  label: 'Zigzag cu Imagini',
  value: 'zigzag-images',
}

// Adaugă câmp imagine la steps:
{
  name: 'image',
  type: 'upload',
  relationTo: 'media',
}
```

---

### 2.3 Services Block - Adaugă variant `cards-hover-lift`
**Modificări în:** `src/blocks/Services/`

Adaugă hover effect `-translate-y-2` + `shadow-xl` pe hover.

---

### 2.4 Testimonials Block - Adaugă variant `video-testimonials`
**Modificări în:** `src/blocks/Testimonials/`

```typescript
// În testimonials collection:
{
  name: 'videoUrl',
  type: 'text',
  admin: { description: 'YouTube/Vimeo URL pentru video testimonial' }
}

// În block config - variant nou:
{
  label: 'Video Testimonials',
  value: 'video-grid',
}
```

---

## FAZA 3: STILURI ȘI TOKENS NOI

### 3.1 Tailwind Config Updates
**Fișier:** `tailwind.config.ts`

```typescript
// Adaugă în theme.extend:
colors: {
  plasturi: {
    blue: '#116DFF',
    'blue-light': '#3D89FF',
    'blue-dark': '#0D58CC',
    purple: '#8B5CF6',
    'purple-light': '#A855F7',
    teal: '#0D9488',
    'teal-dark': '#0F766E',
    'overlay-dark': 'rgba(2, 40, 61, 0.5)',
  }
},
borderRadius: {
  pill: '24px',
},
boxShadow: {
  'glow-blue': '0 4px 20px rgba(17, 109, 255, 0.25)',
  'glow-purple': '0 4px 20px rgba(139, 92, 246, 0.4)',
},
animation: {
  'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
},
keyframes: {
  'pulse-glow': {
    '0%, 100%': { boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)' },
    '50%': { boxShadow: '0 4px 28px rgba(139, 92, 246, 0.6)' },
  },
},
```

---

### 3.2 Global CSS Utilities
**Fișier:** `src/app/(frontend)/globals.css`

```css
@layer utilities {
  /* Hover lift effect */
  .hover-lift {
    @apply transition-all duration-300;
  }
  .hover-lift:hover {
    @apply -translate-y-2 shadow-xl;
  }

  /* Glassmorphism */
  .glass {
    @apply bg-white/80 backdrop-blur-md;
  }
  .glass-dark {
    @apply bg-black/50 backdrop-blur-md;
  }

  /* Gradient overlays */
  .overlay-dark {
    background: rgba(2, 40, 61, 0.5);
  }
  .gradient-overlay-bottom {
    background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%);
  }

  /* Text balance */
  .text-balance {
    text-wrap: balance;
  }
}
```

---

### 3.3 Theme Variants Updates
**Fișier:** `src/theme/variants.ts`

Adaugă preset-uri noi pentru:
- `button.pill` - border-radius 24px
- `button.glow-blue` - shadow glow effect
- `button.glow-purple` - purple gradient + glow
- `section.video-hero` - full screen settings

---

## FAZA 4: COMPONENTE UI NOI

### 4.1 FloatingCTA Component
**Locație:** `src/components/ui/FloatingCTA.tsx`

```typescript
interface FloatingCTAProps {
  text: string;
  href: string;
  variant?: 'purple' | 'blue' | 'teal';
  showOnMobile?: boolean;
  pulseAnimation?: boolean;
}
```

**Integrare:** Controlabil din BusinessInfo global (ca WhatsApp float)

---

### 4.2 TrustBadge Component
**Locație:** `src/components/ui/TrustBadge.tsx`

```typescript
interface TrustBadgeProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

---

### 4.3 VideoPlayer Component
**Locație:** `src/components/ui/VideoPlayer.tsx`

Custom video player cu:
- Play/pause overlay button
- Mute toggle
- Custom styling
- Lazy loading
- Poster image support

---

## FAZA 5: BLOCK VARIANTS SYSTEM ENHANCEMENT

### 5.1 Adaugă SectionWrapper la toate blocurile noi
Toate blocurile noi trebuie să folosească `sectionWrapperFields` pentru:
- Background color (default/light/dark/primary)
- Padding control
- Container width
- Glass effects

### 5.2 Adaugă Animation Options
Opțiune nouă în sectionWrapper:
```typescript
{
  name: 'animation',
  type: 'select',
  options: [
    { label: 'None', value: 'none' },
    { label: 'Fade In', value: 'fade-in' },
    { label: 'Slide Up', value: 'slide-up' },
    { label: 'Scale In', value: 'scale-in' },
  ],
  defaultValue: 'none',
}
```

---

## PRIORITIZARE IMPLEMENTARE

### Sprint 1 (Critic) - COMPLETED
1. ✅ **VideoHero Block** - diferențiator major
2. ✅ **ProcessSteps Block** - folosit des
3. ✅ **PricingKits Block** - pricing cards cu badges
4. ✅ **Tailwind tokens** - bază pentru toate
5. ✅ **Global utilities CSS** (pulse-glow, overlays, step-numbers, pricing-badges)

### Sprint 2 (Important) - COMPLETED
6. ✅ **Timeline Block** - enhanced with conclusion quote
7. ✅ **FloatingCTA component** - with variants, icons, scroll trigger
8. ✅ **VideoPlayer component** - custom controls, overlay support

### Sprint 3 (Nice-to-have) - COMPLETED
9. ✅ **TrustBadges Block** - already exists
10. ✅ **Video testimonials variant** - video-grid variant with modal player
11. ✅ **Hover effects pe Services** - hoverEffect prop (default/lift/glow/scale/none)
12. ✅ **Animation options în SectionWrapper** - type, stagger, duration, delay
13. ✅ **Hero video-fullscreen variant** (VideoHero covers this use case)
14. ✅ **HowItWorks zigzag-images variant** (ProcessSteps covers this)

---

## BUSINESS TYPES CARE BENEFICIAZĂ DIRECT

| Componentă | Business Types |
|------------|---------------|
| VideoHero | fitness, restaurant, wellness, tech, auto |
| ProcessSteps | servicii, cursuri, medical, juridic, construcții |
| Timeline | wellness, fitness, coaching, educație |
| PricingKits | ecommerce, SaaS, cursuri, membership |
| TrustBadges | medical, juridic, financiar, tech |
| FloatingCTA | toate (conversie boost) |

---

## FIȘIERE DE CREAT/MODIFICAT

### Blocuri Noi:
```
src/blocks/VideoHero/
  ├── config.ts
  └── Component.tsx

src/blocks/ProcessSteps/
  ├── config.ts
  └── Component.tsx

src/blocks/Timeline/
  ├── config.ts
  └── Component.tsx

src/blocks/PricingKits/
  ├── config.ts
  └── Component.tsx

src/blocks/TrustBadges/
  ├── config.ts
  └── Component.tsx
```

### Componente UI:
```
src/components/ui/
  ├── FloatingCTA.tsx
  ├── TrustBadge.tsx
  └── VideoPlayer.tsx
```

### Modificări Config:
```
src/blocks/Hero/config.ts         (adaugă video variant)
src/blocks/HowItWorks/config.ts   (adaugă zigzag-images)
src/blocks/index.ts               (export blocuri noi)
tailwind.config.ts                (tokens noi)
src/app/(frontend)/globals.css    (utilities)
src/theme/variants.ts             (presets noi)
```

---

## METRICI DE SUCCES

După implementare, site-urile ar trebui să:
1. **Lighthouse Performance:** 90+ (cu video optimization)
2. **Design parity:** 95% cu plasturifototerapeutici.ro
3. **Mobile UX:** Touch targets 44px+, responsive perfect
4. **Reusability:** Orice business type poate folosi componentele

---

## NEXT STEPS

1. **Aprobă acest plan**
2. **Creează branch:** `feature/plasturi-integration`
3. **Implementează Sprint 1**
4. **Test pe terapii-energetice seed**
5. **Extend la alte business types**

---

**Estimare totală:** ~20-30 ore de dezvoltare pentru toate fazele.
