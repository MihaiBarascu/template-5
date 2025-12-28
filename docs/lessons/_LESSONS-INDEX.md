---
status: ACTIVE
type: lesson
created: 2025-12-08
updated: 2025-12-21
tags: [lessons, bugs, fixes, tips]
---

# Lessons Learned - Index

> Acest fisier indexeaza toate lectiile invatate in proiect.
> Pentru detalii complete, vezi [LESSONS-LEARNED.md](../LESSONS-LEARNED.md)

---

## SEED CONTENT FOR EXISTING TENANT (2025-12-25) - NOU!

### Workflow: Admin creează tenant → CLI populează cu template

| Pas | Acțiune | Rezultat |
|-----|---------|----------|
| 1 | Super Admin → Admin Panel → Create Tenant | Tenant gol creat (nume, slug, domain) |
| 2 | `TENANT_ID=<id> SEED_TYPE=frizerie pnpm seed` | Tenant populat cu conținut frizerie |

### Comenzi disponibile

```bash
# STANDARD: Creează tenant nou și populează
SEED_TYPE=frizerie pnpm seed

# EXISTING TENANT: Populează tenant creat în Admin
TENANT_ID=abc123 SEED_TYPE=salon pnpm seed

# APPEND: Adaugă fără să șteargă (risc duplicate!)
SEED_TYPE=frizerie pnpm seed --skip-clear

# CU IMAGINI: Re-uploadează media
SEED_TYPE=frizerie pnpm seed --with-images
```

### Fișiere modificate

| Fișier | Modificare |
|--------|-----------|
| `src/seed/index.ts` | Suport `TENANT_ID` env var + `--skip-clear` flag |
| `src/seed/tenant-helpers.ts` | `useExistingTenant()`, `setSeedTenantId()` |

### Templates disponibile (SEED_TYPE)

`frizerie`, `dentist`, `avocat`, `restaurant`, `auto-service`, `constructii`, `salon`, `magazin`, `fitness`, `multiweb`, `terapii-energetice`

---

## MULTI-TENANT R2 STORAGE (2025-12-24) - NOU!

### Implementare prefix per tenant pentru fișiere R2/S3

| Aspect | Detalii |
|--------|---------|
| **Pattern** | `beforeOperation` hook pe Media setează `prefix` field |
| **Organizare fișiere** | `media/{tenant-slug}/filename.jpg` |
| **Fallback** | `media/shared/` pentru fișiere fără tenant |
| **Bug cunoscut** | [#14561](https://github.com/payloadcms/payload/issues/14561) - suffix adăugat chiar și cu prefix diferit |

### Fișiere modificate

| Fișier | Modificare |
|--------|-----------|
| `src/collections/Media.ts` | `prefix` field + `setTenantPrefix` hook |
| `src/payload.config.ts` | s3Storage fără prefix static |
| `src/plugins/index.ts` | Removed duplicate s3Storage |

### Cod cheie (Media.ts)

```typescript
// Import oficial din plugin
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'

const setTenantPrefix: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if ((operation === 'create' || operation === 'update') && req.file) {
    // Get tenant from: 1) data, 2) cookie, 3) user
    const tenantFromData = data?.tenant
    const tenantFromCookie = getTenantFromCookie(req.headers, 'text')
    const tenantFromUser = req.user?.tenants?.[0]?.tenant

    // Resolve tenant ID → fetch slug → set prefix
    const tenantSlug = await resolveTenantSlug(tenantId, req)
    args.data = {
      ...args.data,
      prefix: tenantSlug ? `media/${tenantSlug}` : 'media/shared',
    }
  }
  return args
}
```

### ⚠️ TRACKING: Payload Bug #14561

**Problemă:** Payload adaugă suffix (-1, -2) la filename chiar și când fișierele sunt în prefixuri diferite.

**Impact:** Cosmetic - funcționalitatea OK, doar filename arată urât.

**Status:** Deschis (Dec 2025)

**Verifică periodic:** https://github.com/payloadcms/payload/issues/14561

### Colecții plugin adăugate la multi-tenant (Dec 2024)

| Plugin | Colecții | Referință |
|--------|----------|-----------|
| Form Builder | `forms`, `form-submissions` | [#13660](https://github.com/payloadcms/payload/issues/13660) |
| Redirects | `redirects` | - |
| Search | `search` | - |

### Probleme rezolvate în versiuni recente

| Issue | Fix în | Descriere |
|-------|--------|-----------|
| [#11240](https://github.com/payloadcms/payload/issues/11240) | v3.24.0 | Versions + multi-tenant |
| [#10952](https://github.com/payloadcms/payload/issues/10952) | v3.x | Form submissions disabled |
| [#13518](https://github.com/payloadcms/payload/issues/13518) | v3.53 | Folders + multi-tenant |

### Configurație completă

```typescript
// payload.config.ts - multiTenantPlugin collections
multiTenantPlugin({
  collections: {
    // Content
    pages: {}, posts: {}, services: {}, media: {},
    // Ecommerce
    products: {}, orders: {}, carts: {}, addresses: {},
    // Form Builder (IMPORTANT!)
    forms: {}, 'form-submissions': {},
    // Other plugins
    redirects: {}, search: {},
    // Tenant globals
    'tenant-site-themes': {}, 'tenant-business-info': {},
    // ... etc
  },
})
```

---

## PLAYWRIGHT MCP ADMIN TESTING (2025-12-21) - NOU!

### Ce am învățat despre testarea admin-ului cu Playwright MCP

| Lecție | Detalii | Utilitate viitoare |
|--------|---------|-------------------|
| **browser_snapshot vs screenshot** | `browser_snapshot` returnează accessibility tree (YAML), mai util pentru automatizare decât screenshots | Folosește snapshot pentru navigare, screenshot pentru verificare vizuală |
| **Refs sunt dinamice** | Referințele elementelor (ref=e1234) se schimbă la fiecare snapshot - trebuie luat snapshot fresh înainte de click | Nu hardcoda refs, ia snapshot înainte de fiecare interacțiune |
| **Timeout la pagini mari** | Pagini cu multe blocuri (Home) pot genera output > 100k caractere | Folosește Grep pe fișierul salvat sau scroll incremental |
| **Erori 500 non-blocking** | Erori 500 pentru thumbnail optimization (Sharp) nu afectează funcționalitatea | Ignoră erorile de optimizare imagine în teste |
| **CRUD complet testat** | Create, Read, Update funcționează pentru Pages, Services, Globals | Testele CRUD pot fi replicate pentru orice collection |

### Pattern de testare Playwright MCP

```
1. browser_navigate -> URL
2. browser_snapshot -> verifică structura
3. browser_click -> element ref
4. browser_type -> completează câmpuri
5. browser_click -> Save
6. browser_snapshot -> verifică succes (toast, status)
```

### Collections testate și funcționale

| Collection | CRUD | Observații |
|------------|------|------------|
| Pages | ✅ | Create, Publish, Edit OK |
| Services | ✅ | Edit price, categories OK |
| Media | ✅ | Gallery, upload form OK |
| Site Theme | ✅ | 14 variante, switch OK |
| Header | ✅ | Nav items, TopBar config |
| Footer | ✅ | 4 coloane, badges ANPC |

> Vezi [QA-ADMIN-COMPLETE-REPORT.md](../QA-ADMIN-COMPLETE-REPORT.md) pentru raport complet

---

## PAYLOAD MULTITENANT RESEARCH (2025-12-21) - NOU!

### Decizie: ❌ NU migra la Payload Multitenant

| Factor | Evaluare | Motiv |
|--------|----------|-------|
| **Schema diversity** | ❌ Incompatibil | 11 business types cu scheme diferite (frizerie vs avocat vs magazin) |
| **Field flexibility** | ❌ Rigid | Multitenant cere schema identică pentru toți tenants |
| **Collection variety** | ❌ Problematic | Frizerie: Appointments, Avocat: Cases, Magazin: Products |
| **Deployment** | ✅ Alternativă | Automatizare deploy (Docker/Coolify) mai potrivită |

### Alternativa recomandată: Deployment Automation

```
Template-5 (bază) -> Fork per client -> Deploy independent
                          |
                          v
                   Personalizare seed + env
```

**Beneficii:**
- Fiecare client poate avea schema diferită
- Update-uri se pot propaga selectiv
- Izolare completă a datelor
- Flexibilitate maximă

---

## THEME VARIANTS SYSTEM (2025-12-21) - NOU!

### Cum să adaugi o nouă variantă de temă

**Fișiere de modificat:**
1. `src/theme/variants.ts` - definiție completă variant
2. `src/globals/SiteTheme.ts` - opțiune în select

**Structura unei variante:**

```typescript
'purple-wellness': {
  colors: {
    primary: '#AD50F2',      // Culoare principală
    secondary: '#27BECF',    // Accent secundar
    accent: '#0088CB',       // Highlight
    dark: '#1A1A2E',
    light: '#EEEEEE',
    surface: '#ffffff',
    text: '#000000',
    textLight: '#4F4F4F',
    border: '#E0E0E0',
    textOnPrimary: '#ffffff',  // Contrast colors
    textOnSecondary: '#ffffff',
    // ... etc
  },
  fonts: {
    heading: 'Prompt',       // Font titluri
    body: 'Open_Sans',       // Font text
  },
  borderRadius: 'none',      // Stil colțuri
  shadows: 'none',           // Umbre (flat design = none)
}
```

### Variante disponibile (14+1 purple-wellness)

| # | Varianta | Stil | Use Case |
|---|----------|------|----------|
| 1 | dark-gold | Premium, elegant | Barbershop, restaurant |
| 2 | modern-red | Bold, energic | Fitness, auto |
| 3 | classic-blue | Profesional | Avocat, medical |
| 4 | fresh-green | Natural, eco | Wellness, bio |
| 5 | minimal-black | Clean, modern | Tech, agency |
| 14 | revital-harmony | Gold/Navy | Terapii energetice |
| 15 | purple-wellness | Mov/Cyan flat | Plasturi, wellness |

---

## DOCUMENTATIE DESIGN (2025-12-21) - NOU!

**Analiza Completa UI Components:**
- [PLASTURI-UI-COMPONENTS-ANALYSIS.md](../PLASTURI-UI-COMPONENTS-ANALYSIS.md) - Analiza senior-level a tuturor componentelor de pe plasturifototerapeutici.ro
- [PLASTURI-DESIGN-SYSTEM.md](../PLASTURI-DESIGN-SYSTEM.md) - Design tokens si widgeturi identificate
- [PLASTURI-WIDGETS-COMPARISON.md](../PLASTURI-WIDGETS-COMPARISON.md) - Mapare completa Plasturi → Template-5

**Structura Analizei:**
- HTML structure pentru fiecare componenta
- CSS techniques folosite (flat design, pill buttons, zero shadows)
- JavaScript interactions (carousel, accordion, video players)
- Accessibility considerations (ARIA, keyboard nav, focus states)
- Performance optimizations (lazy loading, Intersection Observer)
- Template-5 implementation mapping (100% implementat)

---

## ECOMMERCE CONTROL (2025-12-21) - NOU!

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-21 | Cart apare pe site-uri non-ecommerce | `shopSettings.enabled` = master switch; ecommerce pages use `showCart={shopSettings?.enabled ?? false}` |
| 2025-12-21 | Ecommerce persista intre seeders | `clearData()` reseteaza `shop-settings.enabled = false`; doar `magazin` seeder activeaza explicit |
| 2025-12-21 | Header shows cart by accident | Header verifica `showCart` prop SI `ctaButton?.link === '/cos'` |

**Fisiere modificate:**
- `src/seed/helpers.ts` - `seedShopSettings()` function
- `src/seed/index.ts` - reset in `clearData()`
- `src/seed/businesses/magazin.ts` - explicit enable
- `src/app/(frontend)/produse/page.tsx` etc - check `shopSettings?.enabled`

---

## PER-PAGE HEADER (2025-12-21) - NOU!

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-21 | Header diferit per pagina | `headerSettings` group in Pages collection cu `inherit` default |
| 2025-12-21 | Transparent header pe anumite pagini | `headerTransparency: 'solid'` sau `'transparent'` override |
| 2025-12-21 | TopBar per pagina | `headerTopBar: 'show'` / `'hide'` / `'inherit'` |

**Flux:**
```
layout.tsx -> PageWrapper -> Header(mergedSettings)
                    ^
                    |
       mergeHeaderSettings(global, page.headerSettings)
```

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

## HEADER & NAVIGATION (2025-12-21)

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-21 | Header transparent peste VideoHero | `isTransparent: true` + `fixed top-0` in loc de `sticky` |
| 2025-12-21 | Header transform la scroll | useState `isScrolled` + scroll event listener cu `passive: true` |
| 2025-12-21 | TopBar dispare la scroll | `opacity-0 -translate-y-full h-0 overflow-hidden` cu `transition-all duration-300` |
| 2025-12-21 | Hydration mismatch la scroll | `isScrolled` diferă server/client - funcționalitatea merge, warning ignorat |
| 2025-12-21 | TopBar layout break | Container trebuie `flex items-center justify-between` mereu |

> Vezi [STICKY-HEADER-TRANSPARENT.md](./STICKY-HEADER-TRANSPARENT.md) pentru implementare completă

---

## VIDEO HERO (2025-12-21)

| Data | Problema | Solutie |
|------|----------|---------|
| 2025-12-21 | Text centrat vs stânga | `textAlignment: 'left'` în seed/admin pentru stil plasturi.ro |
| 2025-12-21 | Butoane/badges nu se aliniază | `justify-center` doar când `textAlignment === 'center'` |
| 2025-12-21 | Trust badges poziție | `trustBadgesPosition: 'above'` sau `'below'` headline |

> Vezi [VIDEO-HERO-TEXT-ALIGNMENT.md](./VIDEO-HERO-TEXT-ALIGNMENT.md) pentru detalii

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
