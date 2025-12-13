# Sistemul de Stiluri - Theme Variables din Admin

Documentație pentru cum funcționează stilurile configurabile din admin panel (container width, font sizes, spacing).

## 1. Arhitectura Sistemului

```
Admin Panel (SiteTheme global)
        ↓
generateThemeStyles.ts (transformă settings în CSS)
        ↓
CSS Variables (injectate în :root)
        ↓
globals.css / Componente (consumă variabilele)
```

---

## 2. Container Max Width

### Cum funcționează

Container width-ul este controlat prin variabila `--container-max` setată din admin.

**În admin (SiteTheme):**
- Field: `containerWidth`
- Valori: `'sm'`, `'md'`, `'lg'`, `'xl'`, `'2xl'`, `'full'`

**În generateThemeStyles.ts:**
```typescript
const containerWidthMap: Record<string, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
}
const containerMax = containerWidthMap[siteTheme?.containerWidth || 'xl']
// Generează: --container-max: 1280px;
```

**În globals.css - IMPORTANT:**
```css
/* TREBUIE să fie OUTSIDE @layer pentru a suprascrie Tailwind's .container */
.container {
  max-width: var(--container-max, 1280px);
}
```

### Greșeală comună

```css
/* NU FUNCȚIONEAZĂ - Tailwind are specificitate mai mare */
@layer base {
  .container {
    max-width: var(--container-max);
  }
}
```

Soluția: Override-ul `.container` trebuie să fie **în afara** oricărui `@layer`.

---

## 3. Heading Scale (Mărimea Titlurilor)

### Presets disponibile

Definite în `src/theme/variants.ts`:

| Preset | H1 | H2 | H3 | H4 | Utilizare |
|--------|----|----|----|----|-----------|
| `small` | 2.5rem (40px) | 2rem (32px) | 1.5rem (24px) | 1.25rem (20px) | Site-uri text-heavy |
| `compact` | 3rem (48px) | 2.25rem (36px) | 1.875rem (30px) | 1.5rem (24px) | Design conservator |
| `normal` | 3.75rem (60px) | 2.5rem (40px) | 2rem (32px) | 1.625rem (26px) | **Default echilibrat** |
| `large` | 4.5rem (72px) | 3rem (48px) | 2.25rem (36px) | 1.875rem (30px) | Vechiul default |
| `xlarge` | 5.5rem (88px) | 3.5rem (56px) | 2.75rem (44px) | 2rem (32px) | Hero-uri impactante |

### Mobile sizes (automat aplicate)

Fiecare preset include și dimensiuni pentru mobile (sub 768px):

```typescript
// Exemplu pentru 'normal'
{
  h1: '3.75rem',         // Desktop: 60px
  h1Mobile: '2.25rem',   // Mobile: 36px
  // ...
}
```

### Variabile CSS generate

```css
:root {
  --font-size-h1: 3.75rem;
  --font-size-h2: 2.5rem;
  --font-size-h3: 2rem;
  --font-size-h4: 1.625rem;
  --font-size-h5: 1.375rem;
  --font-size-h6: 1.125rem;
}

@media (max-width: 768px) {
  :root {
    --font-size-h1: 2.25rem;
    --font-size-h2: 1.875rem;
    --font-size-h3: 1.5rem;
    --font-size-h4: 1.25rem;
  }
}
```

### Utilizare în componente

```tsx
// În componente - folosește variabilele CSS
<h1 style={{ fontSize: 'var(--font-size-h1)' }}>Titlu</h1>

// Sau cu clase Tailwind + CSS custom
<h1 className="text-[length:var(--font-size-h1)]">Titlu</h1>
```

---

## 4. Body Text Size

### Presets disponibile

| Preset | Body | Small | Utilizare |
|--------|------|-------|-----------|
| `small` | 0.875rem (14px) | 0.75rem (12px) | Design compact |
| `normal` | 1rem (16px) | 0.875rem (14px) | **Default** |
| `large` | 1.125rem (18px) | 1rem (16px) | Accesibilitate / readability |

### Variabile CSS generate

```css
:root {
  --font-size-body: 1rem;
  --font-size-small: 0.875rem;
}
```

---

## 5. Card Gap (Spacing între carduri)

### Presets disponibile

| Preset | Gap | Utilizare |
|--------|-----|-----------|
| `compact` | 16px | Multe carduri, spațiu limitat |
| `normal` | 24px | **Default** |
| `spacious` | 32px | Design aerisit |

### Variabilă CSS

```css
:root {
  --spacing-card-gap: 24px;
}
```

### Utilizare

```tsx
<div className="grid grid-cols-3" style={{ gap: 'var(--spacing-card-gap)' }}>
  {cards.map(card => <Card key={card.id} />)}
</div>
```

---

## 6. Fișierul generateThemeStyles.ts

### Structura

```typescript
// src/utilities/generateThemeStyles.ts

export function generateThemeStyles(siteTheme: SiteTheme | null): string {
  // 1. Extrage setările din admin
  const headingScaleKey = siteTheme?.headingScale || 'normal'
  const headingScale = headingScalePresets[headingScaleKey]

  const bodyTextSizeKey = siteTheme?.bodyTextSize || 'normal'
  const bodyTextSize = bodyTextSizePresets[bodyTextSizeKey]

  const cardGapKey = siteTheme?.cardGap || 'normal'
  const cardGap = cardGapPresets[cardGapKey]

  // 2. Generează CSS string
  return `
    :root {
      --container-max: ${containerMax};
      --font-size-h1: ${headingScale.h1};
      --font-size-h2: ${headingScale.h2};
      --font-size-body: ${bodyTextSize.body};
      --spacing-card-gap: ${cardGap};
      /* ... alte variabile */
    }

    @media (max-width: 768px) {
      :root {
        --font-size-h1: ${headingScale.h1Mobile};
        /* ... mobile overrides */
      }
    }
  `
}
```

---

## 7. Admin Fields (SiteTheme Global)

### Fields în src/globals/SiteTheme.ts

```typescript
{
  name: 'headingScale',
  type: 'select',
  options: [
    { label: 'Small - Compact headings', value: 'small' },
    { label: 'Compact - Conservative', value: 'compact' },
    { label: 'Normal - Balanced (default)', value: 'normal' },
    { label: 'Large - Bold statements', value: 'large' },
    { label: 'Extra Large - Hero impact', value: 'xlarge' },
  ],
  defaultValue: 'normal',
},
{
  name: 'bodyTextSize',
  type: 'select',
  options: [
    { label: 'Small (14px)', value: 'small' },
    { label: 'Normal (16px)', value: 'normal' },
    { label: 'Large (18px)', value: 'large' },
  ],
  defaultValue: 'normal',
},
{
  name: 'containerWidth',
  type: 'select',
  options: [
    { label: 'Small (640px)', value: 'sm' },
    { label: 'Medium (768px)', value: 'md' },
    { label: 'Large (1024px)', value: 'lg' },
    { label: 'XL (1280px)', value: 'xl' },
    { label: '2XL (1536px)', value: '2xl' },
    { label: 'Full Width', value: 'full' },
  ],
  defaultValue: 'xl',
},
```

---

## 8. Workflow pentru Adăugare Setări Noi

1. **Adaugă field în SiteTheme.ts** (admin)
2. **Definește presets în variants.ts** (valorile posibile)
3. **Importă și procesează în generateThemeStyles.ts** (generează CSS)
4. **Folosește variabila în globals.css sau componente**
5. **Rulează `pnpm generate:types`** pentru tipuri

---

## 9. Debugging Stiluri

### Verifică variabilele CSS în browser

```javascript
// În DevTools Console
getComputedStyle(document.documentElement).getPropertyValue('--container-max')
getComputedStyle(document.documentElement).getPropertyValue('--font-size-h1')
```

### Verifică stilurile injectate

Caută în `<head>` un `<style>` tag cu comentariul `/* Theme Styles */` sau similar.

---

## Checklist pentru Modificări Stiluri

- [ ] Field adăugat în SiteTheme.ts cu options corecte
- [ ] Presets definite în variants.ts
- [ ] generateThemeStyles.ts importă și procesează presetul
- [ ] Variabila CSS generată corect (verifică în browser)
- [ ] Override-uri Tailwind sunt OUTSIDE @layer
- [ ] Mobile breakpoints incluse unde e cazul
- [ ] Tipuri regenerate cu `pnpm generate:types`
