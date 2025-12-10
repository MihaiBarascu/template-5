# Lecții Învățate - Sesiune Optimizare Performanță

Data: 2025-12-10

## Probleme Rezolvate

### 1. Erori de Hydration (Port Mismatch)

**Simptom:** Erori frecvente "Hydration failed because the server rendered HTML didn't match the client"
- URL-urile imaginilor aveau porturi diferite: server `localhost:3000` vs client `localhost:3010`

**Cauză:** Variabila de mediu `NEXT_PUBLIC_SERVER_URL` era setată în shell (`export NEXT_PUBLIC_SERVER_URL=http://localhost:3000`) și suprascria valoarea din `.env`.

**Soluție:**
- Rulează dev server cu variabila explicită: `NEXT_PUBLIC_SERVER_URL=http://localhost:3010 pnpm dev`
- Sau șterge variabila din shell: `unset NEXT_PUBLIC_SERVER_URL`

**Lecție:** Variabilele de mediu din shell au prioritate peste `.env`. Verifică întotdeauna cu `echo $NEXT_PUBLIC_SERVER_URL`.

---

### 2. Warning-uri `<img>` în Gallery Component

**Simptom:** La build apăreau warning-uri despre folosirea `<img>` în loc de `next/image`

**Cauză:** Fallback-uri pentru imagini care nu aveau `media` object foloseau `<img>` nativ.

**Soluție:** Înlocuit toate `<img>` cu `<Image>` din `next/image` în `src/blocks/Gallery/Component.tsx`:
- Adăugat `import Image from 'next/image'`
- Înlocuit 4 instanțe de `<img>` cu `<Image>` cu proprietățile corecte (`fill`, `sizes`, etc.)

---

### 3. Placeholder Imagine Urât

**Simptom:** Placeholder-ul blur pentru imagini era un pattern de noise gri urât.

**Soluție:** Înlocuit cu un gradient SVG elegant în `src/components/Media/ImageMedia/index.tsx`:

```typescript
const placeholderBlur =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2cpIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiLz48L3N2Zz4='
```

SVG decodat:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f3f4f6"/>
      <stop offset="100%" stop-color="#e5e7eb"/>
    </linearGradient>
  </defs>
  <rect fill="url(#g)" width="40" height="40"/>
</svg>
```

---

### 4. Optimizări Performanță Imagini

**Modificări în `src/components/Media/ImageMedia/index.tsx`:**

1. **Quality redus de la 100 la 85** - Diferență vizuală imperceptibilă, dar fișiere mai mici
2. **fetchPriority="high"** adăugat pentru imagini cu `priority={true}` - Spune browser-ului să prioritizeze descărcarea

```typescript
<NextImage
  // ...alte props
  quality={85}
  {...(priority && { fetchPriority: 'high' as const })}
/>
```

---

### 5. Erori ECONNREFUSED la Build

**Simptom:** La `pnpm build` apar erori `fetch failed - ECONNREFUSED 127.0.0.1:3010`

**Cauză:** Next.js încearcă să pre-rendereze pagini statice și Payload face request-uri HTTP la API, dar serverul nu rulează la build time.

**Diferența față de template-ul Payload oficial:**
- Template-ul oficial folosește **Payload SDK direct** (`getPayload`) care accesează baza de date direct
- NU face fetch-uri HTTP externe la build time

**Soluții:**
1. Rulează `pnpm dev` într-un terminal ÎNAINTE de `pnpm build` în alt terminal
2. Sau scoate `output: 'standalone'` din `next.config.js` dacă nu folosești Docker

**Notă:** `output: 'standalone'` nu e prezent în template-ul Payload oficial.

---

### 6. Imagine Hero Dispare Random la Refresh

**Simptom:** Uneori la refresh imaginea hero apare, alteori nu.

**Cauză probabilă:**
- Mismatch între URL-ul generat pe server vs client
- `getClientSideURL()` returnează valori diferite în funcție de context

**Verificare:** Dacă portul din `.env` (3010) diferă de portul actual al serverului, apar inconsistențe.

---

## Best Practices Învățate

### Payload CMS + Next.js

1. **Folosește Payload SDK direct** pentru încărcarea datelor (nu fetch HTTP):
   ```typescript
   const payload = await getPayload({ config: configPromise })
   const data = await payload.find({ collection: 'pages' })
   ```

2. **Evită `output: 'standalone'`** în development dacă nu e necesar pentru Docker

3. **Verifică mereu porturile** - asigură-te că `.env`, shell env, și serverul actual folosesc același port

### Next.js Image Optimization

1. **Quality 85** e suficient pentru majoritatea cazurilor (100 e overkill)
2. **fetchPriority="high"** pe imaginile LCP (hero, above-the-fold)
3. **priority={true}** pe imaginea principală pentru a dezactiva lazy loading
4. **sizes** trebuie setat corect pentru responsive images

### Debugging

1. **Hydration errors** - verifică dacă URL-urile sunt identice pe server și client
2. **Build errors ECONNREFUSED** - serverul trebuie să ruleze pentru pre-rendering
3. **Console în browser** - verifică URL-urile imaginilor în Network tab

---

## Fișiere Modificate în Această Sesiune

1. `src/components/Media/ImageMedia/index.tsx` - placeholder, quality, fetchPriority
2. `src/blocks/Gallery/Component.tsx` - înlocuit `<img>` cu `<Image>`
3. `src/utilities/getURL.ts` - revertat la original (problema era în shell env)

---

## Comenzi Utile

```bash
# Verifică variabilele de mediu din shell
echo $NEXT_PUBLIC_SERVER_URL

# Șterge variabila din shell
unset NEXT_PUBLIC_SERVER_URL

# Rulează dev cu port explicit
NEXT_PUBLIC_SERVER_URL=http://localhost:3010 pnpm dev

# Build cu server pornit (în terminale separate)
# Terminal 1:
pnpm dev
# Terminal 2 (după ce serverul e ready):
pnpm build
```
