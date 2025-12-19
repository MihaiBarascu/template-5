# E2E Testing - Template 5

## Quick Start

```bash
# 1. Build și pornește serverul
pnpm build && pnpm start

# 2. În alt terminal, rulează testele
pnpm test:e2e              # Toate testele
pnpm test:e2e checkout     # Doar checkout
pnpm test:e2e --headed     # Cu browser vizibil
```

---

## Comenzi Disponibile

```bash
pnpm test:unit          # Unit tests (nu au nevoie de server)
pnpm test:app           # Verificare de bază (~30s)
pnpm test:quick         # Verificare rapidă (~1min)
pnpm test:checkout      # Flux checkout magazin (~3min)
pnpm test:api           # Payload REST/GraphQL API (~30s)
pnpm test:e2e           # TOATE testele E2E (~5min)
```

---

## Cum Adaugi Un Test Nou

### Pasul 1: Copiază template-ul potrivit

```bash
# Pentru formulare (contact, checkout, booking)
cp tests/e2e/templates/form-validation.template.ts tests/e2e/my-form.spec.ts

# Pentru coș/e-commerce
cp tests/e2e/templates/cart-operations.template.ts tests/e2e/my-cart.spec.ts

# Pentru API
cp tests/e2e/templates/api-testing.template.ts tests/e2e/my-api.spec.ts
```

### Pasul 2: Modifică configurarea

```typescript
// În fișierul tău .spec.ts

// Schimbă URL-ul:
const PAGE_URL = '/checkout'

// Schimbă selectorii:
const SELECTORS = {
  form: 'form',
  name: 'input[name="firstName"]',
  email: 'input[name="email"]',
  // ...
}
```

### Pasul 3: Rulează

```bash
pnpm test:e2e my-form
```

---

## Edge Cases (BugMagnet)

Import și folosește date predefinite pentru teste:

```typescript
import { EDGE } from './data/edge-cases'

// Email
await page.fill('input[name="email"]', EDGE.emails.simple)    // test@example.com
await page.fill('input[name="email"]', EDGE.emails.noAt)      // invalid

// Nume românești
await page.fill('input[name="name"]', EDGE.names.withAccents) // Ștefan Țăranu

// Security
await page.fill('input[name="name"]', EDGE.strings.xss)       // <script>...
await page.fill('input[name="name"]', EDGE.strings.sqlInjection)

// Telefon
await page.fill('input[name="phone"]', EDGE.phones.mobile)    // 0722123456
await page.fill('input[name="phone"]', EDGE.phones.withPrefix)// +40722123456
```

### Categorii Disponibile

| Import | Exemple | Pentru |
|--------|---------|--------|
| `EDGE.strings` | empty, xss, romanian | Orice text |
| `EDGE.emails` | simple, noAt, spaces | Email |
| `EDGE.phones` | mobile, withPrefix | Telefon |
| `EDGE.names` | withAccents, veryLong | Nume |
| `EDGE.prices` | zero, oneBan, veryLarge | Prețuri |
| `EDGE.quantities` | zero, negative | Cantități |
| `EDGE.addresses` | simple, withAccents | Adrese |
| `EDGE.postalCodes` | bucuresti, tooShort | Cod poștal |

---

## Structura Fișierelor

```
tests/e2e/
├── data/
│   └── edge-cases.ts          # Date BugMagnet
├── templates/                  # ← COPIAZĂ DE AICI
│   ├── form-validation.template.ts
│   ├── cart-operations.template.ts
│   └── api-testing.template.ts
├── fixtures/
│   └── test-helpers.ts        # Helper functions
└── *.spec.ts                  # Testele tale
```

---

## Exemple Rapide

### Test formular respinge email invalid

```typescript
test('rejects invalid email', async ({ page }) => {
  await page.fill('input[name="email"]', EDGE.emails.noAt)
  await page.click('button[type="submit"]')
  await expect(page.locator('.error')).toBeVisible()
})
```

### Test acceptă caractere românești

```typescript
test('accepts Romanian characters', async ({ page }) => {
  await page.fill('input[name="name"]', EDGE.names.withAccents)
  await page.click('button[type="submit"]')
  await expect(page.locator('.error')).not.toBeVisible()
})
```

### Test XSS security

```typescript
test('escapes XSS', async ({ page }) => {
  await page.fill('input[name="name"]', EDGE.strings.xss)
  await page.click('button[type="submit"]')
  // Verifică că scriptul nu se execută
})
```

---

## Checklist Test Nou

- [ ] Am copiat template-ul potrivit
- [ ] Am modificat URL și selectori
- [ ] Am testat happy path
- [ ] Am testat câmpuri goale
- [ ] Am testat caractere românești (ăîșțâ)
- [ ] Am testat XSS/injection
- [ ] Testele trec: `pnpm test:e2e [fisier]`

---

## Troubleshooting

| Problemă | Soluție |
|----------|---------|
| "Connection refused" | Pornește serverul: `pnpm start` |
| "Element not found" | Verifică selectorii în DevTools |
| "Timeout" | Adaugă `await page.waitForLoadState('networkidle')` |
| Test flaky | Adaugă `await page.waitForTimeout(500)` |

**Debug cu browser vizibil:**
```bash
pnpm test:e2e --headed
```

**Vezi raport HTML:**
```bash
pnpm exec playwright show-report
```

---

## Configurare

Testele E2E rulează pe **port 3100** (configurat în `playwright.config.ts`).

Pentru alt port:
```bash
BASE_URL=http://localhost:3200 pnpm test:e2e
```
