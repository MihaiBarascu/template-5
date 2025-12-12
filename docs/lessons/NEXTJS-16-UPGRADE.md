# Next.js 16 Upgrade - Lecții Învățate

**Data:** 2024-12-12
**Versiuni:** Next.js 15.5.7 → 16.0.10, Payload CMS 3.67.0 → 3.68.3

## Rezumat

Upgrade-ul la Next.js 16 a introdus mai multe breaking changes care au necesitat modificări în codul nostru. Acest document descrie problemele întâmpinate și soluțiile aplicate.

---

## 1. Turbopack ca Bundler Default în Dev Mode

### Problema
Next.js 16 folosește Turbopack ca bundler implicit în development. Payload CMS necesită webpack pentru funcționalități specifice.

### Soluția
Am adăugat flag-ul `--webpack` la comanda de build:

```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build --webpack"
  }
}
```

**Notă:** În dev mode, Turbopack funcționează corect pentru site-ul frontend, dar pentru admin panel se recomandă webpack.

---

## 2. Image Optimization - Query Strings în Local Patterns

### Problema
```
Error: Image with src "/api/media/file/hero-main.jpg?2025-12-11T06:52:14.949Z"
is using a query string which is not configured in images.localPatterns.
```

Next.js 16 este mai strict cu validarea URL-urilor pentru imagini locale. Query string-urile (folosite pentru cache busting) nu sunt permise fără configurare explicită.

### Cauza
Payload CMS include câmpul `updatedAt` în URL-urile imaginilor pentru cache invalidation. Aceasta funcționa în Next.js 15, dar în 16 cauzează erori.

### Soluția

**Opțiunea 1: Configurare `localPatterns` (NU recomandată)**
```javascript
// next.config.js
images: {
  localPatterns: [
    {
      pathname: '/api/media/**',
      search: '', // Empty = no query strings
    },
  ],
}
```
Problema: `search: ''` înseamnă "fără query strings", nu "orice query strings". Omiterea `search` permite orice, dar e un risc de securitate.

**Opțiunea 2: Curățarea URL-urilor la sursă (RECOMANDATĂ)**

Am modificat componenta `ImageMedia` pentru a elimina query strings:

```typescript
// src/components/Media/ImageMedia/index.tsx

/**
 * Strips query strings from URL for Next.js 16 compatibility.
 */
function getCleanUrl(url: string | null | undefined): string {
  if (!url) return ''
  const queryIndex = url.indexOf('?')
  return queryIndex > -1 ? url.substring(0, queryIndex) : url
}

// În componentă:
src = getCleanUrl(url)
```

### Fișiere Modificate
- `src/components/Media/ImageMedia/index.tsx` - Curățare URL imagini
- `src/components/Media/VideoMedia/index.tsx` - Simplificare (video nu folosește Image component)
- `src/heros/FullscreenHero/index.tsx` - Folosește Next.js Image direct cu URL curat

---

## 3. Calitate Imagini (`images.qualities`)

### Problema
```
Warning: Image with src "..." is using quality "85" which is not configured
in images.qualities [75].
```

### Soluția
Am adăugat toate calitățile folosite în configurație:

```javascript
// next.config.js
images: {
  qualities: [75, 85],
}
```

---

## 4. `revalidateTag()` Necesită Al Doilea Argument

### Problema
```
TypeError: revalidateTag() requires a second argument
```

### Soluția
```typescript
// Înainte (Next.js 15)
revalidateTag(tag)

// După (Next.js 16)
revalidateTag(tag, 'max') // sau 'refresh'
```

**Opțiuni pentru al doilea argument:**
- `'max'` - Revalidare completă
- `'refresh'` - Revalidare soft

---

## 5. Priority Property Deprecat

### Observație
Starting cu Next.js 16, `priority` property a fost deprecat în favoarea `preload`:

```typescript
// Recomandat în Next.js 16+
<Image preload={true} ... />

// Încă funcționează, dar deprecat
<Image priority ... />
```

**Decizie:** Am păstrat `priority` deocamdată pentru compatibilitate, dar pentru proiecte noi se recomandă `preload`.

---

## 6. Minimum Cache TTL Default Schimbat

### Observație
Default-ul pentru `images.minimumCacheTTL` s-a schimbat de la 60 secunde la 4 ore (14400 secunde).

Am setat explicit valoarea noastră:
```javascript
images: {
  minimumCacheTTL: 31536000, // 1 an
}
```

---

## Checklist pentru Upgrade-uri Viitoare

- [ ] Verifică changelog-ul Next.js pentru breaking changes
- [ ] Testează Image component cu URL-uri locale și remote
- [ ] Verifică funcțiile de revalidare (revalidateTag, revalidatePath)
- [ ] Rulează testele E2E complet
- [ ] Verifică admin panel Payload CMS
- [ ] Verifică consola browser pentru erori/warnings

---

## Resurse

- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js Image localPatterns](https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns)
- [Payload CMS + Next.js 16 Compatibility](https://github.com/payloadcms/payload/issues/14354)

---

## Status Final

✅ Site-ul funcționează corect în development și production
✅ Toate cele 9 tipuri de business au fost testate cu seed
✅ Zero erori în consola browser
✅ Testele E2E: 7/8 passed (1 test minor de responsive)
✅ Cookie consent GDPR funcțional
