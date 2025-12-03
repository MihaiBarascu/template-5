# Design System - Universal Business Website Template

## Overview

This document defines the design rules that ALL blocks must follow to ensure a consistent, professional look across all business types.

## Core Principles

1. **Consistency** - Same spacing, typography, and visual rules everywhere
2. **Hierarchy** - Clear visual hierarchy using size, weight, and color
3. **Breathing Room** - Adequate whitespace for readability
4. **60-30-10 Rule** - 60% dominant, 30% secondary, 10% accent colors
5. **Mobile-First** - Responsive design starting from mobile

---

## Spacing System (8px Grid)

All spacing should be multiples of 8px (0.5rem):

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px (0.25rem) | Tight spacing, icons |
| `space-2` | 8px (0.5rem) | Small gaps |
| `space-3` | 12px (0.75rem) | Tags, badges |
| `space-4` | 16px (1rem) | Default gap |
| `space-6` | 24px (1.5rem) | Card padding |
| `space-8` | 32px (2rem) | Section gaps |
| `space-10` | 40px (2.5rem) | Large gaps |
| `space-12` | 48px (3rem) | Section headers |
| `space-16` | 64px (4rem) | Section padding mobile |
| `space-20` | 80px (5rem) | Section padding desktop |

### Section Spacing

```css
/* Standard section */
.section {
  padding-top: var(--spacing-section);    /* 80px desktop, 48px mobile */
  padding-bottom: var(--spacing-section);
}

/* Section header margin bottom */
.section-header {
  margin-bottom: 48px; /* 3rem = space-12 */
}

/* Card grid gap */
.card-grid {
  gap: 24px; /* 1.5rem = space-6 */
}
```

---

## Typography System

### Font Stack
- **Headings**: `var(--font-heading)` - Inter or custom serif
- **Body**: `var(--font-body)` - Inter or system font

### Size Scale

| Level | Desktop | Mobile | Weight | Line Height |
|-------|---------|--------|--------|-------------|
| H1 | 48px (3rem) | 36px (2.25rem) | 700 | 1.1 |
| H2 | 36px (2.25rem) | 30px (1.875rem) | 700 | 1.2 |
| H3 | 24px (1.5rem) | 20px (1.25rem) | 600 | 1.3 |
| H4 | 20px (1.25rem) | 18px (1.125rem) | 600 | 1.4 |
| Body | 16px (1rem) | 16px (1rem) | 400 | 1.6 |
| Small | 14px (0.875rem) | 14px (0.875rem) | 400 | 1.5 |
| XSmall | 12px (0.75rem) | 12px (0.75rem) | 500 | 1.4 |

### Text Classes (Tailwind)

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

## Color Usage

### Primary Palette (from CSS variables)
- `--theme-primary`: Main brand color (buttons, links, accents)
- `--theme-secondary`: Secondary brand color
- `--theme-accent`: Highlight color (badges, CTAs)
- `--theme-dark`: Dark backgrounds
- `--theme-light`: Light backgrounds
- `--theme-surface`: Card/content backgrounds

### Text Colors
- `--theme-text`: Primary text (headings, important content)
- `--theme-text-light`: Secondary text (descriptions)
- `--theme-text-muted`: Tertiary text (metadata, hints)

### Usage Rules

1. **Headings**: Always use `text-theme-text`
2. **Body text**: Use `text-theme-text-light`
3. **Metadata**: Use `text-theme-text-muted`
4. **Links/CTAs**: Use `text-theme-primary`
5. **On dark backgrounds**: Use `text-white`, `text-white/70`, `text-white/50`

---

## Border Radius

Use CSS variables for consistency:

| Token | Usage |
|-------|-------|
| `--radius-sm` | Small elements (badges, chips) |
| `--radius-md` | Buttons, inputs |
| `--radius-lg` | Cards, containers |
| `--radius-xl` | Large containers, modals |
| `--radius-full` | Circular elements (avatars) |

```jsx
// Card
<div className="rounded-[var(--radius-card)]">

// Button
<button className="rounded-[var(--radius-button)]">

// Avatar
<div className="rounded-full">

// Badge
<span className="rounded-[var(--radius-sm)]">
```

---

## Shadows

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Subtle elevation (inputs) |
| `--shadow-md` | Medium elevation (dropdowns) |
| `--shadow-lg` | High elevation (modals) |
| `--shadow-card` | Default card shadow |
| `--shadow-card-hover` | Card hover state |

---

## Component Patterns

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

### Button (Secondary/Outline)

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

## Animation Guidelines

### Timing
- **Fast**: 150ms - micro-interactions (hover states)
- **Normal**: 300ms - most transitions
- **Slow**: 500ms - entrance animations

### Easing
- **ease-out**: For elements entering
- **ease-in-out**: For state changes

### Stagger Pattern
When animating multiple items, use 50-75ms delay between each:

```jsx
style={{ transitionDelay: `${index * 50}ms` }}
```

### Entry Animation (Standard)

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

### Hover Effects (Standard)

```jsx
// Lift effect
'hover:-translate-y-1 hover:shadow-lg'

// Scale effect
'hover:scale-105'

// Icon rotate
'group-hover:rotate-3 group-hover:scale-110'
```

---

## Dark Mode / Dark Background Rules

When `backgroundColor === 'dark'` or `backgroundColor === 'primary'`:

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

## Responsive Breakpoints

Following Tailwind defaults:
- **Mobile**: < 768px (default styles)
- **Tablet**: >= 768px (`md:`)
- **Desktop**: >= 1024px (`lg:`)
- **Large**: >= 1280px (`xl:`)

### Container
```jsx
<div className="container mx-auto px-4">
```

---

## Checklist for New Blocks

- [ ] Uses CSS variables for colors, radius, shadows
- [ ] Section has `py-section` padding
- [ ] Header uses standard section header pattern
- [ ] Cards use `p-6 gap-6` pattern
- [ ] Typography follows size scale
- [ ] Entry animations with stagger
- [ ] Hover effects on interactive elements
- [ ] Dark mode support
- [ ] Mobile responsive
- [ ] Uses `cn()` for conditional classes
