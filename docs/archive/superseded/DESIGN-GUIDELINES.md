# Design Guidelines - Particularitati Vizuale Per Nisa

## PROBLEMA ACTUALA

Site-urile noastre au un design **prea generic si basic**:
- Acelasi layout pentru toate business-urile
- Culori simple fara personalitate
- Lipsa elementelor vizuale distinctive
- Fara animatii sau efecte
- Fonturi standard fara caracter

---

## ELEMENTE DE DESIGN OBSERVATE LA SITE-URI PROFESIONALE

### 1. TIPOGRAFIE

| Element | Basic (noi) | Professional |
|---------|-------------|--------------|
| Titluri | Font standard (Inter) | Fonturi cu personalitate per nisa |
| Dimensiuni | Toate similare | Ierarhie clara, titluri mari impactante |
| Stiluri | Regular/Bold | Italic, cursive pentru eleganta |
| Spacing | Standard | Letter-spacing custom, line-height generos |

**Exemple per nisa:**

```css
/* FRIZERIE - masculin, bold */
--font-heading: 'Playfair Display', serif;
--font-body: 'Montserrat', sans-serif;
--letter-spacing-heading: 0.1em;

/* DENTIST - clean, medical */
--font-heading: 'Poppins', sans-serif;
--font-body: 'Open Sans', sans-serif;
--letter-spacing-heading: 0.02em;

/* RESTAURANT - elegant, warm */
--font-heading: 'Cormorant Garamond', serif;
--font-body: 'Lato', sans-serif;
--font-accent: 'Great Vibes', cursive;

/* AVOCAT - serios, profesional */
--font-heading: 'Merriweather', serif;
--font-body: 'Source Sans Pro', sans-serif;

/* SALON - feminin, elegant */
--font-heading: 'Playfair Display', serif;
--font-body: 'Raleway', sans-serif;
--font-accent: 'Parisienne', cursive;

/* CONSTRUCTII - industrial, strong */
--font-heading: 'Oswald', sans-serif;
--font-body: 'Roboto', sans-serif;
--text-transform-heading: uppercase;
```

---

### 2. CULORI SI TEME

**FRIZERIE / BARBERSHOP**
```css
:root {
  /* Dark & Gold - masculin, premium */
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #0d0d0d;
  --color-accent: #c9a227;  /* Gold */
  --color-accent-hover: #d4af37;
  --color-text: #ffffff;
  --color-text-muted: #888888;

  /* Gradient overlay pe imagini */
  --gradient-dark: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
}
```

**CABINET STOMATOLOGIC**
```css
:root {
  /* Clean Blue & White - medical, trust */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-accent: #0077b6;  /* Medical blue */
  --color-accent-light: #90e0ef;
  --color-text: #1e293b;
  --color-success: #22c55e;  /* Pentru "disponibil" */
}
```

**RESTAURANT**
```css
:root {
  /* Warm Orange & Brown - apetisant */
  --color-bg-primary: #faf6f0;  /* Cream */
  --color-bg-secondary: #3d2c2e;  /* Dark brown */
  --color-accent: #d35400;  /* Warm orange */
  --color-accent-secondary: #8b4513;  /* Saddle brown */
  --color-text-light: #f5f5dc;  /* Beige */
}
```

**SERVICE AUTO**
```css
:root {
  /* Red & Dark - industrial */
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2d2d2d;
  --color-accent: #e63946;  /* Bold red */
  --color-warning: #f59e0b;  /* Pentru atentionari */
  --color-text: #ffffff;
}
```

**SALON INFRUMUSETARE**
```css
:root {
  /* Pink & Rose Gold - feminin */
  --color-bg-primary: #fff5f5;
  --color-bg-secondary: #ffe4e6;
  --color-accent: #ec4899;  /* Pink */
  --color-accent-gold: #b76e79;  /* Rose gold */
  --color-text: #831843;
}
```

**CABINET AVOCAT**
```css
:root {
  /* Navy & Gold - profesional */
  --color-bg-primary: #0f172a;  /* Dark navy */
  --color-bg-secondary: #1e293b;
  --color-accent: #c9a227;  /* Gold */
  --color-text: #f8fafc;
  --color-border: #334155;
}
```

**FIRMA CONSTRUCTII**
```css
:root {
  /* Orange Industrial & Dark */
  --color-bg-primary: #1f2937;
  --color-bg-secondary: #111827;
  --color-accent: #ea580c;  /* Construction orange */
  --color-text: #f9fafb;
  --color-steel: #6b7280;  /* Steel gray */
}
```

**MAGAZIN ONLINE**
```css
:root {
  /* Green Eco & Natural */
  --color-bg-primary: #fefefe;
  --color-bg-secondary: #f0fdf4;
  --color-accent: #16a34a;  /* Eco green */
  --color-accent-secondary: #65a30d;  /* Lime */
  --color-text: #1e293b;
}
```

---

### 3. LAYOUT PATTERNS

**HERO SECTION - Variante per nisa**

```
FRIZERIE:
┌─────────────────────────────────┐
│  [VIDEO BACKGROUND / SLIDER]   │
│                                 │
│     ─── TITLU MARE ───          │
│     Subtitlu elegant italic     │
│                                 │
│  [BUTON GOLD]  [BUTON OUTLINE]  │
└─────────────────────────────────┘
- Video background sau slider imagini
- Text centered cu linie decorativa
- Butoane cu hover effects gold

DENTIST:
┌────────────────┬────────────────┐
│ TITLU          │                │
│ Descriere      │   [IMAGINE]    │
│                │                │
│ [───────────]  │                │
│ FORMULAR RAPID │                │
│ [───────────]  │                │
└────────────────┴────────────────┘
- Split layout (text stanga, imagine dreapta)
- Formular programare integrat
- Iconite certificari sub formular

RESTAURANT:
┌─────────────────────────────────┐
│  [SLIDER PREPARATE FULLWIDTH]  │
│                                 │
│        NUME RESTAURANT          │
│      ── Slogan elegant ──       │
│                                 │
│ [REZERVA MASA]  [VEZI MENIU]    │
│                                 │
│  ☎ TELEFON    📍 ADRESA         │
└─────────────────────────────────┘
- Background cu overlay gradient
- Font elegant/cursiv pentru slogan
- Iconite contact vizibile

AVOCAT:
┌────────────────┬────────────────┐
│ CABINET        │                │
│ [Nume Firma]   │   STATUE       │
│                │   JUSTICE      │
│ ─ WE OFFER ─   │   IMAGE        │
│ ─ SOLUTIONS ─  │                │
│                │                │
│ [CONTACT] [BOOK CONSULT]        │
└────────────────┴────────────────┘
- Aspect serios, profesional
- Imagine simbolica (balanta justitiei)
- Call to action "Book Consult"

CONSTRUCTII:
┌─────────────────────────────────┐
│  [VIDEO PROIECTE / DRONE]      │
│                                 │
│   LOGO MARE CENTRAT            │
│   "Perspective Perfecte"        │
│                                 │
│         ▼ SCROLL               │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ [IMG1] [IMG2] [IMG3] [IMG4]    │
│ Antrepriza  Structuri  Infra   │
└─────────────────────────────────┘
- Video drone cu proiecte
- Grid servicii cu imagini fullwidth
- Hover effects pe categorii
```

---

### 4. COMPONENTE VIZUALE DISTINCTIVE

**PRICE LIST DOTTED (Frizerie)**
```
TUNS & STYLING .......................... 130 lei
TUNS SIMPLU ............................. 100 lei
RAS TRADITIONAL .......................... 80 lei
```
- Linie punctata intre serviciu si pret
- Elegant, clasic, premium feel

**SERVICE CARDS CU HOVER (Constructii)**
```
┌─────────────┐
│   IMAGE     │  → Hover: overlay + descriere
│             │  → Scale 1.05
│  CATEGORY   │  → Color accent
└─────────────┘
```

**DOCTOR CARDS (Dentist)**
```
┌───────────────────────┐
│       ┌─────┐         │
│       │ IMG │         │
│       └─────┘         │
│     Dr. Nume          │
│   Specialist Ortodont │
│   15 ani experienta   │
│ [in] [fb] [email]     │
└───────────────────────┘
```
- Social links pentru credibilitate
- Badge-uri specializare

**TESTIMONIALS CU ARROWS (Frizerie)**
```
←  "Testimonial text lung..."  →

        - Nume Client -

    • • • ○ ○  (pagination dots)
```
- Sageti mari laterale
- Font italic pentru citat
- Dots navigation

---

### 5. EFECTE SI ANIMATII

**Hover Effects**
```css
/* Card hover - toate nisele */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

/* Button hover - gold accent */
.btn-accent {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.btn-accent::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
}
.btn-accent:hover::after {
  transform: translateX(100%);
  transition: transform 0.6s ease;
}

/* Image hover - zoom effect */
.image-container {
  overflow: hidden;
}
.image-container img {
  transition: transform 0.5s ease;
}
.image-container:hover img {
  transform: scale(1.1);
}
```

**Scroll Animations**
```css
/* Fade in on scroll */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}
.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.stagger-children > *:nth-child(1) { transition-delay: 0.1s; }
.stagger-children > *:nth-child(2) { transition-delay: 0.2s; }
.stagger-children > *:nth-child(3) { transition-delay: 0.3s; }
```

---

### 6. ELEMENTE DECORATIVE

**Separators / Dividers**
```
FRIZERIE:     ──── ✂ ────
DENTIST:      ──── ✦ ────
RESTAURANT:   ──── ◆ ────
AVOCAT:       ════════════
SALON:        ──── ❀ ────
CONSTRUCTII:  ▬▬▬▬▬▬▬▬▬▬
```

**Background Patterns (CSS)**
```css
/* FRIZERIE - subtle stripes */
.bg-pattern-barber {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(201, 162, 39, 0.03) 10px,
    rgba(201, 162, 39, 0.03) 20px
  );
}

/* DENTIST - dots pattern */
.bg-pattern-dental {
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(0, 119, 182, 0.05) 1px,
    transparent 0
  );
  background-size: 20px 20px;
}

/* CONSTRUCTII - grid */
.bg-pattern-construction {
  background-image:
    linear-gradient(rgba(234, 88, 12, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(234, 88, 12, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

---

### 7. IMAGINI SI MEDIA

**Stiluri per nisa:**

| Nisa | Stil imagine | Overlay | Aspect |
|------|-------------|---------|--------|
| Frizerie | B&W sau desaturate | Dark gradient | Cinematic |
| Dentist | Luminoase, curate | Light/none | Clean |
| Restaurant | Warm, saturate | Warm tint | Apetisant |
| Auto | High contrast | Dark | Industrial |
| Salon | Soft, pastel | Pink tint | Elegant |
| Avocat | Profesional, sobru | Blue tint | Serios |
| Constructii | HDR, dramatic | Orange accent | Puternic |

**Image Treatments (CSS)**
```css
/* FRIZERIE - desaturated */
.barber-image {
  filter: grayscale(30%) contrast(1.1);
}

/* RESTAURANT - warm */
.restaurant-image {
  filter: saturate(1.2) sepia(10%);
}

/* CONSTRUCTII - dramatic */
.construction-image {
  filter: contrast(1.2) brightness(0.9);
}
```

---

### 8. SPACING SYSTEM

```css
:root {
  /* Base spacing */
  --space-xs: 0.5rem;   /* 8px */
  --space-sm: 1rem;     /* 16px */
  --space-md: 1.5rem;   /* 24px */
  --space-lg: 2rem;     /* 32px */
  --space-xl: 3rem;     /* 48px */
  --space-2xl: 4rem;    /* 64px */
  --space-3xl: 6rem;    /* 96px */

  /* Section spacing */
  --section-padding: var(--space-3xl) 0;

  /* Container max-width per nisa */
  --container-width-narrow: 800px;   /* Blog, text content */
  --container-width-default: 1200px; /* Standard */
  --container-width-wide: 1400px;    /* Galleries, portfolios */
}
```

---

## IMPLEMENTARE IN PAYLOAD

### Design Preset per Business Type

```typescript
// src/seed/design-presets.ts

export type DesignPreset = {
  fonts: {
    heading: string
    body: string
    accent?: string
  }
  colors: {
    bgPrimary: string
    bgSecondary: string
    accent: string
    accentHover: string
    text: string
    textMuted: string
  }
  effects: {
    cardHover: 'lift' | 'scale' | 'glow' | 'none'
    imageHover: 'zoom' | 'overlay' | 'grayscale' | 'none'
    buttonStyle: 'solid' | 'outline' | 'gradient'
  }
  patterns: {
    background: 'none' | 'stripes' | 'dots' | 'grid'
    separator: string  // Emoji or symbol
  }
}

export const designPresets: Record<string, DesignPreset> = {
  frizerie: {
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Montserrat', sans-serif",
    },
    colors: {
      bgPrimary: '#1a1a1a',
      bgSecondary: '#0d0d0d',
      accent: '#c9a227',
      accentHover: '#d4af37',
      text: '#ffffff',
      textMuted: '#888888',
    },
    effects: {
      cardHover: 'lift',
      imageHover: 'zoom',
      buttonStyle: 'solid',
    },
    patterns: {
      background: 'stripes',
      separator: '✂',
    },
  },
  dentist: {
    fonts: {
      heading: "'Poppins', sans-serif",
      body: "'Open Sans', sans-serif",
    },
    colors: {
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      accent: '#0077b6',
      accentHover: '#005f92',
      text: '#1e293b',
      textMuted: '#64748b',
    },
    effects: {
      cardHover: 'scale',
      imageHover: 'overlay',
      buttonStyle: 'solid',
    },
    patterns: {
      background: 'dots',
      separator: '✦',
    },
  },
  // ... alte presets
}
```

### Global SiteSettings pentru Design

```typescript
// src/globals/SiteSettings - extindere

{
  name: 'design',
  type: 'group',
  fields: [
    {
      name: 'preset',
      type: 'select',
      options: [
        { label: 'Frizerie (Dark & Gold)', value: 'frizerie' },
        { label: 'Dentist (Clean Blue)', value: 'dentist' },
        { label: 'Restaurant (Warm)', value: 'restaurant' },
        // ...
      ],
    },
    {
      name: 'customColors',
      type: 'group',
      admin: {
        condition: (data) => data?.design?.enableCustom,
      },
      fields: [
        { name: 'bgPrimary', type: 'text' },
        { name: 'accent', type: 'text' },
        // ...
      ],
    },
    {
      name: 'effects',
      type: 'group',
      fields: [
        {
          name: 'cardHover',
          type: 'select',
          options: ['lift', 'scale', 'glow', 'none'],
          defaultValue: 'lift',
        },
        {
          name: 'animations',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable scroll animations',
        },
      ],
    },
  ],
}
```

---

## CONCLUZII

1. **Fiecare nisa are identitate vizuala proprie** - fonturi, culori, efecte diferite
2. **Design-ul influenteaza perceptia** - un barbershop trebuie sa arate masculin, un salon feminin
3. **Efectele adauga profesionalism** - hover effects, animatii, transitions
4. **Totul configurabil din Payload** - presets, dar si customizare
5. **Seedere cu design preset corect** - fiecare business primeste tema potrivita
