---
status: ACTIVE
type: lesson
created: 2025-12-20
tags: [refactoring, shared-utilities, payload-cms, theme-system, typescript, blocks]
---

# Sesiune: Refactorizare Shared Utilities & Eliminare Cod Duplicat

> Documenteaza refactorizarea completa a blocurilor si config-urilor pentru eliminarea codului duplicat.

---

## Obiectiv

Full code audit pentru:
1. Eliminare cod duplicat din toate blocurile
2. 100% configurabilitate din admin panel (culori, radius, animatii)
3. Respectare best practices Payload CMS si Next.js

---

## Ce am creat

### 1. Frontend Shared Utilities (`/src/blocks/_shared/`)

#### `themeHelpers.ts` - Centralizare styling
```typescript
// Background colors cu theme tokens
export function getBgClasses(backgroundColor?: BackgroundColor): string

// Dark mode detection
export function isDarkBackground(backgroundColor?: BackgroundColor): boolean

// Text colors bazate pe dark mode
export function getTextColor(isDark: boolean, variant: 'primary' | 'muted' | 'heading'): string

// Card styling cu theme tokens
export function getCardClasses(isDark: boolean, options?: { hover?: boolean; border?: boolean }): string

// Semantic colors (error, success, warning, info)
export const semanticColors = {
  error: { text, textDark, bg, bgLight, textOnLight, border },
  success: { ... },
  warning: { ... },
  info: { ... },
}

// Status indicator classes
export function getStatusClasses(isPositive: boolean): { container, dot, text }

// Alert/Banner styling
export function getAlertClasses(variant: 'info' | 'success' | 'warning' | 'error'): string

// Category colors (pentru ScheduleTable, etc.)
export function getCategoryColors(color: CategoryColorName): { bg, border, text }
```

#### `iconComponents.tsx` - Dynamic Lucide Icons
```typescript
// IMPORTANT: Doua functii diferite!

// Returneaza JSX renderizat - pentru afisare directa
export function getLucideIcon(iconName: string): React.ReactNode

// Returneaza componenta class - pentru utilizare ca <IconComponent />
export function getLucideIconComponent(iconName: string): React.ComponentType<{ className?: string }> | null
```

**Problema rezolvata:**
```typescript
// GRESIT - TypeError: JSX element type does not have construct signatures
const IconComponent = getLucideIcon(iconName)  // returneaza ReactNode
return <IconComponent className="w-6 h-6" />   // EROARE!

// CORECT
const IconComponent = getLucideIconComponent(iconName)  // returneaza ComponentType
return IconComponent ? <IconComponent className="w-6 h-6" /> : null
```

### 2. Payload CMS Shared Fields (`/src/blocks/_shared/commonFields.ts`)

```typescript
// Background color - cu optiuni configurabile
backgroundColorField({
  includeTransparent?: boolean,
  includePrimary?: boolean,
  defaultValue?: 'default' | 'light' | 'dark' | 'primary' | 'transparent',
  showDescriptions?: boolean
})

// Heading + Subheading
headingFields({
  headingDefault?: string,
  headingRequired?: boolean,
  includeSubheading?: boolean,
  richSubheading?: boolean
})

// CTA Button group
ctaButtonFields({
  defaultLabel?: string,
  groupLabel?: string
})

// Icon select cu toate Lucide icons
iconSelectField({
  name?: string,
  required?: boolean,
  categories?: ('actions' | 'communication' | 'ecommerce' | ...)[],
  condition?: (data, siblingData) => boolean
})

// Columns select
columnsSelectField({
  options?: ('1' | '2' | '3' | '4' | '5' | '6')[],
  defaultValue?: '1' | '2' | '3' | '4'
})

// Toggle field helper
toggleField({ name, label, defaultValue, description })

// Preset fields
showNumbersField, showConnectorsField, showRatingField,
showAvatarField, showDescriptionsField, iconSizeField

// All icon options (centralized array)
allIconOptions
```

---

## Lectii Invatate

### 1. TypeScript: `React.ReactNode` vs `React.ComponentType`

| Tip | Ce returneaza | Utilizare |
|-----|---------------|-----------|
| `React.ReactNode` | Element JSX renderizat | `{getLucideIcon('Star')}` |
| `React.ComponentType` | Clasa/functie componenta | `<IconComponent className="..." />` |

**Regula:** Daca vrei sa pasezi `className` sau alte props, ai nevoie de `ComponentType`, nu `ReactNode`.

### 2. Payload CMS Field Types Constraints

| Tip | Admin Options | NU suporta |
|-----|---------------|------------|
| `type: 'group'` | `hideGutter`, `components` | `initCollapsed` |
| `type: 'collapsible'` | `initCollapsed`, `components` | - |
| `type: 'relationship'` | `condition`, `description` | `relationTo` trebuie sa fie `CollectionSlug` literal |

**Problema:** `relationTo: someStringVariable` nu compileaza - trebuie literal `relationTo: 'team'`

### 3. Semantic Colors vs Theme Colors

```typescript
// SEMANTIC - aceeasi peste tot (red = error, green = success)
// Foloseste culori Tailwind standard
className="text-red-500"    // error
className="text-green-500"  // success
className="text-amber-500"  // warning
className="text-blue-500"   // info

// THEME - depinde de branding
// Foloseste CSS variables
className="text-theme-primary"     // depinde de site
className="text-theme-accent"      // depinde de site
className="bg-theme-surface"       // depinde de site
```

### 4. Pattern: Shared Fields cu Optiuni

```typescript
// BINE - functie cu optiuni
export function backgroundColorField(options = {}): Field {
  const { includeTransparent = false, defaultValue = 'default' } = options
  // ... construieste field bazat pe optiuni
}

// FOLOSIRE
backgroundColorField()  // defaults
backgroundColorField({ includeTransparent: true, defaultValue: 'light' })

// RAU - field static
export const backgroundColorField: Field = { ... }  // nu poti customiza
```

### 5. Spread Operator pe Payload Fields

```typescript
// GRESIT - nu functioneaza cu spread + override
{
  ...showDescriptionsField,
  admin: { description: 'Custom description' }  // EROARE TypeScript
}

// CORECT - scrie field-ul complet
{
  name: 'showDescriptions',
  type: 'checkbox',
  label: 'Afiseaza descrierile',
  defaultValue: true,
  admin: { description: 'Custom description' }
}
```

---

## Fisiere Modificate

### Shared Utilities Create/Update
- `src/blocks/_shared/themeHelpers.ts` - Adaugat `semanticColors`, `getStatusClasses`, `getAlertClasses`, `getCategoryColors`
- `src/blocks/_shared/iconComponents.tsx` - Adaugat `getLucideIconComponent()`
- `src/blocks/_shared/commonFields.ts` - NOU - toate field-urile shared pentru configs

### Blocuri Component Refactorizate
- `src/blocks/HowItWorks/Component.tsx` - foloseste `getLucideIconComponent`
- `src/blocks/ProcessSteps/Component.tsx` - foloseste `getLucideIconComponent`
- `src/blocks/TrustBadges/Component.tsx` - foloseste `getLucideIconComponent`
- `src/blocks/Banner/Component.tsx` - foloseste `getAlertClasses`
- `src/blocks/ScheduleTable/Component.tsx` - foloseste `getCategoryColors`

### Blocuri Config Refactorizate
- `src/blocks/HowItWorks/config.ts` - foloseste `headingFields`, `ctaButtonFields`, `backgroundColorField`, `allIconOptions`
- `src/blocks/ProcessSteps/config.ts` - foloseste shared fields
- `src/blocks/TrustBadges/config.ts` - foloseste shared fields
- `src/blocks/Testimonials/config.ts` - foloseste shared fields
- `src/blocks/Team/config.ts` - foloseste shared fields

---

## Beneficii

1. **DRY Code** - Un singur loc pentru modificari (ex: adaugi o culoare noua)
2. **Consistenta** - Toate blocurile au aceleasi optiuni
3. **Type Safety** - Functiile helper-e sunt typed corect
4. **Maintainability** - Config-uri mai scurte si mai clare
5. **Scalability** - Usor de adaugat noi blocuri cu aceleasi pattern-uri

---

## Quick Reference

### Import-uri comune pentru Block Components
```typescript
import { getBgClasses, isDarkBackground, getTextColor, getCardClasses } from '@/blocks/_shared/themeHelpers'
import { getLucideIconComponent } from '@/blocks/_shared/iconComponents'
import { isValidMedia, getMediaUrl } from '@/blocks/_shared/mediaHelpers'
```

### Import-uri comune pentru Block Configs
```typescript
import {
  backgroundColorField,
  headingFields,
  ctaButtonFields,
  allIconOptions,
  columnsSelectField,
  toggleField,
  showNumbersField,
} from '../_shared/commonFields'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
```

---

*Build verificat - toate testele trec*
