---
status: ACTIVE
type: guide
created: 2025-12-05
updated: 2025-12-08
related:
  - ../plans/multisite.md
  - ../../lessons/_LESSONS-INDEX.md
tags: [seeding, data, business-types]
---

# Ghid Seeding Business Types

> **Locatie:** `src/seed/businesses/`
> **Regula:** Fiecare tip de business are seeder propriu

---

## 1. Comenzi Seeding

```bash
# Seed un business specific
SEED_TYPE=frizerie pnpm seed
SEED_TYPE=dentist pnpm seed
SEED_TYPE=restaurant pnpm seed
SEED_TYPE=magazin pnpm seed
SEED_TYPE=salon pnpm seed
SEED_TYPE=auto-service pnpm seed
SEED_TYPE=fitness pnpm seed

# Sau cu script dedicat
pnpm seed:frizerie
pnpm seed:dentist
pnpm seed:magazin
# etc.
```

---

## 2. Business Types Disponibile

| Tip | Fisier | Pagini | Caracteristici |
|-----|--------|--------|----------------|
| frizerie | `frizerie.ts` | Home, Servicii, Echipa, Contact | Barbershop clasic |
| dentist | `dentist.ts` | Home, Servicii, Doctori, Contact | Cabinet stomatologic |
| restaurant | `restaurant.ts` | Home, Meniu, Galerie, Contact | Restaurant cu meniu |
| magazin | `magazin.ts` | Home, Produse, Cos, Checkout | **Ecommerce complet** |
| salon | `salon.ts` | Home, Tratamente, Echipa, Contact | Salon infrumusetare |
| auto-service | `auto-service.ts` | Home, Servicii, Preturi, Contact | Service auto |
| fitness | `fitness.ts` | Home, Clase, Antrenori, Contact | Sala fitness |

---

## 3. Structura Seeder

```typescript
// src/seed/businesses/frizerie.ts

import type { Payload } from 'payload'
import { seedHelpers } from '../helpers'

export const seedFrizerie = async (payload: Payload) => {
  // 1. Creeaza media
  const heroImage = await seedHelpers.createMedia(payload, {
    filename: 'hero-frizerie.jpg',
    alt: 'Barbershop hero',
  })

  // 2. Creeaza servicii
  const services = await payload.create({
    collection: 'services',
    data: {
      title: 'Tuns Clasic',
      price: 50,
      duration: 30,
      description: 'Tuns cu foarfeca...',
    },
  })

  // 3. Creeaza pagini cu blocuri
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Acasa',
      slug: 'home',
      layout: [
        {
          blockType: 'hero',
          heading: 'Bine ai venit',
          media: heroImage.id,
        },
        {
          blockType: 'services',
          heading: 'Serviciile noastre',
        },
      ],
    },
  })

  // 4. Seteaza globals
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Barbershop Elite',
      // ...
    },
  })
}
```

---

## 4. Helpers Disponibile

```typescript
// src/seed/helpers.ts

// Creeaza media din fisier local
await seedHelpers.createMedia(payload, {
  filename: 'image.jpg',
  alt: 'Descriere imagine',
})

// Creeaza user
await seedHelpers.createUser(payload, {
  email: 'admin@test.com',
  password: 'test123',
  role: 'admin',
})

// Extrage URL imagine
const url = seedHelpers.getImageUrl(media)
```

---

## 5. Lessons Learned - IMPORTANT!

### Imagini Corupte
**Problema:** Imagini HTML salvate ca JPG
**Cauza:** Descarcare de pe site-uri cu protectie
**Fix:** Verifica cu `file imagine.jpg` ca formatul e corect

### Email Invalid
**Problema:** `@example.com` nu trece validarea
**Fix:** Foloseste `@mailinator.com` sau `@test.com`

### Extensie Gresita
**Problema:** Fisier PNG cu extensie .jpg
**Fix:** Renumeste fisierul cu extensia corecta

### Verificare Imagini
```bash
# Gaseste imagini corupte
find public/images -name "*.jpg" -exec file {} \; | grep -v "JPEG"
```

---

## 6. Pattern Ecommerce (Magazin)

```typescript
// src/seed/businesses/magazin.ts

export const seedMagazin = async (payload: Payload) => {
  // 1. Creeaza categorii produse
  const category = await payload.create({
    collection: 'product-categories',
    data: {
      title: 'Electronice',
      slug: 'electronice',
    },
  })

  // 2. Creeaza produse cu inventory
  await payload.create({
    collection: 'products',
    data: {
      title: 'Laptop Gaming',
      slug: 'laptop-gaming',
      price: 4999,
      inventory: 10,  // IMPORTANT: foloseste 'inventory', nu 'stock'
      categories: [category.id],
      _status: 'published',
    },
  })

  // 3. Creeaza pagini shop
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Produse',
      slug: 'produse',
      layout: [/* product blocks */],
    },
  })
}
```

---

## 7. Globals de Setat

```typescript
// Site Settings
await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    siteName: 'Nume Business',
    tagline: 'Slogan',
    contact: {
      email: 'contact@business.com',
      phone: '0722000000',
      address: 'Strada X, Nr Y',
    },
  },
})

// Business Info
await payload.updateGlobal({
  slug: 'business-info',
  data: {
    schedule: [
      { days: 'Luni - Vineri', hours: '09:00 - 18:00' },
      { days: 'Sambata', hours: '10:00 - 14:00' },
      { days: 'Duminica', hours: 'Inchis', isClosed: true },
    ],
  },
})

// Site Theme
await payload.updateGlobal({
  slug: 'site-theme',
  data: {
    colors: {
      primary: '#c9a227',
      secondary: '#1a1a1a',
    },
  },
})
```

---

## 8. Checklist Seeder Nou

- [ ] Fisier creat in `src/seed/businesses/`
- [ ] Export adaugat in `src/seed/index.ts`
- [ ] Script adaugat in `package.json`
- [ ] Media files pregatite in `public/images/`
- [ ] Imagini verificate (format corect)
- [ ] Email-uri cu domeniu valid
- [ ] Toate paginile principale create
- [ ] Globals setate (settings, theme, business-info)
- [ ] Testat cu `pnpm seed:business-type`

---

*Consolidat din: plan-multi-website-seed.md*
*Verificat: 2025-12-08*
