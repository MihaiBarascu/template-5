# Blocuri Payload CMS - Documentatie

Acest document descrie cele 5 blocuri noi adaugate in template.

---

## 1. OpeningHours (Program Functionare)

**Slug:** `openingHours`
**Fisiere:** `src/blocks/OpeningHours/`

### Descriere
Afiseaza programul de functionare al business-ului. Poate prelua datele din global BusinessInfo sau permite introducerea manuala.

### Variante disponibile
| Varianta | Descriere |
|----------|-----------|
| `simple` | Lista simpla cu zilele si orele |
| `with-image` | Program cu imagine laterala |
| `card` | Card compact |
| `with-cta` | Cu buton de programare |
| `inline` | Afisare pe o singura linie |

### Campuri principale
- **heading** - Titlu sectiune (default: "Program")
- **subheading** - Subtitlu optional
- **source** - Sursa date: `businessInfo` sau `custom`
- **schedule** - Array cu program (vizibil doar daca source = custom)
  - `days` - Zilele (ex: "Luni - Vineri")
  - `hours` - Orele (ex: "09:00 - 18:00")
  - `isClosed` - Checkbox daca e inchis
- **image** - Imagine (vizibila doar pentru varianta `with-image`)
- **showCurrentStatus** - Afiseaza badge Deschis/Inchis
- **ctaButton** - Buton CTA (vizibil doar pentru varianta `with-cta`)
  - `label` - Text buton
  - `link` - Link buton
- **backgroundColor** - Culoare fundal: default, light, dark, primary

### Exemplu utilizare
```
Adauga bloc "Program Functionare" > Selecteaza varianta >
Seteaza sursa date (BusinessInfo pentru date din global) >
Activeaza status curent daca doresti
```

---

## 2. Locations (Locatii)

**Slug:** `locations`
**Fisiere:** `src/blocks/Locations/`

### Descriere
Afiseaza locatiile business-ului cu adresa, telefon, program, harta Google Maps si rating.

### Variante disponibile
| Varianta | Descriere |
|----------|-----------|
| `cards` | Carduri pentru fiecare locatie |
| `list-map` | Lista cu harta generala |
| `grid-images` | Grid cu imagini |
| `minimal` | Varianta minimalista |

### Campuri principale
- **heading** - Titlu sectiune (default: "Locatiile noastre")
- **subheading** - Subtitlu optional
- **locations** - Array cu locatii (OBLIGATORIU, minim 1)
  - `name` - Denumire locatie (obligatoriu)
  - `address` - Adresa (obligatoriu)
  - `city` - Oras
  - `phone` - Telefon
  - `email` - Email
  - `image` - Imagine locatie
  - `schedule` - Program specific locatiei
  - `googleMapsEmbed` - URL iframe Google Maps
  - `googleMapsLink` - Link direct pentru directii
  - `rating` - Rating 1-5
  - `ctaButton` - Buton actiune
- **showMap** - Afiseaza harta generala (pentru varianta `list-map`)
- **generalMapEmbed** - Google Maps embed pentru toate locatiile
- **showRating** - Afiseaza rating
- **showSchedule** - Afiseaza program
- **backgroundColor** - Culoare fundal: default, light, dark

### Exemplu utilizare
```
Adauga bloc "Locatii" > Adauga cel putin o locatie cu nume si adresa >
Completeaza detalii suplimentare (telefon, email, program) >
Adauga Google Maps embed URL pentru harta
```

---

## 3. BrandLogos (Logo-uri Branduri)

**Slug:** `brandLogos`
**Fisiere:** `src/blocks/BrandLogos/`

### Descriere
Afiseaza logo-urile partenerilor, clientilor sau brandurilor cu care lucrati.

### Variante disponibile
| Varianta | Descriere |
|----------|-----------|
| `row` | Rand simplu de logo-uri |
| `grid` | Grid cu logo-uri |
| `slider` | Slider automat |
| `titled` | Cu titlu deasupra |
| `sectioned` | Organizat pe sectiuni |

### Campuri principale
- **heading** - Titlu sectiune (optional)
- **subheading** - Subtitlu optional
- **source** - Sursa logo-uri: `custom` sau `sections`
- **logos** - Array cu logo-uri (vizibil daca source = custom)
  - `image` - Logo (OBLIGATORIU, upload media)
  - `name` - Nume brand
  - `link` - Link catre site-ul brandului
- **sections** - Array cu sectiuni (vizibil daca source = sections)
  - `title` - Titlu sectiune
  - `logos` - Array cu logo-uri
- **grayscale** - Logo-uri grayscale (color la hover)
- **autoplay** - Autoplay slider (pentru varianta `slider`)
- **logoSize** - Marime logo: small, medium, large
- **backgroundColor** - Culoare fundal: default, light, dark

### Exemplu utilizare
```
Adauga bloc "Logo-uri Branduri" > Selecteaza varianta >
Adauga logo-uri (upload imagine obligatoriu) >
Activeaza grayscale pentru efect hover
```

---

## 4. Timeline (Timeline / Istorie)

**Slug:** `timeline`
**Fisiere:** `src/blocks/Timeline/`

### Descriere
Afiseaza istoria companiei, etapele unui proiect sau evenimente importante intr-un format timeline.

### Variante disponibile
| Varianta | Descriere |
|----------|-----------|
| `vertical` | Timeline vertical standard |
| `vertical-alternating` | Vertical cu alternare stanga-dreapta |
| `horizontal` | Timeline horizontal |
| `compact` | Varianta compacta |

### Campuri principale
- **heading** - Titlu sectiune (default: "Povestea noastra")
- **subheading** - Subtitlu optional
- **events** - Array cu evenimente (OBLIGATORIU, minim 1)
  - `year` - An/Data (obligatoriu, ex: "2020")
  - `title` - Titlu eveniment (obligatoriu)
  - `description` - Descriere
  - `image` - Imagine eveniment
  - `icon` - Icon Lucide (ex: Star, Award, Building, Users)
- **showConnector** - Afiseaza linie conectoare intre evenimente
- **backgroundColor** - Culoare fundal: default, light, dark

### Exemplu utilizare
```
Adauga bloc "Timeline / Istorie" > Selecteaza varianta >
Adauga cel putin un eveniment cu an si titlu >
Completeaza descriere si imagine optional >
Activeaza linia conectoare pentru efect vizual
```

---

## 5. AnnouncementBar (Bara Anunturi)

**Slug:** `announcementBar`
**Fisiere:** `src/blocks/AnnouncementBar/`

### Descriere
Bara de anunturi pentru promotii, mesaje importante sau countdown-uri. Poate fi afisata sus sau jos pe pagina.

### Variante disponibile
| Varianta | Descriere |
|----------|-----------|
| `simple` | Mesaj simplu |
| `with-button` | Cu buton CTA |
| `countdown` | Cu numaratoare inversa |
| `slider` | Slider pentru mai multe mesaje |
| `dismissable` | Poate fi inchis de utilizator |

### Campuri principale
- **messages** - Array cu mesaje (OBLIGATORIU, minim 1)
  - `text` - Text mesaj (obligatoriu)
  - `link` - Link optional
  - `linkText` - Text pentru link (default: "Afla mai mult")
- **ctaButton** - Buton CTA (pentru varianta `with-button`)
  - `label` - Text buton (default: "Vezi oferta")
  - `link` - Link buton
- **countdown** - Countdown (pentru varianta `countdown`)
  - `endDate` - Data sfarsit (cu picker data+ora)
  - `expiredText` - Text dupa expirare
- **icon** - Icon Lucide (ex: Gift, Percent, Bell, Star)
- **backgroundColor** - Culoare fundal: primary, red, green, blue, black, gradient
- **position** - Pozitie: top sau bottom
- **sticky** - Ramane vizibil la scroll

### Exemplu utilizare
```
Adauga bloc "Bara Anunturi" > Selecteaza varianta >
Adauga cel putin un mesaj >
Seteaza culoarea si pozitia >
Activeaza sticky pentru bara fixa
```

---

## Structura fisiere bloc

Fiecare bloc are urmatoarea structura:

```
src/blocks/[BlockName]/
├── config.ts       # Configuratia Payload (campuri, variante)
├── Component.tsx   # Componentul React pentru frontend
└── index.ts        # Export-uri
```

## Adaugarea unui bloc in pagina

1. Deschide Admin Panel > Pagini
2. Editeaza o pagina sau creeaza una noua
3. In sectiunea "Continut pagina", click "Add Layout"
4. Selecteaza blocul dorit din drawer (cu thumbnail SVG)
5. Configureaza campurile blocului
6. Salveaza si publica pagina

## Note tehnice

- Toate blocurile au thumbnail SVG in `/public/blocks/[slug].svg`
- Campurile conditionale se afiseaza doar pentru variantele relevante
- Validarea campurilor obligatorii se face la publish
- Blocurile folosesc TypeScript cu tipuri generate din Payload
