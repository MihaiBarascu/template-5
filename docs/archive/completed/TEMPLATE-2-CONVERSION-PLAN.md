# Plan de Conversie: Template-2 (Transilvania Fitness) → Seed Template-5

> **Versiune:** 2.0 - Actualizat cu analiza detaliată a sistemelor
> **Data:** Decembrie 2025
> **Scop:** Replicarea exactă a template-2 doar prin configurații din seeder

---

## Obiectiv Principal

Replicarea **exactă** a design-ului și funcționalităților din template-2 (Transilvania Fitness) folosind **doar configurații din seeder** în template-5.

**Principii cheie:**

1. **Zero modificări breaking** - celelalte business-uri nu sunt afectate
2. **Tot ce adăugăm e reutilizabil** - beneficiază și alte business-uri
3. **Configurabil din seeder** - fără hardcoding în componente

---

## Analiză Comparativă Detaliată

### Template-5 - Ce EXISTĂ deja:

| Categorie               | Detalii                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| **Culori**              | 9 CSS variables: primary, secondary, accent, dark, light, surface, text, textLight, border |
| **Border Radius**       | 5 presets: none (0), small (4px), medium (8px), large (16px), full (50px)                  |
| **Shadows**             | 4 presets: none, subtle, moderate, strong                                                  |
| **Spacing**             | 3 presets: compact (48px), normal (80px), spacious (120px)                                 |
| **Fonturi Heading**     | 14 opțiuni Google Fonts (Inter, Playfair, Montserrat, etc.)                                |
| **Fonturi Body**        | 14 opțiuni Google Fonts                                                                    |
| **Container Width**     | 4 opțiuni: 1024px, 1280px, 1400px, 1600px                                                  |
| **Blocuri cu variante** | 28+ blocuri, fiecare cu 3-7 variante                                                       |
| **Design Variants**     | 40 variante (8 business × 5 variante fiecare)                                              |

### Template-2 - Ce trebuie REPLICAT:

| Element              | Valoare Template-2               | Stare în Template-5             |
| -------------------- | -------------------------------- | ------------------------------- |
| **Primary Color**    | `#f13a11` (portocaliu)           | ❌ Lipsește varianta            |
| **Dark Color**       | `#171819` (negru)                | ✅ Disponibil                   |
| **Border Radius**    | 2px (foarte mic)                 | ⚠️ Cel mai mic e 4px            |
| **Button Padding**   | 24px × 24px                      | ❌ Lipsește opțiune             |
| **Button Uppercase** | `text-transform: uppercase`      | ❌ Lipsește                     |
| **Letter Spacing**   | 0.5px pe butoane                 | ❌ Lipsește                     |
| **Heading Weight**   | 700 (bold)                       | ✅ Disponibil                   |
| **Hero Overlay**     | 85% opacitate                    | ⚠️ Parțial                      |
| **Font**             | Plain (custom)                   | ❌ Lipsește (Work Sans similar) |
| **Clase Fitness**    | Colecție cu schedule             | ❌ Lipsește                     |
| **Abonamente**       | Colecție cu features + highlight | ❌ Lipsește                     |

---

## Fișiere Cheie de Modificat

### Sistemul de Teme

| Fișier                     | Locație                                | Ce modificăm                                            |
| -------------------------- | -------------------------------------- | ------------------------------------------------------- |
| **SiteTheme.ts**           | `src/globals/SiteTheme.ts`             | Adăugare tab-uri noi: Typography Advanced, Button Style |
| **generateThemeStyles.ts** | `src/utilities/generateThemeStyles.ts` | Generare CSS variables noi                              |
| **ThemeProvider.tsx**      | `src/providers/ThemeProvider.tsx`      | Aplicare runtime a variabilelor noi                     |
| **globals.css**            | `src/app/(frontend)/globals.css`       | Valori default pentru variabile noi                     |
| **theme-presets.ts**       | `src/config/theme-presets.ts`          | Opțiuni noi pentru select-uri                           |
| **design-variants.ts**     | `src/seed/design-variants.ts`          | Varianta "fitness-orange"                               |

### Colecții Noi

| Fișier               | Locație                            | Descriere                                      |
| -------------------- | ---------------------------------- | ---------------------------------------------- |
| **Classes.ts**       | `src/collections/Classes.ts`       | Clase fitness cu schedule, trainer, difficulty |
| **Subscriptions.ts** | `src/collections/Subscriptions.ts` | Abonamente cu features, highlighting, CTA      |

### Blocuri Noi

| Fișier                | Locație                         | Descriere                  |
| --------------------- | ------------------------------- | -------------------------- |
| **ScheduleTable**     | `src/blocks/ScheduleTable/`     | Orar clase săptămânal      |
| **SubscriptionCards** | `src/blocks/SubscriptionCards/` | Grid abonamente cu overlay |
| **ClassesGrid**       | `src/blocks/ClassesGrid/`       | Grid clase fitness         |

### Seeder

| Fișier           | Locație                          | Descriere                                   |
| ---------------- | -------------------------------- | ------------------------------------------- |
| **fitness.ts**   | `src/seed/businesses/fitness.ts` | Seeder principal                            |
| **seed-data.ts** | `src/seed/seed-data.ts`          | Date fitness                                |
| **helpers.ts**   | `src/seed/helpers.ts`            | Funcții noi: seedClasses, seedSubscriptions |

---

## FAZA 1: Extindere Sistem de Teme

### 1.1 Typography Advanced (SiteTheme.ts)

**Locație:** `src/globals/SiteTheme.ts` - după TAB 4 (Fonturi)

```typescript
// TAB 5: TIPOGRAFIE AVANSATĂ
{
  label: 'Tipografie Avansată',
  description: 'Configurări detaliate pentru tipografie (opțional)',
  fields: [
    {
      name: 'useAdvancedTypography',
      type: 'checkbox',
      label: 'Activează setări avansate',
      defaultValue: false,
    },
    {
      type: 'row',
      admin: { condition: (_, siblingData) => siblingData?.useAdvancedTypography },
      fields: [
        {
          name: 'letterSpacing',
          type: 'select',
          label: 'Letter Spacing',
          admin: { width: '33%' },
          options: [
            { label: 'Tight (-0.5px)', value: 'tight' },
            { label: 'Normal (0)', value: 'normal' },
            { label: 'Wide (0.5px)', value: 'wide' },
            { label: 'Wider (1px)', value: 'wider' },
          ],
          defaultValue: 'normal',
        },
        {
          name: 'headingLineHeight',
          type: 'select',
          label: 'Line Height Titluri',
          admin: { width: '33%' },
          options: [
            { label: '1.1 (Compact)', value: '1.1' },
            { label: '1.2 (Normal)', value: '1.2' },
            { label: '1.3 (Spațios)', value: '1.3' },
          ],
          defaultValue: '1.2',
        },
        {
          name: 'bodyLineHeight',
          type: 'select',
          label: 'Line Height Text',
          admin: { width: '33%' },
          options: [
            { label: '1.5 (Compact)', value: '1.5' },
            { label: '1.6 (Normal)', value: '1.6' },
            { label: '1.8 (Spațios)', value: '1.8' },
          ],
          defaultValue: '1.6',
        },
      ],
    },
  ],
},
```

### 1.2 Button Style (SiteTheme.ts)

**Locație:** `src/globals/SiteTheme.ts` - după Typography Advanced

```typescript
// TAB 6: STIL BUTOANE
{
  label: 'Stil Butoane',
  description: 'Personalizare aspect butoane (opțional)',
  fields: [
    {
      name: 'useCustomButtons',
      type: 'checkbox',
      label: 'Activează setări butoane',
      defaultValue: false,
    },
    {
      type: 'row',
      admin: { condition: (_, siblingData) => siblingData?.useCustomButtons },
      fields: [
        {
          name: 'buttonPadding',
          type: 'select',
          label: 'Padding Buton',
          admin: { width: '33%' },
          options: [
            { label: 'Compact (8px 16px)', value: 'compact' },
            { label: 'Normal (12px 24px)', value: 'normal' },
            { label: 'Large (16px 32px)', value: 'large' },
            { label: 'XL (24px 40px)', value: 'xl' },  // Template-2
          ],
          defaultValue: 'normal',
        },
        {
          name: 'buttonTextTransform',
          type: 'select',
          label: 'Text Transform',
          admin: { width: '33%' },
          options: [
            { label: 'None', value: 'none' },
            { label: 'Uppercase', value: 'uppercase' },  // Template-2
            { label: 'Capitalize', value: 'capitalize' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'buttonFontWeight',
          type: 'select',
          label: 'Font Weight',
          admin: { width: '33%' },
          options: [
            { label: 'Normal (400)', value: '400' },
            { label: 'Medium (500)', value: '500' },
            { label: 'Semibold (600)', value: '600' },
            { label: 'Bold (700)', value: '700' },  // Template-2
          ],
          defaultValue: '600',
        },
      ],
    },
  ],
},
```

### 1.3 Extindere generateThemeStyles.ts

**Locație:** `src/utilities/generateThemeStyles.ts`

**Adăugare presets (după linia ~229):**

```typescript
// Typography presets
const letterSpacingMap = {
  tight: '-0.5px',
  normal: '0',
  wide: '0.5px',
  wider: '1px',
};

// Button presets
const buttonPaddingMap = {
  compact: { y: '8px', x: '16px' },
  normal: { y: '12px', x: '24px' },
  large: { y: '16px', x: '32px' },
  xl: { y: '24px', x: '40px' },
};
```

**Adăugare în funcția generateThemeStyles (linia ~273):**

```typescript
// Extract advanced typography
const letterSpacing = siteTheme?.useAdvancedTypography
  ? letterSpacingMap[siteTheme?.letterSpacing || 'normal']
  : '0';
const headingLineHeight = siteTheme?.useAdvancedTypography
  ? siteTheme?.headingLineHeight || '1.2'
  : '1.2';
const bodyLineHeight = siteTheme?.useAdvancedTypography
  ? siteTheme?.bodyLineHeight || '1.6'
  : '1.6';

// Extract button styles
const buttonPadding = siteTheme?.useCustomButtons
  ? buttonPaddingMap[siteTheme?.buttonPadding || 'normal']
  : buttonPaddingMap.normal;
const buttonTextTransform = siteTheme?.useCustomButtons
  ? siteTheme?.buttonTextTransform || 'none'
  : 'none';
const buttonFontWeight = siteTheme?.useCustomButtons
  ? siteTheme?.buttonFontWeight || '600'
  : '600';
```

**Adăugare CSS variables în return string:**

```typescript
return `
  :root {
    /* ... variabile existente ... */

    /* Typography Advanced */
    --letter-spacing: ${letterSpacing};
    --heading-line-height: ${headingLineHeight};
    --body-line-height: ${bodyLineHeight};

    /* Button Styles */
    --btn-padding-y: ${buttonPadding.y};
    --btn-padding-x: ${buttonPadding.x};
    --btn-text-transform: ${buttonTextTransform};
    --btn-font-weight: ${buttonFontWeight};
  }
`.trim();
```

### 1.4 Actualizare globals.css

**Locație:** `src/app/(frontend)/globals.css`

**Adăugare defaults în :root:**

```css
:root {
  /* ... existente ... */

  /* Typography Advanced - Defaults */
  --letter-spacing: 0;
  --heading-line-height: 1.2;
  --body-line-height: 1.6;

  /* Button Styles - Defaults */
  --btn-padding-y: 12px;
  --btn-padding-x: 24px;
  --btn-text-transform: none;
  --btn-font-weight: 600;
}
```

**Aplicare în @layer base:**

```css
@layer base {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: var(--heading-line-height);
    letter-spacing: var(--letter-spacing);
  }

  body,
  p {
    line-height: var(--body-line-height);
  }
}

@layer components {
  .btn,
  button[type='submit'],
  .custom-btn {
    padding: var(--btn-padding-y) var(--btn-padding-x);
    text-transform: var(--btn-text-transform);
    font-weight: var(--btn-font-weight);
  }
}
```

### 1.5 Actualizare ThemeProvider.tsx

**Locație:** `src/providers/ThemeProvider.tsx` - în useEffect

```typescript
// Typography Advanced
const letterSpacing = siteTheme?.useAdvancedTypography
  ? letterSpacingMap[siteTheme?.letterSpacing || 'normal']
  : '0';
root.style.setProperty('--letter-spacing', letterSpacing);
root.style.setProperty(
  '--heading-line-height',
  siteTheme?.headingLineHeight || '1.2',
);
root.style.setProperty(
  '--body-line-height',
  siteTheme?.bodyLineHeight || '1.6',
);

// Button Styles
const btnPadding = buttonPaddingMap[siteTheme?.buttonPadding || 'normal'];
root.style.setProperty('--btn-padding-y', btnPadding.y);
root.style.setProperty('--btn-padding-x', btnPadding.x);
root.style.setProperty(
  '--btn-text-transform',
  siteTheme?.buttonTextTransform || 'none',
);
root.style.setProperty(
  '--btn-font-weight',
  siteTheme?.buttonFontWeight || '600',
);
```

---

## FAZA 2: Tema "Fitness Orange"

### 2.1 Adăugare în design-variants.ts

**Locație:** `src/seed/design-variants.ts` - în THEME_VARIANTS

```typescript
// FITNESS / GYM VARIANTS
{
  id: 'fitness-orange',
  name: 'Fitness Orange & Dark',
  description: 'Vibrant fitness theme - portocaliu energic pe fundal închis',
  theme: {
    preset: 'bold',
    colors: {
      primary: '#f13a11',      // Portocaliu vibrant (exact Template-2)
      secondary: '#171819',    // Negru
      accent: '#f97316',       // Portocaliu secundar
      dark: '#171819',
      light: '#ffffff',
      surface: '#f9f9f9',
      text: '#171819',
      textLight: '#666262',    // Gri (exact Template-2)
      border: '#e5e5e5',
    },
    fontPreset: 'bold',        // Montserrat sau Work Sans
    stylePreset: 'bold',
    borderRadius: 'small',     // 4px (cel mai apropiat de 2px)
    shadows: 'subtle',
  },
  hero: {
    type: 'fullscreen',
    overlay: 'dark',           // 85% opacity
    alignment: 'center',
  },
  layout: {
    sections: ['hero', 'stats', 'classes', 'team', 'pricing', 'schedule', 'testimonials', 'faq', 'cta', 'contact'],
    servicesVariant: 'grid-3',
    teamVariant: 'grid-centered',
    testimonialsVariant: 'carousel',
    galleryVariant: 'grid-3',
    pricingVariant: 'cards-3',
  },
},
```

### 2.2 Adăugare în SiteTheme variant options

**Locație:** `src/globals/SiteTheme.ts` - în variant select

```typescript
{
  name: 'variant',
  type: 'select',
  options: [
    // ... existente ...
    { label: 'Fitness Orange & Dark', value: 'fitness-orange' },
  ],
}
```

### 2.3 Mapare în generateThemeStyles.ts

**Locație:** `src/utilities/generateThemeStyles.ts` - în THEME_VARIANTS object

```typescript
'fitness-orange': {
  colors: {
    primary: '#f13a11',
    secondary: '#171819',
    accent: '#f97316',
    dark: '#171819',
    light: '#ffffff',
    surface: '#f9f9f9',
    text: '#171819',
    textLight: '#666262',
    border: '#e5e5e5',
  },
  fonts: {
    heading: "'Work Sans', sans-serif",  // Similar cu Plain
    body: "'Work Sans', sans-serif",
  },
  borderRadius: 'small',
  shadows: 'subtle',
},
```

---

## FAZA 3: Colecții Noi

### 3.1 Classes.ts (Clase Fitness)

**Fișier nou:** `src/collections/Classes.ts`

```typescript
import type { CollectionConfig } from 'payload';
import { anyone, authenticated } from '@/access';
import { slugField } from '@/fields/slug';

export const Classes: CollectionConfig = {
  slug: 'classes',
  labels: {
    singular: 'Clasă Fitness',
    plural: 'Clase Fitness',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'difficulty', 'trainer', 'duration'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Denumire Clasă',
      required: true,
    },
    slugField('title'),
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Descriere scurtă',
      maxLength: 300,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Descriere detaliată',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (Lucide)',
      admin: {
        description: 'Ex: Dumbbell, Heart, Flame, Bike',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          label: 'Categorie',
          admin: { width: '50%' },
          required: true,
          options: [
            { label: 'Cardio', value: 'cardio' },
            { label: 'Forță', value: 'strength' },
            { label: 'Flexibilitate', value: 'flexibility' },
            { label: 'Mind & Body', value: 'mind-body' },
            { label: 'Combat', value: 'combat' },
            { label: 'Dans', value: 'dance' },
            { label: 'HIIT', value: 'hiit' },
            { label: 'Cycling', value: 'cycling' },
          ],
        },
        {
          name: 'difficulty',
          type: 'select',
          label: 'Dificultate',
          admin: { width: '50%' },
          required: true,
          options: [
            { label: 'Începător', value: 'beginner' },
            { label: 'Intermediar', value: 'intermediate' },
            { label: 'Avansat', value: 'advanced' },
            { label: 'Toate nivelurile', value: 'all-levels' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'duration',
          type: 'number',
          label: 'Durată (min)',
          min: 15,
          max: 180,
          defaultValue: 60,
          admin: { width: '33%' },
        },
        {
          name: 'capacity',
          type: 'number',
          label: 'Capacitate',
          defaultValue: 20,
          admin: { width: '33%' },
        },
        {
          name: 'caloriesBurned',
          type: 'number',
          label: 'Calorii arse',
          admin: { width: '33%', description: 'Estimat per sesiune' },
        },
      ],
    },
    {
      name: 'trainer',
      type: 'relationship',
      relationTo: 'team',
      label: 'Antrenor',
    },
    {
      name: 'schedule',
      type: 'array',
      label: 'Program săptămânal',
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            { label: 'Luni', value: 'monday' },
            { label: 'Marți', value: 'tuesday' },
            { label: 'Miercuri', value: 'wednesday' },
            { label: 'Joi', value: 'thursday' },
            { label: 'Vineri', value: 'friday' },
            { label: 'Sâmbătă', value: 'saturday' },
            { label: 'Duminică', value: 'sunday' },
          ],
        },
        {
          name: 'startTime',
          type: 'text',
          required: true,
          admin: { placeholder: '18:00' },
        },
        {
          name: 'endTime',
          type: 'text',
          admin: { placeholder: '19:00' },
        },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Prețuri',
      fields: [
        { name: 'dropIn', type: 'number', label: 'Preț/ședință (RON)' },
        { name: 'monthly', type: 'number', label: 'Abonament lunar (RON)' },
        {
          name: 'package',
          type: 'group',
          label: 'Pachet ședințe',
          fields: [
            { name: 'sessions', type: 'number', label: 'Număr ședințe' },
            { name: 'price', type: 'number', label: 'Preț pachet (RON)' },
          ],
        },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Beneficii',
      fields: [{ name: 'benefit', type: 'text', required: true }],
    },
    {
      name: 'requirements',
      type: 'textarea',
      label: 'Echipament necesar',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Clasă populară',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Activă',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
};
```

### 3.2 Subscriptions.ts (Abonamente)

**Fișier nou:** `src/collections/Subscriptions.ts`

```typescript
import type { CollectionConfig } from 'payload';
import { anyone, authenticated } from '@/access';
import { slugField } from '@/fields/slug';

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  labels: {
    singular: 'Abonament',
    plural: 'Abonamente',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'price', 'highlighted', 'order'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Nume abonament',
      required: true,
    },
    slugField('title'),
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitlu',
      admin: { placeholder: 'Ex: "8 ședințe", "Nelimitat"' },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descriere',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine (pentru carduri cu overlay)',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tip abonament',
      required: true,
      defaultValue: 'gym',
      options: [
        { label: 'Sală / GYM', value: 'gym' },
        { label: 'SPA', value: 'spa' },
        { label: 'Solar', value: 'solar' },
        { label: 'Fitness + SPA', value: 'fitness-spa' },
        { label: 'Clase', value: 'classes' },
        { label: 'Personal Training', value: 'personal' },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Preț',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'amount',
              type: 'number',
              required: true,
              label: 'Sumă',
              admin: { width: '33%' },
            },
            {
              name: 'currency',
              type: 'text',
              defaultValue: 'RON',
              admin: { width: '33%' },
            },
            {
              name: 'period',
              type: 'text',
              defaultValue: '/lună',
              admin: { width: '33%', placeholder: '/lună, /an, /ședință' },
            },
          ],
        },
        {
          name: 'oldPrice',
          type: 'number',
          label: 'Preț vechi (pentru reduceri)',
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Beneficii incluse',
      fields: [
        { name: 'text', type: 'text', required: true },
        {
          name: 'included',
          type: 'checkbox',
          defaultValue: true,
          label: 'Inclus (✓) sau Nu (✗)',
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Buton acțiune',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Contactează-ne',
        },
        {
          name: 'linkType',
          type: 'radio',
          defaultValue: 'custom',
          options: [
            { label: 'Pagină internă', value: 'page' },
            { label: 'URL custom', value: 'custom' },
          ],
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'page',
          },
        },
        {
          name: 'url',
          type: 'text',
          defaultValue: '/contact',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'custom',
          },
        },
      ],
    },
    {
      name: 'highlighted',
      type: 'checkbox',
      label: 'Evidențiat (Popular)',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'highlightLabel',
      type: 'text',
      defaultValue: 'Popular',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.highlighted,
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
};
```

### 3.3 Înregistrare Colecții

**Modificare:** `src/payload.config.ts`

```typescript
import { Classes } from './collections/Classes';
import { Subscriptions } from './collections/Subscriptions';

export default buildConfig({
  collections: [
    // ... existente ...
    Classes,
    Subscriptions,
  ],
});
```

**După adăugare, rulează:**

```bash
pnpm generate:types
```

---

## FAZA 4: Blocuri Noi

### 4.1 Pattern de Implementare Blocuri

Fiecare bloc nou urmează structura:

```
src/blocks/[BlockName]/
├── config.ts      # Configurația Payload
└── Component.tsx  # Componenta React
```

**Pattern Component.tsx:**

```typescript
export function BlockName({ variant = 'grid', ...props }: BlockNameProps) {
  // Varianta 1
  if (variant === 'list') {
    return <section>...</section>
  }

  // Varianta 2
  if (variant === 'carousel') {
    return <section>...</section>
  }

  // Default (grid)
  return <section>...</section>
}
```

### 4.2 ScheduleTable Block

**Fișier:** `src/blocks/ScheduleTable/config.ts`

```typescript
import type { Block } from 'payload';

export const ScheduleTable: Block = {
  slug: 'scheduleTable',
  interfaceName: 'ScheduleTableBlock',
  labels: { singular: 'Schedule Table', plural: 'Schedule Tables' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Program Clase' },
    { name: 'subheading', type: 'text' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'full-week',
      options: [
        { label: 'Grid Săptămânal', value: 'full-week' },
        { label: 'Listă Compactă', value: 'compact' },
        { label: 'Tabs pe Zile', value: 'tabs' },
        { label: 'Timeline', value: 'timeline' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Din Colecția Clase', value: 'collection' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'customSchedule',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
      fields: [
        { name: 'time', type: 'text', required: true },
        { name: 'monday', type: 'text' },
        { name: 'tuesday', type: 'text' },
        { name: 'wednesday', type: 'text' },
        { name: 'thursday', type: 'text' },
        { name: 'friday', type: 'text' },
        { name: 'saturday', type: 'text' },
        { name: 'sunday', type: 'text' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Primary', value: 'primary' },
      ],
    },
  ],
};
```

### 4.3 SubscriptionCards Block

**Fișier:** `src/blocks/SubscriptionCards/config.ts`

```typescript
import type { Block } from 'payload';

export const SubscriptionCards: Block = {
  slug: 'subscriptionCards',
  interfaceName: 'SubscriptionCardsBlock',
  labels: { singular: 'Subscription Cards', plural: 'Subscription Cards' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Abonamente' },
    { name: 'subheading', type: 'text' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'overlay',
      options: [
        { label: 'Cu Overlay Imagine', value: 'overlay' },
        { label: 'Carduri Simple', value: 'simple' },
        { label: 'Featured Center', value: 'featured-center' },
        { label: 'Tabel Comparativ', value: 'table' },
      ],
    },
    {
      name: 'filterByType',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'GYM', value: 'gym' },
        { label: 'SPA', value: 'spa' },
        { label: 'Solar', value: 'solar' },
        { label: 'Fitness + SPA', value: 'fitness-spa' },
        { label: 'Clase', value: 'classes' },
        { label: 'Personal', value: 'personal' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Coloane', value: '2' },
        { label: '3 Coloane', value: '3' },
        { label: '4 Coloane', value: '4' },
      ],
    },
    { name: 'showBadge', type: 'checkbox', defaultValue: true },
    { name: 'showOldPrice', type: 'checkbox', defaultValue: true },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
};
```

### 4.4 ClassesGrid Block

**Fișier:** `src/blocks/ClassesGrid/config.ts`

```typescript
import type { Block } from 'payload';

export const ClassesGrid: Block = {
  slug: 'classesGrid',
  interfaceName: 'ClassesGridBlock',
  labels: { singular: 'Classes Grid', plural: 'Classes Grids' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Clasele Noastre' },
    { name: 'subheading', type: 'text' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid Carduri', value: 'grid' },
        { label: 'Listă', value: 'list' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Masonry', value: 'masonry' },
      ],
    },
    {
      name: 'filterByCategory',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Cardio', value: 'cardio' },
        { label: 'Forță', value: 'strength' },
        { label: 'Flexibilitate', value: 'flexibility' },
        { label: 'Mind & Body', value: 'mind-body' },
        { label: 'Combat', value: 'combat' },
        { label: 'Dans', value: 'dance' },
        { label: 'HIIT', value: 'hiit' },
        { label: 'Cycling', value: 'cycling' },
      ],
    },
    { name: 'showDifficulty', type: 'checkbox', defaultValue: true },
    { name: 'showDuration', type: 'checkbox', defaultValue: true },
    { name: 'showTrainer', type: 'checkbox', defaultValue: true },
    { name: 'showPrice', type: 'checkbox', defaultValue: true },
    { name: 'limit', type: 'number', defaultValue: 6 },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Coloane', value: '2' },
        { label: '3 Coloane', value: '3' },
        { label: '4 Coloane', value: '4' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
};
```

### 4.5 Înregistrare Blocuri în Pages

**Modificare:** `src/collections/Pages.ts` - în blocks array

```typescript
import { ScheduleTable } from '@/blocks/ScheduleTable/config';
import { SubscriptionCards } from '@/blocks/SubscriptionCards/config';
import { ClassesGrid } from '@/blocks/ClassesGrid/config';

// În blocks field:
blocks: [
  // ... existente ...
  ScheduleTable,
  SubscriptionCards,
  ClassesGrid,
];
```

### 4.6 Adăugare în RenderBlocks.tsx

**Modificare:** `src/blocks/RenderBlocks.tsx`

```typescript
import { ScheduleTableBlock } from '@/blocks/ScheduleTable/Component';
import { SubscriptionCardsBlock } from '@/blocks/SubscriptionCards/Component';
import { ClassesGridBlock } from '@/blocks/ClassesGrid/Component';

const blockComponents = {
  // ... existente ...
  scheduleTable: ScheduleTableBlock,
  subscriptionCards: SubscriptionCardsBlock,
  classesGrid: ClassesGridBlock,
};
```

---

## FAZA 5: Variante Noi pentru Blocuri Existente

### 5.1 Team Block - Variantă "centered-portrait"

**Modificare:** `src/blocks/Team/config.ts`

```typescript
{
  name: 'variant',
  type: 'select',
  options: [
    // ... existente ...
    { label: 'Centered Portrait (Fitness)', value: 'centered-portrait' },
  ],
}
```

**Adăugare în Component.tsx:**

```typescript
if (variant === 'centered-portrait') {
  return (
    <section className={cn('py-section', bgClasses[backgroundColor])}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && <h2 className="text-3xl font-bold">{heading}</h2>}
            {subheading && <p className="text-theme-text-light mt-2">{subheading}</p>}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-8">
          {members.map((member) => (
            <div key={member.id} className="w-[280px] text-center group">
              <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4">
                {member.image && (
                  <Image
                    src={getImageUrl(member.image)}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              {showRole && (
                <p className="text-theme-primary">{member.role}</p>
              )}
              {member.excerpt && (
                <p className="text-theme-text-light text-sm mt-2 line-clamp-2">
                  {member.excerpt}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 5.2 Pricing Block - Variantă "overlay-image"

**Modificare:** `src/blocks/Pricing/config.ts`

```typescript
{
  name: 'variant',
  options: [
    // ... existente ...
    { label: 'Image Overlay (Fitness)', value: 'overlay-image' },
  ],
}
```

---

## FAZA 6: Seeder Fitness

### 6.1 Fișier Principal

**Fișier nou:** `src/seed/businesses/fitness.ts`

```typescript
import type { Payload } from 'payload';
import {
  createAdminUser,
  seedSiteTheme,
  seedBusinessInfo,
  seedLogo,
  seedHeader,
  seedFooter,
  seedTeam,
  seedTestimonials,
  seedFAQ,
  seedHomePage,
  uploadLocalSeedImages,
} from '../helpers';
import { fitnessData, fitnessImages } from '../seed-data';
import { getVariant } from '../design-variants';

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10);

export async function seedFitness(payload: Payload): Promise<void> {
  const variant = getVariant('fitness', VARIANT_INDEX);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏋️ Seeding: FITNESS / GYM');
  console.log(`🎨 Design Variant: ${variant.name}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 1. Admin User
  await createAdminUser(payload);

  // 2. Upload Images
  console.log('📸 Uploading images...');
  const allImages = [
    ...fitnessImages.hero,
    ...fitnessImages.team,
    ...fitnessImages.classes,
    ...fitnessImages.subscriptions,
    ...fitnessImages.gallery,
  ];
  const imageMap = await uploadLocalSeedImages(payload, allImages);
  const getImageId = (filename: string) => imageMap.get(filename);

  // 3. Site Theme - FITNESS ORANGE + Custom Settings
  console.log('🎨 Configuring theme...');
  await seedSiteTheme(payload, {
    variant: 'fitness-orange',
    borderRadius: 'small',
    shadows: 'subtle',
    sectionSpacing: 'spacious',
    containerWidth: '1280',
    // Typography Advanced (Template-2 style)
    useAdvancedTypography: true,
    letterSpacing: 'wide',
    headingLineHeight: '1.2',
    bodyLineHeight: '1.6',
    // Button Style (Template-2 style)
    useCustomButtons: true,
    buttonPadding: 'xl',
    buttonTextTransform: 'uppercase',
    buttonFontWeight: '700',
  });

  // 4. Business Info
  console.log('🏪 Setting business info...');
  await seedBusinessInfo(payload, fitnessData.business);

  // 5. Logo
  console.log('🏷️ Setting logo...');
  await seedLogo(payload, {
    type: 'text',
    text: 'Transilvania Fitness',
  });

  // 6. Header
  console.log('📋 Setting header...');
  await seedHeader(payload, {
    variant: 'standard',
    navItems: fitnessData.navigation,
    ctaButton: {
      enabled: true,
      label: 'Începe Acum',
      link: '/contact',
      variant: 'default',
    },
  });

  // 7. Footer
  console.log('📋 Setting footer...');
  await seedFooter(payload, fitnessData.footer);

  // 8. Team (Trainers)
  console.log('👥 Creating trainers...');
  const teamWithImages = fitnessData.team.map((member, idx) => ({
    ...member,
    imageId: getImageId(fitnessImages.team[idx]?.filename),
  }));
  await seedTeam(payload, teamWithImages);

  // 9. Classes
  console.log('🏃 Creating fitness classes...');
  await seedClasses(payload, fitnessData.classes, imageMap);

  // 10. Subscriptions
  console.log('💳 Creating subscriptions...');
  await seedSubscriptions(payload, fitnessData.subscriptions, imageMap);

  // 11. Testimonials
  console.log('⭐ Creating testimonials...');
  await seedTestimonials(payload, fitnessData.testimonials);

  // 12. FAQ
  console.log('❓ Creating FAQ...');
  await seedFAQ(payload, fitnessData.faq);

  // 13. Homepage
  console.log('🏠 Creating homepage...');
  const heroImageId = getImageId(fitnessImages.hero[0]?.filename);
  await seedHomePage(payload, {
    heroType: 'fullscreen',
    hero: {
      headline: 'Transformă-ți Corpul și Mintea',
      subheadline:
        'Alătură-te celei mai moderne săli de fitness din Cluj-Napoca',
      ctaButtons: [
        { label: 'Începe Acum', link: '/contact', variant: 'default' },
        { label: 'Vezi Abonamente', link: '/abonamente', variant: 'outline' },
      ],
      imageId: heroImageId,
      overlayOpacity: '0.85',
    },
    layout: buildHomepageLayout(variant),
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ FITNESS seeding complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

function buildHomepageLayout(variant: any) {
  return [
    { blockType: 'stats', variant: 'cards', source: 'businessInfo' },
    {
      blockType: 'classesGrid',
      variant: 'grid',
      columns: '3',
      limit: 6,
      heading: 'Clasele Noastre',
    },
    {
      blockType: 'team',
      variant: 'centered-portrait',
      heading: 'Antrenorii Noștri',
    },
    {
      blockType: 'subscriptionCards',
      variant: 'overlay',
      filterByType: ['gym'],
      heading: 'Abonamente',
    },
    {
      blockType: 'scheduleTable',
      variant: 'full-week',
      source: 'collection',
      heading: 'Program Clase',
    },
    {
      blockType: 'testimonials',
      variant: 'carousel',
      heading: 'Ce Spun Membrii Noștri',
    },
    { blockType: 'faq', variant: 'accordion', heading: 'Întrebări Frecvente' },
    { blockType: 'cta', variant: 'large' },
    { blockType: 'contact', variant: 'both' },
  ];
}

// Helper pentru clase fitness
async function seedClasses(
  payload: Payload,
  classesData: any[],
  imageMap: Map<string, string>,
) {
  const trainers = await payload.find({ collection: 'team', limit: 100 });

  for (let i = 0; i < classesData.length; i++) {
    const cls = classesData[i];
    const trainer = trainers.docs.find(t => t.name === cls.trainerName);

    await payload.create({
      collection: 'classes',
      data: {
        title: cls.title,
        slug: cls.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        shortDescription: cls.description,
        category: cls.category,
        difficulty: cls.difficulty,
        duration: cls.duration,
        capacity: cls.capacity,
        trainer: trainer?.id,
        schedule: cls.schedule,
        pricing: cls.pricing,
        benefits: cls.benefits?.map((b: string) => ({ benefit: b })),
        requirements: cls.requirements,
        image: imageMap.get(fitnessImages.classes[i]?.filename),
        featured: cls.featured || false,
        active: true,
      },
    });
  }
  console.log(`   ✓ Created ${classesData.length} classes`);
}

// Helper pentru abonamente
async function seedSubscriptions(
  payload: Payload,
  subsData: any[],
  imageMap: Map<string, string>,
) {
  for (let i = 0; i < subsData.length; i++) {
    const sub = subsData[i];

    await payload.create({
      collection: 'subscriptions',
      data: {
        title: sub.title,
        slug: sub.title.toLowerCase().replace(/\s+/g, '-'),
        subtitle: sub.subtitle,
        type: sub.type,
        pricing: sub.pricing,
        features: sub.features,
        cta: {
          label: sub.cta?.label || 'Contactează-ne',
          linkType: 'custom',
          url: sub.cta?.url || '/contact',
        },
        highlighted: sub.highlighted || false,
        highlightLabel: sub.highlightLabel,
        order: sub.order || i,
        image:
          sub.imageIndex !== undefined
            ? imageMap.get(
                fitnessImages.subscriptions[sub.imageIndex]?.filename,
              )
            : undefined,
        active: true,
      },
    });
  }
  console.log(`   ✓ Created ${subsData.length} subscriptions`);
}
```

### 6.2 Date Fitness în seed-data.ts

**Adăugare în:** `src/seed/seed-data.ts`

```typescript
// ============================================
// FITNESS / GYM DATA
// ============================================

export const fitnessImages = {
  hero: [
    { filename: 'fitness/hero/gym-hero-1.jpg', alt: 'Sala de fitness moderna' },
  ],
  team: [
    { filename: 'fitness/team/trainer-1.jpg', alt: 'Antrenor fitness' },
    { filename: 'fitness/team/trainer-2.jpg', alt: 'Instructor yoga' },
    { filename: 'fitness/team/trainer-3.jpg', alt: 'Coach CrossFit' },
  ],
  classes: [
    { filename: 'fitness/classes/yoga.jpg', alt: 'Clasa de yoga' },
    { filename: 'fitness/classes/crossfit.jpg', alt: 'Antrenament CrossFit' },
    { filename: 'fitness/classes/spinning.jpg', alt: 'Clasa de spinning' },
  ],
  subscriptions: [
    { filename: 'fitness/subscriptions/gym-basic.jpg', alt: 'Abonament Basic' },
    {
      filename: 'fitness/subscriptions/gym-premium.jpg',
      alt: 'Abonament Premium',
    },
    { filename: 'fitness/subscriptions/gym-vip.jpg', alt: 'Abonament VIP' },
  ],
  gallery: [],
};

export const fitnessData = {
  business: {
    name: 'Transilvania Fitness',
    tagline: 'Transformă-ți corpul și mintea',
    description:
      'Sala de fitness premium din Cluj-Napoca cu echipamente de ultima generatie si antrenori certificati.',
    yearEstablished: 2015,
    phone: '+40 264 123 456',
    email: 'contact@transilvaniafitness.ro',
    whatsapp: '+40 264 123 456',
    address: {
      street: 'Str. Motilor nr. 54',
      city: 'Cluj-Napoca',
      county: 'Cluj',
      postalCode: '400000',
      country: 'Romania',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '06:00 - 23:00' },
      { days: 'Sambata', hours: '08:00 - 21:00' },
      { days: 'Duminica', hours: '09:00 - 18:00' },
    ],
    social: {
      facebook: 'https://facebook.com/transilvaniafitness',
      instagram: 'https://instagram.com/transilvaniafitness',
      tiktok: 'https://tiktok.com/@transilvaniafitness',
      youtube: 'https://youtube.com/@transilvaniafitness',
    },
    stats: [
      { value: '10+', label: 'Ani experienta' },
      { value: '5000+', label: 'Membri activi' },
      { value: '50+', label: 'Clase pe saptamana' },
      { value: '20+', label: 'Antrenori certificati' },
    ],
  },

  navigation: [
    { label: 'Acasa', type: 'custom', url: '/' },
    { label: 'Clase', type: 'custom', url: '/clase' },
    { label: 'Antrenori', type: 'custom', url: '/echipa' },
    { label: 'Abonamente', type: 'custom', url: '/abonamente' },
    { label: 'Contact', type: 'custom', url: '/contact' },
  ],

  footer: {
    variant: 'columns-4',
    columns: [
      { title: 'Transilvania Fitness', type: 'text' },
      { title: 'Navigare', type: 'links' },
      { title: 'Program', type: 'schedule' },
      { title: 'Contact', type: 'contact' },
    ],
  },

  team: [
    {
      name: 'Alexandru Popescu',
      role: 'Head Trainer & Fondator',
      experience: 15,
      specializations: ['Culturism', 'Powerlifting', 'Fitness functional'],
      excerpt:
        'Cu peste 15 ani de experienta in industria fitness, Alexandru a antrenat sute de sportivi...',
      social: { instagram: 'https://instagram.com/alexfitness' },
    },
    {
      name: 'Maria Ionescu',
      role: 'Instructor Yoga & Pilates',
      experience: 8,
      specializations: ['Yoga', 'Pilates', 'Mindfulness'],
      excerpt:
        'Maria a descoperit yoga acum 10 ani si de atunci si-a dedicat viata acestei practici...',
      social: { instagram: 'https://instagram.com/mariayoga' },
    },
    {
      name: 'Andrei Munteanu',
      role: 'CrossFit Coach',
      experience: 6,
      specializations: ['CrossFit', 'HIIT', 'Kettlebell'],
      excerpt:
        'Fost atlet de performanta, Andrei aduce energia si disciplina in fiecare antrenament...',
      social: { instagram: 'https://instagram.com/andreicrossfit' },
    },
  ],

  classes: [
    {
      title: 'Yoga Flow',
      category: 'mind-body',
      difficulty: 'all-levels',
      duration: 60,
      capacity: 20,
      description:
        'Clasa de yoga pentru toate nivelurile, focusata pe respiratie si flexibilitate.',
      trainerName: 'Maria Ionescu',
      schedule: [
        { day: 'monday', startTime: '07:00' },
        { day: 'wednesday', startTime: '07:00' },
        { day: 'friday', startTime: '18:00' },
      ],
      pricing: { dropIn: 50, monthly: 350 },
      benefits: [
        'Imbunatateste flexibilitatea',
        'Reduce stresul',
        'Intareste muschii',
      ],
      featured: true,
    },
    {
      title: 'CrossFit WOD',
      category: 'hiit',
      difficulty: 'intermediate',
      duration: 45,
      capacity: 15,
      description:
        'Antrenament intens de tip CrossFit cu exercitii variate zilnic.',
      trainerName: 'Andrei Munteanu',
      schedule: [
        { day: 'monday', startTime: '18:00' },
        { day: 'tuesday', startTime: '18:00' },
        { day: 'thursday', startTime: '18:00' },
      ],
      pricing: { dropIn: 60, monthly: 450 },
      benefits: [
        'Ardere maxima de calorii',
        'Forta si rezistenta',
        'Comunitate motivanta',
      ],
      featured: true,
    },
    {
      title: 'Spinning Extreme',
      category: 'cycling',
      difficulty: 'advanced',
      duration: 50,
      capacity: 25,
      description: 'Clasa intensa de cycling indoor cu muzica energizanta.',
      schedule: [
        { day: 'tuesday', startTime: '19:00' },
        { day: 'thursday', startTime: '19:00' },
        { day: 'saturday', startTime: '10:00' },
      ],
      pricing: { dropIn: 45, monthly: 320 },
      benefits: ['Cardio intens', 'Tonifiere picioare', 'Energie maxima'],
    },
  ],

  subscriptions: [
    {
      title: 'Basic',
      subtitle: 'Acces sala',
      type: 'gym',
      pricing: { amount: 150, period: '/luna' },
      features: [
        { text: 'Acces la echipamente', included: true },
        { text: 'Vestiare si dusuri', included: true },
        { text: 'Clase de grup', included: false },
        { text: 'Antrenor personal', included: false },
      ],
      order: 1,
    },
    {
      title: 'Premium',
      subtitle: 'Cel mai popular',
      type: 'gym',
      pricing: { amount: 250, period: '/luna', oldPrice: 300 },
      features: [
        { text: 'Acces nelimitat la sala', included: true },
        { text: 'Toate clasele de grup', included: true },
        { text: 'Evaluare fitness', included: true },
        { text: 'Antrenor personal', included: false },
      ],
      highlighted: true,
      highlightLabel: 'Popular',
      order: 2,
    },
    {
      title: 'VIP',
      subtitle: 'Experienta completa',
      type: 'gym',
      pricing: { amount: 450, period: '/luna' },
      features: [
        { text: 'Tot ce include Premium', included: true },
        { text: '4 sedinte antrenor personal', included: true },
        { text: 'Acces SPA & Sauna', included: true },
        { text: 'Suplimente post-workout', included: true },
      ],
      order: 3,
    },
  ],

  testimonials: [
    {
      name: 'Andreea M.',
      role: 'Membra de 2 ani',
      content:
        'Am slabit 20 kg in 6 luni cu ajutorul antrenorilor de aici. Cea mai buna decizie!',
      rating: 5,
      featured: true,
    },
    {
      name: 'Mihai D.',
      role: 'Membru de 1 an',
      content:
        'Clasele de CrossFit sunt incredibile! Atmosfera si comunitatea te motiveaza enorm.',
      rating: 5,
    },
  ],

  faq: [
    {
      question: 'Care este programul salii?',
      answer:
        'Suntem deschisi Luni-Vineri 06:00-23:00, Sambata 08:00-21:00, Duminica 09:00-18:00.',
    },
    {
      question: 'Pot incerca sala inainte de abonament?',
      answer:
        'Da! Oferim o sedinta gratuita de proba. Contacteaza-ne pentru programare.',
    },
    {
      question: 'Ce trebuie sa aduc la antrenament?',
      answer:
        'Ai nevoie de incaltaminte sport curata, prosop si sticla de apa. Vestiarele au dusuri si dulapuri.',
    },
  ],
};
```

### 6.3 Înregistrare în seed/index.ts

**Modificare:** `src/seed/index.ts`

```typescript
import { seedFitness } from './businesses/fitness'

// În switch-ul principal sau if chain:
case 'fitness':
  await seedFitness(payload)
  break
```

### 6.4 Script în package.json

**Adăugare:**

```json
{
  "scripts": {
    "seed:fitness": "cross-env SEED_TYPE=fitness NODE_OPTIONS=--no-deprecation tsx --env-file=.env src/seed/index.ts"
  }
}
```

---

## FAZA 7: Imagini Seed

### 7.1 Structura Foldere

```
public/images/fitness/
├── hero/
│   ├── gym-hero-1.jpg
│   └── gym-hero-2.jpg
├── team/
│   ├── trainer-1.jpg
│   ├── trainer-2.jpg
│   └── trainer-3.jpg
├── classes/
│   ├── yoga.jpg
│   ├── crossfit.jpg
│   ├── spinning.jpg
│   ├── pilates.jpg
│   └── boxing.jpg
├── subscriptions/
│   ├── gym-basic.jpg
│   ├── gym-premium.jpg
│   ├── gym-vip.jpg
│   ├── spa.jpg
│   └── solar.jpg
└── gallery/
    └── (imagini galerie)
```

### 7.2 Surse Imagini Recomandate

- **Unsplash** - imagini gratuite de înaltă calitate
  - Căutări: "gym", "fitness", "yoga class", "crossfit", "personal trainer"
- **Pexels** - alternativă gratuită
- Dimensiuni recomandate: 1200x800px (hero: 1920x1080px)

---

## FAZA 8: Testare și Validare

### 8.1 Checklist Pre-Implementare

```bash
# 1. Verifică că build-ul funcționează ÎNAINTE de modificări
pnpm build

# 2. Backup la fișierele importante
git stash  # sau commit curent
```

### 8.2 Checklist Implementare

- [ ] Faza 1: Extindere Sistem Teme
  - [ ] SiteTheme.ts - Tab-uri noi
  - [ ] generateThemeStyles.ts - CSS variables noi
  - [ ] ThemeProvider.tsx - Runtime application
  - [ ] globals.css - Default values
  - [ ] `pnpm generate:types`
  - [ ] `pnpm build` - verificare erori

- [ ] Faza 2: Tema Fitness Orange
  - [ ] design-variants.ts - Varianta nouă
  - [ ] SiteTheme.ts - Opțiune în select
  - [ ] generateThemeStyles.ts - Mapare culori
  - [ ] `pnpm build`

- [ ] Faza 3: Colecții Noi
  - [ ] Classes.ts
  - [ ] Subscriptions.ts
  - [ ] payload.config.ts - Înregistrare
  - [ ] `pnpm generate:types`
  - [ ] `pnpm build`

- [ ] Faza 4: Blocuri Noi
  - [ ] ScheduleTable (config + Component)
  - [ ] SubscriptionCards (config + Component)
  - [ ] ClassesGrid (config + Component)
  - [ ] Pages.ts - Înregistrare în blocks
  - [ ] RenderBlocks.tsx - Mapare
  - [ ] `pnpm build`

- [ ] Faza 5: Variante Noi
  - [ ] Team - centered-portrait
  - [ ] Pricing - overlay-image
  - [ ] `pnpm build`

- [ ] Faza 6: Seeder
  - [ ] fitness.ts
  - [ ] seed-data.ts - Date fitness
  - [ ] seed/index.ts - Case fitness
  - [ ] package.json - Script

- [ ] Faza 7: Imagini
  - [ ] public/images/fitness/ - Structura
  - [ ] Imagini descărcate și optimizate

- [ ] Faza 8: Testare
  - [ ] `pnpm seed:fitness` - Funcționează
  - [ ] Verificare vizuală - Se aseamănă cu Template-2
  - [ ] Responsive - Mobile/Tablet/Desktop
  - [ ] Admin Panel - Toate colecțiile funcționează

### 8.3 Comparație Vizuală

După seed, compară cu Template-2 folosind Playwright:

```bash
# Pornește ambele servere
# Template-2: http://localhost:3100
# Template-5: http://localhost:3101

# Folosește browser_screenshot pentru comparație
```

---

## Note Importante

### Reguli de Implementare

1. **Nu modifica codul existent** - doar adaugă
2. **Testează build după fiecare fază** - `pnpm build`
3. **Generează types după modificări colecții** - `pnpm generate:types`
4. **Păstrează consistența** - urmează pattern-urile existente
5. **Documentează** - comentarii clare în cod

### Beneficii pentru Alte Business-uri

Toate adăugările pot fi reutilizate:

| Adăugare               | Utilizare pentru alte business-uri                |
| ---------------------- | ------------------------------------------------- |
| Typography Advanced    | Orice business care vrea control fin              |
| Button Style           | Orice business                                    |
| Classes collection     | Dentist (tratamente), Salon (servicii cu program) |
| Subscriptions          | Orice business cu abonamente                      |
| ScheduleTable block    | Restaurant (program), Dentist, orice cu orar      |
| Team centered-portrait | Orice cu echipă                                   |

### Debugging Comun

```typescript
// Verifică dacă tema se aplică
console.log(
  'Theme:',
  document.documentElement.style.getPropertyValue('--theme-primary'),
);

// Verifică colecții
await payload.find({ collection: 'classes', limit: 1 });

// Verifică blocuri în pagină
console.log('Blocks:', page.layout);
```

---

## Timeline Estimat

| Fază      | Durată     | Dependențe |
| --------- | ---------- | ---------- |
| Faza 1    | 2-3h       | -          |
| Faza 2    | 30min      | Faza 1     |
| Faza 3    | 1-2h       | Faza 2     |
| Faza 4    | 4-6h       | Faza 3     |
| Faza 5    | 2-3h       | Faza 4     |
| Faza 6    | 2-3h       | Faza 5     |
| Faza 7    | 1h         | -          |
| Faza 8    | 2h         | Toate      |
| **TOTAL** | **15-20h** |            |

---

_Document versiune 2.0_
_Creat: Decembrie 2025_
_Actualizat cu analiză detaliată din agenți_
