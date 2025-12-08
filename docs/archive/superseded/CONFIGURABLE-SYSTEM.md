# Sistem Configurabil - Arhitectura Tehnica

Acest document descrie arhitectura sistemului maxim configurabil pentru platforma universala de website-uri business.

## 1. Design Presets (Preseturi de Design)

Trei stiluri principale aplicabile oricarui tip de business:

### Modern/Minimal
```typescript
const modernPreset = {
  name: 'modern',
  displayName: 'Modern & Minimal',
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    button: '8px',
    card: '12px',
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.08)',
    cardHover: '0 4px 12px rgba(0,0,0,0.12)',
    button: 'none',
  },
  spacing: {
    sectionPadding: '80px',
    cardGap: '24px',
  },
  style: {
    headerStyle: 'transparent',
    heroStyle: 'minimal',
    cardStyle: 'flat',
  }
}
```

### Classic/Elegant
```typescript
const classicPreset = {
  name: 'classic',
  displayName: 'Classic & Elegant',
  fonts: {
    heading: 'Playfair Display',
    body: 'Source Sans Pro',
  },
  borderRadius: {
    small: '2px',
    medium: '4px',
    large: '8px',
    button: '4px',
    card: '8px',
  },
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.1)',
    cardHover: '0 8px 24px rgba(0,0,0,0.15)',
    button: '0 2px 4px rgba(0,0,0,0.1)',
  },
  spacing: {
    sectionPadding: '100px',
    cardGap: '32px',
  },
  style: {
    headerStyle: 'solid',
    heroStyle: 'elegant',
    cardStyle: 'bordered',
  }
}
```

### Bold/Vibrant
```typescript
const boldPreset = {
  name: 'bold',
  displayName: 'Bold & Vibrant',
  fonts: {
    heading: 'Montserrat',
    body: 'Open Sans',
  },
  borderRadius: {
    small: '8px',
    medium: '16px',
    large: '24px',
    button: '50px',
    card: '20px',
  },
  shadows: {
    card: '0 4px 16px rgba(0,0,0,0.1)',
    cardHover: '0 8px 32px rgba(0,0,0,0.2)',
    button: '0 4px 12px rgba(var(--color-primary-rgb),0.3)',
  },
  spacing: {
    sectionPadding: '120px',
    cardGap: '40px',
  },
  style: {
    headerStyle: 'gradient',
    heroStyle: 'dynamic',
    cardStyle: 'elevated',
  }
}
```

---

## 2. Color Schemes per Business Type

Fiecare tip de business are 2-3 scheme de culori predefinite:

### Dentist/Medical
```typescript
const dentistColors = {
  clean: {
    primary: '#00a0dc',
    secondary: '#26d9d9',
    accent: '#00c853',
    dark: '#1a365d',
    light: '#f0f9ff',
    surface: '#ffffff',
  },
  professional: {
    primary: '#2563eb',
    secondary: '#3b82f6',
    accent: '#10b981',
    dark: '#1e3a5f',
    light: '#eff6ff',
    surface: '#ffffff',
  },
  warm: {
    primary: '#0891b2',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    dark: '#164e63',
    light: '#ecfeff',
    surface: '#ffffff',
  }
}
```

### Barbershop/Frizerie
```typescript
const barbershopColors = {
  classic: {
    primary: '#000000',
    secondary: '#1a1a1a',
    accent: '#c9a962',
    dark: '#000000',
    light: '#f5f5f5',
    surface: '#ffffff',
  },
  vintage: {
    primary: '#8b4513',
    secondary: '#a0522d',
    accent: '#d4af37',
    dark: '#3d2914',
    light: '#faf5f0',
    surface: '#ffffff',
  },
  modern: {
    primary: '#18181b',
    secondary: '#27272a',
    accent: '#f97316',
    dark: '#09090b',
    light: '#fafafa',
    surface: '#ffffff',
  }
}
```

### Restaurant
```typescript
const restaurantColors = {
  rustic: {
    primary: '#92400e',
    secondary: '#b45309',
    accent: '#65a30d',
    dark: '#422006',
    light: '#fef3c7',
    surface: '#fffbeb',
  },
  elegant: {
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#b91c1c',
    dark: '#111827',
    light: '#f9fafb',
    surface: '#ffffff',
  },
  fresh: {
    primary: '#166534',
    secondary: '#15803d',
    accent: '#ea580c',
    dark: '#14532d',
    light: '#f0fdf4',
    surface: '#ffffff',
  }
}
```

### Avocat/Juridic
```typescript
const lawyerColors = {
  corporate: {
    primary: '#1e3a5f',
    secondary: '#2563eb',
    accent: '#b8860b',
    dark: '#0f172a',
    light: '#f1f5f9',
    surface: '#ffffff',
  },
  modern: {
    primary: '#18181b',
    secondary: '#3f3f46',
    accent: '#0ea5e9',
    dark: '#09090b',
    light: '#fafafa',
    surface: '#ffffff',
  },
  traditional: {
    primary: '#7c2d12',
    secondary: '#9a3412',
    accent: '#d4af37',
    dark: '#431407',
    light: '#fef2f2',
    surface: '#ffffff',
  }
}
```

### Constructii
```typescript
const constructionColors = {
  industrial: {
    primary: '#dc2626',
    secondary: '#ef4444',
    accent: '#f59e0b',
    dark: '#1c1917',
    light: '#fafaf9',
    surface: '#ffffff',
  },
  professional: {
    primary: '#2563eb',
    secondary: '#3b82f6',
    accent: '#f97316',
    dark: '#1e3a8a',
    light: '#eff6ff',
    surface: '#ffffff',
  },
  earthy: {
    primary: '#78716c',
    secondary: '#a8a29e',
    accent: '#16a34a',
    dark: '#44403c',
    light: '#fafaf9',
    surface: '#ffffff',
  }
}
```

### Salon Infrumusetare
```typescript
const salonColors = {
  natural: {
    primary: '#4a7c59',
    secondary: '#5a9a6a',
    accent: '#c9a962',
    dark: '#2d4a35',
    light: '#f0fdf4',
    surface: '#ffffff',
  },
  glamour: {
    primary: '#be185d',
    secondary: '#db2777',
    accent: '#fbbf24',
    dark: '#831843',
    light: '#fdf2f8',
    surface: '#ffffff',
  },
  minimalist: {
    primary: '#737373',
    secondary: '#a3a3a3',
    accent: '#ec4899',
    dark: '#404040',
    light: '#fafafa',
    surface: '#ffffff',
  }
}
```

### Auto Service
```typescript
const autoColors = {
  performance: {
    primary: '#dc2626',
    secondary: '#ef4444',
    accent: '#000000',
    dark: '#18181b',
    light: '#fafafa',
    surface: '#ffffff',
  },
  professional: {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#f97316',
    dark: '#1e3a8a',
    light: '#eff6ff',
    surface: '#ffffff',
  },
  industrial: {
    primary: '#3f3f46',
    secondary: '#52525b',
    accent: '#eab308',
    dark: '#27272a',
    light: '#fafafa',
    surface: '#ffffff',
  }
}
```

---

## 3. Layout Variants per Block

Fiecare bloc are multiple variante de layout selectabile din admin:

### Hero Block
```typescript
const heroVariants = [
  'centered',        // Text centrat, imagine fundal
  'left-aligned',    // Text stanga, imagine dreapta
  'right-aligned',   // Text dreapta, imagine stanga
  'split',           // 50/50 text si imagine
  'fullscreen',      // Fullscreen cu overlay
  'video',           // Video background
  'slider',          // Multiple slides
  'minimal',         // Doar text, fara imagine
]
```

### Services Block
```typescript
const servicesVariants = [
  'grid-3',          // 3 coloane grid
  'grid-4',          // 4 coloane grid
  'grid-2',          // 2 coloane grid
  'list',            // Lista verticala
  'list-alternating',// Lista cu imagini alternand stanga/dreapta
  'carousel',        // Carousel orizontal
  'tabs',            // Tabs cu continut
  'accordion',       // Accordion expandabil
  'masonry',         // Masonry grid
]
```

### Team Block
```typescript
const teamVariants = [
  'cards-grid',      // Carduri in grid
  'cards-centered',  // Carduri centrate
  'list-horizontal', // Lista orizontala
  'carousel',        // Carousel
  'featured',        // Un membru mare + restul mici
  'with-modal',      // Click deschide modal cu detalii
]
```

### Testimonials Block
```typescript
const testimonialsVariants = [
  'carousel',        // Carousel clasic
  'grid',            // Grid 2-3 coloane
  'single-featured', // Un testimonial mare
  'masonry',         // Masonry layout
  'cards-rotating',  // Carduri cu rotatie automata
  'minimal',         // Doar text, fara avatare
]
```

### Portfolio Block
```typescript
const portfolioVariants = [
  'grid-masonry',    // Masonry grid
  'grid-uniform',    // Grid uniform
  'carousel',        // Carousel
  'filterable',      // Cu filtre pe categorii
  'lightbox',        // Cu lightbox la click
  'case-studies',    // Carduri mari cu detalii
]
```

### Pricing Block
```typescript
const pricingVariants = [
  'cards-3',         // 3 carduri
  'cards-4',         // 4 carduri
  'table',           // Tabel comparativ
  'list',            // Lista simpla
  'toggle',          // Cu toggle lunar/anual
  'featured',        // Card featured in centru
]
```

### Contact Block
```typescript
const contactVariants = [
  'split',           // Form stanga, info dreapta
  'centered',        // Form centrat
  'with-map',        // Form + harta
  'full-width',      // Form full width
  'minimal',         // Doar informatii esentiale
  'cards',           // Info in carduri
]
```

### FAQ Block
```typescript
const faqVariants = [
  'accordion',       // Accordion clasic
  'two-columns',     // Doua coloane
  'tabs',            // Grupate in tabs
  'searchable',      // Cu search
  'numbered',        // Cu numere
]
```

### Gallery Block
```typescript
const galleryVariants = [
  'grid-3',          // 3 coloane
  'grid-4',          // 4 coloane
  'masonry',         // Masonry
  'carousel',        // Carousel
  'lightbox',        // Cu lightbox
  'instagram',       // Stil Instagram
]
```

### Stats Block
```typescript
const statsVariants = [
  'inline',          // Pe o linie
  'grid-4',          // 4 carduri
  'grid-3',          // 3 carduri
  'with-icons',      // Cu iconite
  'animated',        // Cu numarare animata
  'minimal',         // Text simplu
]
```

### CTA Block
```typescript
const ctaVariants = [
  'centered',        // Centrat
  'split',           // Text stanga, buton dreapta
  'with-image',      // Cu imagine fundal
  'gradient',        // Fundal gradient
  'minimal',         // Minimal
  'floating',        // Card flotant
]
```

---

## 4. Header Variants

```typescript
const headerVariants = [
  'standard',        // Logo stanga, meniu dreapta
  'centered',        // Logo centru, meniu sub
  'with-topbar',     // Topbar + header principal
  'transparent',     // Transparent pe hero
  'sticky',          // Sticky cu efect scroll
  'hamburger',       // Hamburger menu mereu
  'mega-menu',       // Cu mega menu dropdown
]
```

---

## 5. Footer Variants

```typescript
const footerVariants = [
  'columns-4',       // 4 coloane
  'columns-3',       // 3 coloane
  'minimal',         // O linie
  'centered',        // Tot centrat
  'with-newsletter', // Cu formular newsletter
  'dark',            // Fundal inchis
  'with-map',        // Cu harta integrata
]
```

---

## 6. CSS Variables Complete

```css
:root {
  /* Colors */
  --color-primary: #000000;
  --color-primary-rgb: 0, 0, 0;
  --color-primary-light: #333333;
  --color-primary-dark: #000000;

  --color-secondary: #666666;
  --color-secondary-rgb: 102, 102, 102;

  --color-accent: #c9a962;
  --color-accent-rgb: 201, 169, 98;

  --color-dark: #000000;
  --color-light: #f5f5f5;
  --color-surface: #ffffff;
  --color-surface-secondary: #fafafa;

  --color-text: #1a1a1a;
  --color-text-light: #666666;
  --color-text-muted: #999999;

  --color-border: #e5e5e5;
  --color-border-light: #f0f0f0;

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-accent: 'Inter', sans-serif;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-6xl: 3.75rem;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Spacing */
  --spacing-section: 80px;
  --spacing-section-mobile: 48px;
  --spacing-card-gap: 24px;
  --spacing-content-gap: 16px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  --radius-button: 8px;
  --radius-card: 12px;
  --radius-input: 8px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-button: none;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;

  /* Container */
  --container-max: 1280px;
  --container-padding: 24px;

  /* Header */
  --header-height: 80px;
  --header-height-mobile: 64px;
  --topbar-height: 40px;

  /* Z-index */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal: 400;
  --z-tooltip: 500;
}
```

---

## 7. Responsive Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

---

## 8. Component Variants

### Button Variants
```typescript
const buttonVariants = {
  sizes: ['sm', 'md', 'lg', 'xl'],
  styles: ['solid', 'outline', 'ghost', 'link'],
  shapes: ['default', 'rounded', 'pill'],
}
```

### Card Variants
```typescript
const cardVariants = {
  styles: ['flat', 'elevated', 'bordered', 'filled'],
  sizes: ['sm', 'md', 'lg'],
  hover: ['none', 'lift', 'glow', 'border'],
}
```

### Input Variants
```typescript
const inputVariants = {
  styles: ['default', 'filled', 'underline', 'floating-label'],
  sizes: ['sm', 'md', 'lg'],
}
```

---

## 9. Animation Presets

```typescript
const animations = {
  none: {
    duration: '0ms',
  },
  subtle: {
    duration: '300ms',
    hover: 'translateY(-2px)',
    fadeIn: 'fadeIn 0.3s ease',
  },
  moderate: {
    duration: '400ms',
    hover: 'translateY(-4px)',
    fadeIn: 'fadeIn 0.4s ease',
    slideUp: 'slideUp 0.4s ease',
  },
  dynamic: {
    duration: '500ms',
    hover: 'translateY(-8px) scale(1.02)',
    fadeIn: 'fadeIn 0.5s ease',
    slideUp: 'slideUp 0.5s ease',
    parallax: true,
  },
}
```

---

## 10. Business-Specific Features Toggle

Fiecare seeder activeaza/dezactiveaza features specifice:

```typescript
const businessFeatures = {
  frizerie: {
    booking: true,
    prices: true,
    team: true,
    gallery: true,
    products: false,
    portfolio: false,
    blog: false,
  },
  dentist: {
    booking: true,
    prices: true,
    team: true,
    gallery: true,
    products: false,
    portfolio: false,
    blog: true,
  },
  constructii: {
    booking: false,
    prices: false,
    team: true,
    gallery: true,
    products: false,
    portfolio: true,
    blog: true,
  },
  restaurant: {
    booking: true,  // rezervari
    prices: true,   // meniu
    team: false,
    gallery: true,
    products: false,
    portfolio: false,
    blog: false,
  },
  magazin: {
    booking: false,
    prices: true,
    team: false,
    gallery: true,
    products: true,
    portfolio: false,
    blog: false,
  },
  // ... etc
}
```

---

## Implementare in Payload Admin

Toate aceste optiuni vor fi configurabile din Payload Admin panel:

1. **Theme Global** - selectie preset + customizare culori
2. **Layout Settings** - variante pentru fiecare sectiune
3. **Feature Toggles** - ce functionalitati sunt active
4. **Typography** - fonturi si dimensiuni
5. **Spacing** - dimensiuni sectiuni si gap-uri
6. **Animations** - nivel de animatie dorit

Astfel, orice combinatie de business + design preset + layout variants este posibila fara modificari de cod.
