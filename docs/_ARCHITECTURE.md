# DECIZII ARHITECTURALE (ADR)

> **REGULA:** O decizie tehnica se ia O SINGURA DATA si se documenteaza AICI.
> **Consulta acest fisier INAINTE de a lua decizii tehnice noi!**

**Ultima actualizare:** 2025-12-08

---

## Format ADR

```
### [ADR-XXX] Titlu

**Status:** DECIDED | PROPOSED | DEPRECATED
**Data:** YYYY-MM-DD
**Context:** De ce a aparut intrebarea?
**Decizie:** Ce am decis?
**Consecinte:** Ce implica?
**Supersedes:** ADR-YYY (daca inlocuieste alta decizie)
```

---

## DECIZII ACTIVE

### [ADR-001] Cart Storage: Database via Plugin

**Status:** DECIDED
**Data:** 2025-12-08
**Context:** Trebuia ales unde se stocheaza cosul de cumparaturi.

**Decizie:** Folosim plugin-ul oficial `@payloadcms/plugin-ecommerce` care stocheaza cart-ul in DATABASE, nu localStorage.

**Consecinte:**
- Cart sincronizat intre dispozitive
- Validare stoc server-side
- Guest checkout functional
- Trebuie `read: () => true` in carts access pentru checkout
- Componenta corecta: `AddToCart` (NU `AddToCartButton` deprecated)

**Implementare:**
```typescript
// payload.config.ts
carts: {
  cartsCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    access: {
      ...defaultCollection.access,
      create: () => true,
      update: () => true,
      read: () => true,  // OBLIGATORIU pentru checkout
    },
  }),
},
```

---

### [ADR-002] Payment Adapter: Manual (Cash on Delivery)

**Status:** DECIDED
**Data:** 2025-12-08
**Context:** Romania are nevoie de "Plata la livrare" (ramburs).

**Decizie:** Implementam Manual Payment Adapter urmand pattern-ul oficial Stripe din plugin.

**Consecinte:**
- initiatePayment.ts - creeaza Transaction pending
- confirmOrder.ts - creeaza Order, marcheaza cart purchased
- Inventory decrementat AUTOMAT de plugin (nu manual in adapter)
- Status order: `processing` (nu `pending`)

**Implementare:**
```typescript
// src/payments/adapters/manual/index.ts
export const manualAdapter = (args: { label: string }) => ({
  slug: 'manual',
  label: args.label,
  initiatePayment: initiatePayment(),
  confirmOrder: confirmOrder(),
})
```

---

### [ADR-003] Rute Ecommerce

**Status:** DECIDED
**Data:** 2025-12-07
**Context:** Structura URL-urilor pentru shop.

**Decizie:**
- `/produse` - lista toate produsele cu filtre
- `/produse/[slug]` - pagina produs individual
- `/cos` - pagina cos
- `/checkout` - pagina checkout
- Categoriile sunt FILTRE pe `/produse?categorie=X`, nu pagini separate

**Consecinte:**
- O singura pagina pentru toate produsele
- URL params pentru filtrare
- SEO friendly cu slug-uri

---

### [ADR-004] Block Pattern (2 fisiere)

**Status:** DECIDED
**Data:** 2025-12-01
**Context:** Cum structuram blocurile Payload?

**Decizie:** Fiecare bloc are 2 fisiere: `config.ts` + `Component.tsx`

**Consecinte:**
- Separare clara config vs render
- `interfaceName` OBLIGATORIU in config pentru TypeScript
- Export in `blocks/index.ts`
- RenderBlocks.tsx randeaza dinamic

**Structura:**
```
src/blocks/
├── Hero/
│   ├── config.ts      # Configuratia Payload (fields, labels)
│   └── Component.tsx  # Componenta React pentru frontend
├── Services/
│   ├── config.ts
│   └── Component.tsx
└── RenderBlocks.tsx   # Randeaza dinamic toate blocurile
```

---

### [ADR-005] Design System: CSS Variables

**Status:** DECIDED
**Data:** 2025-12-01
**Context:** Cum facem tema configurabila din admin?

**Decizie:** Folosim CSS Variables generate din SiteTheme global.

**Consecinte:**
- NICIODATA culori hardcodate (nu `text-gray-600`)
- INTOTDEAUNA variabile tema (`text-theme-text-light`)
- Border radius cu `var(--radius-card)` etc.
- Schimbarea temei din admin afecteaza instant tot site-ul

**Variabile disponibile:**
- `--theme-primary`, `--theme-secondary`, `--theme-accent`
- `--theme-text`, `--theme-text-light`, `--theme-text-muted`
- `--theme-surface`, `--theme-light`, `--theme-dark`
- `--radius-button`, `--radius-card`, `--radius-input`

---

### [ADR-006] Access Control Pattern

**Status:** DECIDED
**Data:** 2025-12-01
**Context:** Cum gestionam permisiunile?

**Decizie:** Functii reutilizabile in `src/access/index.ts`

**Consecinte:**
- `isAdmin` - doar admin
- `isDocumentOwner` - owner sau admin
- `authenticatedOrPublished` - autentificat sau document published
- `allowGuestCreate` - pentru guest checkout

**Implementare:**
```typescript
// src/access/index.ts
export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const isDocumentOwner: Access = ({ req: { user } }) => {
  if (user?.role === 'admin') return true
  if (user?.id) return { customer: { equals: user.id } }
  return false
}
```

---

### [ADR-007] Hooks: Transaction Safety

**Status:** DECIDED
**Data:** 2025-12-01
**Context:** Cum asiguram atomicitate in hooks?

**Decizie:** INTOTDEAUNA transmite `req` la operatii Local API din hooks.

**Consecinte:**
- Operatiile ruleaza in aceeasi tranzactie
- Rollback automat la erori
- Context disponibil pentru prevenirea loop-urilor

**Implementare:**
```typescript
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        req,  // OBLIGATORIU pentru tranzactie atomica!
      })
    },
  ]
}
```

---

### [ADR-008] Currency: RON (Lei Romanesc)

**Status:** DECIDED
**Data:** 2025-12-01
**Context:** Ce moneda folosim?

**Decizie:** RON ca moneda default si unica suportata.

**Consecinte:**
- Preturi in RON peste tot
- Symbol: "lei"
- Decimals: 2
- Configurabil in ecommerce plugin

**Implementare:**
```typescript
currencies: {
  defaultCurrency: 'RON',
  supportedCurrencies: [
    { code: 'RON', symbol: 'lei', decimals: 2, label: 'Leu Romanesc' },
  ],
},
```

---

### [ADR-009] Documentatie: Structura Organizata

**Status:** DECIDED
**Data:** 2025-12-08
**Context:** Aveam 26+ fisiere MD cu suprapuneri si contradictii.

**Decizie:** Reorganizam in structura ierarhica cu `_INDEX.md` ca Single Source of Truth.

**Consecinte:**
- `docs/_INDEX.md` - index principal, citeste INTAI
- `docs/_ARCHITECTURE.md` - decizii tehnice (acest fisier)
- `docs/active/` - documente valide acum
- `docs/reference/` - info statica
- `docs/lessons/` - lessons learned
- `docs/archive/` - documente inlocuite

**Structura:**
```
docs/
├── _INDEX.md           # Single Source of Truth
├── _ARCHITECTURE.md    # Decizii tehnice (ADR-uri)
├── active/             # Documente ACTIVE
│   ├── plans/
│   ├── practices/
│   └── guides/
├── reference/          # Referinta (info statica)
├── lessons/            # Lessons Learned
└── archive/            # Documente vechi
```

---

## DECIZII DEPRECATED

### [ADR-D01] Cart in localStorage (DEPRECATED)

**Status:** DEPRECATED
**Data Deprecare:** 2025-12-08
**Superseded By:** ADR-001

**Context:** Initial cosul era stocat in localStorage.

**De ce s-a schimbat:** Plugin-ul oficial foloseste database. localStorage nu sincroniza intre dispozitive si nu valida stoc server-side.

---

*Document creat: 2025-12-08*
*Template: Universal Business Website Platform*
