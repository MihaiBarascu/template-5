# Sticky Header cu Transformare Transparent → Solid

## Data: 2025-12-21
## Referință: plasturifototerapeutici.ro

---

## Problema Rezolvată

Implementarea unui header care:
1. Este **transparent** și suprapus peste VideoHero când pagina e la top
2. Se **transformă în solid** (cu background) când utilizatorul face scroll
3. TopBar-ul (bara de sus cu social + contact) **dispare** la scroll
4. Tranziția este **smooth** (animată)

---

## Soluția Implementată

### Fișier: `src/components/Header/index.tsx`

### 1. Scroll Detection

```tsx
// Scroll threshold in pixels for header transformation
const SCROLL_THRESHOLD = 50

export function Header({ data, logo, businessInfo, showCart = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll detection for transparent header transformation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > SCROLL_THRESHOLD)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
```

**Note:** `{ passive: true }` e important pentru performanță!

### 2. Header Positioning

```tsx
<header className={cn(
  'w-full',
  // Non-transparent sticky header
  data?.sticky && !isTransparent && 'sticky top-0 z-50',
  // Transparent header - always fixed, transforms on scroll
  isTransparent && 'fixed top-0 left-0 right-0 z-50'
)}>
```

**Diferența:**
- `sticky` = rămâne în flow-ul paginii, devine fixed doar la scroll
- `fixed` = mereu scos din flow, suprapus peste conținut

### 3. TopBar Visibility (Dispare la Scroll)

```tsx
{showTopBar && data?.topBar && (
  <div className={cn(
    'transition-all duration-300',
    // When transparent: show at top, hide on scroll
    isTransparent && !isScrolled && 'opacity-100 translate-y-0',
    isTransparent && isScrolled && 'opacity-0 -translate-y-full h-0 overflow-hidden'
  )}>
    <TopBar ... />
  </div>
)}
```

**Clasele pentru ascundere completă:**
- `opacity-0` - face invizibil
- `-translate-y-full` - mută în sus (animație)
- `h-0 overflow-hidden` - elimină spațiul ocupat

### 4. Main Header Background Transformation

```tsx
// Determine if header should show solid background
const showSolidBackground = isTransparent ? isScrolled : true

<div className={cn(
  'transition-all duration-300',
  showSolidBackground
    ? 'bg-theme-surface border-b border-theme-border shadow-sm'
    : 'bg-transparent border-transparent'
)}>
```

### 5. Navigation Text Color Change

```tsx
// Pentru link-uri de navigare
className={cn(
  "px-3 py-2 rounded-lg transition-colors font-medium",
  isTransparent && !isScrolled && transparentTextColor === 'white'
    ? "text-white hover:text-white/80 hover:bg-white/10"
    : isTransparent && !isScrolled && transparentTextColor === 'dark'
      ? "text-gray-900 hover:text-gray-700 hover:bg-black/5"
      : "text-theme-text hover:text-theme-primary hover:bg-gray-50"
)}
```

---

## Configurare în Payload Admin

### Global: Header (`src/globals/Header.ts`)

```ts
{
  name: 'isTransparent',
  type: 'checkbox',
  label: 'Header transparent (overlay pe hero)',
  defaultValue: false,
},
{
  name: 'transparentTextColor',
  type: 'select',
  label: 'Culoare text când transparent',
  defaultValue: 'white',
  options: [
    { label: 'Alb', value: 'white' },
    { label: 'Negru', value: 'dark' },
    { label: 'Auto (bazat pe hero)', value: 'auto' },
  ],
  admin: {
    condition: (_, siblingData) => siblingData?.isTransparent,
  },
},
```

---

## TopBar Layout Options

### Layout Variants disponibile:

| Layout | Stânga | Dreapta |
|--------|--------|---------|
| `social-left` | Social icons | Message + Contact |
| `message-left` | Message + Contact | Social icons |
| `contact-left` | Contact info | Message + Social |
| `centered` | Totul centrat | - |

### Container CSS:

```tsx
<div className={cn(
  'container mx-auto px-4 flex items-center gap-4',
  layout === 'centered' ? 'justify-center' : 'justify-between'
)}>
```

---

## Probleme Cunoscute

### 1. Hydration Mismatch
- **Cauza:** `isScrolled` e `false` pe server, dar poate fi `true` pe client (dacă pagina e deja scrollată)
- **Soluție temporară:** Ignorăm warning-ul, funcționalitatea merge
- **Soluție viitoare:** Folosește `useLayoutEffect` sau delay initial state

### 2. TopBar Layout Break
- **Simptom:** Elementele TopBar apar pe linii separate
- **Cauza:** Container nu are `flex` aplicat corect
- **Soluție:** Asigură-te că containerul are `flex items-center justify-between`

---

## Utilizare în Seed

```ts
// În src/seed/businesses/[business].ts
// Header config (în seed helper sau direct)
{
  variant: 'with-topbar',
  isTransparent: true,
  transparentTextColor: 'white',
  sticky: true,
  topBar: {
    backgroundColor: 'dark',
    layout: 'social-left',
    showPhone: true,
    showEmail: true,
    showSocial: true,
    customText: 'Te rugăm să te întorci la persoana care te-a recomandat!',
  },
}
```

---

## Referință Vizuală

**plasturifototerapeutici.ro** - Header comportament:
- La top: Header transparent, TopBar vizibil
- La scroll: TopBar dispare, Header devine solid cu shadow
- Tranziție: Smooth, ~300ms

---

## Fișiere Relevante

- `src/components/Header/index.tsx` - Componenta principală
- `src/globals/Header.ts` - Config Payload
- `src/seed/businesses/*.ts` - Seed data pentru fiecare business
