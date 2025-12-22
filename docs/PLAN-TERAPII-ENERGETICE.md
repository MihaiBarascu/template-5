# Plan de Implementare: Terapii Energetice

**Data:** 2025-12-19
**Status:** V4 - COMPLET + LIBRĂRII + BEST PRACTICES
**Actualizat:** Cu librării React recomandate și best practices Payload CMS / Next.js

---

## ⚠️ REGULI CRITICE - CITEȘTE ÎNAINTE DE IMPLEMENTARE

### Documentație Obligatorie
**ÎNAINTE de a scrie COD, citește în ordine:**
1. `docs/_INDEX.md` - Entry point, reguli generale
2. `docs/active/practices/payload-cms.md` - Best practices Payload
3. `docs/active/guides/blocks.md` - Pattern pentru blocuri

### Principii Fundamentale
1. **NU STRICI, DOAR EXTINZI** - Tot codul nou trebuie să fie backwards compatible
2. **RESPECTĂ PATTERN-URILE EXISTENTE** - Studiază cum sunt făcute celelalte block-uri
3. **2 FIȘIERE PER BLOCK** - `config.ts` + `Component.tsx` (NU într-un singur fișier!)
4. **`interfaceName` OBLIGATORIU** - În toate config-urile de block-uri
5. **isDark PATTERN** - Folosește pentru a detecta background-uri întunecate
6. **THEME TOKENS** - NEVER hardcode culori! Folosește `bg-theme-dark`, `text-theme-text`, etc.
7. **TypeScript STRICT** - Import types din `@/payload-types`, NU `any`
8. **`cn()` UTILITY** - Pentru class merging, nu template strings

### Checklist Pre-Implementare Per Task
- [ ] Am citit documentația relevantă
- [ ] Am studiat un block similar existent
- [ ] Știu ce pattern de cod să urmez
- [ ] Am verificat că nu stric funcționalitatea existentă

---

## 1. Obiective

### 1.1 Obiectiv Principal
Reconstruirea site-ului https://www.terapiienergetice.ro/ folosind sistemul template-5 cu:
- Conținutul original exact (text, imagini)
- Schema de culori originală (gold #F5C518 + dark navy #1a1a2e)
- Design modern inspirat de plasturifototerapeutici.ro

### 1.2 Obiectiv Secundar CRITIC
**Îmbunătățirea sistemului multiwebsite** astfel încât să putem reproduce design modern (full-width, video hero, spacing controlat) **doar din seedere**, fără modificări manuale CSS.

---

## 2. Date Extrase (COMPLET)

### 2.1 Business Info
| Camp | Valoare |
|------|---------|
| Nume | Revital Harmony |
| Owner | Monica Batir |
| Telefon | 0774512905 |
| Email | office@terapiienergetice.ro |
| Adresa | Bulevardul Decebal Nr. 9, Sector 3, București |
| Tagline | Centrul de Terapii Energetice Bowen, Access Bars și Facelift Energetic Reiki |

### 2.2 Terapii (8 servicii)
1. **Eliberare de Tensiuni Musculare și Articulare** - Tehnica Bowen
2. **Terapia cu Lumină (Fototerapie)** - Plasturi LifeWave
3. **Masaj Termic Ceragem** - Terapie cu infraroșu
4. **Terapia Bowen** - Tehnica australiană
5. **Corecția Bioritmurilor Bioenergetice** - Terapie holistica
6. **Terapia Reiki** - Energie universală
7. **Access Bars** - 32 puncte energetice
8. **Facelift Energetic** - Anti-aging natural

### 2.3 Cursuri (2 cursuri)
| Curs | Preț | Durată |
|------|------|--------|
| Access Bars | 1,460 RON | 1 zi |
| Facelift Energetic | 1,875 RON | 1 zi |

### 2.4 Testimoniale (40 testimoniale - EXTRAS COMPLET)
| Categorie | Nr. Testimoniale |
|-----------|------------------|
| Terapia Bowen | 19 |
| Access Bars | 8 |
| Facelift Energetic | 5 |
| Corecție Bioenergetică | 3 |
| Eliberare Tensiuni | 3 |
| Reiki | 2 |
| **Total** | **40** |

### 2.5 Media (11 video-uri YouTube)
```
rpQ7Gxw24EQ, kUydjMCBAe8, 9R9p0_eNyrw, g_WYobfnNbE,
-l8dzRYwPg4, LjYooa25Ibc, NYZ6-VitAJo, MonPDzAlhCs,
9g1lWHOgPLo, 6M8ZbT9Ycqs, PgskKpwKVvM
```

### 2.6 Imagini de descărcat (20 imagini)
- Hero images (3-4)
- Therapy images (8)
- About/Team images (2-3)
- Gallery images (4-5)
- Course images (2)

---

## 3. ANALIZĂ DESIGN - plasturifototerapeutici.ro (Expert Analysis)

### 3.1 Elemente Vizuale Cheie

| Element | Specificații | Impact |
|---------|--------------|--------|
| **Video Hero** | 930px înălțime, fullscreen, autoplay, loop | WOW factor |
| **Overlay** | `rgba(2, 40, 61, 0.5)` - gradient | Text visibility |
| **Font Weight** | 400 (normal) pentru TOATE heading-urile | Eleganță, nu bold agresiv |
| **Line Height** | 1.4 consistent pentru toate | Lizibilitate |
| **Border Radius** | DOAR 2 valori: 8px și 24px (pill) | Consistență |
| **Box Shadows** | ZERO - design complet flat | Modern, curat |
| **Spacing** | Zero padding pe sections, controlat intern | Flexibilitate |

### 3.2 Layout Patterns

| Pattern | Utilizare |
|---------|-----------|
| **2-column Video+Text** | Repetat pe tot site-ul, alternând stânga/dreapta |
| **Full-width sections** | Video și imagini edge-to-edge |
| **Multiple video sections** | 5-7 secțiuni cu video, nu doar hero |
| **Grid 12 coloane** | Coloane de 24px, gap 24px |

### 3.3 Butoane

| Tip | Specificații |
|-----|--------------|
| **Primary** | `rgb(0, 145, 150)` teal, 8px radius, 13px 22px padding |
| **Secondary** | white bg, blue text, 24px radius (pill) |
| **Semi-transparent** | `rgba(255, 255, 255, 0.5)`, 8px radius |
| **Font** | 13-14px, NO uppercase |

### 3.4 Animații și Tranziții

```css
/* Easing functions folosite */
--ease-fast: cubic-bezier(0.12, 0, 0.39, 0);
--ease-elastic: cubic-bezier(0.61, 1, 0.88, 1);

/* Durate */
--duration-fast: 0.15s;
--duration-normal: 0.2s;
--duration-slow: 0.4s;
```

---

## 4. LIBRĂRII REACT RECOMANDATE

### 4.1 Video Player (pentru Hero și VideoGallery)

| Librărie | Stars | Licență | Recomandare |
|----------|-------|---------|-------------|
| **react-player** | 10.1k | MIT | ✅ RECOMANDAT - suportă YouTube, Vimeo, self-hosted |
| next-video | 1.2k | MIT | OK - specific Next.js |
| **HTML5 `<video>` nativ** | - | - | ✅ RECOMANDAT pentru self-hosted |

```bash
# Instalare (dacă e nevoie)
pnpm add react-player
```

**Notă:** Pentru hero video self-hosted, preferă HTML5 `<video>` nativ pentru performanță optimă.

### 4.2 Lightbox pentru VideoGallery

| Librărie | Stars | Licență | Recomandare |
|----------|-------|---------|-------------|
| **yet-another-react-lightbox** | 1.2k | MIT | ✅ RECOMANDAT - MIT, actualizat recent |
| lightGallery | 6.7k | GPLv3 | ❌ Licență comercială pentru proiecte comerciale |
| react-image-lightbox | 1.5k | MIT | OK - dar nu mai e menținut activ |

```bash
# Instalare
pnpm add yet-another-react-lightbox
```

**Features yet-another-react-lightbox:**
- Video support (YouTube, Vimeo, self-hosted)
- Keyboard navigation
- Touch/swipe support
- Zoom, slideshow, thumbnails plugins
- Fully customizable styling

### 4.3 Animații și Parallax

| Librărie | Stars | Licență | Recomandare |
|----------|-------|---------|-------------|
| **framer-motion** | 30.5k | MIT | ✅ RECOMANDAT - standard industrial |
| react-scroll-parallax | 3k | MIT | ✅ Bun pentru parallax specific |

```bash
# Framer Motion (probabil deja instalat)
pnpm add framer-motion

# React Scroll Parallax (opțional)
pnpm add react-scroll-parallax
```

### 4.4 UI Components

| Librărie | Tip | Recomandare |
|----------|-----|-------------|
| **shadcn/ui** | Copy-paste components | ✅ RECOMANDAT - folosit deja în proiect |
| Aceternity UI | Animated components | OK - pentru efecte speciale |
| Flowbite | Tailwind components | OK - dacă e nevoie |

**Notă:** Preferă să folosești componente deja existente în proiect înainte de a adăuga librării noi.

---

## 5. ARHITECTURĂ TEHNICĂ (Next.js Expert)

### 5.1 SectionWrapper Component (NOU)

Un component reutilizabil pentru toate block-urile care oferă:

```typescript
// src/components/SectionWrapper/index.tsx
interface SectionWrapperProps {
  // Layout
  fullWidth?: boolean
  containerSize?: 'default' | 'narrow' | 'wide' | 'full'

  // Spacing
  paddingTop?: 'none' | 'small' | 'medium' | 'large' | 'xl'
  paddingBottom?: 'none' | 'small' | 'medium' | 'large' | 'xl'

  // Background
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary' | 'accent' | 'transparent'
  backgroundImage?: MediaType | null
  backgroundVideo?: {
    url: string
    poster?: MediaType | null
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    playbackSpeed?: number
  } | null

  // Overlay
  overlay?: {
    type: 'solid' | 'gradient-to-t' | 'gradient-to-b' | 'gradient-radial'
    opacity?: number // 0-100
    color?: string
  } | null

  // Effects
  parallax?: boolean
  parallaxSpeed?: number
  blur?: boolean
}
```

### 5.2 Shared Config Fields

```typescript
// src/blocks/_shared/sectionWrapperFields.ts
// Adaugă în fiecare block - collapsible "Setări Layout & Design"
export const sectionWrapperFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Setari Layout & Design',
    admin: { initCollapsed: true },
    fields: [
      // fullWidth, containerSize
      // paddingTop, paddingBottom
      // backgroundImage, backgroundVideo
      // overlay (type, opacity, color)
      // parallax, blur
    ]
  }
]
```

### 5.3 VideoGallery Block (NOU)

```typescript
// src/blocks/VideoGallery/config.ts
{
  slug: 'videoGallery',
  fields: [
    { name: 'variant', options: ['grid-2', 'grid-3', 'grid-4', 'featured', 'carousel', 'masonry'] },
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    { name: 'videos', type: 'array', fields: [
      { name: 'source', options: ['youtube', 'vimeo', 'self'] },
      { name: 'videoUrl', type: 'text' },
      { name: 'thumbnail', type: 'upload' },
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'duration', type: 'text' },
      { name: 'category', type: 'text' },
    ]},
    { name: 'showTitles', type: 'checkbox' },
    { name: 'showDuration', type: 'checkbox' },
    { name: 'aspectRatio', options: ['16-9', '4-3', 'square', '9-16'] },
    ...sectionWrapperFields,
  ]
}
```

---

## 6. EXTENSII DESIGN SYSTEM (Payload CMS Expert)

### 6.1 Noi Tab-uri în SiteTheme

| Tab | Opțiuni |
|-----|---------|
| **Tipografie Avansată** | headingWeight, bodyWeight, headingLineHeight, bodyLineHeight, letterSpacing, textTransform |
| **Spacing & Layout** | sectionPadding, contentDensity, whitespaceRatio, gridColumns |
| **Butoane Avansate** | buttonStyle, buttonSize, buttonRounding, buttonHoverEffect, buttonTextTransform |
| **Efecte & Animații** | transitionSpeed, hoverEffects, parallaxEffect, glassEffect |
| **Umbre & Depth** | shadowStyle, shadowColor, shadowIntensity, layerDepth |
| **Borduri & Backgrounds** | borderStyle, dividerStyle, backgroundPattern, gradientStyle |

### 6.2 Noi Presets în theme/variants.ts

```typescript
// Heading weight presets
export const headingWeightPresets = {
  light: '300',
  normal: '400',    // ← Stil plasturi
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
}

// Button hover effects
export const buttonHoverEffectPresets = {
  lift: { transform: 'translateY(-2px)', shadow: 'md' },
  scale: { transform: 'scale(1.05)' },
  glow: { boxShadow: '0 0 20px var(--theme-primary)' },
  darken: { filter: 'brightness(0.9)' },
  brighten: { filter: 'brightness(1.1)' },
}

// Glass effect (glassmorphism)
export const glassEffectPresets = {
  none: { backdropFilter: 'none' },
  subtle: { backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.6)' },
  moderate: { backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.4)' },
  strong: { backdropFilter: 'blur(24px)', background: 'rgba(255,255,255,0.2)' },
}

// Shadow styles
export const shadowStylePresets = {
  flat: { sm: 'none', md: 'none', lg: 'none' },
  soft: { sm: '0 2px 8px rgba(0,0,0,0.06)', md: '0 4px 16px rgba(0,0,0,0.08)' },
  sharp: { sm: '2px 2px 0 rgba(0,0,0,0.2)' },
  colored: { sm: '0 2px 8px var(--shadow-color-alpha-30)' },
  neumorphic: { sm: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.8)' },
}
```

### 6.3 Design Variant pentru Terapii Energetice

```typescript
export const terapiiEnergeticeVariant: DesignVariant = {
  id: 'terapii-energetice-v1',
  name: 'Healing Energy Design',
  description: 'Design pentru terapii energetice - gold & navy, calm, premium',
  theme: {
    preset: 'elegant',
    colors: {
      primary: '#F5C518',      // Gold
      secondary: '#1a1a2e',    // Dark Navy
      accent: '#FFD700',       // Gold accent
      dark: '#0d0d1a',
      light: '#faf9f6',
      surface: '#ffffff',
      text: '#1a1a2e',
      textLight: '#666666',
      border: '#e5e5e5',
      textOnPrimary: '#1a1a2e',
      textOnSecondary: '#F5C518',
      textOnDark: '#ffffff',
    },

    // Fonts
    headingFont: 'Playfair_Display',
    bodyFont: 'Open_Sans',
    fontPreset: 'elegant',

    // TYPOGRAPHY ADVANCED
    headingWeight: 'normal',      // ← Stil plasturi (400)
    headingLineHeight: 'relaxed', // 1.4
    bodyLineHeight: 'relaxed',
    letterSpacing: 'normal',
    textTransform: 'none',

    // SPACING
    sectionSpacing: 'spacious',
    sectionPadding: 'comfortable',
    cardGap: 'spacious',
    contentDensity: 'comfortable',
    whitespaceRatio: 'generous',

    // BUTTONS
    buttonStyle: 'filled',
    buttonSize: 'lg',
    buttonRounding: 'medium',     // 8px
    buttonTextTransform: 'none',  // ← Stil plasturi (nu uppercase)
    buttonHoverEffect: 'lift',

    // EFFECTS
    animations: 'moderate',
    transitionSpeed: 'normal',
    hoverEffects: 'subtle',
    parallaxEffect: 'subtle',
    glassEffect: 'none',

    // SHADOWS
    shadowStyle: 'soft',          // sau 'flat' pentru stil plasturi
    shadowIntensity: 'subtle',

    // Layout
    stylePreset: 'elegant',
    borderRadius: 'medium',       // 8px
    shadows: 'subtle',
  },
  hero: {
    type: 'video',
    overlay: 'gradient',
    alignment: 'center',
    height: 'fullscreen',
    parallax: true,
  },
  layout: {
    sections: ['services', 'howItWorks', 'team', 'testimonials', 'videoGallery', 'courses', 'faq', 'contact', 'cta'],
    servicesVariant: 'grid-4',
    teamVariant: 'grid-centered',
    testimonialsVariant: 'carousel',
    galleryVariant: 'grid-3',
    pricingVariant: 'featured-center',
  },
}
```

---

## 7. STRUCTURA PAGINILOR

### 7.1 Homepage

| Secțiune | Block | Variant | Opțiuni Noi |
|----------|-------|---------|-------------|
| Hero | Hero | video | overlayType: gradient, minHeight: fullscreen |
| Terapii | Services | grid-4 | paddingTop: large, backgroundColor: light |
| Cum funcționează | HowItWorks | steps | paddingTop: medium |
| Despre Monica | Team | grid-centered | backgroundImage + overlay |
| Testimoniale | Testimonials | carousel | backgroundColor: dark |
| Video Gallery | VideoGallery | grid-3 | NEW BLOCK |
| Cursuri | Services | featured | paddingBottom: large |
| Contact | Contact | split | |
| CTA | CTA | centered | |

### 7.2 Pagini Secundare

| Pagină | Blocks |
|--------|--------|
| /despre-mine | Content + Team |
| /terapii | Services (list-alternating) |
| /terapii/[slug] | ServiceDetail |
| /cursuri | Services + Pricing |
| /testimoniale | Testimonials (grid) |
| /media | VideoGallery |
| /contact | Contact + Map + Form |

---

## 8. FIȘIERE DE CREAT/MODIFICAT

### 8.1 Fișiere NOI

| Fișier | Descriere |
|--------|-----------|
| `src/components/SectionWrapper/index.tsx` | Component reutilizabil pentru layout |
| `src/components/SectionWrapper/types.ts` | TypeScript types |
| `src/blocks/_shared/sectionWrapperFields.ts` | Shared Payload fields |
| `src/blocks/VideoGallery/config.ts` | Config block nou |
| `src/blocks/VideoGallery/Component.tsx` | Component React |
| `src/seed/businesses/terapii-energetice.ts` | Seeder principal |
| `src/seed/seed-data/terapii-energetice.ts` | Date content |
| `src/seed/images/terapii-energetice/` | Folder imagini |

### 8.2 Fișiere de MODIFICAT

| Fișier | Modificare |
|--------|------------|
| `src/globals/SiteTheme.ts` | Adaugă tab-uri noi: Tipografie, Spacing, Butoane, Efecte, Shadows, Backgrounds |
| `src/theme/variants.ts` | Adaugă presets noi: headingWeight, buttonHoverEffect, glassEffect, shadowStyle |
| `src/utilities/generateThemeStyles.ts` | Generează CSS variables pentru noile opțiuni |
| `src/seed/design-variants.ts` | Adaugă `terapiiEnergeticeVariants` + extinde interfața |
| `src/blocks/Hero/config.ts` | Adaugă overlayType, overlayColor, minHeight |
| `src/blocks/Services/config.ts` | Adaugă `...sectionWrapperFields` |
| `src/blocks/Team/config.ts` | Adaugă `...sectionWrapperFields` |
| `src/blocks/Testimonials/config.ts` | Adaugă `...sectionWrapperFields` |
| `src/blocks/Gallery/config.ts` | Adaugă `...sectionWrapperFields` |
| `src/blocks/FAQ/config.ts` | Adaugă `...sectionWrapperFields` |
| `src/blocks/Stats/config.ts` | Adaugă `...sectionWrapperFields` |
| `src/blocks/HowItWorks/config.ts` | Adaugă `...sectionWrapperFields` |
| `src/blocks/index.ts` | Export VideoGallery |
| `src/payload.config.ts` sau blocks.ts | Adaugă VideoGallery în lista de blocks |
| `src/seed/index.ts` | Adaugă case pentru 'terapii-energetice' |

---

## 9. PLAN DE EXECUȚIE DETALIAT

### FAZA 1: Infrastructure Core (CRITIC)

#### 1.1 SectionWrapper Component
- [ ] Creează `src/components/SectionWrapper/index.tsx`
- [ ] Creează `src/components/SectionWrapper/types.ts`
- [ ] Implementează: fullWidth, padding, backgroundColor, backgroundImage, backgroundVideo
- [ ] Implementează: overlay (solid, gradient), parallax, blur

#### 1.2 Shared Config Fields
- [ ] Creează `src/blocks/_shared/sectionWrapperFields.ts`
- [ ] Testează că se poate importa în block-uri

### FAZA 2: Extensii Design System (CRITIC)

#### 2.1 Theme Variants
- [ ] Extinde `src/theme/variants.ts` cu:
  - headingWeightPresets
  - buttonHoverEffectPresets
  - glassEffectPresets
  - shadowStylePresets
  - sectionPaddingPresets
  - contentDensityPresets

#### 2.2 SiteTheme Global
- [ ] Extinde `src/globals/SiteTheme.ts` cu tab-uri noi:
  - Tipografie Avansată
  - Spacing & Layout
  - Butoane Avansate
  - Efecte & Animații
  - Umbre & Depth
  - Borduri & Backgrounds

#### 2.3 CSS Variables
- [ ] Actualizează `src/utilities/generateThemeStyles.ts` pentru noile variabile

### FAZA 3: Block Updates (CRITIC)

#### 3.1 Hero Block
- [ ] Adaugă în config: overlayType, overlayColor, minHeight
- [ ] Actualizează Component pentru noile opțiuni

#### 3.2 Alte Block-uri
- [ ] Services: adaugă `...sectionWrapperFields`, actualizează Component
- [ ] Team: adaugă `...sectionWrapperFields`, actualizează Component
- [ ] Testimonials: adaugă `...sectionWrapperFields`, actualizează Component
- [ ] Gallery: adaugă `...sectionWrapperFields`, actualizează Component
- [ ] FAQ: adaugă `...sectionWrapperFields`, actualizează Component
- [ ] Stats: adaugă `...sectionWrapperFields`, actualizează Component
- [ ] HowItWorks: adaugă `...sectionWrapperFields`, actualizează Component

### FAZA 4: VideoGallery Block (IMPORTANT)

- [ ] Creează `src/blocks/VideoGallery/config.ts`
- [ ] Creează `src/blocks/VideoGallery/Component.tsx`
- [ ] Implementează: grid variants, lightbox, YouTube/Vimeo detection
- [ ] Adaugă în exports și blocks list
- [ ] Testează individual

### FAZA 5: Assets

- [ ] Descarcă toate imaginile de pe terapiienergetice.ro (20 imagini)
- [ ] Descarcă video hero de pe Pexels (Bokeh Golden Lights #9255169)
- [ ] Organizează în `src/seed/images/terapii-energetice/`

### FAZA 6: Design Variant & Seed Data

#### 6.1 Design Variant
- [ ] Extinde interfața DesignVariant cu noile proprietăți
- [ ] Adaugă `terapiiEnergeticeVariants` în design-variants.ts

#### 6.2 Seed Data
- [ ] Creează `src/seed/seed-data/terapii-energetice.ts`
- [ ] Include: business info, 8 terapii, 2 cursuri
- [ ] Include: toate 40 testimonialele
- [ ] Include: 11 video-uri pentru VideoGallery
- [ ] Include: imagini references

### FAZA 7: Seeder

- [ ] Creează `src/seed/businesses/terapii-energetice.ts`
- [ ] Implementează: seedSiteTheme cu noile opțiuni
- [ ] Implementează: seedBusinessInfo, seedServices, seedTeam, etc.
- [ ] Implementează: homepage cu VideoGallery
- [ ] Implementează: pagini secundare
- [ ] Adaugă în `src/seed/index.ts`

### FAZA 8: Testare & Verificare

- [ ] `pnpm generate:types` - regenerare types
- [ ] `pnpm build` - verificare build
- [ ] `SEED_TYPE=terapii-energetice pnpm seed` - rulare seeder
- [ ] Verificare vizuală în browser
- [ ] Comparare cu site-ul original
- [ ] Verificare responsive (mobile, tablet, desktop)
- [ ] Ajustări fine

---

## 10. VIDEO HERO

### 10.1 Opțiuni Recomandate (Gratuite)

| Sursă | ID | Descriere | Link |
|-------|-----|-----------|------|
| **Pexels** | **9255169** | **Bokeh Golden Lights** - RECOMANDAT pentru gold theme | pexels.com/video/9255169 |
| Pixabay | 31571 | Yoga Meditation Zen | pixabay.com/videos/31571 |
| Pexels | 3214524 | Spa Relaxation | pexels.com/video/3214524 |

### 10.2 Caracteristici Necesare
- Durată: minim 15-20 secunde pentru loop smooth
- Rezoluție: 1920x1080 minim (4K preferabil)
- Fără watermark
- Loop-able (start și end similare)
- Culori calde/gold pentru a se potrivi cu tema

---

## 11. REZULTAT AȘTEPTAT

După implementare completă, sistemul va permite:

### 11.1 Pentru Acest Proiect
- Site terapiienergetice.ro complet funcțional
- Design modern similar cu plasturifototerapeutici.ro
- Video hero cu gradient overlay
- VideoGallery cu 11 video-uri
- Toate cele 40 testimoniale
- Responsive pe toate device-urile

### 11.2 Pentru Sistemul Multiwebsite (Beneficii Permanente)
1. **SectionWrapper reutilizabil** - orice block poate avea video/image backgrounds, overlays, parallax
2. **Control spacing din seeder** - paddingTop/Bottom per secțiune
3. **Full-width sections** - imagini/video edge-to-edge oriunde
4. **Typography flexibilă** - headingWeight normal/bold din admin
5. **Button customization** - hover effects, sizes, rounding din theme
6. **Glass effects** - glassmorphism disponibil global
7. **Shadow styles** - flat/soft/sharp/colored/neumorphic
8. **Background patterns** - dots/grid/diagonal/wave/noise

---

## 12. BACKWARDS COMPATIBILITY

Toate modificările sunt **100% backwards compatible**:

1. **Default values** - toate câmpurile noi au valori default care mențin comportamentul actual
2. **Optional fields** - SectionWrapper verifică dacă există backgroundImage/Video înainte să le rendereze
3. **Existing seeders** - funcționează fără modificări
4. **Existing pages** - nu sunt afectate

---

## 13. ESTIMARE COMPONENTE

| Componentă | Complexitate | Prioritate | Status |
|------------|--------------|------------|--------|
| SectionWrapper Component | Medie | CRITIC | TODO |
| Shared sectionWrapperFields | Simplă | CRITIC | TODO |
| Theme variants presets | Medie | CRITIC | TODO |
| SiteTheme extensii | Medie | CRITIC | TODO |
| generateThemeStyles update | Medie | CRITIC | TODO |
| Hero block extensions | Simplă | CRITIC | TODO |
| 7 blocks cu sectionWrapper | Medie | CRITIC | TODO |
| VideoGallery Block | Medie | IMPORTANT | TODO |
| Design variant terapii | Simplă | IMPORTANT | TODO |
| Seed data (40 testimoniale) | Medie | IMPORTANT | TODO |
| Seeder complet | Medie | IMPORTANT | TODO |
| Assets download | Simplă | IMPORTANT | TODO |

---

## 14. TEMPLATES DE COD (BEST PRACTICES)

### 14.1 Block Config Template

```typescript
// src/blocks/[BlockName]/config.ts
import type { Block } from 'payload'

export const MyBlock: Block = {
  slug: 'myBlock',
  interfaceName: 'MyBlock',  // OBLIGATORIU!
  labels: {
    singular: 'My Block',
    plural: 'My Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'default',  // ÎNTOTDEAUNA default value!
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Primary', value: 'primary' },
      ],
    },
    // ...alte field-uri
  ],
}
```

### 14.2 Block Component Template

```tsx
// src/blocks/[BlockName]/Component.tsx
import type { MyBlock as MyBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

export const MyBlock: React.FC<MyBlockProps> = ({
  heading,
  backgroundColor = 'default',  // Default value și în component!
}) => {
  // Pattern isDark pentru detectarea background-urilor întunecate
  const isDark = backgroundColor === 'dark' || backgroundColor === 'primary'

  return (
    <section
      className={cn(
        'py-16 md:py-20',
        // FOLOSEȘTE THEME TOKENS, nu hardcode!
        backgroundColor === 'dark' && 'bg-theme-dark',
        backgroundColor === 'light' && 'bg-theme-light',
        backgroundColor === 'primary' && 'bg-theme-primary',
      )}
    >
      <div className="container mx-auto px-4">
        <h2 className={cn(
          'text-3xl md:text-4xl font-heading',
          // isDark pattern pentru text
          isDark ? 'text-white' : 'text-theme-text',
        )}>
          {heading}
        </h2>
      </div>
    </section>
  )
}
```

### 14.3 Checklist Înainte de PR/Merge

- [ ] `pnpm generate:types` rulat după modificări schema
- [ ] `pnpm build` trece fără erori
- [ ] Nici o culoare hardcoded (caută `#` în cod nou)
- [ ] Toate block-urile au `interfaceName`
- [ ] Toate câmpurile noi au default values
- [ ] Pattern `isDark` folosit pentru text pe background-uri
- [ ] Import types din `@/payload-types`
- [ ] Nici un `any` în TypeScript
- [ ] `cn()` folosit pentru class merging
- [ ] Verificare vizuală în browser

---

*Plan V4 - Cu librării React recomandate și best practices Payload CMS / Next.js.*
*Respectă sistemul de documentație MD și pattern-urile existente.*
*Pregătit pentru implementare.*
