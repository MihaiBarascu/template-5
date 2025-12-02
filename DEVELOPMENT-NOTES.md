# Development Notes - Template 5

## Probleme Rezolvate in Sesiunea Curenta

### 1. Problema: Imaginile Hero Gresite la Seed

**Simptom:** Cand se ruleaza testele pentru toate cele 8 tipuri de business, toate site-urile afisau aceeasi imagine hero (barbershop) in loc de imaginea specifica fiecarui business.

**Cauza:**
- Payload CMS stocheaza imaginile uploadate in folder-ul `/media/`
- Toate imaginile hero se numeau `hero-main.jpg` indiferent de business
- Cand se facea seed pentru un nou business, imaginile vechi ramaneau in `/media/`
- Payload nu sterge automat fisierele cand stergi inregistrarile din baza de date

**Solutia:**
1. Am modificat `src/seed/index.ts` pentru a sterge SI fisierele din `/media/`:
```typescript
// Clear media files from filesystem
const mediaDir = path.join(process.cwd(), 'media')
if (fs.existsSync(mediaDir)) {
  const files = fs.readdirSync(mediaDir)
  for (const file of files) {
    const filePath = path.join(mediaDir, file)
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath)
    }
  }
  console.log(`   Cleared media files: ${files.length} files`)
}
```

2. Am adaugat functia `clearImageCache()` in `src/seed/helpers.ts`:
```typescript
export function clearImageCache(): void {
  imageCache.clear()
  console.log('   Image cache cleared')
}
```

3. Am apelat `clearImageCache()` dupa `clearData()` in index.ts

---

### 2. Problema: CSS nu se Incarca

**Simptom:** Site-ul se incarca fara stiluri CSS.

**Cauza:** Next.js cache-uieste CSS-ul compilat in `.next/`. Daca se fac modificari sau se intampla ceva gresit, cache-ul poate deveni corupt.

**Solutia:**
```bash
# Sterge cache-ul Next.js si reporneste serverul
rm -rf .next && pnpm dev
```

---

### 3. Structura Imaginilor pe Business

Fiecare business are imaginile organizate astfel:
```
public/images/{business-type}/
  ├── hero/
  │   ├── hero-main.jpg    (imaginea principala pentru hero section)
  │   └── hero-alt.jpg     (imaginea alternativa)
  ├── team/
  │   ├── {role}-1.jpg
  │   └── {role}-2.jpg
  ├── gallery/
  │   ├── gallery-1.jpg
  │   └── gallery-6.jpg
  └── services/ (optional)
```

Business types:
- `barbershop` - Frizerie
- `dentist` - Cabinet Stomatologic
- `restaurant` - Restaurant
- `auto-service` - Service Auto
- `salon` - Salon Infrumusetare
- `avocat` - Cabinet Avocat
- `constructii` - Firma Constructii
- `magazin` - Magazin Online

---

## Teste E2E cu Playwright

### Rulare Teste

```bash
# Ruleaza toate testele de screenshot pentru toate 8 business-uri
pnpm test:screenshots

# Vezi raportul Playwright
pnpm test:screenshots:show
```

### Locatie Screenshots
Toate screenshot-urile sunt salvate in: `tests/e2e/screenshots/`

Format nume fisiere:
- `{business}-desktop-full.png` - Pagina completa desktop
- `{business}-desktop-viewport.png` - Doar viewport-ul vizibil
- `{business}-mobile-full.png` - Pagina completa mobil
- `{business}-mobile-viewport.png` - Viewport mobil
- `{business}-section-{n}.png` - Sectiuni individuale

---

## Comenzi Utile

### Seed Database

```bash
# Seed pentru un business specific
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

### Server Management

```bash
# Pornire normala
pnpm dev

# Restart cu stergere cache
rm -rf .next && pnpm dev

# Restart complet (cache + media)
rm -rf .next media/* && pnpm dev

# Oprire server
lsof -ti:3000 | xargs kill -9
```

### Debugging

```bash
# Verifica ce imagini sunt in media
ls -la media/

# Verifica MD5 sum pentru imagini hero
md5sum public/images/*/hero/hero-main.jpg

# Verifica daca serverul ruleaza
curl -s http://localhost:3000 | head -5
```

---

## Arhitectura Sistemului

### Fluxul de Seed

1. `pnpm seed` porneste `src/seed/index.ts`
2. Se citeste `SEED_TYPE` din env vars
3. Se apeleaza `clearData()` care:
   - Sterge toate documentele din colectii (pages, services, team, etc.)
   - Sterge fisierele din `/media/`
4. Se apeleaza `clearImageCache()` pentru a reseta cache-ul de imagini
5. Se ruleaza seeder-ul specific (ex: `seedFrizerie()`)
6. Seeder-ul:
   - Uploadeaza imaginile din `public/images/{business}/`
   - Configureaza tema
   - Creeaza business info, header, footer
   - Creeaza servicii, echipa, testimoniale
   - Creeaza pagini (homepage, servicii, contact, etc.)

### Cache-uri de Luat in Considerare

1. **Next.js Cache** (`.next/`)
   - Cache pentru pagini compilate
   - Cache pentru imagini optimizate
   - Trebuie sters cand apar probleme de CSS/JS

2. **Image Cache** (in memorie, `helpers.ts`)
   - Map care tine minte imaginile deja uploadate
   - Evita re-uploadarea aceleiasi imagini
   - Se reseteaza la fiecare seed nou

3. **Payload Media** (`/media/`)
   - Fisierele fizice uploadate
   - NU se sterg automat la DELETE din DB
   - Trebuie sterse manual la seed

---

## Probleme Cunoscute si Workaround-uri

### 1. Imagini Corupte
Unele imagini genereaza eroare "File buffer returned no detectable MIME type".

**Workaround:** Regenereaza imaginea sau verifica formatul.

### 2. Imagini Lipsa
Seed-ul continua chiar daca unele imagini lipsesc.

**Verificare:**
```bash
# Verifica ce imagini exista pentru un business
ls public/images/dentist/
```

### 3. ISR (Incremental Static Regeneration)
Dupa seed, pagina poate afisa date vechi.

**Solutie:** Asteapta 2-3 secunde sau face refresh manual.

---

## Imbunatatiri Viitoare

1. **Adaugare verificare imagini la seed** - Verifica daca toate imaginile definite in seed-data.ts exista
2. **Batch upload** - Upload imagini in paralel pentru viteza
3. **Better error handling** - Log-uri mai clare pentru imagini lipsa
4. **Image validation** - Verifica MIME type inainte de upload
5. **Cleanup command** - Comanda dedicata pentru cleanup complet
