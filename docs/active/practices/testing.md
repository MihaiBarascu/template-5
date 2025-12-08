---
status: ACTIVE
type: practice
created: 2025-12-05
updated: 2025-12-08
related:
  - ../plans/ecommerce.md
tags: [testing, playwright, e2e, automation]
---

# Testing Best Practices

> **Tool:** Playwright pentru E2E
> **Regula:** Testeaza flow-uri complete, nu doar componente izolate

---

## 1. Structura Teste

```
tests/
├── e2e/                          # Teste End-to-End
│   ├── fixtures/
│   │   ├── business-types.ts     # Configuratii business
│   │   └── test-helpers.ts       # Helper functions
│   ├── screenshots/              # Screenshots (gitignore)
│   ├── smoke.spec.ts             # Quick smoke tests
│   ├── all-businesses.spec.ts    # Toate tipurile business
│   ├── ecommerce-checkout.spec.ts # Flow checkout
│   └── visual-regression.spec.ts # Visual tests
└── playwright-report/            # Rapoarte HTML
```

---

## 2. Comenzi Rapide

```bash
# Toate testele E2E
pnpm test:e2e

# Test specific
pnpm test:e2e tests/e2e/smoke.spec.ts

# Cu browser vizibil
pnpm exec playwright test --headed

# Debug mode
pnpm exec playwright test --debug

# Un singur test
pnpm exec playwright test -g "Frizerie"

# Deschide raport
pnpm test:screenshots:show
```

---

## 3. Tipuri Teste

| Tip | Fisier | Durata | Cand |
|-----|--------|--------|------|
| Smoke | `smoke.spec.ts` | ~2 min | Dupa modificari |
| All Businesses | `all-businesses.spec.ts` | ~15 min | Inainte release |
| Checkout | `ecommerce-checkout.spec.ts` | ~5 min | Dupa modificari ecommerce |
| Visual | `visual-regression.spec.ts` | ~10 min | Dupa modificari CSS |

---

## 4. Selectori Robusti

```typescript
// EVITA - fragile
page.locator('.btn-primary')
page.locator('div > span:nth-child(2)')

// PREFERA - robusti
page.getByRole('button', { name: 'Programeaza-te' })
page.getByTestId('contact-form')
page.getByLabel('Email')
page.getByText('Servicii')
```

---

## 5. Asteptari Explicite

```typescript
// EVITA - timeout fix
await page.waitForTimeout(5000)

// PREFERA - asteptari pentru elemente
await page.waitForSelector('[data-loaded="true"]')
await expect(page.getByText('Loaded')).toBeVisible()
await page.waitForLoadState('networkidle')
```

---

## 6. Pattern Test Standard

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: 'Submit' })

    // Act
    await button.click()

    // Assert
    await expect(page.getByText('Success')).toBeVisible()
  })
})
```

---

## 7. Testare Business Types

```bash
# Seed un business
pnpm seed:frizerie

# Porneste serverul
pnpm dev

# Ruleaza testele
pnpm test:e2e tests/e2e/smoke.spec.ts
```

### Business Types Disponibile

| Tip | Seed | Caracteristici |
|-----|------|----------------|
| frizerie | `pnpm seed:frizerie` | Servicii, Echipa |
| dentist | `pnpm seed:dentist` | Servicii medicale |
| restaurant | `pnpm seed:restaurant` | Meniu, Rezervari |
| magazin | `pnpm seed:magazin` | **Ecommerce**: Cos, Checkout |
| salon | `pnpm seed:salon` | Tratamente |
| auto-service | `pnpm seed:auto-service` | Servicii auto |
| fitness | `pnpm seed:fitness` | Clase, Abonamente |

---

## 8. Testare Checkout (Ecommerce)

```typescript
test('should complete checkout flow', async ({ page }) => {
  // 1. Adauga produs in cos
  await page.goto('/produse')
  await page.getByRole('button', { name: 'Adauga in cos' }).first().click()

  // 2. Navigheaza la checkout
  await page.goto('/checkout')

  // 3. Completeaza adresa
  await page.getByLabel('Nume').fill('Test User')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Telefon').fill('0722000000')
  await page.getByLabel('Adresa').fill('Strada Test 123')

  // 4. Selecteaza plata
  await page.getByText('Plata la livrare').click()

  // 5. Plaseaza comanda
  await page.getByRole('button', { name: 'Plaseaza comanda' }).click()

  // 6. Verifica succes
  await expect(page.getByText('Comanda plasata')).toBeVisible()
})
```

---

## 9. Debugging

### Cand un test esueaza:

1. **Verifica raportul HTML:**
```bash
pnpm test:screenshots:show
```

2. **Ruleaza in mod debug:**
```bash
pnpm exec playwright test --debug -g "numele testului"
```

3. **Verifica trace-ul:**
- Deschide `playwright-report/index.html`
- Click pe testul esuat
- Vezi trace-ul pas cu pas

### Probleme Comune

| Problema | Solutie |
|----------|---------|
| Timeout | Mareste timeout in config |
| Element nu e gasit | Foloseste `data-testid` |
| Server nu porneste | Verifica portul liber |

---

## 10. Environment Variables

```bash
# .env.test
BASE_URL=http://localhost:3100
TEST_PORT=3100
SEED_TYPE=frizerie
CI=false
```

---

## 11. Checklist Pre-Release

- [ ] Smoke tests trec
- [ ] All businesses tests trec
- [ ] Checkout flow functional
- [ ] Visual regression OK
- [ ] Nu sunt teste skip-uite

---

*Consolidat din: TESTING.md*
*Verificat: 2025-12-08*
