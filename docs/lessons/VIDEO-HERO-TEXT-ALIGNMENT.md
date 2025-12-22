# VideoHero - Text Alignment și Layout

## Data: 2025-12-21
## Referință: plasturifototerapeutici.ro

---

## Problema

Textul din VideoHero era **centrat** dar clientul voia layout ca pe plasturi.ro unde textul e **aliniat la stânga**.

---

## Diferența Vizuală

### Layout Centrat (default)
```
        ┌─────────────────────────────────┐
        │                                 │
        │      Headline Centrat           │
        │      Subheadline centrat        │
        │      [Button] [Button]          │
        │                                 │
        └─────────────────────────────────┘
```

### Layout Stânga (plasturi.ro style)
```
        ┌─────────────────────────────────┐
        │                                 │
        │ Headline la Stânga              │
        │ Subheadline la stânga           │
        │ [Button] [Button]               │
        │ [Badge] [Badge]                 │
        │                                 │
        └─────────────────────────────────┘
```

---

## Soluția

### Fișier: `src/blocks/VideoHero/Component.tsx`

Componenta are deja suport pentru `textAlignment`:

```tsx
interface VideoHeroBlockProps {
  // ...
  textAlignment?: 'center' | 'left' | 'right'
  // ...
}

// Text alignment classes
const alignmentClasses = {
  center: 'text-center items-center',
  left: 'text-left items-start',
  right: 'text-right items-end',
}
```

### Aplicare în Container:

```tsx
<div className={cn(
  'relative z-10 flex flex-col justify-center h-full container mx-auto px-4',
  heightClasses[height],
  alignmentClasses[textAlignment]  // <-- Aici se aplică alinierea
)}>
  <div className={cn(
    'flex flex-col gap-6 max-w-4xl',
    textAlignment === 'center' && 'mx-auto'  // <-- mx-auto doar pentru center
  )}>
```

### Pentru Butoane și Badge-uri:

```tsx
{/* CTA Buttons */}
<div className={cn(
  'flex flex-wrap gap-4 mt-4',
  textAlignment === 'center' && 'justify-center'  // <-- justify-center doar pentru center
)}>
```

---

## Configurare în Seed

### Fișier: `src/seed/businesses/terapii-energetice.ts`

```ts
// VideoHero block config
{
  blockType: 'video-hero' as const,
  videoSource: 'upload',
  videoFile: videoMedia.id,
  videoPoster: heroImage.id,
  overlayColor: 'rgba(26, 26, 46, 0.6)',
  overlayOpacity: 60,
  headline: 'Descoperă Terapiile Energetice',
  subheadline: 'Terapii energetice aplicate de Monica Batir...',
  ctaButtons: [
    { label: 'Programează o Ședință', link: '/contact', variant: 'primary', pillShape: true },
    { label: 'Descoperă Terapiile', link: '/terapii', variant: 'secondary', pillShape: true },
  ],
  textAlignment: 'left',  // <-- SCHIMBAT de la 'center'
  height: 'fullscreen',
  showScrollIndicator: true,
},
```

---

## Schimbare din Admin Panel

1. Mergi la **Admin** → **Pages** → **Acasă**
2. Edit pagina
3. Găsește blocul **VideoHero**
4. Câmpul **"Text Alignment"** → schimbă de la "Center" la "Left"
5. **Save**

---

## Opțiuni Disponibile

| textAlignment | Descriere | Când să folosești |
|---------------|-----------|-------------------|
| `center` | Tot centrat | Landing pages simple, focus pe CTA |
| `left` | Aliniat stânga | Stil plasturi.ro, profesional, cu multe info |
| `right` | Aliniat dreapta | Rar folosit, pentru efecte speciale |

---

## Height Options

```ts
const heightClasses = {
  fullscreen: 'min-h-screen',    // Ocupă tot ecranul
  large: 'min-h-[90vh]',         // 90% din ecran
  medium: 'min-h-[70vh]',        // 70% din ecran
  small: 'min-h-[50vh]',         // Jumătate de ecran
}
```

---

## Trust Badges Position

Badge-urile pot fi plasate:
- `above` - Deasupra headline-ului
- `below` - Sub subheadline (stil plasturi.ro)

```ts
{
  trustBadges: [
    { image: badgeImage.id, alt: 'Certificat' },
    { image: moneyBackImage.id, alt: 'Garanție 30 zile' },
  ],
  trustBadgesPosition: 'below',  // sau 'above'
}
```

---

## Button Variants

| Variant | Stil | Utilizare |
|---------|------|-----------|
| `primary` | Background primary, text alb | CTA principal |
| `secondary` | Border alb, transparent | CTA secundar |
| `accent` | Background accent cu glow | Urgență, promoții |
| `ghost` | Semi-transparent blur | Subtil |

### Pill Shape

```ts
{ label: 'Button', link: '/url', variant: 'primary', pillShape: true }
//                                                    ^^^^^^^^^^^^^^
// pillShape: true = rounded-full (complet rotunjit)
// pillShape: false = rounded-[var(--radius-button)]
```

---

## Fișiere Relevante

- `src/blocks/VideoHero/Component.tsx` - Componenta
- `src/blocks/VideoHero/config.ts` - Payload schema
- `src/seed/businesses/*.ts` - Seed data
