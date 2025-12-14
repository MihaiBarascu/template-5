---
status: ACTIVE
type: lesson
created: 2025-12-14
tags: [ecommerce, cart, react, useCallback, email, shipping]
---

# Lessons Learned - Ecommerce Cart & Checkout Fixes

> Sesiune de debugging pentru probleme de coș, prețuri și notificări email.

---

## 1. Plugin Ecommerce - Cart Field Bug

### Problema
Coșul nu apărea după login fără refresh manual.

### Cauza Root
Plugin-ul are un bug: face request cu `select[carts]=true` (plural) dar citește răspunsul ca `user.cart?.docs` (singular).

### Soluție
1. În `Users.ts`, câmpul join trebuie să se numească `cart` (singular), NU `carts`:
```typescript
{
  name: 'cart', // NU 'carts' - plugin citeste user.cart?.docs
  type: 'join',
  collection: 'carts',
  on: 'customer',
  where: { purchasedAt: { exists: false } }, // doar cart-uri active
}
```

2. Workaround cu `syncCartToLocalStorage()` în Auth provider:
```typescript
async function syncCartToLocalStorage(): Promise<void> {
  const res = await fetch('/api/users/me?select[cart]=true', { credentials: 'include' })
  const data = await res.json()
  const carts = data.user?.cart?.docs || []
  const activeCart = carts.find(cart => !cart.purchasedAt)
  if (activeCart?.id) localStorage.setItem('cart', activeCart.id)
}
```

3. Apelează după login și la mount dacă user e logat dar nu are cart în localStorage.

---

## 2. React useCallback - Stale Closure Bug

### Problema
Costul de transport nu se salva în comenzi (funcționa intermitent).

### Cauza Root
Variabila `shippingCost` NU era în dependency array-ul `useCallback`, ducând la "stale closure":
```typescript
// BUG - shippingCost lipsește din dependințe
const handleSubmit = useCallback(async () => {
  await confirmOrder({ shippingCost }) // poate fi valoare veche!
}, [otherDeps]) // shippingCost NU e aici
```

### Soluție
**ÎNTOTDEAUNA** include toate variabilele folosite în callback în dependency array:
```typescript
const handleSubmit = useCallback(async () => {
  await confirmOrder({ shippingCost })
}, [shippingCost, ...otherDeps]) // shippingCost TREBUIE să fie aici
```

### De ce funcționa uneori
- Când alte dependințe se schimbau (ex: `billingAddress`), callback-ul se recrea și captura noua valoare `shippingCost`
- Dar dacă `shippingCost` se schimba SINGUR (ex: subtotal depășea pragul gratuit), callback-ul rămânea cu valoarea veche

---

## 3. Currency Decimals Configuration

### Problema
Prețurile apăreau împărțite la 100 în admin (ex: 2.67 în loc de 267 lei).

### Cauza Root
`decimals: 2` în currency config înseamnă că valorile sunt în "bani" (cea mai mică unitate). Plugin-ul împarte/înmulțește automat.

### Soluție
Pentru RON unde stocăm prețuri în lei (numere întregi), folosim `decimals: 0`:
```typescript
// În payload.config.ts ȘI EcommerceProvider.tsx
currencies: {
  supportedCurrencies: [
    { code: 'RON', symbol: 'lei', decimals: 0, label: 'Leu Romanesc' }
  ]
}
```

### Regulă
- `decimals: 0` = prețuri în unități întregi (267 = 267 lei)
- `decimals: 2` = prețuri în cea mai mică unitate (26700 = 267.00 lei)

---

## 4. Cart Clearing After Order

### Problema
Coșul rămânea vizibil după plasarea comenzii.

### Soluție
Nu e suficient doar `clearCart()` din plugin. Trebuie:
```typescript
if (confirmResult?.orderID) {
  localStorage.removeItem('cart')
  localStorage.removeItem('cart_secret')
  setOrderPlaced(true)
  // Reload forțat pentru reset complet
  setTimeout(() => window.location.reload(), 1500)
}
```

### De ce reload?
`EcommerceProvider` are `key={user?.id || 'guest'}`. După comandă, user-ul e același, deci key-ul nu se schimbă și provider-ul nu se remontează. Reload-ul forțează refresh complet.

---

## 5. Cart Isolation Between Users

### Problema
După login/logout, coșul vechi rămânea vizibil.

### Soluție
1. `key` pe EcommerceProvider bazat pe user ID:
```typescript
<EcommerceProvider key={user?.id || 'guest'} ... />
```

2. `router.refresh()` după login/logout pentru a triggera re-render cu noul key

3. Clear localStorage la logout:
```typescript
localStorage.removeItem('cart')
localStorage.removeItem('cart_secret')
```

---

## 6. Custom Fields on Plugin Collections

### Problema
Trebuia să adăugăm `shippingCost` pe colecția Orders (creată de plugin).

### Soluție
În `ecommerceConfig.collections.orders`:
```typescript
orders: ({ defaultCollection }) => ({
  ...defaultCollection,
  fields: [
    ...(Array.isArray(defaultCollection.fields) ? defaultCollection.fields : []),
    // Câmp custom
    {
      name: 'shippingCost',
      type: 'number',
      label: 'Cost Transport',
      admin: { position: 'sidebar' },
    },
  ],
})
```

---

## 7. Default Field Values pe Plugin Collections

### Problema
Checkbox-ul "Enable RON price" nu era bifat implicit la produse noi.

### Soluție CORECTĂ
Folosește `.map()` pentru a modifica câmpul existent, NU filter + add:
```typescript
fields: [
  ...(Array.isArray(defaultCollection.fields)
    ? defaultCollection.fields.map((field) => {
        if ('name' in field && field.name === 'priceInRONEnabled') {
          return { ...field, defaultValue: true } as typeof field
        }
        return field
      })
    : []),
]
```

### Soluție GREȘITĂ
```typescript
// NU așa - cauza eroare DuplicateFieldName
.filter(f => f.name !== 'priceInRONEnabled'),
{ name: 'priceInRONEnabled', ... } // câmp duplicat!
```

---

## 8. Email Reply-To Header

### Problema
Clienții nu puteau răspunde la email-uri de confirmare.

### Soluție
Adaugă `replyTo` în `sendEmail()`:
```typescript
await payload.sendEmail({
  to: customerEmail,
  subject: 'Confirmare comandă',
  html: emailHtml,
  replyTo: businessEmail, // permite răspunsuri
})
```

---

## Quick Reference

### Debugging Cart Issues

1. **Cart nu apare după login**: Verifică câmpul join `cart` pe Users și `syncCartToLocalStorage()`
2. **Cart rămâne după logout**: Verifică `localStorage.removeItem()` și `router.refresh()`
3. **Cart rămâne după comandă**: Verifică clear localStorage + reload
4. **Prețuri greșite**: Verifică `decimals` în currency config

### useCallback Dependencies Checklist

Înainte de a crea un useCallback, verifică:
- [ ] Toate variabilele de state folosite sunt în dependencies?
- [ ] Toate props-urile folosite sunt în dependencies?
- [ ] Toate computed values folosite sunt în dependencies?

### Email Debugging

```bash
# Verifică logs pentru email-uri
grep -i "email\|mail\|notification" server.log
```

---

*Documentat din sesiunea de debugging din 14 Decembrie 2025*
