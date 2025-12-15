# Turbopack HMR - Probleme și Soluții

Documentație pentru problemele de Hot Module Replacement cu Next.js 16 + Turbopack.

## 1. Problema: Modificările nu se reflectă în browser

În development mode cu Turbopack (Next.js 16 canary), modificările făcute în fișiere React/TypeScript pot să nu apară în browser, chiar și după:
- Refresh manual (F5)
- Hard refresh (Ctrl+Shift+R)
- Restart dev server
- Ștergere `.next` folder

### Simptome

| Situație | Ce observi |
|----------|------------|
| Modifici un fișier `.tsx` | Browser-ul nu arată modificarea |
| Adaugi `console.log` | Nu apare în consolă |
| Schimbi text (ex: "RON" → "LEI") | Textul vechi rămâne afișat |
| Server restart | Tot nu se actualizează |

### Cauza

Turbopack (dev bundler-ul rapid din Next.js 16) are uneori probleme de sincronizare a cache-ului intern. HMR (Hot Module Replacement) nu trimite actualizările corect către browser.

---

## 2. Soluția: Production Build

Când dev server-ul nu reflectă modificările, folosește production build:

```bash
# Oprește dev server-ul (Ctrl+C)

# Build pentru production
pnpm build

# Rulează production server pe alt port
pnpm start -p 3100
```

### De ce funcționează

| Mode | Bundler | Cache | Fiabilitate |
|------|---------|-------|-------------|
| Development | Turbopack | Agresiv, uneori buggy | ~85% |
| Production | Webpack | Fresh la fiecare build | ~100% |

Production build-ul:
- Compilează totul de la zero
- Nu are cache HMR
- Reflectă exact codul din fișiere

---

## 3. Alternativă: Dezactivează Turbopack

Dacă ai probleme frecvente, poți dezactiva Turbopack:

```json
// package.json
{
  "scripts": {
    "dev": "next dev",           // Cu Turbopack (default în Next.js 16)
    "dev:webpack": "next dev --no-turbopack"  // Fără Turbopack (mai lent, mai stabil)
  }
}
```

### Comparație

| Aspect | Turbopack | Webpack |
|--------|-----------|---------|
| Viteză pornire | ~1-2s | ~5-15s |
| HMR speed | Foarte rapid | Moderat |
| Stabilitate | Canary (buguri posibile) | Stabil |
| Recomandare | Development rapid | Debugging probleme |

---

## 4. Pași de debugging când HMR nu funcționează

```bash
# 1. Verifică că fișierul s-a salvat corect
cat src/components/cart/CartModal.tsx | grep "textul modificat"

# 2. Șterge cache Next.js complet
rm -rf .next

# 3. Șterge node_modules/.cache (dacă există)
rm -rf node_modules/.cache

# 4. Restart dev server
pnpm dev

# 5. Dacă tot nu merge - production build
pnpm build && pnpm start -p 3100
```

---

## 5. Exemplu real: CartModal TVA

### Context
Am modificat `CartModal.tsx` să afișeze prețuri cu TVA folosind `getDisplayPrice()`.

### Ce s-a întâmplat
1. Codul era corect, TypeScript compila fără erori
2. Dev server (port 3010) arăta prețul vechi (29 RON)
3. Am schimbat "RON" în "LEI" ca test - tot nu apărea
4. Multiple restarts - fără efect

### Soluție
```bash
# Am oprit dev server
# Am rulat production build
pnpm build
pnpm start -p 3100

# Pe port 3100 - toate modificările erau vizibile
# Preț afișat corect: 35 RON (29 × 1.21 TVA)
```

---

## 6. Când să suspectezi probleme HMR

- [ ] Modificările nu apar după save
- [ ] Console.log-urile noi nu se afișează
- [ ] Ai restartat server-ul de mai multe ori fără efect
- [ ] Codul e corect (TypeScript nu dă erori)
- [ ] Alte fișiere se actualizează, doar unul nu

---

## 7. Best Practices

### În development
```bash
# Folosește porturi diferite pentru dev și prod testing
pnpm dev        # Port 3010 (dev)
pnpm start -p 3100  # Port 3100 (prod testing)
```

### Pentru validare finală
```bash
# Întotdeauna verifică pe production build înainte de commit
pnpm build && pnpm start -p 3100
```

### Dacă lucrezi pe features critice
```bash
# Folosește Webpack pentru stabilitate
pnpm dev --no-turbopack
```

---

## Resurse

- [Turbopack Documentation](https://turbo.build/pack/docs)
- [Next.js 16 Known Issues](https://github.com/vercel/next.js/issues)
- [HMR Troubleshooting](https://nextjs.org/docs/architecture/fast-refresh)
