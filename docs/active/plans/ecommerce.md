---
status: ACTIVE
type: plan
created: 2025-12-01
updated: 2025-12-08
version: "3.67.0+"
related:
  - ../../_ARCHITECTURE.md#adr-001
  - ../../_ARCHITECTURE.md#adr-002
  - ../practices/payload-cms.md
tags: [ecommerce, plugin, cart, checkout, orders]
---

# Ecommerce System - Plan Activ

> **Status:** STABIL SI FUNCTIONAL
> **Plugin:** @payloadcms/plugin-ecommerce v3.67.0+
> **Testat:** 2025-12-08 cu Playwright

---

## 1. Arhitectura Curenta

### Stack Tehnic
- **Payload CMS 3.x** - Headless CMS
- **Next.js 15** - App Router
- **@payloadcms/plugin-ecommerce** - Plugin oficial
- **MongoDB** - Database
- **Resend** - Email notifications

### Colectii Plugin
| Colectie | Scop |
|----------|------|
| `products` | Produse cu preturi, stoc, categorii |
| `carts` | Cosuri de cumparaturi (DB-backed) |
| `orders` | Comenzi finalizate |
| `transactions` | Tranzactii de plata |
| `addresses` | Adrese salvate utilizatori |

### Structura Fisiere
```
src/
├── payments/
│   └── adapters/
│       └── manual/           # Plata la livrare
│           ├── index.ts
│           ├── initiatePayment.ts
│           └── confirmOrder.ts
├── components/
│   ├── cart/
│   │   ├── AddToCart.tsx     # CORECT - foloseste useCart() din plugin
│   │   └── AddToCartButton.tsx # DEPRECATED - localStorage
│   └── ecommerce/
│       ├── ProductCard.tsx
│       ├── ProductSort.tsx
│       └── Breadcrumbs.tsx
├── providers/
│   └── EcommerceProvider.tsx # Wrapper pentru context
└── app/(frontend)/
    ├── produse/
    │   ├── page.tsx          # Lista produse
    │   └── [slug]/page.tsx   # Pagina produs
    ├── cos/page.tsx          # Pagina cos
    └── checkout/page.tsx     # Pagina checkout
```

---

## 2. Configurare Plugin

### payload.config.ts
```typescript
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { manualAdapter } from '@/payments'

ecommercePlugin({
  access: {
    isAdmin,
    isDocumentOwner,
    adminOnlyFieldAccess,
    adminOrPublishedStatus,
    customerOnlyFieldAccess,
  },
  customers: { slug: 'users' },
  addresses: true,
  carts: {
    cartsCollectionOverride: ({ defaultCollection }) => ({
      ...defaultCollection,
      access: {
        ...defaultCollection.access,
        create: () => true,
        update: () => true,
        read: () => true,  // OBLIGATORIU pentru checkout!
      },
    }),
  },
  currencies: {
    defaultCurrency: 'RON',
    supportedCurrencies: [
      { code: 'RON', symbol: 'lei', decimals: 2, label: 'Leu Romanesc' },
    ],
  },
  products: {
    productsCollectionOverride: ({ defaultCollection }) => ({
      ...defaultCollection,
      fields: [
        // Custom fields FIRST
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', unique: true, index: true },
        // Plugin defaults
        ...(defaultCollection.fields || []),
        // Custom fields AFTER
        { name: 'brand', type: 'text', index: true },
        { name: 'tags', type: 'relationship', relationTo: 'product-tags', hasMany: true },
      ],
    }),
  },
  orders: {
    ordersCollectionOverride: ({ defaultCollection }) => ({
      ...defaultCollection,
      access: { ...defaultCollection.access, create: () => true },
      hooks: {
        ...defaultCollection.hooks,
        afterChange: [
          ...(defaultCollection.hooks?.afterChange || []),
          orderEmailHook,  // Notificari email
        ],
      },
    }),
  },
  payments: {
    paymentMethods: [
      manualAdapter({ label: 'Plata la livrare' }),
    ],
  },
})
```

---

## 3. Manual Payment Adapter

### Pattern (bazat pe Stripe oficial)

**initiatePayment.ts:**
- Valideaza cart si customer email
- Creeaza Transaction cu status `pending`
- Returneaza `transactionID` + `skipPaymentUI: true`

**confirmOrder.ts:**
- Gaseste Transaction dupa ID
- Creeaza Order cu status `processing`
- Marcheaza cart ca `purchasedAt`
- Actualizeaza Transaction cu `order` si status `succeeded`
- **NU decrementeaza inventory** (plugin-ul face automat)

---

## 4. Componente Frontend

### AddToCart (CORECT)
```tsx
import { useCart } from '@payloadcms/plugin-ecommerce/client'

export function AddToCart({ product }) {
  const { addItemToCart, isProductInCart, cart } = useCart()

  const handleAddToCart = () => {
    addItemToCart({ product: product.id, quantity: 1 })
  }

  return <button onClick={handleAddToCart}>Adauga in cos</button>
}
```

### ProductCard
- Foloseste `AddToCart` (nu AddToCartButton deprecated)
- Afiseaza badge-uri, preturi, imagini
- Hover effect cu imagine secundara

---

## 5. Checkout Flow

1. User adauga produse in cos (AddToCart → useCart → DB)
2. Navigheaza la /checkout
3. Completeaza adresa (sau selecteaza salvata)
4. Selecteaza metoda livrare (standard/express)
5. Selecteaza metoda plata (manual = ramburs)
6. Click "Plaseaza comanda"
7. Frontend apeleaza `/api/payments/manual/initiate`
8. Plugin creeaza Transaction
9. Frontend apeleaza `/api/payments/manual/confirm`
10. Plugin creeaza Order, marcheaza cart, decrementeaza stoc
11. Hook trimite email-uri (owner + client)
12. Redirect la pagina succes

---

## 6. Troubleshooting

### 404 "Cart not found" la checkout
**Cauza:** Plugin foloseste `overrideAccess: false` cand citeste cart.
**Fix:** Adauga `read: () => true` in carts access.

### Status invalid la Order
**Cauza:** Folosit `pending` (nu exista).
**Fix:** Foloseste `processing`, `completed`, `cancelled`, sau `refunded`.

### Cart nu se sincronizeaza
**Cauza:** Folosit AddToCartButton (localStorage).
**Fix:** Foloseste AddToCart (useCart din plugin).

### Inventory nu se decrementeaza
**Cauza:** Astepti sa o faci manual in adapter.
**Fix:** Plugin-ul face automat dupa ce confirmOrder returneaza transactionID.

---

## 7. Teste Playwright

```bash
# Test checkout flow complet
pnpm exec playwright test tests/e2e/checkout.spec.ts
```

**Flow testat:**
- Adaugare produse in cos
- Navigare la checkout
- Completare adresa
- Selectare livrare/plata
- Plasare comanda
- Verificare Order creat in admin

---

## 8. Istoric Schimbari

| Data | Schimbare |
|------|-----------|
| 2025-12-08 | Fix ProductCard sa foloseasca AddToCart (nu localStorage) |
| 2025-12-08 | Adaugat `read: () => true` in carts access |
| 2025-12-07 | Implementat Manual Payment Adapter |
| 2025-12-01 | Configurare initiala plugin ecommerce |

---

*Consolidat din: ECOMMERCE.md, ECOMMERCE-MIGRATION-PLAN.md, ECOMMERCE-IMPROVEMENT-PLAN.md, SHOP-MIGRATION-PLAN.md, SHOP-IMPLEMENTATION-PLAN.md*
