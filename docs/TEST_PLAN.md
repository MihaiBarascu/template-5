# Plan de Testare Completă - Template-5

## Obiective
1. Testare toate setările din admin panel (globals)
2. Testare toate seed-urile pentru cele 9 tipuri de business
3. Testare funcționalități SEO
4. Documentare ce funcționează și ce nu

---

## FAZA 1: Testare Setări Admin Panel

### 1.1 Tema Site (SiteTheme Global)

#### Tab 1: Varianta Design
- [ ] Verificare că toate 12 variantele se pot selecta
- [ ] Verificare Variant Preview - afișează culorile corect
- [ ] Verificare Live Preview - afișează simularea website

#### Tab 2: Layout & Stil
- [ ] Testare raze colțuri (5 opțiuni)
- [ ] Testare umbre (4 opțiuni)
- [ ] Testare animații (4 opțiuni)
- [ ] Testare lățime container (4 opțiuni)
- [ ] Testare spațiere secțiuni (3 opțiuni)

#### Tab 3: Culori Personalizate
- [ ] Toggle "Folosește culori personalizate"
- [ ] Toggle "Generează paleta automat" (OKLCH)
- [ ] Verificare că toate câmpurile de culoare apar
- [ ] Testare input HEX
- [ ] Testare secțiunea contrast colors (expandable)

#### Tab 4: Tipografie
- [ ] Testare selecție font titluri (9 opțiuni)
- [ ] Testare selecție font text (8 opțiuni)
- [ ] Toggle setări avansate tipografie
- [ ] Testare letter spacing (4 opțiuni)
- [ ] Testare line height titluri (3 opțiuni)
- [ ] Testare line height text (3 opțiuni)

#### Tab 5: Stil Butoane
- [ ] Toggle setări butoane
- [ ] Testare padding buton (4 opțiuni)
- [ ] Testare text transform (3 opțiuni)
- [ ] Testare font weight (4 opțiuni)
- [ ] Testare letter spacing butoane (4 opțiuni)

#### Tab 6: Export / Import
- [ ] Testare export JSON - descarcă fișier
- [ ] Testare import JSON valid
- [ ] Verificare mesaje succes/eroare

### 1.2 Business Info Global

#### Tab General
- [ ] Verificare câmpuri: name, tagline, description, yearEstablished

#### Tab Contact
- [ ] Verificare adresă (street, city, county, postalCode, country)
- [ ] Verificare telefoane și email
- [ ] Verificare WhatsApp Float Button settings

#### Tab Program
- [ ] Verificare working hours array

#### Tab Social Media
- [ ] Verificare toate 6 câmpurile social

#### Tab Harta
- [ ] Verificare Google Maps embed și coordonate

#### Tab Statistici
- [ ] Verificare stats array

#### Tab Legal
- [ ] Verificare date fiscale (CUI, Reg Com, IBAN)

#### Tab Widgeturi
- [ ] Verificare Announcement Bar
- [ ] Verificare Cookie Consent GDPR
- [ ] Verificare tracking IDs (GA, GTM, FB, TikTok, Hotjar)

### 1.3 Header Global
- [ ] Verificare 5 variante header
- [ ] Verificare setări TopBar
- [ ] Verificare meniu navigare
- [ ] Verificare buton CTA
- [ ] Verificare sticky header

### 1.4 Footer Global
- [ ] Verificare 6 variante footer
- [ ] Verificare setări coloane
- [ ] Verificare newsletter config
- [ ] Verificare social links
- [ ] Verificare copyright și legal links

### 1.5 Logo Global
- [ ] Verificare 3 tipuri logo (text, imagine, combinat)
- [ ] Verificare variante light/dark
- [ ] Verificare favicon
- [ ] Verificare dimensiuni

### 1.6 Shop Settings Global
- [ ] Verificare setări generale (monedă, simbol)
- [ ] Verificare TVA (21%/11%/0%)
- [ ] Verificare comandă (minimă, transport)
- [ ] Verificare metode plată
- [ ] Verificare notificări email
- [ ] Verificare texte butoane

### 1.7 System Pages Global
- [ ] Verificare setări pagină produse
- [ ] Verificare texte/labels
- [ ] Verificare cos
- [ ] Verificare checkout
- [ ] Verificare pagini cont

---

## FAZA 2: Testare Seed-uri (9 Business Types)

### Proces pentru fiecare seed:
1. Rulare seed: `pnpm seed:[tip]`
2. Verificare în admin că datele s-au creat
3. Verificare pe frontend că pagina arată corect
4. Verificare SEO (meta tags, schema.org)

### 2.1 Frizerie
- [ ] Rulare `pnpm seed:frizerie`
- [ ] Verificare servicii create
- [ ] Verificare echipă creată
- [ ] Verificare pagini create
- [ ] Verificare frontend

### 2.2 Dentist
- [ ] Rulare `pnpm seed:dentist`
- [ ] Verificare servicii create
- [ ] Verificare echipă creată
- [ ] Verificare pagini create
- [ ] Verificare frontend

### 2.3 Avocat
- [ ] Rulare `pnpm seed:avocat`
- [ ] Verificare servicii create
- [ ] Verificare echipă creată
- [ ] Verificare pagini create
- [ ] Verificare frontend

### 2.4 Restaurant
- [ ] Rulare `pnpm seed:restaurant`
- [ ] Verificare servicii create
- [ ] Verificare echipă creată
- [ ] Verificare pagini create
- [ ] Verificare frontend

### 2.5 Auto-Service
- [ ] Rulare `pnpm seed:auto-service`
- [ ] Verificare servicii create
- [ ] Verificare echipă creată
- [ ] Verificare pagini create
- [ ] Verificare frontend

### 2.6 Constructii
- [ ] Rulare `pnpm seed:constructii`
- [ ] Verificare servicii create
- [ ] Verificare echipă creată
- [ ] Verificare pagini create
- [ ] Verificare frontend

### 2.7 Salon
- [ ] Rulare `pnpm seed:salon`
- [ ] Verificare servicii create
- [ ] Verificare echipă creată
- [ ] Verificare pagini create
- [ ] Verificare frontend

### 2.8 Magazin
- [ ] Rulare `pnpm seed:magazin`
- [ ] Verificare produse create
- [ ] Verificare categorii create
- [ ] Verificare pagini create
- [ ] Verificare frontend ecommerce

### 2.9 Fitness
- [ ] Rulare `pnpm seed:fitness`
- [ ] Verificare servicii create
- [ ] Verificare echipă creată
- [ ] Verificare abonamente create
- [ ] Verificare frontend

---

## FAZA 3: Testare SEO

### 3.1 Meta Tags
- [ ] Verificare meta title pe homepage
- [ ] Verificare meta description pe homepage
- [ ] Verificare OG tags (og:title, og:description, og:image)
- [ ] Verificare canonical URL

### 3.2 JSON-LD Schema
- [ ] Verificare LocalBusiness schema pe homepage
- [ ] Verificare Article schema pe blog posts
- [ ] Verificare Product schema pe produse
- [ ] Verificare FAQPage schema pe pagini cu FAQ
- [ ] Verificare BreadcrumbList schema

### 3.3 Performance
- [ ] Verificare Core Web Vitals
- [ ] Verificare imagini optimizate
- [ ] Verificare lazy loading

---

## FAZA 4: Testare Frontend per Business Type

Pentru fiecare business type cu Playwright:
- [ ] Homepage se încarcă
- [ ] Navigare funcționează
- [ ] Header și Footer arată corect
- [ ] Tema este aplicată corect
- [ ] Formular contact funcționează
- [ ] Responsive pe mobile
- [ ] Zero erori JavaScript în consolă

---

## Rezultate Testare

### Ce funcționează:
(Se va completa pe parcurs)

### Ce NU funcționează (bugs):
(Se va completa pe parcurs)

### Probleme rezolvate:
(Se va completa pe parcurs)

---

## Timeline estimat:
- Faza 1 (Admin Settings): ~30 min
- Faza 2 (Seed-uri): ~45 min (5 min per seed)
- Faza 3 (SEO): ~15 min
- Faza 4 (Frontend): ~30 min
- Rezolvare bugs: variabil

**Total: ~2-3 ore**
