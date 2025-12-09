# Plan Implementare SEO

> **Status:** ✅ COMPLETAT
> **Data:** 9 decembrie 2024
> **Ultima actualizare:** 9 decembrie 2024
> **Prioritate:** Medie

---

## Progress

### Ce s-a descoperit:
- **Article Schema** - DEJA EXISTĂ în `/src/app/(frontend)/blog/[slug]/page.tsx`
- **Product Schema** - DEJA EXISTĂ în `/src/app/(frontend)/produse/[slug]/page.tsx`
- **Breadcrumbs vizuale** - DEJA EXISTĂ în `/src/components/ecommerce/Breadcrumbs.tsx`
- Nu există pagini `/servicii/[slug]` sau `/echipa/[slug]` - se folosește `[...slug]` catch-all

### Fișiere cheie analizate:
- `src/utilities/generateMeta.ts` - generare metadata Next.js
- `src/utilities/mergeOpenGraph.ts` - merge OG tags (are deja siteName)
- `src/app/(frontend)/blog/[slug]/page.tsx` - are JSON-LD Article + BreadcrumbList
- `src/app/(frontend)/produse/[slug]/page.tsx` - are JSON-LD Product + BreadcrumbList

### Completat (9 decembrie 2024):
- ✅ **BreadcrumbList JSON-LD** adăugat în `produse/[slug]/page.tsx`
- ✅ **BreadcrumbList JSON-LD** adăugat în `blog/[slug]/page.tsx`
- Ambele includ categoria ca nivel intermediar (dacă există)

---

## Context

Am finalizat:
- [x] White-label MultiWebsite în admin
- [x] Implementare TVA corectă pentru România (21%/11%, pricesIncludeVat=true)

Urmează implementarea îmbunătățirilor SEO conform cercetării făcute.

---

## Ce avem deja

Fișiere existente:
- `/src/utilities/generateMeta.ts` - generare metadata Next.js (title, description, OG, canonical)
- `/src/utilities/mergeOpenGraph.ts` - merge OG tags
- Plugin SEO Payload activ în config

---

## De implementat (prioritate)

### 1. ✅ BreadcrumbList Schema + Componenta vizuală (COMPLETAT)

**Implementat:**
- Componenta vizuală EXISTĂ: `src/components/ecommerce/Breadcrumbs.tsx`
- JSON-LD adăugat direct în `page.tsx` (pattern Payload + Next.js)

**Unde e implementat:**
- ✅ Pagini produse (`/produse/[slug]/page.tsx`)
- ✅ Pagini blog (`/blog/[slug]/page.tsx`)

**Schema implementată:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://site.ro" },
    { "@type": "ListItem", "position": 2, "name": "Produse", "item": "https://site.ro/produse" },
    { "@type": "ListItem", "position": 3, "name": "Categorie", "item": "https://site.ro/produse?categorie=slug" },
    { "@type": "ListItem", "position": 4, "name": "Nume Produs" }
  ]
}
```

---

### 2. ✅ Article Schema pentru Blog Posts (COMPLETAT)

**Deja implementat în:** `/blog/[slug]/page.tsx`

Include: headline, description, image, datePublished, dateModified, author, publisher, mainEntityOfPage

---

### 3. ✅ Open Graph complet (COMPLETAT)

**Modificat:**
- `src/utilities/mergeOpenGraph.ts` - adăugat `locale: 'ro_RO'`
- `src/utilities/generateMeta.ts` - adăugat pentru posts:
  - `publishedTime`
  - `modifiedTime`
  - `authors`

---

### 4. ✅ FAQPage Schema pentru FAQ Block (COMPLETAT)

**Implementat în:** `src/blocks/RenderBlocks.tsx` (case 'faq')

Schema se generează automat când o pagină conține un FAQ block.
Include toate întrebările și răspunsurile din colecția FAQ.

---

### 5. ✅ LocalBusiness Schema (DEJA EXISTA)

**Implementat în:** `src/app/(frontend)/layout.tsx` (liniile 77-116)

Se adaugă pe toate paginile site-ului. Include:
- name, description, url
- telephone, email
- address (PostalAddress)
- geo (GeoCoordinates)
- openingHours
- sameAs (social links)

---

### 6. ✅ Product Schema (COMPLETAT)

**Deja implementat în:** `/produse/[slug]/page.tsx`

Include: name, description, image, sku, brand, offers (price, currency, availability, condition)

---

## Ordinea implementării

1. ✅ **BreadcrumbList** - COMPLETAT
2. ✅ **Article schema** - COMPLETAT (exista deja)
3. ✅ **Open Graph complet** - COMPLETAT
4. ✅ **FAQPage schema** - COMPLETAT
5. ✅ **LocalBusiness schema** - COMPLETAT (exista deja)
6. ✅ **Product schema** - COMPLETAT (exista deja)

**TOATE IMPLEMENTĂRILE SEO SUNT COMPLETE!**

---

## Comenzi utile

```bash
# Regenerare tipuri după modificări
pnpm generate:types

# Testare build
pnpm build

# Verificare SEO cu Google Rich Results Test
# https://search.google.com/test/rich-results
```

---

## Note tehnice

- Toate schema-urile JSON-LD se adaugă cu `<script type="application/ld+json">`
- Se pot adăuga în layout sau în paginile individuale
- Folosește `JSON.stringify()` pentru a genera JSON-ul
- Testează cu Google Rich Results Test înainte de deploy
