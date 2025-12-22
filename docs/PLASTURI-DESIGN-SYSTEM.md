# PLASTURI DESIGN SYSTEM - Analiza Completă

> **Scop**: Documentație completă a design-ului și widgeturilor de pe plasturifototerapeutici.ro pentru integrare în template-5

## Screenshot-uri Disponibile

| Fișier | Descriere |
|--------|-----------|
| `.playwright-mcp/plasturi-homepage-full.png` | Pagina principală completă |
| `.playwright-mcp/shop-products.png` | Pagina Shop |
| `.playwright-mcp/product-page-full.png` | Pagina Produs Individual |
| `.playwright-mcp/despre-companie.png` | Pagina Despre Companie |
| `.playwright-mcp/my-alavida.png` | Pagina My Alavida |
| `.playwright-mcp/sport-performanta.png` | Sport de Performanță |

---

## 1. DESIGN TOKENS

### 1.1 Paleta de Culori

```
Primary:     #116DFF (Albastru)
Secondary:   #AD50F2 (Purple/Violet)
Accent:      #00CED1 (Cyan/Turcoaz)
Dark:        #1A1A2E (Albastru foarte închis)
Light:       #FFFFFF (Alb)
Surface:     #F5F5F5 (Gri foarte deschis)
Text:        #000000 (Negru)
TextLight:   #666666 (Gri)
Border:      #E0E0E0 (Gri deschis)
```

### 1.2 Tipografie

```
Heading Font: "Prompt" (400-700 weight)
Body Font:    "Prompt" sau "Open Sans"
H1:           28-36px, weight 400
H2:           24-28px, weight 400
H3:           20-24px, weight 400
H4:           18-20px, weight 400
H5/H6:        16-18px, weight 400
Body:         16-17px, weight 400
Small:        14px, weight 400
```

### 1.3 Spacing

```
Section Padding:  80px (desktop), 40px (mobile)
Card Gap:         24px
Container Max:    1200px
```

### 1.4 Borders & Shadows

```
Border Radius:    0px (flat design)
Button Radius:    24px (pill style pentru sort) sau 0px (CTA)
Card Radius:      0px
Shadow:           none (flat design complet)
```

---

## 2. WIDGETURI IDENTIFICATE

### 2.1 HEADER / NAVIGATION

#### TopBar
```
┌─────────────────────────────────────────────────────────────┐
│ [YT] [FB]  │  "Te rugăm să te întorci la persoana care..."  │
└─────────────────────────────────────────────────────────────┘
```
- **Componente**: Social icons (YouTube, Facebook) + Mesaj text
- **Background**: Alb sau transparent
- **Status Template-5**: ✅ EXISTĂ (TopBar block)
- **Config necesară**: `showSocialIcons`, `topBarMessage`

#### Main Navigation
```
┌─────────────────────────────────────────────────────────────┐
│ [LOGO]  Pagina Principala | Blog | Despre | Shop    [Coș]  │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ✅ EXISTĂ (Header component)
- **Config necesară**: Menu items din Payload

---

### 2.2 HERO SECTIONS

#### A) Video Hero (Homepage)
```
┌─────────────────────────────────────────────────────────────┐
│                    [VIDEO BACKGROUND]                        │
│                                                              │
│        Redescoperă energia cu Plasturii Fototerapeutici     │
│                                                              │
│   Activează regenerarea naturală și ameliorează durerile    │
│                                                              │
│                   [MONEY BACK BADGE]                         │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ⚠️ PARȚIAL (Hero există, dar fără video background)
- **TODO**: Adaugă `videoUrl` field în Hero config

#### B) Image Hero (Pagini Secundare)
```
┌─────────────────────────────────────────────────────────────┐
│                    [IMAGE BACKGROUND]                        │
│                                                              │
│                    Misiunea noastră                          │
│            Trăiește mult. Trăiește bine.                    │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ✅ EXISTĂ (Hero block)

---

### 2.3 VIDEO + TEXT SECTION (2 Coloane)

```
┌─────────────────────────────────────────────────────────────┐
│  [IMAGE/ICON]  │  Urmărește videoclipul ~1:30 minute        │
│                │                                             │
│  [VIDEO        │  Cum funcționează tehnologia?               │
│   PLAYER]      │                                             │
│                │  Când aplici un plasture X39 pe corp...     │
│                │  [Paragraf explicativ lung]                 │
│                │                                             │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ⚠️ PARȚIAL (MediaContent există)
- **TODO**:
  - Adaugă suport pentru video embed
  - Layout video stânga + text dreapta
  - Badge "Urmărește videoclipul ~X minute"

---

### 2.4 PROCESS STEPS (3 Pași)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│   │  [IMG]   │    │  [IMG]   │    │  [IMG]   │             │
│   │          │    │          │    │          │             │
│   │ Pasul 1: │    │ Pasul 2: │    │ Pasul 3: │             │
│   │  Aplică  │    │ Activează│    │Stimulează│             │
│   │          │    │          │    │          │             │
│   │ [text]   │    │ [text]   │    │ [text]   │             │
│   └──────────┘    └──────────┘    └──────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ⚠️ PARȚIAL (Features block)
- **TODO**:
  - Adaugă `showStepNumbers` option
  - Layout alternativ cu imagini mari

---

### 2.5 ACCORDION / FAQ

```
┌─────────────────────────────────────────────────────────────┐
│  ▶ Află mai multe!                                          │
│  ──────────────────────────────────────────────────────────│
│  [Conținut expandabil când click]                           │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ✅ EXISTĂ (FAQ block cu accordion)
- **Config**: Deja configurabil

---

### 2.6 DOWNLOAD LINKS

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  [📥 Download și trimite cum funcționează?]                 │
│  [📥 Download și trimite ce conțin?]                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ❌ NU EXISTĂ
- **TODO**: Crează block `DownloadLinks`
  - Array de link-uri cu label + URL PDF
  - Stil button sau link

---

### 2.7 TIMELINE / EXPECTATIONS

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Ce așteptări să ai de la Plasturii Fototerapeutici?        │
│                                                              │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐     │
│  │[IMG]│  │[IMG]│  │[IMG]│  │[IMG]│  │[IMG]│  │[IMG]│     │
│  │     │  │     │  │     │  │     │  │     │  │     │     │
│  │La   │  │Clar-│  │Forță│  │Sănă-│  │Stare│  │Util-│     │
│  │înce-│  │itate│  │     │  │tate │  │de   │  │izare│     │
│  │put  │  │     │  │     │  │     │  │bine │  │cont.│     │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘     │
│                                                              │
│  [TEXT DESCRIERE SUB FIECARE]                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ❌ NU EXISTĂ
- **TODO**: Crează block `Timeline` sau `ExpectationsCards`
  - Horizontal scroll pe mobile
  - Cards cu imagine + titlu + descriere
  - Video player în stânga

---

### 2.8 BENEFITS HIGHLIGHT

```
┌─────────────────────────────────────────────────────────────┐
│  [IMAGE]  │  beneficii                                      │
│           │                                                  │
│           │  Beneficiile pot fi imediate!                   │
│           │  LifeWave X39 își începe acțiunea imediat       │
│           │                                                  │
│           │  "Transformă-ți viața cu beneficii dovedite:    │
│           │   ameliorarea rapidă a durerii..."              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ⚠️ PARȚIAL (MediaContent)
- **TODO**: Adaugă `label` field (ex: "beneficii")

---

### 2.9 NUMBERED STEPS LIST

```
┌─────────────────────────────────────────────────────────────┐
│  Cum maximizezi beneficiile?                                │
│                                                              │
│  1. Hidratează-te                                           │
│     Consumă 120-150 ml de apă la fiecare 30 minute         │
│                                                              │
│  2. Susține echilibrul electrolitic                        │
│     Folosește electroliți zilnic...                        │
│                                                              │
│  3. Adoptă o alimentație sănătoasă                         │
│     Evită alimentele ultraprocesate...                     │
│                                                              │
│  [📥 Descarcă - Urmărește-ți Rezultatele]                  │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ⚠️ PARȚIAL (poate fi făcut cu RichText)
- **TODO**: Crează block `NumberedSteps` cu:
  - Titlu heading
  - Array de steps (number + title + description)
  - Optional download link

---

### 2.10 PRICING KITS (4 Carduri)

```
┌─────────────────────────────────────────────────────────────┐
│  Accesează cele mai mici prețuri prin kiturile noastre     │
│                     DISCOUNT 30-50%                         │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  [IMG]   │ │  [IMG]   │ │  [IMG]   │ │  [IMG]   │      │
│  │          │ │          │ │          │ │          │      │
│  │ Kit Core │ │Kit Adv.  │ │Kit Adv+  │ │Kit Prem. │      │
│  │          │ │          │ │          │ │          │      │
│  │ Include: │ │ Include: │ │ Include: │ │ Include: │      │
│  │ ✓ item1  │ │ ✓ item1  │ │ ✓ item1  │ │ ✓ item1  │      │
│  │ ✓ item2  │ │ ✓ item2  │ │ ✓ item2  │ │ ✓ item2  │      │
│  │          │ │          │ │          │ │          │      │
│  │ 1645 lei │ │ 2923 lei │ │ 5265 lei │ │ 9391 lei │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ⚠️ PARȚIAL (Services block există)
- **TODO**: Extinde Services sau crează `PricingKits`:
  - Imagine produs
  - Titlu kit
  - Lista de features (✓ checkmarks)
  - Preț
  - Garanție text
  - Badge discount

---

### 2.11 RESULTS TIMELINE

```
┌─────────────────────────────────────────────────────────────┐
│  Rezultate pe Termen Lung X39                               │
│         CONFORM STUDIILOR DE CAZ                            │
│                                                              │
│  Primele zile ─────────────────────────────────────────────│
│    • 4.000 de gene încep să se reseteze                    │
│    • Creierul devine echilibrat                            │
│                                                              │
│  În decurs de 6 săptămâni ─────────────────────────────────│
│    • Colagenul tău crește                                  │
│                                                              │
│  În decurs de 3 luni ──────────────────────────────────────│
│    • Inima își inversează vârsta                           │
│                                                              │
│  În decurs de 6 luni ──────────────────────────────────────│
│                                                              │
│  "NU ESTE ANTI-ÎMBĂTRÂNIRE, ESTE INVERSAREA VÂRSTEI."      │
│           David Schmidt CEO, Inventatorul Lifewave          │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ❌ NU EXISTĂ
- **TODO**: Crează block `ResultsTimeline`:
  - Titlu + subtitlu
  - Array de timeline entries (period + bullet points)
  - Quote final cu autor

---

### 2.12 NEWSLETTER FORM

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│           Abonează-te la Health Letter                      │
│                                                              │
│  Buletinul tău de sănătate.                                │
│  Inspirație, tehnologie și echilibru prin plasturi.        │
│                                                              │
│  Email* [________________________]                          │
│                                                              │
│  ☐ Da, mă abonez la newsletter*                            │
│                                                              │
│              [ Submit ]                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ✅ EXISTĂ (Newsletter block)
- **Config**: Deja configurabil

---

### 2.13 CTA SECTION

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│               ești pregătit/ă                               │
│                                                              │
│  ...să încerci tehnologia noastră brevetată?               │
│  Prețurile de distribuitor vin cu garanție 30 zile!        │
│                                                              │
│  Aplică. Poartă. Împărtășește                              │
│                                                              │
│               [MONEY BACK BADGE]                            │
│                                                              │
│  Te rugăm să te întorci la persoana care te-a recomandat!  │
│                                                              │
│  [Disclaimer lung...]                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ⚠️ PARȚIAL (CTA block există)
- **TODO**: Adaugă `badge` image field, `disclaimer` text field

---

### 2.14 FOOTER

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  plasturifototerapeutici.ro     │   Link-uri Utile          │
│                                 │                            │
│  Firmă: UNIQUE LIGHT...         │   Politica confidențial.  │
│  Sediu social: București...     │   Politica cookie-uri     │
│  Nr. registru: J2025...         │   Protecția datelor       │
│                                 │   Termeni și condiții     │
│                                 │   Politica livrare        │
│                                 │   Politica anulare        │
│                                                              │
│  [NETOPIA]  [ANPC-SOL]  [ANPC-SAL]                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ✅ EXISTĂ (Footer component)
- **Config**: Company info, links, payment badges

---

### 2.15 FLOATING CTA BUTTON

```
                                    ┌─────────────────────┐
                                    │ Abonează-te Acum    │
                                    └─────────────────────┘
                                    (Fixed position dreapta)
```
- **Status Template-5**: ❌ NU EXISTĂ
- **TODO**: Crează `FloatingCTA` component:
  - Fixed position (right side sau bottom)
  - Text + link configurabil
  - Apare după scroll

---

### 2.16 ATHLETE/TESTIMONIAL CARDS (Sport Page)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │    [FOTO]     │  │    [FOTO]     │  │    [FOTO]     │   │
│  │               │  │               │  │               │   │
│  │ Mihaela       │  │ Catalin       │  │ Bianca        │   │
│  │ Buzarnescu    │  │ Cozma         │  │ Ghelber       │   │
│  │               │  │               │  │               │   │
│  │ Tenis prof.   │  │ Sărituri apă  │  │ Arunc. ciocan │   │
│  │               │  │               │  │               │   │
│  │ "Testimonial" │  │ "Testimonial" │  │ "Testimonial" │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ⚠️ PARȚIAL (Testimonials block)
- **TODO**: Extinde cu:
  - Imagine mare portret
  - Nume + titlu/sport
  - Testimonial text
  - Grid layout (3-4 coloane)

---

### 2.17 VIDEO CAROUSEL

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│           Ce spune inventatorul?                            │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ [VIDEO]  │  │ [VIDEO]  │  │ [VIDEO]  │                  │
│  │   ▶      │  │   ▶      │  │   ▶      │                  │
│  │          │  │          │  │          │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                              │
│         < prev                    next >                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ❌ NU EXISTĂ
- **TODO**: Crează block `VideoGallery`:
  - Titlu heading
  - Array de video URLs (YouTube embed sau MP4)
  - Carousel cu 3 visible
  - Play/pause controls

---

### 2.18 INGREDIENTS ACCORDION (Alavida Page)

```
┌─────────────────────────────────────────────────────────────┐
│  Principalele ingrediente                                   │
│                                                              │
│  ▼ Ulei de microalge (triolein)                            │
│    [Descriere detaliată când expand]                       │
│                                                              │
│  ▶ Peptida de cupru GHK-Cu                                 │
│                                                              │
│  ▶ Ulei de primulă de seară                                │
│                                                              │
│  ▶ Peptide din lapte                                       │
│                                                              │
│  ▶ Unt de moringa                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ✅ EXISTĂ (FAQ block ca accordion)
- **Config**: Refolosește FAQ block cu stil diferit

---

### 2.19 STATS/AWARDS SECTION

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • Fondată în 2004                                 │    │
│  │  • Prezență în 75+ țări                           │    │
│  │  • Certificare ISO 9001                           │    │
│  │  • Venituri 550M USD (2025)                       │    │
│  │  • 1.000.000+ Parteneri de Brand                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Companie premiată                                          │
│                                                              │
│  ┌─────────────┐    ┌─────────────┐                        │
│  │ [BRAVO IMG] │    │ [INC 5000]  │                        │
│  │ DSN Bravo   │    │ Inc. 5000   │                        │
│  │ Award 2024  │    │ List 2008   │                        │
│  └─────────────┘    └─────────────┘                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ⚠️ PARȚIAL
- **TODO**:
  - Stats list poate fi RichText cu bullets
  - Awards: grid de imagini cu caption

---

### 2.20 BRAND PARTNER CTA

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Devino partener de brand!                                  │
│  Alături de echipa numărul 1 din Europa.                   │
│                                                              │
│  ✓ Cele mai mici prețuri                                   │
│    pentru produse și acces la promoții dedicate            │
│                                                              │
│  ✓ Câștigă comisioane săptămânale                          │
│    venituri imediate sau pe termen lung...                 │
│                                                              │
│  ✓ Oportunitate globală flexibilă                          │
│    poți avea clienți în peste +80 de țări...              │
│                                                              │
│  ✓ Dezvoltare personală                                    │
│    acces la materiale educative, webinarii...             │
│                                                              │
│                [#1 IN EUROPE BADGE]                         │
│                                                              │
│  [VIDEO - Cum devin Partener de Brand]                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
- **Status Template-5**: ⚠️ PARȚIAL (poate fi CTA + Features)
- **TODO**: Combinație de blocuri existente

---

## 3. COMPONENTE NOI NECESARE

### 3.1 Prioritate ÎNALTĂ (Core pentru plasturi design)

| # | Component | Complexitate | Ore Est. |
|---|-----------|--------------|----------|
| 1 | `VideoHero` - Hero cu video background | Medie | 3h |
| 2 | `VideoTextSection` - Video + Text 2 coloane | Medie | 3h |
| 3 | `DownloadLinks` - Grid de butoane download PDF | Ușoară | 1h |
| 4 | `FloatingCTA` - Buton fix pe ecran | Ușoară | 1h |
| 5 | `ExpectationsTimeline` - Timeline orizontal cu carduri | Medie | 3h |
| 6 | `ResultsTimeline` - Timeline vertical cu perioadă + bullets | Medie | 2h |
| 7 | `PricingKits` - Carduri pricing cu features | Medie | 3h |
| 8 | `VideoGallery` - Carousel de video-uri | Medie | 3h |

### 3.2 Prioritate MEDIE (Nice to have)

| # | Component | Complexitate | Ore Est. |
|---|-----------|--------------|----------|
| 9 | `NumberedSteps` - Pași numerotați | Ușoară | 1h |
| 10 | `AthleteCards` - Grid testimoniale sportivi | Medie | 2h |
| 11 | `StatsSection` - Lista de statistici | Ușoară | 1h |
| 12 | `AwardsGrid` - Grid premii cu imagini | Ușoară | 1h |

### 3.3 Configurări Noi pentru Blocuri Existente

| Block Existent | Configurări Noi |
|----------------|-----------------|
| `Hero` | `videoUrl`, `videoPoster`, `showMoneyBackBadge` |
| `MediaContent` | `videoUrl`, `videoPosition`, `durationBadge` |
| `Features` | `showStepNumbers`, `stepPrefix` |
| `CTA` | `badgeImage`, `disclaimerText` |
| `Services` | `showFeaturesList`, `showGuarantee` |
| `Testimonials` | `layout: 'athlete-cards'`, `showSport` |

---

## 4. PLAN DE IMPLEMENTARE

### Faza 1: Design Tokens (Deja completat ✅)
- [x] Font Prompt adăugat
- [x] headingWeight configurable (400)
- [x] buttonRounding: pill (24px)
- [x] shadows: none

### Faza 2: Componente Noi Core
1. `VideoTextSection` block
2. `DownloadLinks` block
3. `FloatingCTA` component (global)
4. `ExpectationsTimeline` block

### Faza 3: Extindere Blocuri Existente
1. Hero - video support
2. Features - step numbers
3. CTA - badge și disclaimer

### Faza 4: Componente Secundare
1. `ResultsTimeline` block
2. `PricingKits` block
3. `VideoGallery` block
4. `NumberedSteps` block

### Faza 5: Integrare terapii-energetice Seeder
- Actualizează seeder cu toate blocurile noi
- Test complet cu Playwright

---

## 5. MAPARE PAGINI → BLOCURI

### Homepage plasturi → terapii-energetice

```
1. TopBar ──────────────────→ TopBar (existent)
2. Header ──────────────────→ Header (existent)
3. Video Hero ──────────────→ Hero + videoUrl
4. Video+Text ──────────────→ VideoTextSection (NOU)
5. Process Steps ───────────→ Features + showStepNumbers
6. FAQ Accordion ───────────→ FAQ (existent)
7. Download Links ──────────→ DownloadLinks (NOU)
8. Video+Text ──────────────→ VideoTextSection (NOU)
9. Video Demo ──────────────→ MediaContent + video
10. Expectations ───────────→ ExpectationsTimeline (NOU)
11. Benefits ───────────────→ MediaContent (existent)
12. Numbered Steps ─────────→ NumberedSteps (NOU)
13. Pricing Kits ───────────→ PricingKits (NOU)
14. Warehouse Video ────────→ MediaContent + video
15. Focus Section ──────────→ MediaContent (existent)
16. Results Timeline ───────→ ResultsTimeline (NOU)
17. Newsletter ─────────────→ Newsletter (existent)
18. CTA ────────────────────→ CTA + badge
19. Footer ─────────────────→ Footer (existent)
20. Floating CTA ───────────→ FloatingCTA (NOU global)
```

---

## 6. URMĂTORII PAȘI

1. **Implementare VideoTextSection** - cel mai folosit bloc
2. **Implementare DownloadLinks** - simplu și necesar
3. **Implementare FloatingCTA** - global component
4. **Extindere Hero** cu video support
5. **Implementare ExpectationsTimeline**
6. **Integrare completă în terapii-energetice seeder**
7. **Test Playwright pentru verificare vizuală**
