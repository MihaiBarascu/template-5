# Catalog Shadcn Blocks - Referință Rapidă

## Statistici

- **Total Blocuri Shadcn:** 1,148+ componente
- **Blocuri în PayBlocks (Payload-ready):** 70+
- **Categorii principale:** 50+

---

## Categorii și Număr de Variante

| Categorie | Nr. Variante | Descriere |
|-----------|--------------|-----------|
| **Hero** | 176 | Secțiuni de introducere, banner principal |
| **Feature** | 274 | Prezentare funcționalități, caracteristici |
| **Gallery** | 48 | Galerii foto, portofolii vizuale |
| **Pricing** | 35 | Tabele prețuri, pachete, abonamente |
| **Testimonial** | 28 | Recenzii clienți, feedback |
| **Footer** | 25 | Footer-uri multi-coloană |
| **CTA** | 26 | Call-to-action, butoane acțiune |
| **Blog** | 22 | Liste articole, preview-uri |
| **Services** | 19 | Prezentare servicii |
| **Contact** | 17 | Formulare contact, info |
| **FAQ** | 15+ | Întrebări frecvente, acordeoane |
| **Team** | 15+ | Prezentare echipă |
| **Stats** | 12+ | Statistici, numere, contoare |
| **About** | 10+ | Despre noi, istoric |
| **Project** | 33 | Portofolii proiecte |
| **Logos** | 10+ | Parteneri, clienți |

---

## Stiluri de Design Disponibile

### Hero Styles
1. **Centered** - Text centrat cu CTA
2. **Split Layout** - Text + imagine side-by-side
3. **Video Background** - Video fullscreen în fundal
4. **Gradient** - Gradienți animați
5. **Minimal** - Design curat, focus pe text
6. **With Form** - Formular integrat (booking/newsletter)

### Feature Styles
1. **Grid** - Cards într-un grid uniform
2. **Bento** - Layout asimetric modern
3. **Alternating** - Text și imagine alternând
4. **Icon Grid** - Iconițe cu descrieri
5. **Tabs** - Funcționalități în tabs

### Gallery Styles
1. **Grid** - Imagini uniforme
2. **Masonry** - Layout Pinterest-style
3. **Carousel** - Slider cu arrows
4. **Lightbox** - Click pentru mărire
5. **Filter** - Cu filtrare pe categorii

### Testimonial Styles
1. **Cards** - Grid de carduri
2. **Carousel** - Rotire automată
3. **Single Featured** - Un testimonial mare
4. **Video** - Video testimonials
5. **Masonry** - Layout variat

### Pricing Styles
1. **Cards** - Carduri verticale
2. **Table** - Tabel comparativ
3. **Toggle** - Monthly/Yearly switch
4. **Highlighted** - Cu plan recomandat evidențiat

---

## Componente Specifice Business-urilor

### Pentru Saloane/Frizerii
- PriceListDotted (lista prețuri cu linie punctată)
- BeforeAfter (comparație înainte/după)
- Team cu specializări
- Booking inline

### Pentru Restaurante
- Menu cu categorii
- Reservation form
- Gallery cu filtrare
- Hours/Location

### Pentru Cabinete Medicale
- Doctor cards cu credentials
- Services cu durate
- Booking cu calendar
- FAQ medical

### Pentru Service Auto
- Service categories cu iconițe
- Gallery before/after
- Price list categorized
- Stats (ani experiență, mașini reparate)

### Pentru Avocați
- Practice areas
- Team cu specializări juridice
- Case studies/Success stories
- Contact profesional

### Pentru Construcții
- Project portfolio cu galerie
- Timeline proiecte
- Certifications bar
- Stats (proiecte finalizate, mp construiți)

### Pentru Magazine
- Product carousel
- Category grid
- Promo banners
- Benefits bar

---

## Pattern de Implementare pentru Variante

```typescript
// 1. Config cu designVersion
{
  name: 'designVersion',
  type: 'select',
  options: [
    { label: 'Grid Layout', value: 'GRID' },
    { label: 'Carousel', value: 'CAROUSEL' },
    { label: 'Masonry', value: 'MASONRY' },
  ],
  defaultValue: 'GRID',
}

// 2. Component router
const variants = { GRID, CAROUSEL, MASONRY }
const Component = variants[designVersion] || GRID
return <Component {...props} />
```

---

## Priorități pentru Sistemul Nostru

### Must Have (Prioritate 1)
- [ ] Hero cu 6 variante
- [ ] Services cu 5 variante
- [ ] LogosBlock (nou)
- [ ] SplitViewBlock (nou)

### Should Have (Prioritate 2)
- [ ] Team cu 4 variante
- [ ] Testimonials cu 5 variante
- [ ] Gallery cu 5 variante
- [ ] TimelineBlock (nou)

### Nice to Have (Prioritate 3)
- [ ] AboutBlock cu variante
- [ ] ComparisonBlock (nou)
- [ ] Pricing cu variante
- [ ] FAQ cu variante
- [ ] Contact cu variante

---

## Link-uri Utile

- [Shadcn Blocks](https://www.shadcnblocks.com/)
- [PayBlocks Demo](https://demo-payblocks.trieb.work/)
- [PayBlocks Docs](https://docs.shadcnblocks.com/payload/getting-started/)
- [Payload Blocks Field](https://payloadcms.com/docs/fields/blocks)
