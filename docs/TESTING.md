# Ghid Complet de Testare Automată

Acest document explică cum să rulezi și să întreții testele automate pentru template-5.

## Cuprins

1. [Structura Testelor](#structura-testelor)
2. [Tipuri de Teste](#tipuri-de-teste)
3. [Comenzi Rapide](#comenzi-rapide)
4. [Testare pe Business Type](#testare-pe-business-type)
5. [Configurare Playwright](#configurare-playwright)
6. [Debugging Teste](#debugging-teste)
7. [CI/CD Integration](#cicd-integration)
8. [Best Practices](#best-practices)
9. [Mentenanță](#mentenanță)

---

## Structura Testelor

```
template-5/
├── tests/
│   ├── e2e/                          # Teste End-to-End (Playwright)
│   │   ├── fixtures/
│   │   │   ├── business-types.ts     # Configurații pentru toate business-urile
│   │   │   └── test-helpers.ts       # Helper functions reutilizabile
│   │   ├── screenshots/              # Screenshots generate (gitignore)
│   │   ├── all-businesses.spec.ts    # Teste complete pentru toate 8 tipuri
│   │   ├── smoke.spec.ts             # Quick smoke tests
│   │   ├── homepage.spec.ts          # Teste homepage
│   │   ├── contact-form.spec.ts      # Teste formulare
│   │   ├── visual-regression.spec.ts # Visual regression tests
│   │   └── production-ready.spec.ts  # Teste de pregătire producție
│   └── int/                          # Teste Integration (Vitest) - TODO
├── playwright.config.ts              # Configurare Playwright
├── vitest.config.mts                 # Configurare Vitest
└── playwright-report/                # Rapoarte HTML generate
```

---

## Tipuri de Teste

### 1. Smoke Tests (`smoke.spec.ts`)

**Scop:** Verificare rapidă că site-ul funcționează
**Durată:** ~2 minute
**Când să rulezi:** După fiecare modificare majoră

```bash
pnpm test:e2e tests/e2e/smoke.spec.ts
```

### 2. All Businesses Tests (`all-businesses.spec.ts`)

**Scop:** Testare completă pentru toate cele 8 tipuri de business
**Durată:** ~15-20 minute
**Când să rulezi:** Înainte de release

```bash
pnpm test:e2e tests/e2e/all-businesses.spec.ts
```

### 3. Production Ready Tests (`production-ready.spec.ts`)

**Scop:** Verificare completă că site-ul e gata pentru producție
**Durată:** ~30-45 minute per business
**Când să rulezi:** Final QA înainte de deploy

```bash
pnpm test:e2e tests/e2e/production-ready.spec.ts
```

### 4. Visual Regression Tests (`visual-regression.spec.ts`)

**Scop:** Detectare modificări vizuale neintenționate
**Durată:** ~10 minute
**Când să rulezi:** După modificări CSS/layout

```bash
pnpm test:screenshots
```

---

## Comenzi Rapide

### Rulare teste

```bash
# Toate testele E2E
pnpm test:e2e

# Test specific
pnpm test:e2e tests/e2e/smoke.spec.ts

# Toate testele (E2E + Integration)
pnpm test

# Screenshots pentru toate business-urile
pnpm test:screenshots

# Deschide raportul HTML
pnpm test:screenshots:show
```

### Debugging

```bash
# Mod interactiv cu UI
pnpm exec playwright test --ui

# Cu browser vizibil
pnpm exec playwright test --headed

# Debug mode (pas cu pas)
pnpm exec playwright test --debug

# Rulează un singur test
pnpm exec playwright test -g "Frizerie"
```

### Generare screenshots baseline

```bash
# Generează screenshots noi pentru comparație
pnpm test:screenshots
```

---

## Testare pe Business Type

### Business Types Disponibile

| Tip            | Seed Command             | Caracteristici                 |
| -------------- | ------------------------ | ------------------------------ |
| `frizerie`     | `pnpm seed:frizerie`     | Servicii, Echipă, Programări   |
| `dentist`      | `pnpm seed:dentist`      | Servicii medicale, Doctori     |
| `avocat`       | `pnpm seed:avocat`       | Servicii juridice, Consultanță |
| `restaurant`   | `pnpm seed:restaurant`   | Meniu, Galerie, Rezervări      |
| `auto-service` | `pnpm seed:auto-service` | Servicii auto, Prețuri         |
| `constructii`  | `pnpm seed:constructii`  | Portofoliu, Proiecte           |
| `salon`        | `pnpm seed:salon`        | Tratamente, Stiliste           |
| `magazin`      | `pnpm seed:magazin`      | Produse, Coș, Checkout         |

### Testare manuală rapidă

```bash
# 1. Seed un business
pnpm seed:frizerie

# 2. Pornește serverul
pnpm dev

# 3. Rulează testele
pnpm test:e2e tests/e2e/smoke.spec.ts
```

### Testare completă pentru un business

```bash
# Testează complet frizerie
SEED_TYPE=frizerie pnpm test:e2e tests/e2e/production-ready.spec.ts
```

---

## Configurare Playwright

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  // Retry la eșec (2 în CI, 0 local)
  retries: process.env.CI ? 2 : 0,

  // Workers (1 în CI pentru stabilitate, nelimitat local)
  workers: process.env.CI ? 1 : undefined,

  // Reporter HTML
  reporter: 'html',

  // Configurare globală
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Browsere testate
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Start server automat
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### Environment Variables

```bash
# .env.test
BASE_URL=http://localhost:3005
TEST_PORT=3005
SEED_TYPE=frizerie
DESIGN_VARIANT=0
CI=false
```

> **Notă:** Testele folosesc portul 3005 implicit pentru a evita conflicte cu alte servicii (ex: Dokploy pe 3000). Poți schimba cu `TEST_PORT=3006 pnpm test:e2e`

---

## Debugging Teste

### Când un test eșuează

1. **Verifică raportul HTML:**

   ```bash
   pnpm test:screenshots:show
   ```

2. **Rulează în mod debug:**

   ```bash
   pnpm exec playwright test --debug -g "numele testului"
   ```

3. **Verifică trace-ul:**
   - Deschide `playwright-report/index.html`
   - Click pe testul eșuat
   - Vezi trace-ul pas cu pas

### Probleme comune

| Problemă             | Soluție                                      |
| -------------------- | -------------------------------------------- |
| Timeout la încărcare | Mărește `timeout` în config sau test         |
| Element nu e găsit   | Verifică selectorul, folosește `data-testid` |
| Screenshot diferit   | Regenerează baseline cu `--update-snapshots` |
| Server nu pornește   | Verifică că portul 3000 e liber              |

---

## CI/CD Integration

### GitHub Actions

Creează `.github/workflows/test.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps

      - name: Setup test database
        run: |
          # MongoDB in-memory sau test DB
          pnpm seed:frizerie

      - name: Run Playwright tests
        run: pnpm test:e2e
        env:
          CI: true
          BASE_URL: http://localhost:3000

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-screenshots
          path: tests/e2e/screenshots/
          retention-days: 30
```

### Testare automată la fiecare PR

Adaugă în workflow:

```yaml
- name: Test all business types
  run: |
    for type in frizerie dentist avocat restaurant auto-service constructii salon magazin; do
      echo "Testing $type..."
      SEED_TYPE=$type pnpm seed
      pnpm test:e2e tests/e2e/smoke.spec.ts
    done
```

---

## Best Practices

### 1. Structură Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup comun
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: 'Submit' });

    // Act
    await button.click();

    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### 2. Selectori robuști

```typescript
// ❌ Evită
page.locator('.btn-primary');
page.locator('div > span:nth-child(2)');

// ✅ Preferă
page.getByRole('button', { name: 'Programează-te' });
page.getByTestId('contact-form');
page.getByLabel('Email');
page.getByText('Servicii');
```

### 3. Așteptări explicite

```typescript
// ❌ Evită timeouts fixe
await page.waitForTimeout(5000);

// ✅ Preferă așteptări pentru elemente
await page.waitForSelector('[data-loaded="true"]');
await expect(page.getByText('Loaded')).toBeVisible();
await page.waitForLoadState('networkidle');
```

### 4. Test data management

```typescript
// fixtures/test-data.ts
export const testUser = {
  name: 'Test Playwright',
  email: 'test@playwright.dev',
  phone: '0722000000',
};

// În test
import { testUser } from './fixtures/test-data';

test('should submit form', async ({ page }) => {
  await page.getByLabel('Nume').fill(testUser.name);
  await page.getByLabel('Email').fill(testUser.email);
});
```

---

## Mentenanță

### Când să actualizezi testele

1. **După adăugare feature nou** - Adaugă teste pentru noul feature
2. **După modificare UI** - Actualizează selectori și screenshots
3. **După modificare flow** - Actualizează pașii din teste
4. **După adăugare business type** - Adaugă în `business-types.ts`

### Actualizare screenshots baseline

```bash
# Regenerează toate screenshots
pnpm test:screenshots -- --update-snapshots

# Sau doar pentru un business
SEED_TYPE=frizerie pnpm test:screenshots -- --update-snapshots
```

### Cleanup periodic

```bash
# Șterge screenshots vechi
rm -rf tests/e2e/screenshots/*

# Șterge rapoarte
rm -rf playwright-report/*

# Regenerează
pnpm test:screenshots
```

### Verificare sănătate teste

```bash
# Rulează toate testele și verifică că trec
pnpm test

# Verifică că nu sunt teste skip-uite
grep -r "test.skip" tests/e2e/
```

---

## Troubleshooting

### MongoDB nu pornește

```bash
# Verifică dacă MongoDB rulează
mongosh --eval "db.adminCommand('ping')"

# Sau folosește memoria
PAYLOAD_DROP_DATABASE=true pnpm test
```

### Port ocupat

```bash
# Găsește procesul
lsof -i :3000

# Oprește-l
kill -9 <PID>

# Sau folosește alt port
PORT=3100 pnpm dev
```

### Teste lente

1. Rulează în paralel (local)
2. Folosește `test.describe.parallel()`
3. Reduce screenshots în CI

---

## Resurse

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Payload CMS Testing](https://payloadcms.com/docs)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

---

_Ultima actualizare: Decembrie 2025_
