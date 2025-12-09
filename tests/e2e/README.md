# Ghid Teste E2E - Playwright

## Comenzi Rapide

```bash
# Rulează TOATE testele (durează ~15-20 minute)
pnpm test:e2e

# Rulează un singur fișier de teste
pnpm test:e2e tests/e2e/payload-api.spec.ts

# Rulează mai multe fișiere
pnpm test:e2e tests/e2e/payload-api.spec.ts tests/e2e/admin-auth.spec.ts

# Rulează teste care conțin un anumit text în nume
pnpm test:e2e --grep "frizerie"
pnpm test:e2e --grep "Homepage"

# Rulează și deschide raportul HTML
pnpm test:e2e && pnpm exec playwright show-report
```

## Fișiere de Teste Disponibile

| Fișier | Descriere | Durată |
|--------|-----------|--------|
| `payload-api.spec.ts` | Testează REST API și GraphQL Payload CMS | ~30s |
| `admin-auth.spec.ts` | Testează autentificarea și admin panel | ~30s |
| `contact-form.spec.ts` | Testează formularul de contact | ~2min |
| `homepage.spec.ts` | Testează homepage pentru toate business-urile | ~10min |
| `production-ready.spec.ts` | Verificare completă pentru producție | ~3min |
| `smoke.spec.ts` | Teste rapide pentru toate 9 tipurile de business | ~15min |
| `all-businesses.spec.ts` | Screenshot-uri pentru toate business-urile | ~15min |
| `visual-regression.spec.ts` | Screenshot-uri desktop și mobile | ~5min |
| `ecommerce-checkout.spec.ts` | Testează fluxul de checkout (magazin) | ~3min |
| `quick-check.spec.ts` | Verificare rapidă că site-ul funcționează | ~1min |
| `images-loaded.spec.ts` | Verifică încărcarea corectă a imaginilor | ~10min |
| `seo.spec.ts` | Verifică meta tags, Open Graph, JSON-LD, heading hierarchy | ~5min |
| `lighthouse.spec.ts` | Audit Lighthouse (Performance, Accessibility, SEO) | ~3min |

## Teste Recomandate

### Pentru verificare rapidă (înainte de deploy):
```bash
pnpm test:e2e tests/e2e/payload-api.spec.ts tests/e2e/admin-auth.spec.ts tests/e2e/quick-check.spec.ts
```

### Pentru verificare completă API:
```bash
pnpm test:e2e tests/e2e/payload-api.spec.ts tests/e2e/admin-auth.spec.ts
```

### Pentru verificare UI cu un business:
```bash
pnpm test:e2e tests/e2e/production-ready.spec.ts
```

### Pentru a testa toate tipurile de business:
```bash
pnpm test:e2e tests/e2e/smoke.spec.ts
```

### Pentru screenshot-uri vizuale:
```bash
pnpm test:e2e tests/e2e/visual-regression.spec.ts
# Screenshot-urile sunt salvate în: tests/e2e/screenshots/
```

### Pentru verificare imagini (cu --with-images):
```bash
# 1. Seed cu imagini (obligatoriu prima dată)
pnpm seed -- --with-images
# SAU pentru un business specific:
sh run-seed.sh frizerie with-images

# 2. Verificare rapidă (fără reseed)
pnpm test:images:quick

# 3. Teste complete (re-seed automat)
pnpm test:images
```

**Ce verifică testele de imagini:**
- ✓ Imaginile au `src` valid (nu `undefined` sau gol)
- ✓ Imaginile se încarcă efectiv (`naturalWidth > 0`)
- ✓ Nu există cereri 404 pentru imagini
- ✓ Next.js Image optimization funcționează
- ✓ Atributul `sizes` este prezent (SEO)
- ✓ `/api/media` returnează imagini

### Pentru verificare SEO:
```bash
# Verificare rapidă (fără reseed)
pnpm test:seo:quick

# Teste complete (re-seed 3 business-uri)
pnpm test:seo
```

**Ce verifică testele SEO:**
- ✓ Title tag (10-70 caractere)
- ✓ Meta description (50-170 caractere)
- ✓ Open Graph tags (og:title, og:description, og:image, og:type)
- ✓ Twitter Card tags
- ✓ Un singur H1 pe pagină
- ✓ Heading hierarchy (H1 → H2 → H3, fără skip-uri)
- ✓ Alt text pe toate imaginile
- ✓ Canonical URL
- ✓ sitemap.xml valid
- ✓ robots.txt valid
- ✓ JSON-LD structured data (Organization/LocalBusiness)
- ✓ Link-uri interne valide (fără undefined/null)
- ✓ Titluri unice pe pagini diferite
- ✓ Lazy loading pe imagini

### Pentru audit Lighthouse (Performance, Accessibility, SEO):
```bash
# Generează raport fără threshold-uri (nu fail-uiește)
pnpm test:lighthouse:quick

# Teste complete cu threshold-uri
pnpm test:lighthouse
```

**Ce verifică testele Lighthouse:**
- ✓ **Performance** (LCP, FID, CLS, TTFB)
- ✓ **Accessibility** (contrast, ARIA, keyboard navigation)
- ✓ **Best Practices** (HTTPS, console errors, image aspect ratio)
- ✓ **SEO** (meta tags, crawlability, mobile-friendly)

**Threshold-uri (Development / Production):**
| Categorie | Dev | Prod (CI) |
|-----------|-----|-----------|
| Performance | 50 | 70 |
| Accessibility | 70 | 85 |
| Best Practices | 70 | 85 |
| SEO | 70 | 85 |

Rapoartele HTML sunt salvate în: `tests/e2e/lighthouse-reports/`

## Configurare

Testele rulează pe portul **3100** (definit în `playwright.config.ts`).

Variabile de mediu opționale:
```bash
# Schimbă portul
TEST_PORT=3200 pnpm test:e2e

# Schimbă URL-ul de bază
BASE_URL=http://localhost:3005 pnpm test:e2e

# Testează un anumit tip de business (pentru production-ready)
SEED_TYPE=dentist pnpm test:e2e tests/e2e/production-ready.spec.ts
```

## Tipuri de Business Disponibile

1. `frizerie` - Barbershop
2. `dentist` - Cabinet stomatologic
3. `avocat` - Cabinet avocat
4. `restaurant` - Restaurant / Cafenea
5. `auto-service` - Service auto
6. `constructii` - Firmă construcții
7. `salon` - Salon înfrumusețare
8. `magazin` - Magazin online (cu ecommerce)
9. `fitness` - Sală fitness

## Raportul HTML

După rularea testelor, poți vedea raportul detaliat:
```bash
pnpm exec playwright show-report
```

Raportul include:
- Status fiecare test (passed/failed)
- Screenshot-uri la erori
- Timeline execuție
- Erori detaliate

## Troubleshooting

### Eroare: "Port already in use"
```bash
# Oprește procesul de pe portul 3100
lsof -ti:3100 | xargs kill -9
```

### Eroare: "Duplicate slug"
Testele rulează cu 1 worker pentru a evita conflicte de seed. Dacă vezi această eroare:
```bash
# Rulează cu forță 1 worker
pnpm test:e2e --workers=1
```

### Testele durează prea mult
Rulează doar testele care te interesează:
```bash
# Doar API (rapid)
pnpm test:e2e tests/e2e/payload-api.spec.ts

# Doar un business
pnpm test:e2e --grep "frizerie"
```

## CI/CD

Pentru GitHub Actions sau alt CI:
```bash
CI=true pnpm test:e2e
```

În CI:
- Rulează cu 1 worker
- Are 2 retry-uri la eșec
- Timeout: 90 secunde per test
