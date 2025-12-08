# Plan: Multi-Website Agency Seed

## Rezumat

Crearea unui seed pentru **website de agenție web** care prezintă serviciul de creare site-uri și afișează cele 8 demo-uri live ca portofoliu.

**Principiu:** Toate blocurile noi vor fi **generice și reutilizabile** pentru orice tip de afacere.

---

## 🔧 PRINCIPII TEHNICE FUNDAMENTALE

> **OBLIGATORIU:** La crearea oricărui bloc nou, se vor respecta **principiile Payload CMS** și **best practices** documentate în proiect.

### Resurse de consultat ÎNAINTE de implementare:

1. **Payload Skill** (`/payload`) - Pentru patterns și convenții Payload CMS
2. **Documentație proiect** - Best practices locale în `/docs`
3. **Blocuri existente** - Pattern-uri din `/src/blocks/*` pentru consistență

### Reguli stricte:

- ✅ Folosește tipurile TypeScript generate (`payload-types.ts`)
- ✅ Config-ul block-ului în `config.ts`, Component în `Component.tsx`
- ✅ Export corect în `src/blocks/index.ts`
- ✅ Field-uri cu `admin.description` pentru UX în admin
- ✅ Variante implementate corect cu switch/conditional rendering
- ✅ Labels în română pentru admin panel
- ✅ Rich text cu Lexical editor unde e nevoie
- ✅ Relații cu `relationTo` pentru media/pages/etc.
- ✅ Validări cu `validate` unde e necesar
- ❌ NU hardcoda valori - totul configurabil din admin
- ❌ NU crea dependențe circulare între blocuri
- ❌ NU ignora TypeScript errors

---

## ⭐ PRIORITATE MAXIMĂ: DESIGN EXCEPȚIONAL

> **Acest website TREBUIE să fie cel mai frumos dintre toate.**
> Este vitrina serviciului nostru - dacă site-ul nostru nu arată impecabil, clienții nu vor avea încredere că putem crea site-uri frumoase pentru ei.

### Cerințe Design:

1. **Hero Section Spectaculoasă**
   - Animații subtile (fade-in, parallax, floating elements)
   - Gradient-uri moderne sau mesh gradients
   - Typography impactful cu font premium
   - Device mockups animate (showcase demo-uri)

2. **Microinteracțiuni Everywhere**
   - Hover effects pe toate elementele interactive
   - Smooth transitions (300-500ms)
   - Loading states elegante
   - Scroll animations (reveal on scroll)

3. **Showcase Demo-uri Premium**
   - Device frames realiste (MacBook, iPhone)
   - Hover → video preview sau animație
   - Overlay cu detalii la hover
   - Tranziții fluide între items

4. **Visual Polish**
   - Shadows bine calibrate (layered shadows)
   - Border radius consistent
   - Spacing generos (whitespace premium)
   - Culori vibrante dar profesionale
   - Glassmorphism / blur effects unde e potrivit

5. **Typography Impecabilă**
   - Font heading: premium (Inter, Outfit, Satoshi, etc.)
   - Ierarhie clară (h1 > h2 > h3)
   - Line-height și letter-spacing optimizate
   - Text contrast accessibility

6. **Mobile Experience Perfect**
   - Nu doar "responsive" - trebuie să arate BINE pe mobil
   - Touch-friendly interactions
   - Performanță excelentă

### Inspirație Design:

- **Linear.app** - clean, animații subtile, premium feel
- **Vercel.com** - modern, dark mode, gradients
- **Stripe.com** - polish incredibil, atenție la detalii
- **Framer.com** - showcase templates spectaculos
- **Webflow.com** - prezentare portofoliu elegantă

---

## 1. Structura Site

### Pagini

| Pagina | URL | Scop |
|--------|-----|------|
| **Home** | `/` | Landing page cu hero, portofoliu featured, beneficii |
| **Portofoliu** | `/portofoliu` | Toate cele 8 demo-uri cu preview live |
| **Servicii** | `/servicii` | Ce oferim (site prezentare, e-commerce, etc.) |
| **Cum Funcționează** | `/cum-functioneaza` | Procesul de lucru (How It Works) |
| **Blog** | `/blog` | Articole despre web development, tips & tricks |
| **Contact** | `/contact` | Formular + info contact (CTA pentru ofertă) |
| **Demo Individual** | `/portofoliu/[slug]` | Pagină detaliată pentru fiecare demo |

> **Notă:** Pagina de prețuri va fi adăugată ulterior când se decide modelul de business (abonament vs. site-uri unice).

### Demo Websites

| URL | Tip Business | Stil Design |
|-----|--------------|-------------|
| a.multiwebsite.org | Barbershop | Dark & Gold |
| b.multiwebsite.org | Cabinet Stomatologic | Teal, Modern |
| c.multiwebsite.org | Cabinet Avocat | Blue, Corporate |
| d.multiwebsite.org | Service Auto | Red & Blue |
| e.multiwebsite.org | Restaurant | Warm Orange |
| f.multiwebsite.org | Magazin Online | Green, Clean |
| g.multiwebsite.org | Salon Beauty | Pink, Luxury |
| h.multiwebsite.org | Construcții | Orange, Professional |

---

## 2. Blocuri Noi Necesare (GENERICE)

### 2.1 Showcase Block (Generic)

**Scop:** Grid/carousel pentru orice tip de items (proiecte, produse, case studies, portofoliu)

**Utilizări posibile:**
- 🌐 Agenție web: showcase site-uri create
- 🏗️ Construcții: proiecte finalizate
- 📸 Fotograf: portofoliu fotografii
- 🎨 Designer: lucrări design
- 💼 Consultanță: case studies
- 🏠 Imobiliare: proprietăți
- 🚗 Auto: mașini disponibile

```typescript
// Variante:
- 'featured-grid'     // 2 mari + 4 mici (ATENȚIE: animații staggered)
- 'grid-3'            // 3 coloane uniform
- 'grid-4'            // 4 coloane
- 'masonry'           // Layout masonry cu animații
- 'carousel'          // Slider smooth cu drag
- 'bento'             // Bento grid layout (modern, asymmetric)

// Fields:
- heading, subheading
- items[] (array):
  - title
  - category (ex: "Website", "Apartament", "Proiect")
  - description
  - image (thumbnail principal)
  - externalUrl (link extern opțional)
  - detailPageLink (link intern opțional)
  - tags[] (ex: ["Next.js", "3 camere", "Modern"])
  - featured (boolean)
  - metadata (JSON flexibil pentru date extra)
- showExternalLinkButton
- showTags
- showCategory
- ctaButton
- backgroundColor
- enableAnimations (boolean, default: true)
```

**🎨 Design Requirements pentru Showcase:**
- ✨ Hover effect: scale(1.02) + shadow increase + overlay cu gradient
- ✨ Reveal on scroll (staggered animation per item)
- ✨ Image hover: zoom subtle sau parallax effect
- ✨ Tags cu pill style și hover highlight
- ✨ "View" button apare smooth la hover
- ✨ Optional: video preview la hover pentru website demos

### 2.2 IframeEmbed Block (Generic)

**Scop:** Embed orice conținut extern într-un iframe cu opțiuni de display

**Utilizări posibile:**
- 🌐 Preview site-uri live
- 🎥 Embed video custom (non-YouTube)
- 🗺️ Hărți interactive
- 📊 Dashboards/charts externe
- 📄 PDFs, prezentări
- 🎮 Embed-uri interactive (Figma, CodePen, etc.)

```typescript
// Variante:
- 'default'          // Iframe simplu cu border elegant
- 'device-frame'     // Cu frame de device (laptop, phone, tablet) - PREMIUM
- 'browser-frame'    // Cu bara de browser Chrome-style
- 'responsive'       // Cu butoane animate pentru switch device
- 'fullscreen'       // Full width cu expand animation

// Fields:
- heading, subheading
- url (required) - URL-ul de embed
- fallbackImage - imagine fallback dacă iframe e blocat
- aspectRatio: '16:9' | '4:3' | '1:1' | '9:16' | 'auto'
- height: 'small' | 'medium' | 'large' | 'full'
- deviceFrame: 'none' | 'macbook' | 'imac' | 'iphone' | 'ipad' | 'browser'
- showDeviceSwitcher (boolean)
- allowFullscreen (boolean)
- lazyLoad (boolean)
- ctaButtons[]
- backgroundColor
```

**🎨 Design Requirements pentru IframeEmbed:**
- ✨ Device frames REALISTE (nu generice) - MacBook Pro, iPhone 15, etc.
- ✨ Reflection/shadow sub device pentru realism
- ✨ Device switcher cu animație smooth (morphing între devices)
- ✨ Loading skeleton elegant în timp ce iframe se încarcă
- ✨ Fullscreen button cu expand animation
- ✨ Browser frame cu dots colorate și URL bar
- ✨ Optional: tilt/3D effect la hover pe device

### 2.3 ComparisonTable Block (Generic)

**Scop:** Tabel comparativ pentru orice (pachete, produse, planuri, opțiuni)

**Utilizări posibile:**
- 💰 Comparație pachete/prețuri
- 📱 Comparație produse/modele
- 🏠 Comparație proprietăți
- 📋 Comparație planuri abonament
- ⚖️ Pro vs Contra
- 🔄 Before vs After features

```typescript
// Variante:
- 'table'            // Tabel clasic cu coloane
- 'cards'            // Cards side-by-side
- 'toggle'           // Cu toggle (ex: Monthly/Annual)
- 'highlight'        // Cu coloană highlighted (recommended)

// Fields:
- heading, subheading
- columns[] (array):
  - name
  - subtitle
  - price (opțional)
  - priceUnit (ex: "/lună", "RON", "€")
  - highlighted (boolean)
  - highlightLabel (ex: "Recomandat", "Popular")
  - ctaLabel
  - ctaLink
- features[] (array):
  - category (opțional, pentru grupare)
  - name
  - tooltip (explicație)
  - values[] - valoare per coloană: true/false/"text"/"5 pagini"
- showToggle (boolean)
- toggleLabels: { left: string, right: string }
- disclaimer (text mic jos)
- backgroundColor
```

---

## 3. Layout Pagini

### Homepage

```
1. Hero (split/centered) - "Website-uri Profesionale pentru Afacerea Ta"
2. Trust Badges - "100+ proiecte", "5+ ani", etc.
3. Stats - numere impresionante
4. Showcase (featured-grid) - 4-6 demo-uri featured
5. Services (grid-3) - tipuri de site-uri oferite
6. How It Works (timeline) - procesul de lucru
7. Video Embed - prezentare/demo
8. Testimonials (carousel) - reviews clienți
9. Logo Cloud - clienți/parteneri
10. FAQ - întrebări frecvente
11. Newsletter
12. CTA final - "Contactează-ne pentru o ofertă personalizată"
```

### Portofoliu

```
1. Heading + intro text
2. Showcase (grid-3 sau masonry) - toate cele 8 demo-uri
3. CTA - "Vrei un site similar?"
```

### Pagină Demo Individual (ex: /portofoliu/barbershop)

```
1. IframeEmbed (device-frame) - iframe cu site-ul live
2. Content - descriere, features, tech stack
3. Showcase (carousel) - alte demo-uri similare
4. CTA - "Vrei un site similar? Contactează-ne"
```

---

## 4. Conținut Principal

### Business Info

```typescript
{
  name: 'multiwebsite',
  tagline: 'Website-uri profesionale pentru afacerea ta',
  phone: '0722 456 789',
  email: 'contact@multiwebsite.org',
  address: 'București, România',
  stats: [
    { value: '8+', label: 'Template-uri disponibile' },
    { value: '100%', label: 'Personalizabil' },
    { value: '24/7', label: 'Suport' },
    { value: '⚡', label: 'Rapid & Modern' },
  ]
}
```

### Servicii

| Serviciu | Descriere |
|----------|-----------|
| Website de Prezentare | Site profesional pentru afacerea ta cu design modern |
| Landing Page | Pagină de conversie optimizată pentru campanii |
| Magazin Online | E-commerce complet cu plăți online |
| Website Custom | Soluție personalizată pentru nevoi complexe |
| Redesign Website | Modernizarea site-ului existent |
| Mentenanță & Suport | Update-uri, backup și suport tehnic |

> **Notă:** Prețurile vor fi adăugate ulterior.

### Proces (How It Works)

1. **Consultație Gratuită** - Discuție despre obiective
2. **Propunere & Concept** - Mockup-uri și ofertă
3. **Design & Dezvoltare** - Creăm site-ul cu feedback
4. **Lansare & Training** - Go live + training CMS

---

## 5. Demo Websites Content

```typescript
demoWebsites: [
  {
    title: 'Barber Shop Premium',
    businessType: 'Frizerie / Barbershop',
    liveUrl: 'https://a.multiwebsite.org',
    features: ['Programări online', 'Galerie lucrări', 'Prețuri', 'Echipa'],
    featured: true,
  },
  {
    title: 'DentalMed Clinic',
    businessType: 'Cabinet Stomatologic',
    liveUrl: 'https://b.multiwebsite.org',
    features: ['Servicii medicale', 'Echipa', 'Programare online'],
    featured: true,
  },
  {
    title: 'Cabinet Avocat Ionescu',
    businessType: 'Cabinet Juridic',
    liveUrl: 'https://c.multiwebsite.org',
    features: ['Arii practică', 'Consultație online'],
    featured: false,
  },
  {
    title: 'AutoPro Service',
    businessType: 'Service Auto',
    liveUrl: 'https://d.multiwebsite.org',
    features: ['Servicii', 'Programare ITP', 'Prețuri'],
    featured: false,
  },
  {
    title: 'La Copac Restaurant',
    businessType: 'Restaurant',
    liveUrl: 'https://e.multiwebsite.org',
    features: ['Meniu digital', 'Rezervări', 'Evenimente'],
    featured: true,
  },
  {
    title: 'EcoShop Premium',
    businessType: 'Magazin Online',
    liveUrl: 'https://f.multiwebsite.org',
    features: ['Catalog', 'Coș cumpărături', 'Checkout'],
    featured: true,
  },
  {
    title: 'Beauty Studio Elena',
    businessType: 'Salon Înfrumusețare',
    liveUrl: 'https://g.multiwebsite.org',
    features: ['Servicii', 'Programări', 'Galerie'],
    featured: false,
  },
  {
    title: 'BuildPro Construct',
    businessType: 'Firmă Construcții',
    liveUrl: 'https://h.multiwebsite.org',
    features: ['Portofoliu', 'Servicii', 'Cerere ofertă'],
    featured: false,
  },
]
```

---

## 6. Fișiere de Creat

```
src/
├── blocks/
│   ├── Showcase/
│   │   ├── config.ts        # Configurare Payload (generic)
│   │   └── Component.tsx    # React component
│   ├── IframeEmbed/
│   │   ├── config.ts        # Configurare Payload (generic)
│   │   └── Component.tsx
│   ├── ComparisonTable/     # (opțional, pentru viitor)
│   │   ├── config.ts
│   │   └── Component.tsx
│   └── index.ts             # Update exports
├── seed/
│   ├── businesses/
│   │   └── multiweb.ts      # Seed principal
│   ├── multiweb-data.ts     # Date (content)
│   └── seed-data.ts         # Update exports
```

---

## 7. Pași Implementare

### Faza 0: Îmbunătățiri Sistem Design (GENERIC) ⭐
> Aceste îmbunătățiri vor fi disponibile pentru TOATE site-urile

- [ ] **Gradiente avansate** în SiteTheme.ts
  - [ ] Adăugare câmpuri pentru gradient type, colors, angle
  - [ ] CSS classes pentru gradient-primary, gradient-radial, text-gradient
  - [ ] ThemeProvider să genereze CSS variables pentru gradients

- [ ] **Animații avansate** în SiteTheme.ts
  - [ ] Câmpuri pentru transition duration, easing, stagger
  - [ ] CSS keyframes noi (reveal-up, reveal-scale, float, glow-pulse)
  - [ ] Support pentru prefers-reduced-motion

- [ ] **Glass effects extinse**
  - [ ] CSS classes pentru glass-subtle/medium/strong (light & dark)
  - [ ] Blur intensity configurabil

- [ ] **Shadow system extins**
  - [ ] Shadow layered, shadow premium
  - [ ] Shadow glow cu culoare customizabilă

- [ ] **Hover effects configurabile**
  - [ ] Card hover: lift/scale/glow/tilt-3d
  - [ ] Button hover: darken/lighten/scale/glow
  - [ ] Image hover: zoom/brightness/overlay

- [ ] Update **globals.css** cu toate clasele noi
- [ ] Update **tailwind.config.mjs** cu utilities noi

### Faza 1: Blocuri Noi Generice
- [ ] Creare **Showcase** block (generic pentru orice portofoliu/proiecte)
  - [ ] config.ts cu toate variantele și fields
  - [ ] Component.tsx cu design premium și animații
  - [ ] 6 variante: featured-grid, grid-3, grid-4, masonry, carousel, bento
- [ ] Creare **IframeEmbed** block (generic pentru embed-uri)
  - [ ] config.ts cu fields pentru device frames
  - [ ] Component.tsx cu device mockups realiste
  - [ ] 5 variante: default, device-frame, browser-frame, responsive, fullscreen
- [ ] Adăugare în blocks/index.ts
- [ ] Test blocuri în admin panel

### Faza 2: Date Seed
- [ ] Creare **multiweb-data.ts** cu tot conținutul:
  - [ ] Business info
  - [ ] Demo websites (cele 8)
  - [ ] Servicii
  - [ ] FAQ
  - [ ] Testimoniale (fictive dar realiste)
  - [ ] Blog posts (3-5 articole despre web dev)
- [ ] Screenshots pentru cele 8 demo-uri cu Playwright

### Faza 3: Implementare Seed
- [ ] Creare **multiweb.ts** după pattern-ul existent
- [ ] Design variant cu tema violet/purple
- [ ] Homepage cu toate secțiunile (showcase, services, how-it-works, etc.)
- [ ] Pagină portofoliu cu toate demo-urile
- [ ] Pagini individuale demo (8 pagini)
- [ ] Pagină servicii
- [ ] Pagină cum funcționează
- [ ] Pagină blog
- [ ] Pagină contact

### Faza 4: Polish & Testare
- [ ] Verificare toate paginile în browser
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Test iframe previews pentru toate demo-urile
- [ ] Verificare animații și tranziții
- [ ] Performance check (Lighthouse)
- [ ] Cross-browser testing

---

## 8. Considerații Tehnice

### Iframe Security
```tsx
<iframe
  src={websiteUrl}
  sandbox="allow-scripts allow-same-origin allow-popups"
  loading="lazy"
/>
```

### Fallback pentru iframe blocat
- Folosim screenshot static ca fallback
- Detectăm eroare iframe și afișăm imaginea

### Device Mockups
- Imagini PNG pentru frame-uri (MacBook, iPhone)
- CSS pentru poziționare iframe în frame

---

## 9. Decizii

### ✅ Decis:
- **Nume business:** `multiwebsite`
- **Echipa:** ❌ Fără echipă (nu se afișează)
- **Blog:** ✅ Da, dacă e relevant (articole despre web development, tips, etc.)
- **Culori:** 🟣 **MOV / Violet** - gradient modern violet-purple

### 🎨 Paletă Culori (Violet/Purple theme):
```
Primary:     #8B5CF6 (Violet 500)
Secondary:   #A78BFA (Violet 400)
Accent:      #C4B5FD (Violet 300)
Dark:        #1E1B4B (Indigo 950) - pentru fundal dark sections
Light:       #F5F3FF (Violet 50) - pentru fundal light
Gradient:    from-violet-600 via-purple-600 to-indigo-600
```

### ❓ De făcut:
- Screenshots demo-uri cu Playwright

---

## 10. Îmbunătățiri Sistem Design (GENERIC - pentru toate site-urile)

> **Principiu:** Orice adăugăm la sistemul de design va fi disponibil pentru TOATE seed-urile, nu doar multiwebsite.

### 10.1 Ce avem deja ✅

| Feature | Status |
|---------|--------|
| CSS Variables (40+) | ✅ Complet |
| 12 Design Presets | ✅ Complet |
| Culori (9 per temă) | ✅ Complet |
| Fonturi (15 heading, 14 body) | ✅ Complet |
| Border Radius (5 nivele) | ✅ Complet |
| Shadows (4 nivele) | ✅ Complet |
| Animații basic (fade, slide, scale) | ✅ Complet |
| Glassmorphism basic | ✅ Complet |
| Gradient overlays | ✅ Complet |
| Hover effects (lift, scale, glow) | ✅ Complet |

### 10.2 Ce lipsește pentru design PREMIUM ❌

#### A. Gradiente Avansate (NEW)
```typescript
// De adăugat în SiteTheme.ts
gradients: {
  type: 'group',
  fields: [
    { name: 'enableGradients', type: 'checkbox' },
    { name: 'primaryGradient', type: 'select', options: [
      'none',
      'linear-horizontal',      // left to right
      'linear-vertical',        // top to bottom
      'linear-diagonal',        // 45deg
      'radial-center',          // circular from center
      'radial-corner',          // circular from corner
      'conic',                  // color wheel effect
      'mesh'                    // mesh gradient (CSS)
    ]},
    { name: 'gradientColors', type: 'array', fields: [
      { name: 'color', type: 'text' },
      { name: 'position', type: 'number' }  // 0-100%
    ]},
    { name: 'gradientAngle', type: 'number' },  // 0-360
  ]
}
```

**CSS Classes noi:**
```css
.gradient-primary { background: var(--gradient-primary); }
.gradient-radial { background: radial-gradient(...); }
.gradient-conic { background: conic-gradient(...); }
.gradient-mesh { background: var(--gradient-mesh); }
.text-gradient { background-clip: text; -webkit-text-fill-color: transparent; }
```

#### B. Animații Avansate (NEW)
```typescript
// De adăugat în SiteTheme.ts
animations: {
  type: 'group',
  fields: [
    { name: 'transitionDuration', type: 'select', options: [
      'fast',      // 150ms
      'normal',    // 300ms
      'slow',      // 500ms
      'slower'     // 700ms
    ]},
    { name: 'transitionEasing', type: 'select', options: [
      'ease',
      'ease-in-out',
      'spring',        // cubic-bezier(0.175, 0.885, 0.32, 1.275)
      'bounce',        // cubic-bezier(0.68, -0.55, 0.265, 1.55)
      'smooth'         // cubic-bezier(0.4, 0, 0.2, 1)
    ]},
    { name: 'enableScrollAnimations', type: 'checkbox' },
    { name: 'enableStaggerAnimations', type: 'checkbox' },
    { name: 'staggerDelay', type: 'number' },  // ms between items
    { name: 'respectReducedMotion', type: 'checkbox', defaultValue: true },
  ]
}
```

**CSS Variables noi:**
```css
--transition-duration: 300ms;
--transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
--stagger-delay: 100ms;
--animation-distance: 20px;
```

**Animații noi:**
```css
@keyframes reveal-up { from { opacity: 0; transform: translateY(var(--animation-distance)); } }
@keyframes reveal-scale { from { opacity: 0; transform: scale(0.95); } }
@keyframes float-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes shimmer { from { background-position: -200%; } to { background-position: 200%; } }
@keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 5px var(--theme-primary); } 50% { box-shadow: 0 0 20px var(--theme-primary); } }
```

#### C. Backdrop & Blur Effects (NEW)
```typescript
// De adăugat în SiteTheme.ts
backdrop: {
  type: 'group',
  fields: [
    { name: 'blurIntensity', type: 'select', options: [
      'none',    // 0
      'subtle',  // 4px
      'medium',  // 8px
      'strong',  // 16px
      'intense'  // 24px
    ]},
    { name: 'glassOpacity', type: 'number', min: 0, max: 100 },  // % opacity
    { name: 'enableSaturation', type: 'checkbox' },
  ]
}
```

**CSS Classes noi:**
```css
.glass-subtle { backdrop-filter: blur(4px); background: rgba(255,255,255,0.7); }
.glass-medium { backdrop-filter: blur(8px); background: rgba(255,255,255,0.6); }
.glass-strong { backdrop-filter: blur(16px); background: rgba(255,255,255,0.5); }
.glass-dark-subtle { backdrop-filter: blur(4px); background: rgba(0,0,0,0.5); }
.glass-dark-medium { backdrop-filter: blur(8px); background: rgba(0,0,0,0.6); }
.glass-dark-strong { backdrop-filter: blur(16px); background: rgba(0,0,0,0.7); }
```

#### D. Shadow System Extins (NEW)
```typescript
// De adăugat în SiteTheme.ts
shadows: {
  type: 'group',
  fields: [
    { name: 'shadowColor', type: 'text' },  // permite shadow colorat
    { name: 'enableLayeredShadows', type: 'checkbox' },
    { name: 'enableGlowShadows', type: 'checkbox' },
  ]
}
```

**CSS Variables noi:**
```css
--shadow-color: 0 0 0;  /* RGB pentru shadow colorat */
--shadow-glow: 0 0 30px rgba(var(--shadow-color), 0.3);
--shadow-layered:
  0 1px 2px rgba(0,0,0,0.05),
  0 4px 6px rgba(0,0,0,0.05),
  0 10px 15px rgba(0,0,0,0.1);
--shadow-premium:
  0 2px 4px rgba(0,0,0,0.02),
  0 4px 8px rgba(0,0,0,0.04),
  0 8px 16px rgba(0,0,0,0.06),
  0 16px 32px rgba(0,0,0,0.08);
```

#### E. Hover States Customizabile (NEW)
```typescript
// De adăugat în SiteTheme.ts
hoverEffects: {
  type: 'group',
  fields: [
    { name: 'cardHoverEffect', type: 'select', options: [
      'none',
      'lift',           // translateY(-4px) + shadow
      'scale',          // scale(1.02)
      'glow',           // box-shadow glow
      'border-accent',  // border color change
      'tilt-3d'         // perspective + rotateX/Y
    ]},
    { name: 'buttonHoverEffect', type: 'select', options: [
      'darken',
      'lighten',
      'scale',
      'glow',
      'slide-bg'        // background slide animation
    ]},
    { name: 'imageHoverEffect', type: 'select', options: [
      'none',
      'zoom',           // scale(1.1)
      'brightness',     // brightness(1.1)
      'grayscale',      // grayscale on hover out
      'overlay'         // overlay appears
    ]},
  ]
}
```

#### F. Dark Mode Support (NEW)
```typescript
// De adăugat în SiteTheme.ts
darkMode: {
  type: 'group',
  fields: [
    { name: 'enableDarkMode', type: 'checkbox' },
    { name: 'darkModeDefault', type: 'checkbox' },
    { name: 'darkColors', type: 'group', fields: [
      { name: 'background', type: 'text' },
      { name: 'surface', type: 'text' },
      { name: 'text', type: 'text' },
      // ... all color overrides for dark mode
    ]},
  ]
}
```

### 10.3 Fișiere de Modificat

```
src/
├── globals/
│   └── SiteTheme.ts          # Adăugare câmpuri noi
├── providers/
│   └── ThemeProvider.tsx     # Generare CSS variables noi
├── utilities/
│   └── generateThemeStyles.ts # Logică pentru noile stiluri
├── app/(frontend)/
│   └── globals.css           # CSS classes noi
└── tailwind.config.mjs       # Extend cu noile utilities
```

### 10.4 Prioritate Implementare

| Feature | Prioritate | Efort | Impact |
|---------|-----------|-------|--------|
| Gradiente avansate | 🔴 HIGH | Medium | Mare - hero sections |
| Animații stagger | 🔴 HIGH | Medium | Mare - showcase items |
| Glass effects | 🟡 MEDIUM | Low | Mediu - cards, nav |
| Shadow layered | 🟡 MEDIUM | Low | Mediu - depth |
| Hover effects | 🟡 MEDIUM | Medium | Mare - interactivitate |
| Dark mode | 🟢 LOW | High | Optional |

---

## 11. Inspirație Design

Site-uri similare de referință:
- **Linear.app** - animații subtile, gradients
- **Vercel.com** - dark mode, glassmorphism
- **Stripe.com** - polish, layered shadows
- **Framer.com** - showcase spectaculos
- **Webflow.com** - prezentare portofoliu
- **Squarespace.com** - template showcase
- **Wix.com** - portfolio agencies
- Agency portfolios cu device mockups
