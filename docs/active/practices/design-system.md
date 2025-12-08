---
status: ACTIVE
type: practice
created: 2025-12-01
updated: 2025-12-08
related:
  - ../../_ARCHITECTURE.md#adr-005
  - ../guides/blocks.md
tags: [design, css, tailwind, theme, colors, typography]
---

# Design System - Best Practices

> **VERSIUNE:** CSS Variables + Tailwind
> **REGULA:** NICIODATA culori hardcodate, INTOTDEAUNA variabile tema!

---

## 1. REGULA FUNDAMENTALA

**NICIODATA:**
```jsx
// GRESIT - hardcodat
className="text-gray-600"
className="bg-blue-500"
className="border-gray-200"
```

**INTOTDEAUNA:**
```jsx
// CORECT - foloseste tema
className="text-theme-text-light"
className="bg-theme-primary"
className="border-theme-border"
```

---

## 2. CSS Variables Disponibile

### Culori Principale
```css
--theme-primary      /* Culoare brand principala */
--theme-secondary    /* Culoare brand secundara */
--theme-accent       /* Culoare accent (CTAs, highlights) */
--theme-dark         /* Fundal dark */
--theme-light        /* Fundal light */
--theme-surface      /* Fundal carduri/continut */
```

### Culori Text
```css
--theme-text         /* Text principal (headings) */
--theme-text-light   /* Text secundar (descrieri) */
--theme-text-muted   /* Text tertiar (metadata) */
```

### Border Radius
```css
--radius-sm          /* Elemente mici (badges) */
--radius-md          /* Butoane, inputs */
--radius-lg          /* Carduri */
--radius-xl          /* Containere mari */
--radius-button      /* Specific butoane */
--radius-card        /* Specific carduri */
--radius-input       /* Specific inputs */
```

### Shadows
```css
--shadow-sm          /* Elevatie subtila */
--shadow-md          /* Elevatie medie (dropdowns) */
--shadow-lg          /* Elevatie mare (modals) */
--shadow-card        /* Default card */
--shadow-card-hover  /* Card hover state */
```

---

## 3. Spacing System (8px Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing, icons |
| `space-2` | 8px | Small gaps |
| `space-4` | 16px | Default gap |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section gaps |
| `space-12` | 48px | Section headers |
| `space-16` | 64px | Section padding mobile |
| `space-20` | 80px | Section padding desktop |

---

## 4. Typography Scale

| Level | Desktop | Mobile | Weight | Line Height |
|-------|---------|--------|--------|-------------|
| H1 | 48px (3rem) | 36px | 700 | 1.1 |
| H2 | 36px (2.25rem) | 30px | 700 | 1.2 |
| H3 | 24px (1.5rem) | 20px | 600 | 1.3 |
| H4 | 20px (1.25rem) | 18px | 600 | 1.4 |
| Body | 16px (1rem) | 16px | 400 | 1.6 |
| Small | 14px (0.875rem) | 14px | 400 | 1.5 |

### Clase Tailwind
```jsx
// Section heading (H2)
<h2 className="text-3xl md:text-4xl font-bold mb-4">

// Section subheading
<p className="text-lg text-theme-text-light max-w-2xl mx-auto">

// Card title (H3)
<h3 className="text-xl font-semibold mb-2">

// Card description
<p className="text-sm text-theme-text-light">

// Badge/Label
<span className="text-xs font-medium uppercase tracking-wider">
```

---

## 5. Dark Mode Pattern

Cand `backgroundColor === 'dark'` sau `backgroundColor === 'primary'`:

```jsx
const isDark = backgroundColor === 'dark' || backgroundColor === 'primary'

// Text
className={isDark ? 'text-white' : 'text-theme-text'}
className={isDark ? 'text-white/70' : 'text-theme-text-light'}
className={isDark ? 'text-white/50' : 'text-theme-text-muted'}

// Backgrounds
className={isDark ? 'bg-white/5' : 'bg-white'}
className={isDark ? 'bg-white/10' : 'bg-theme-light'}

// Borders
className={isDark ? 'border-white/10' : 'border-theme-border'}
className={isDark ? 'border-white/20' : 'border-theme-border'}

// Hover states
className={isDark
  ? 'hover:bg-white/10'
  : 'hover:shadow-lg'
}
```

---

## 6. Component Patterns

### Section Header (Standard)
```jsx
{(heading || subheading) && (
  <div className="text-center mb-12">
    {heading && (
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-theme-text">
        {heading}
      </h2>
    )}
    {subheading && (
      <p className="text-lg text-theme-text-light max-w-2xl mx-auto">
        {subheading}
      </p>
    )}
  </div>
)}
```

### Card (Standard)
```jsx
<div className={cn(
  'p-6 rounded-[var(--radius-card)]',
  'bg-white border border-theme-border',
  'transition-all duration-300',
  'hover:shadow-lg hover:border-theme-primary/20'
)}>
  {/* Icon */}
  <div className="w-12 h-12 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center mb-4">
    {icon}
  </div>

  {/* Title */}
  <h3 className="text-lg font-semibold mb-2 text-theme-text">
    {title}
  </h3>

  {/* Description */}
  <p className="text-sm text-theme-text-light">
    {description}
  </p>
</div>
```

### Grid Layouts
```jsx
// 2 columns
<div className="grid md:grid-cols-2 gap-6">

// 3 columns
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

// 4 columns
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Button (Primary)
```jsx
<Link
  href={link}
  className={cn(
    'inline-flex items-center justify-center gap-2',
    'px-6 py-3 font-semibold',
    'rounded-[var(--radius-button)]',
    'bg-theme-primary text-white',
    'transition-all duration-200',
    'hover:bg-theme-secondary hover:shadow-md',
    'active:scale-[0.98]'
  )}
>
  {label}
</Link>
```

### Button (Outline)
```jsx
<Link
  href={link}
  className={cn(
    'inline-flex items-center justify-center gap-2',
    'px-6 py-3 font-semibold',
    'rounded-[var(--radius-button)]',
    'border-2 border-theme-primary text-theme-primary',
    'transition-all duration-200',
    'hover:bg-theme-primary hover:text-white',
    'active:scale-[0.98]'
  )}
>
  {label}
</Link>
```

---

## 7. Animation Guidelines

### Timing
- **Fast**: 150ms - micro-interactions (hover)
- **Normal**: 300ms - most transitions
- **Slow**: 500ms - entrance animations

### Stagger Pattern
```jsx
style={{ transitionDelay: `${index * 50}ms` }}
```

### Entry Animation
```jsx
const [isLoaded, setIsLoaded] = useState(false)

useEffect(() => {
  setIsLoaded(true)
}, [])

<div
  className={cn(
    'transition-all duration-500',
    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  )}
  style={{ transitionDelay: `${index * 50}ms` }}
>
```

### Hover Effects
```jsx
// Lift effect
'hover:-translate-y-1 hover:shadow-lg'

// Scale effect
'hover:scale-105'

// Icon rotate
'group-hover:rotate-3 group-hover:scale-110'
```

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Prefix |
|------------|-------|--------|
| Mobile | < 768px | default |
| Tablet | >= 768px | `md:` |
| Desktop | >= 1024px | `lg:` |
| Large | >= 1280px | `xl:` |

### Container
```jsx
<div className="container mx-auto px-4">
```

---

## 9. Design per Nisa (Presets)

Fiecare tip de business are preset-uri vizuale specifice:

| Nisa | Fonturi | Culori | Efecte |
|------|---------|--------|--------|
| Frizerie | Playfair Display + Montserrat | Dark & Gold | Hover lift, zoom |
| Dentist | Poppins + Open Sans | Clean Blue | Scale, overlay |
| Restaurant | Cormorant + Lato | Warm Orange | Zoom, warm tint |
| Auto Service | Oswald + Roboto | Red & Dark | Industrial |
| Salon | Playfair + Raleway | Pink & Rose Gold | Soft, pastel |
| Avocat | Merriweather + Source Sans | Navy & Gold | Serios |
| Constructii | Oswald + Roboto | Orange Industrial | HDR, dramatic |
| Magazin | Poppins + Inter | Eco Green | Modern |

---

## 10. Checklist Bloc Nou

- [ ] Foloseste CSS variables pentru culori, radius, shadows
- [ ] Section are `py-section` padding
- [ ] Header foloseste pattern standard section header
- [ ] Cards folosesc `p-6 gap-6` pattern
- [ ] Typography urmeaza scale-ul
- [ ] Entry animations cu stagger
- [ ] Hover effects pe elemente interactive
- [ ] Dark mode support cu `isDark` pattern
- [ ] Mobile responsive
- [ ] Foloseste `cn()` pentru clase conditionale

---

*Consolidat din: DESIGN-SYSTEM.md, DESIGN-GUIDELINES.md*
*Verificat: 2025-12-08*
