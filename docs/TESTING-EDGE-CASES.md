# Testare Edge Cases - Ghid Simplu

## Ce sunt Edge Cases?

**Edge cases** = situații rare sau extreme care pot cauza bug-uri.

Exemplu simplu:
- Un utilizator pune **preț 0** la un produs → funcționează calculul TVA?
- Un utilizator pune **cantitate 1.000.000** → site-ul crapă?
- Un hacker încearcă `<script>alert(1)</script>` în formular → e protejat?

---

## Ce am adăugat

### 1. BugMagnet Command (`/bugmagnet`)

**Ce face:** Analizează un fișier și generează teste pentru edge cases pe care nu le-ai acoperit.

**Cum îl folosești:**
```bash
# În Claude Code, conversație nouă:
/bugmagnet src/utilities/tax.ts
```

**Ce primești:** O listă cu teste noi care acoperă cazuri la care nu te-ai gândit.

---

### 2. Edge Cases Utility (`tests/utilities/edgeCases.ts`)

**Ce face:** O colecție de valori "ciudate" pentru teste.

**Exemple:**

```typescript
// Prețuri problematice
numericEdgeCases.prices = [
  0,          // Produs gratuit - merge?
  0.01,       // Preț minim (1 ban)
  0.001,      // Sub-ban - cum rotunjește?
  -10,        // Refund/discount negativ
  99999.99,   // Preț foarte mare
]

// Atacuri XSS
securityEdgeCases.xss = [
  '<script>alert(1)</script>',     // Clasic
  '<img src=x onerror=alert(1)>',  // Via imagine
  // ... 15+ variante
]

// Cantități ciudate
numericEdgeCases.quantities = [
  0,          // Stoc epuizat
  -1,         // Invalid
  0.5,        // Fracțional (produse la kg)
  1000000,    // Foarte mare
]
```

**Cum le folosești în teste:**
```typescript
import { numericEdgeCases } from '@tests/utilities/edgeCases'

// Testează toate prețurile problematice automat
test.each(numericEdgeCases.prices)('calcul TVA pentru preț %s', (pret) => {
  expect(calculeazaTVA(pret)).toBeDefined()
})
```

---

## Ce teste noi am adăugat

### Tax Tests (+29 teste noi)

| Categorie | Ce testează | De ce e important |
|-----------|-------------|-------------------|
| **Prețuri extreme** | 0, 0.01, 99999.99, negative | Evită erori la checkout |
| **Cantități ciudate** | 0, fracțional, foarte mari | Evită calcule greșite în coș |
| **Rotunjire** | 0.005, 10.995 | Evită pierderi/câștiguri din rotunjire |
| **Rate TVA** | 0%, 100%, 0.1% | Asigură flexibilitate |
| **Categorii mixte** | standard + reduced + zero | Verifică breakdown corect |

**Exemplu concret:**
```typescript
// Înainte: Nu testam ce se întâmplă cu preț 0
// Acum: Verificăm explicit
it('handles zero price in cart', () => {
  const items = [{ price: 0, quantity: 5 }]
  const result = calculateCartTotals(items)
  expect(result.total).toBe(0)  // Nu crapă, returnează 0
})
```

---

### Security Tests (+32 teste noi)

| Categorie | Ce testează | De ce e important |
|-----------|-------------|-------------------|
| **XSS Vectors** | 15 tipuri de atacuri | Protecție contra hackerilor |
| **Unicode attacks** | Zero-width chars, RTL | Atacuri ascunse vizual |
| **SQL Injection** | `'; DROP TABLE --` | Verifică că escapează quotes |
| **Attribute injection** | `" onmouseover="` | Protecție în atribute HTML |

**Exemplu concret:**
```typescript
// Verificăm că TOATE variantele de XSS sunt blocate
const xssVectors = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  // ... 12 mai multe
]

test.each(xssVectors)('blochează XSS: %s', (atac) => {
  const escaped = escapeHtml(atac)
  expect(escaped).not.toContain('<')  // Fără HTML executabil
  expect(escaped).not.toContain('>')
})
```

---

## Cum te ajută în practică

### Scenariul 1: Client pune preț greșit
```
Client: "Am pus preț 0 la un produs și checkout-ul a crăpat"
Tu: "Imposibil, avem teste pentru asta" ✅
```

### Scenariul 2: Tentativă de hack
```
Hacker: Încearcă <script>alert(1)</script> în formularul de contact
Site: Afișează textul escaped, nu execută scriptul ✅
```

### Scenariul 3: Rotunjire greșită
```
Înainte: 100 produse x 0.01 lei = 0.99 lei (eroare floating point)
Acum: 100 produse x 0.01 lei = 1.00 lei ✅
```

---

## Cum să rulezi testele

```bash
# Toate testele unitare (268 teste)
pnpm vitest run tests/unit

# Doar tax tests (63 teste)
pnpm vitest run tests/unit/utilities/tax.test.ts

# Doar security tests (52 teste)
pnpm vitest run tests/unit/utilities/escapeHtml.test.ts

# Watch mode (rerulează la modificări)
pnpm vitest tests/unit
```

---

## Cum să adaugi teste noi folosind edge cases

```typescript
import {
  numericEdgeCases,
  stringEdgeCases,
  securityEdgeCases,
  ecommerceEdgeCases
} from '@tests/utilities/edgeCases'

// Test pentru o funcție nouă
describe('Funcția mea nouă', () => {
  // Testează cu toate prețurile problematice
  test.each(numericEdgeCases.prices)('funcționează cu preț %s', (pret) => {
    expect(functiaMea(pret)).toBeDefined()
  })

  // Testează cu string-uri unicode
  test.each(stringEdgeCases.unicode)('acceptă unicode: %s', (text) => {
    expect(functiaMea(text)).not.toThrow()
  })

  // Testează securitatea
  test.each(securityEdgeCases.xss)('blochează XSS: %s', (atac) => {
    const result = functiaMea(atac)
    expect(result).not.toContain('<script>')
  })
})
```

---

## Structura fișierelor

```
tests/
├── utilities/
│   └── edgeCases.ts          # 500+ edge cases gata de folosit
├── unit/
│   ├── utilities/
│   │   ├── tax.test.ts       # 63 teste (inclusiv edge cases)
│   │   └── escapeHtml.test.ts # 52 teste (inclusiv security)
│   └── blocks/
│       └── Portfolio.test.tsx # 34 teste
└── e2e/
    └── app.spec.ts           # Teste end-to-end

.claude/commands/
└── bugmagnet.md              # Slash command pentru analiza automată
```

---

## TL;DR

1. **268 teste** protejează codul tău
2. **Edge cases** = situații extreme care pot cauza bug-uri
3. **Security tests** = protecție contra XSS, SQL injection
4. **`/bugmagnet`** = analiză automată pentru gaps în teste
5. **`edgeCases.ts`** = valori pregătite pentru teste noi

**Rulează `pnpm vitest run tests/unit` înainte de fiecare deploy pentru liniște sufletească.**
