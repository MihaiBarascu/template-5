# Template Website - Preview Variante Business

Acest template universal poate fi configurat pentru 8 tipuri diferite de business, fiecare cu propriul design si continut specific.

## Tipuri de Business Disponibile

### 1. Frizerie / Barbershop
**Brand:** Barber Shop
**Culori:** Negru & Auriu (Classic Dark & Gold)
**Functionalitati:** Servicii cu preturi, echipa, testimoniale, FAQ, programari online

![Frizerie Preview](frizerie/variant-0.png)

---

### 2. Cabinet Stomatologic / Dentist
**Brand:** DentalMed
**Culori:** Albastru Medical (Clean Blue & White)
**Functionalitati:** Servicii medicale, echipa doctori, testimoniale, programari

![Dentist Preview](dentist/variant-0.png)

---

### 3. Restaurant / Cafenea
**Brand:** La Copac
**Culori:** Portocaliu & Maro (Warm Orange & Brown)
**Functionalitati:** Meniu, galerie, echipa bucatari, rezervari, testimoniale

![Restaurant Preview](restaurant/variant-0.png)

---

### 4. Service Auto
**Brand:** AutoPro
**Culori:** Rosu & Inchis (Classic Red & Dark)
**Functionalitati:** Servicii cu preturi, echipa mecanici, galerie, FAQ, programari

![Auto Service Preview](auto-service/variant-0.png)

---

### 5. Salon Infrumusetare
**Brand:** Beauty Elena
**Culori:** Roz & Rose Gold (Pink & Rose Gold)
**Functionalitati:** Servicii frumusete, echipa stiliste, galerie, programari

![Salon Preview](salon/variant-0.png)

---

### 6. Cabinet Avocat
**Brand:** Avocat Ionescu
**Culori:** Navy & Auriu (Classic Navy & Gold)
**Functionalitati:** Domenii de practica, echipa avocati, testimoniale, FAQ, consultatie

![Avocat Preview](avocat/variant-0.png)

---

### 7. Firma Constructii
**Brand:** BuildPro
**Culori:** Portocaliu Industrial (Orange & Dark Industrial)
**Functionalitati:** Servicii constructii, portofoliu proiecte, echipa, testimoniale

![Constructii Preview](constructii/variant-0.png)

---

### 8. Magazin Online
**Brand:** EcoShop
**Culori:** Verde Natural (Green Eco & Natural)
**Functionalitati:** Catalog produse, categorii, cos cumparaturi, checkout, testimoniale

![Magazin Preview](magazin/variant-0.png)

---

## Cum sa schimbi tipul de business

```bash
# Seed pentru un anumit tip de business (variant 0 default)
SEED_TYPE=frizerie pnpm seed
SEED_TYPE=dentist pnpm seed
SEED_TYPE=restaurant pnpm seed
SEED_TYPE=auto-service pnpm seed
SEED_TYPE=salon pnpm seed
SEED_TYPE=avocat pnpm seed
SEED_TYPE=constructii pnpm seed
SEED_TYPE=magazin pnpm seed

# Cu varianta de design specifica (0-4)
SEED_TYPE=frizerie DESIGN_VARIANT=2 pnpm seed
```

## Variante de Design

Fiecare tip de business are 5 variante de design (0-4):

| Varianta | Stil |
|----------|------|
| 0 | Design principal recomandat |
| 1 | Alternativa moderna |
| 2 | Design clasic/vintage |
| 3 | Design minimalist |
| 4 | Design bold/vibrant |

## Functionalitati Comune

- Header responsive cu navigatie
- Hero section customizabil
- Sectiune servicii cu preturi
- Echipa cu poze si specializari
- Testimoniale cu rating
- FAQ accordion
- Formular contact functional
- Footer cu informatii contact
- SEO optimizat
- ISR (Incremental Static Regeneration)
- Toast notifications
- Keyboard accessible

## Functionalitati Specifice Magazin

- Catalog produse cu categorii
- Pagini produs detaliate
- Cos de cumparaturi persistent
- Checkout flow
- Reduceri si promotii
- Filtrare produse

## Tehnologii

- Next.js 14 (App Router)
- Payload CMS 3.x
- TypeScript
- Tailwind CSS
- PostgreSQL / SQLite

## Admin Panel

Acceseaza `/admin` pentru a edita continutul:
- **Email:** admin@example.com
- **Parola:** admin123
