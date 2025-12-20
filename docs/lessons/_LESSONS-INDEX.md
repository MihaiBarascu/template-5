---
status: ACTIVE
type: lesson
created: 2025-12-08
updated: 2025-12-20
tags: [lessons, bugs, fixes, tips]
---

# Lessons Learned - Index

> Acest fisier indexeaza toate lectiile invatate in proiect.
> Pentru detalii complete, vezi [LESSONS-LEARNED.md](../LESSONS-LEARNED.md)

---

## CRITICE (Trebuie stiute!)

### Ecommerce Plugin

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-14 | Cart nu apare dupa login | Plugin bug: cere `select[carts]=true` dar citeste `user.cart?.docs` - camp join = `cart` (singular) + `syncCartToLocalStorage()` |
| 2025-12-14 | Cart ramane dupa comanda | Clear localStorage (`cart`, `cart_secret`) + `window.location.reload()` |
| 2025-12-14 | Preturi /100 in admin | `decimals: 0` in currency config (nu 2) pt RON stocat in lei |
| 2025-12-14 | shippingCost nu se salva | useCallback stale closure - adauga variabila in dependency array |
| 2025-12-14 | priceInRONEnabled default false | Foloseste `.map()` pe fields pt a modifica `defaultValue`, NU filter+add |
| 2025-12-08 | 404 "Cart not found" la checkout | Plugin foloseste `overrideAccess: false` - adauga `read: () => true` in carts access |
| 2025-12-08 | ProductCard folosea localStorage | Schimba `AddToCartButton` cu `AddToCart` (useCart din plugin) |
| 2025-12-08 | Order status invalid | Plugin accepta: `processing`, `completed`, `cancelled`, `refunded` - NU `pending` |
| 2025-12-07 | Inventory nu se decrementeaza | Plugin-ul face AUTOMAT - nu decrementa manual in adapter |
| 2025-12-07 | Campul `stock` vs `inventory` | Plugin foloseste `inventory` - nu crea camp `stock` separat |

> Vezi [SESSION-ECOMMERCE-CART-FIXES.md](./SESSION-ECOMMERCE-CART-FIXES.md) pentru detalii complete

### Payload CMS General

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-20 | `type: 'group'` nu suporta `initCollapsed` | Foloseste `type: 'collapsible'` sau omite optiunea |
| 2025-12-20 | `relationTo` cere CollectionSlug literal | NU poti genericiza - `relationTo: 'team'` literal, nu variabila |
| 2025-12-20 | Spread pe Field cu override admin | Scrie field-ul complet inline, nu spread + override |
| 2025-12-01 | Hooks nu ruleaza in aceeasi tranzactie | Transmite `req` la toate operatiile Local API din hooks |
| 2025-12-01 | Loop infinit in hooks | Foloseste `context.skipRevalidation` sau similar |
| 2025-12-01 | TypeScript errors la blocuri | Adauga `interfaceName` in config.ts pentru fiecare bloc |

> Vezi [SESSION-SHARED-UTILITIES-REFACTORING.md](./SESSION-SHARED-UTILITIES-REFACTORING.md) pentru shared fields pattern

---

## DESIGN SYSTEM

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-01 | Text invizibil pe fundal dark | Pattern `isDark ? 'text-white' : 'text-theme-text'` |
| 2025-12-01 | Border invizibil | `isDark ? 'border-white/10' : 'border-theme-border'` |
| 2025-12-01 | Culori hardcodate nu respecta tema | NICIODATA `text-gray-600`, INTOTDEAUNA `text-theme-text-light` |

---

## SEEDING

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-05 | Imagini corupte (HTML ca JPG) | Verifica cu `file imagine.jpg` ca formatul e corect |
| 2025-12-05 | Email invalid @example.com | Foloseste @mailinator.com sau @test.com |
| 2025-12-05 | Extensie gresita (.jpg pentru PNG) | Renumeste fisierul cu extensia corecta |

---

## BLOCKS

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-06 | Nested blocks au padding nedorit | CSS: `[&>*:first-child]:mt-0 [&>section]:py-0` |
| 2025-12-06 | RenderBlocks in component sync | Fa componenta `async` cu `await Promise.all()` |
| 2025-12-05 | Map block nu se afiseaza | Campul corect e `googleMapsEmbed` nu `mapEmbed` |

---

## SERVER/CLIENT SEPARATION

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-07 | Functii din 'use client' nu merg pe server | Muta helper functions in fisier separat fara 'use client' |

---

## REACT PATTERNS

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-14 | useCallback stale closure | TOATE variabilele folosite in callback TREBUIE sa fie in dependency array |
| 2025-12-14 | Valoare veche in callback | Daca callback foloseste `x`, adauga `x` in `[deps]` - chiar daca e computed |
| 2025-12-14 | Component re-mount la user change | Foloseste `key={user?.id}` pe Provider pentru force remount |

---

## TESTING

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-10 | `networkidle` timeout in Playwright | Foloseste `waitUntil: 'domcontentloaded'` + `waitForTimeout(3000)` |
| 2025-12-10 | Verific imagini incarcate corect | `toHaveJSProperty('complete', true)` + `not.toHaveJSProperty('naturalWidth', 0)` |
| 2025-12-10 | Lazy loading nu trigereaza in teste | Scroll prin pagina cu `window.scrollTo()` in loop |
| 2025-12-09 | Cum verific ca testele sunt fresh | Vezi timestamps, verifica assertions reale, output variabil per test |
| 2025-12-08 | Playwright nu gaseste elemente | Foloseste `mcp__playwright__browser_snapshot` pentru accessibility tree |
| 2025-12-05 | Server nu raspunde in teste | Asteapta cu `mcp__playwright__browser_wait_for` |

---

## WHITE-LABEL

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-09 | Logo Payload in admin panel | Creeaza `graphics.Logo` si `graphics.Icon` in payload.config.ts |

---

## SEO/PERFORMANCE

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-09 | Next.js Image fara sizes afecteaza LCP | Adauga `sizes` attribute la toate imaginile (ex: `sizes="(max-width: 768px) 100vw, 33vw"`) |
| 2025-12-09 | Imagini fara blur placeholder cauzeaza CLS | Foloseste Media component cu `placeholder="blur"` |
| 2025-12-09 | Imagini cached dupa update | Media component adauga `?updatedAt=timestamp` pentru cache busting |

---

## SHARED UTILITIES (2025-12-20)

| Tip | Locatie | Utilizare |
|-----|---------|-----------|
| Theme helpers | `blocks/_shared/themeHelpers.ts` | `getBgClasses()`, `isDarkBackground()`, `getTextColor()` |
| Icon components | `blocks/_shared/iconComponents.tsx` | `getLucideIcon()` (ReactNode), `getLucideIconComponent()` (ComponentType) |
| Common fields | `blocks/_shared/commonFields.ts` | `backgroundColorField()`, `headingFields()`, `ctaButtonFields()` |
| Section wrapper | `blocks/_shared/sectionWrapperFields.ts` | Layout & design fields for all blocks |

### TypeScript: ReactNode vs ComponentType

| Tip | Returneaza | Cand sa folosesti |
|-----|------------|-------------------|
| `React.ReactNode` | Element JSX renderizat | `{getLucideIcon('Star')}` - afisare directa |
| `React.ComponentType` | Clasa/functie componenta | `<IconComponent className="..." />` - cand vrei sa pasezi props |

---

## Quick Reference

### Comenzi utile

```bash
# Regenereaza tipuri dupa modificari schema
pnpm generate:types

# Seed un business specific
SEED_TYPE=magazin pnpm seed

# Verifica imagini corupte
find public/images -name "*.jpg" -exec file {} \; | grep -v "JPEG"

# Fix email-uri in toate seeders
sed -i "s/@example\.com/@mailinator.com/g" src/seed/businesses/*.ts
```

### Pattern-uri comune

```typescript
// Extrage URL imagine din Media | string
function getImageUrl(image: Media | string | null): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.url || null
}

// Pattern isDark pentru blocuri
const isDark = backgroundColor === 'dark' || backgroundColor === 'primary'
className={isDark ? 'text-white' : 'text-theme-text'}
```

### Import-uri pentru Block Configs (nou 2025-12-20)

```typescript
// Shared Payload fields
import {
  backgroundColorField,
  headingFields,
  ctaButtonFields,
  allIconOptions,
  columnsSelectField,
  toggleField,
} from '../_shared/commonFields'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
```

### Import-uri pentru Block Components (nou 2025-12-20)

```typescript
// Theme helpers
import { getBgClasses, isDarkBackground, getTextColor, getCardClasses } from '@/blocks/_shared/themeHelpers'

// Dynamic icons - alegere in functie de utilizare
import { getLucideIconComponent } from '@/blocks/_shared/iconComponents'  // pentru <Icon className="..."/>
import { getLucideIcon } from '@/blocks/_shared/iconComponents'           // pentru {icon}
```

---

*Pentru detalii complete, vezi [LESSONS-LEARNED.md](../LESSONS-LEARNED.md)*
