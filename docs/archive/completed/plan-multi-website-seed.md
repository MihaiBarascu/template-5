# Plan: Multi-Website Agency Seed

> **ACTUALIZAT:** 16 Decembrie 2024 - Plan revizuit complet

## Rezumat

Crearea unui seed pentru **website de agenție web (MultiWebsite)** - cel mai frumos și spectaculos site din toate demo-urile. Prezintă serviciul de creare site-uri și afișează demo-urile ca portofoliu.

**Principii cheie:**
- **Design spectaculos** - prioritate maximă pe aspect vizual
- **Fără iframe-uri** - folosim screenshot-uri pentru portofoliu
- **Efecte CSS/Tailwind only** - fără librării JavaScript noi
- **Totul configurabil** - nimic hardcodat, totul din seed și admin
- **Reutilizabil** - efectele noi vor fi disponibile pentru toate site-urile

---

## Screenshots Demo-uri (Capturate)

| Subdomain | Business | Screenshot |
|-----------|----------|------------|
| a.multiwebsite.org | Barber Shop Premium (Frizerie) | `docs/previews/agency/a-frizerie.png` |
| b.multiwebsite.org | DentalMed (Dentist) | `docs/previews/agency/b-dentist.png` |
| c.multiwebsite.org | Avocat Ionescu (Avocat) | `docs/previews/agency/c-avocat.png` |
| d.multiwebsite.org | AutoPro (Auto Service) | `docs/previews/agency/d-auto-service.png` |
| e.multiwebsite.org | La Copac (Restaurant) | `docs/previews/agency/e-restaurant.png` |
| f.multiwebsite.org | EcoShop (Magazin Online) | `docs/previews/agency/f-magazin.png` |
| g.multiwebsite.org | Beauty Elena (Salon) | `docs/previews/agency/g-salon.png` |
| h.multiwebsite.org | BuildPro (Construcții) | `docs/previews/agency/h-constructii.png` |
| i.multiwebsite.org | Transilvania Fitness (Fitness) | `docs/previews/agency/i-fitness.png` |

---

## Efecte CSS/Tailwind Noi (Reutilizabile)

Toate efectele vor fi implementate doar cu CSS/Tailwind, fără librării JavaScript externe.

### 1. Gradient Text
```css
/* Text cu gradient animat */
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
```

### 2. Glass Morphism
```css
/* Efect sticlă mată */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### 3. Hover Lift Effect
```css
/* Card lift la hover cu shadow */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
```

### 4. Shine Effect
```css
/* Efect strălucire pe card/button */
.shine-effect {
  position: relative;
  overflow: hidden;
}
.shine-effect::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  transform: rotate(30deg) translateX(-100%);
  transition: transform 0.6s;
}
.shine-effect:hover::after {
  transform: rotate(30deg) translateX(100%);
}
```

### 5. Scroll-triggered Fade In (CSS only)
```css
/* Animație la scroll folosind scroll-driven animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-on-scroll {
  animation: fade-in-up linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```

### 6. Border Gradient
```css
/* Border cu gradient */
.border-gradient {
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, var(--primary), var(--secondary)) border-box;
  border-radius: 12px;
}
```

### 7. Subtle Parallax (CSS)
```css
/* Parallax ușor fără JS */
.parallax-subtle {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
```

### 8. Animated Underline
```css
/* Underline animat la hover */
.animated-underline {
  position: relative;
}
.animated-underline::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: width 0.3s ease;
}
.animated-underline:hover::after {
  width: 100%;
}
```

---

## Seeder Agency (multiweb.ts)

### Business Info

```typescript
{
  name: 'MultiWebsite',
  tagline: 'Website-uri profesionale pentru afacerea ta',
  description: 'Creăm site-uri web moderne și funcționale pentru afaceri mici din România. Fiecare website este optimizat pentru conversii și ușor de administrat.',
  phone: '0722 456 789',
  email: 'contact@multiwebsite.org',
  address: 'București, România',
  stats: [
    { value: '9+', label: 'Template-uri disponibile' },
    { value: '100%', label: 'Personalizabil' },
    { value: '24h', label: 'Răspuns garantat' },
    { value: '4.9★', label: 'Rating clienți' },
  ]
}
```

### Design Theme (Modern & Elegant)

```typescript
// Tema modernă - de decis culoarea exactă
// Opțiuni: Violet/Purple, Deep Blue, Emerald, sau combinație
colors: {
  primary: '#6366F1',     // Indigo 500 (sau alt accent)
  secondary: '#818CF8',   // Indigo 400
  accent: '#A5B4FC',      // Indigo 300
  dark: '#0F172A',        // Slate 900
  light: '#F8FAFC',       // Slate 50
}

// Accent pe efecte moderne:
// - Glass morphism pentru cards
// - Gradient text pentru headings
// - Hover lift pentru portfolio items
// - Shine effect pentru CTA buttons
```

### Pagini

| Pagină | URL | Blocuri |
|--------|-----|---------|
| **Home** | `/` | Hero (spectaculos), TrustBadges, Stats, Showcase (portofoliu), Services, HowItWorks, Testimonials, FAQ, CTA |
| **Portofoliu** | `/portofoliu` | Hero (minimal), Showcase (grid cu toate 9 demo-uri), CTA |
| **Servicii** | `/servicii` | Hero, Services (detailed cu icons), FAQ, CTA |
| **Despre** | `/despre` | Hero, Content (story), Stats, CTA |
| **Blog** | `/blog` | Hero, LatestPosts |
| **Contact** | `/contact` | Contact (formular prominent), Map |

### Demo Websites (Portfolio Items)

```typescript
portfolioItems: [
  {
    title: 'Barber Shop Premium',
    category: 'Frizerie / Barbershop',
    description: 'Website modern pentru frizerie cu sistem de programări online',
    image: 'a-frizerie.png', // Screenshot capturat
    externalUrl: 'https://a.multiwebsite.org',
    tags: ['Programări', 'Servicii', 'Echipă'],
    featured: true,
  },
  {
    title: 'DentalMed Clinic',
    category: 'Cabinet Stomatologic',
    description: 'Prezentare profesională pentru cabinet dentar cu booking',
    image: 'b-dentist.png',
    externalUrl: 'https://b.multiwebsite.org',
    tags: ['Medical', 'Programări', 'Servicii'],
    featured: true,
  },
  {
    title: 'Cabinet Avocat Ionescu',
    category: 'Juridic / Avocat',
    description: 'Website elegant pentru cabinet de avocatură',
    image: 'c-avocat.png',
    externalUrl: 'https://c.multiwebsite.org',
    tags: ['Juridic', 'Consultații', 'Contact'],
    featured: false,
  },
  {
    title: 'AutoPro Service',
    category: 'Service Auto',
    description: 'Prezentare completă pentru service auto cu prețuri',
    image: 'd-auto-service.png',
    externalUrl: 'https://d.multiwebsite.org',
    tags: ['Auto', 'Servicii', 'Prețuri'],
    featured: false,
  },
  {
    title: 'Restaurant La Copac',
    category: 'Restaurant / HoReCa',
    description: 'Website apetisant pentru restaurant cu meniu și rezervări',
    image: 'e-restaurant.png',
    externalUrl: 'https://e.multiwebsite.org',
    tags: ['Meniu', 'Rezervări', 'Galerie'],
    featured: true,
  },
  {
    title: 'EcoShop Premium',
    category: 'Magazin Online',
    description: 'E-commerce complet pentru produse naturale',
    image: 'f-magazin.png',
    externalUrl: 'https://f.multiwebsite.org',
    tags: ['E-commerce', 'Produse', 'Coș'],
    featured: true,
  },
  {
    title: 'Beauty Studio Elena',
    category: 'Salon Înfrumusețare',
    description: 'Website elegant pentru salon beauty cu programări',
    image: 'g-salon.png',
    externalUrl: 'https://g.multiwebsite.org',
    tags: ['Beauty', 'Programări', 'Servicii'],
    featured: false,
  },
  {
    title: 'BuildPro Construct',
    category: 'Construcții / Renovări',
    description: 'Prezentare solidă pentru firmă de construcții',
    image: 'h-constructii.png',
    externalUrl: 'https://h.multiwebsite.org',
    tags: ['Construcții', 'Portofoliu', 'Ofertă'],
    featured: false,
  },
  {
    title: 'Transilvania Fitness',
    category: 'Fitness / Gym',
    description: 'Website energic pentru sală de fitness cu abonamente',
    image: 'i-fitness.png',
    externalUrl: 'https://i.multiwebsite.org',
    tags: ['Fitness', 'Abonamente', 'Clase'],
    featured: false,
  },
]
```

### Blog Posts (Emphasis pe crearea website-urilor)

```typescript
blogPosts: [
  {
    title: 'De ce are nevoie afacerea ta de un website în 2024',
    excerpt: 'Descoperă beneficiile unui website profesional pentru orice tip de afacere.',
    category: 'Ghiduri',
  },
  {
    title: 'Cum să alegi template-ul potrivit pentru afacerea ta',
    excerpt: 'Sfaturi pentru alegerea designului perfect care reprezintă brandul tău.',
    category: 'Sfaturi',
  },
  {
    title: 'Website pentru frizerie: funcționalități esențiale',
    excerpt: 'Ce trebuie să includă un site de succes pentru un barbershop modern.',
    category: 'Case Studies',
  },
  {
    title: 'E-commerce pentru afaceri mici: ghid complet',
    excerpt: 'Cum să începi să vinzi online fără investiții mari.',
    category: 'E-commerce',
  },
  {
    title: 'SEO pentru afaceri locale: primii pași',
    excerpt: 'Cum să fii găsit de clienți în zona ta geografică.',
    category: 'SEO',
  },
]
```

---

## Pași Implementare

### Faza 1: Efecte CSS Noi
- [ ] Creare fișier `src/app/(frontend)/globals-effects.css` cu efectele noi
- [ ] Adăugare clase Tailwind custom în `tailwind.config.ts`
- [ ] Documentare efecte pentru reutilizare

### Faza 2: Seeder Agency
- [ ] Creare `src/seed/businesses/multiweb.ts`
- [ ] Design variant modern (indigo/violet sau altă culoare)
- [ ] Import screenshots ca imagini de portofoliu
- [ ] Adăugare în seeders (index.ts)

### Faza 3: Testare
- [ ] Test homepage - toate efectele vizibile
- [ ] Test portofoliu - grid cu screenshots
- [ ] Test responsive pe mobile
- [ ] Test formularul de contact
- [ ] Performance check (Core Web Vitals)

---

## Decizii

### Confirmate
- **Nume seed:** `multiweb`
- **Fără iframe-uri** - folosim screenshots
- **Efecte CSS only** - fără JS libraries
- **Blog:** Da, articole despre web development
- **Contact:** Formular simplu, fără prețuri deocamdată
- **Target:** Afaceri mici din România

### De făcut ulterior
- Pagină prețuri/pachete (când se decide modelul)
- Integrare CRM/email marketing
- Landing pages pentru fiecare tip de business
