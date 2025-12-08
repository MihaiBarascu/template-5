---
status: REFERENCE
type: project
created: 2025-12-01
tags: [project, configuration, presets]
---

# Sistem Configurabil - Arhitectura

---

## Design Presets

Trei stiluri principale aplicabile oricarui tip de business:

### 1. Modern/Minimal
```typescript
{
  fonts: { heading: 'Inter', body: 'Inter' },
  borderRadius: { button: '8px', card: '12px' },
  shadows: { card: '0 1px 3px rgba(0,0,0,0.08)' },
  style: { headerStyle: 'transparent', cardStyle: 'flat' }
}
```

### 2. Classic/Elegant
```typescript
{
  fonts: { heading: 'Playfair Display', body: 'Source Sans Pro' },
  borderRadius: { button: '4px', card: '8px' },
  shadows: { card: '0 2px 8px rgba(0,0,0,0.1)' },
  style: { headerStyle: 'solid', cardStyle: 'bordered' }
}
```

### 3. Bold/Vibrant
```typescript
{
  fonts: { heading: 'Montserrat', body: 'Open Sans' },
  borderRadius: { button: '50px', card: '20px' },
  shadows: { card: '0 4px 16px rgba(0,0,0,0.1)' },
  style: { headerStyle: 'gradient', cardStyle: 'shadow' }
}
```

---

## CSS Variables

Preseturile genereaza CSS variables la runtime:

```css
:root {
  /* Colors */
  --theme-primary: #...;
  --theme-secondary: #...;
  --theme-accent: #...;

  /* Radius */
  --radius-button: ...;
  --radius-card: ...;

  /* Shadows */
  --shadow-card: ...;
  --shadow-card-hover: ...;

  /* Typography */
  --font-heading: ...;
  --font-body: ...;
}
```

---

## Configurare din Admin

1. Global **Site Theme** contine toate setarile
2. Selectie preset sau customizare
3. Override culori individuale
4. Preview instant in frontend

---

*Document de referinta - nu modifica*
