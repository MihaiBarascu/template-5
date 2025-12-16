# Ghid Testare

## Pași pentru testare

### 1. Build proiect (o singură dată)
```bash
pnpm build
```

### 2. Pornește serverul (Terminal 1)
```bash
pnpm start
# Serverul rulează pe http://localhost:3100
```

### 3. Rulează testele (Terminal 2)

**Unit tests** (nu au nevoie de server):
```bash
pnpm test:unit          # 173 teste, ~1 secundă
```

**E2E tests** (au nevoie de server pornit):
```bash
pnpm test:app           # verificare de bază (~30s)
pnpm test:quick         # verificare rapidă (~1min)
pnpm test:checkout      # flux checkout magazin (~3min)
pnpm test:api           # Payload REST/GraphQL API (~30s)
pnpm test:e2e           # TOATE testele E2E (~5min)
```

## Comenzi rapide

```bash
# Înainte de deploy - verificare completă
pnpm build && pnpm start &
pnpm test:unit && pnpm test:app

# Doar unit tests (fără server)
pnpm test:unit

# Vezi raportul HTML după E2E
pnpm exec playwright show-report
```

## Fișiere de teste

### Unit Tests (`tests/unit/`)
| Fișier | Teste | Descriere |
|--------|-------|-----------|
| `tax.test.ts` | 34 | Calcule TVA - getDisplayPrice, addVat, removeVat |
| `colors.test.ts` | 42 | OKLCH color utilities |
| `cn.test.ts` | 20 | Classnames utility |
| `escapeHtml.test.ts` | 20 | HTML escaping |
| `getMediaUrl.test.ts` | 17 | Media URL generation |
| `deepMerge.test.ts` | 14 | Deep merge objects |
| `rateLimit.test.ts` | 13 | Rate limiting |
| `formatDateTime.test.ts` | 13 | Date formatting |

### E2E Tests (`tests/e2e/`)
| Fișier | Descriere |
|--------|-----------|
| `app.spec.ts` | Homepage, navigație, contact, admin, responsive |
| `quick-check.spec.ts` | Verificare rapidă funcționalitate |
| `ecommerce-checkout.spec.ts` | Flux complet checkout magazin |
| `payload-api.spec.ts` | REST API și GraphQL Payload |

## Configurare

Testele E2E rulează pe **port 3100** (configurat în `playwright.config.ts`).

Pentru alt port:
```bash
TEST_PORT=3200 pnpm test:app
BASE_URL=http://localhost:3200 pnpm test:app
```

## Troubleshooting

### "Connection refused" la E2E
Serverul nu e pornit. Rulează `pnpm start` în alt terminal.

### Unit tests fail cu import errors
Rulează `pnpm build` pentru a genera tipurile.

### E2E timeout
Mărește timeout-ul sau verifică dacă serverul răspunde pe http://localhost:3100
