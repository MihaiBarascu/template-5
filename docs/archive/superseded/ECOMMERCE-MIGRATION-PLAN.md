# Plan Migrare la Ecommerce Plugin 100% Oficial

## Ce oferă plugin-ul oficial (și vom folosi 100%)

### 1. **EcommerceProvider** - Context pentru toată aplicația
```tsx
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
```
- Gestionează cart în database (NU localStorage)
- Oferă hooks: `useCart()`, `usePayments()`, `useAddresses()`
- Validare automată stoc
- Decrementare automată inventory

### 2. **useCart()** - Gestionare coș
```tsx
const { cart, addItem, removeItem, incrementItem, decrementItem, isLoading } = useCart()
```
- Cart salvat în DB
- Sincronizat între dispozitive (dacă user e logat)
- Verifică automat inventory la fiecare operație

### 3. **usePayments()** - Flow plată
```tsx
const { initiatePayment } = usePayments()
```
- `initiatePayment()` → validează stoc → creează transaction
- `confirmOrder()` → decrementează inventory automat

### 4. **Inventory Management**
- Plugin validează stocul înainte de plată
- Plugin decrementează inventory după confirmare
- Totul atomic și sigur

---

## Ce trebuie să facem

### Faza 1: Setup Provider (obligatoriu)

**Fișier: `src/providers/Ecommerce.tsx`** (NOU)
```tsx
'use client'
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'

// Payment adapter opțional - dacă nu e Stripe, folosim "manual"
const paymentMethods = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? [stripeAdapterClient({ publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY })]
  : [manualPaymentAdapter()] // Adapter custom pentru "plată la livrare"

export function EcommerceProviderWrapper({ children }) {
  return (
    <EcommerceProvider
      enableVariants={false} // OPȚIONAL - activezi când vrei variante
      paymentMethods={paymentMethods}
      api={{
        cartsFetchQuery: {
          depth: 2,
          populate: {
            products: { slug: true, title: true, images: true, inventory: true, price: true }
          }
        }
      }}
    >
      {children}
    </EcommerceProvider>
  )
}
```

**Fișier: `src/app/(frontend)/layout.tsx`**
- Wrap cu EcommerceProviderWrapper

### Faza 2: Înlocuire Cart (localStorage → DB)

**Fișiere de înlocuit din oficial:**
- `src/components/Cart/index.tsx`
- `src/components/Cart/CartModal.tsx`
- `src/components/Cart/AddToCart.tsx`
- `src/components/Cart/EditItemQuantityButton.tsx`
- `src/components/Cart/DeleteItemButton.tsx`
- `src/components/Cart/OpenCart.tsx`

**Ce se șterge:**
- `src/blocks/Cart/Component.tsx` (înlocuit cu CartModal oficial)
- `src/components/cart/AddToCartButton.tsx` (înlocuit cu AddToCart oficial)
- Logica localStorage din toate componentele

### Faza 3: Checkout cu Plugin Flow

**Fișiere de adaptat din oficial:**
- `src/components/checkout/CheckoutPage.tsx`
- `src/components/checkout/CheckoutAddresses.tsx`
- `src/components/forms/CheckoutForm.tsx`

**Flow:**
1. User completează adresa
2. `initiatePayment('stripe')` sau `initiatePayment('manual')`
3. Plugin validează stocul automat
4. Dacă ok → creează order + decrementează inventory
5. Dacă stoc insuficient → eroare `OutOfStock`

### Faza 4: Payment Adapter Manual (pentru când nu e Stripe)

**Fișier: `src/payments/manualAdapter.ts`** (NOU)
```tsx
// Adapter pentru "plată la livrare" sau "plată în showroom"
export const manualPaymentAdapter = () => ({
  name: 'manual',
  // Client side - nimic special
  client: {
    // No payment UI needed
  },
  // Server side - doar confirmă comanda
  server: {
    initiatePayment: async ({ cart, req }) => {
      // Plugin validează automat stocul aici
      return { success: true }
    },
    confirmOrder: async ({ order, req }) => {
      // Plugin decrementează inventory automat aici
      return { success: true, orderID: order.id }
    }
  }
})
```

### Faza 5: Configurare Plugin în payload.config.ts

```tsx
ecommercePlugin({
  // ... existing config ...

  // Variante OPȚIONALE
  products: {
    enableVariants: false, // Schimbă în true când vrei variante
  },

  // Inventory activat
  inventory: true, // Plugin se ocupă de tot
})
```

---

## Ce NU mai trebuie să facem manual

| Aspect | Înainte (manual) | După (plugin) |
|--------|------------------|---------------|
| Validare stoc | `/api/orders` custom | Plugin automat |
| Decrementare inventory | Hook custom | Plugin automat |
| Cart storage | localStorage | Database |
| Sincronizare cart | Nu există | Automat (user logat) |
| Verificare stoc la +/- | Client-side | Server-side |

---

## Opțiuni configurabile

### Variante: ON/OFF
```tsx
enableVariants={true}  // Cu variante (mărime, culoare)
enableVariants={false} // Fără variante (simplu)
```

### Payment Provider: Stripe sau Manual
```tsx
// Cu Stripe
paymentMethods={[stripeAdapterClient({ publishableKey: '...' })]}

// Fără Stripe (plată la livrare)
paymentMethods={[manualPaymentAdapter()]}

// Ambele
paymentMethods={[stripeAdapterClient({...}), manualPaymentAdapter()]}
```

---

## Ordine implementare

1. [ ] Creare `manualPaymentAdapter` pentru plată fără Stripe
2. [ ] Setup `EcommerceProviderWrapper` cu adapter opțional
3. [ ] Copiere componente Cart din oficial (adaptate la design nostru)
4. [ ] Copiere componente Checkout din oficial
5. [ ] Ștergere cod vechi (localStorage cart, /api/orders custom)
6. [ ] Update ProductDetails să folosească `addItem()` din `useCart()`
7. [ ] Update ProductsBlock la fel
8. [ ] Re-seed produse cu inventory
9. [ ] Testare flow complet

---

## Beneficii finale

✅ 100% logica oficială Payload
✅ Validare stoc server-side automată
✅ Decrementare inventory automată
✅ Cart în database (nu se pierde)
✅ Variante opționale
✅ Stripe opțional
✅ Zero cod custom pentru logica de bază
✅ Doar adaptări UI la designul nostru
