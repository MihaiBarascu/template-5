# Plan Migrare Shop - Model Payload Clean-Ecommerce

**Data:** 2025-12-07
**Scop:** Aliniere completa cu template-ul oficial Payload eCommerce, pastrand doar design-ul configurabil din admin.

---

## 1. ANALIZA COMPARATIVA

### Template Payload Clean-Ecommerce
```
/shop                    → Toate produsele + filtre sidebar
/products/[slug]         → Pagina produs individual
/checkout                → Checkout flow
/checkout/confirm-order  → Confirmare comanda
/(account)/orders        → Istoric comenzi
```

### Template-5 Actual
```
/produse                 → Pagina din CMS cu bloc Products (fara filtre)
/produse/[slug]          → Pagina produs individual (hardcoded)
/categorii/[slug]        → Pagina categorie (hardcoded) - DE ELIMINAT
/cos                     → Pagina cos (din CMS)
/checkout                → Pagina checkout (din CMS)
```

---

## 2. STRUCTURA TINTA

### Rute finale:
```
/produse                 → Ruta dedicata cu filtre (ca /shop la Payload)
/produse/[slug]          → Pagina produs individual (pastram)
/cos                     → Pagina cos (pastram din CMS)
/checkout                → Pagina checkout (pastram din CMS)
/cont                    → Zona utilizator (de implementat)
```

### De eliminat:
- `/categorii/[slug]` - categoriile devin filtre pe /produse
- Blocul `ProductListing` - nu mai e necesar
- Pagina CMS `/produse` din seeder - inlocuita cu ruta dedicata

---

## 3. FISIERE DE CREAT

### 3.1 Ruta /produse (Shop Page)
**Fisier:** `src/app/(frontend)/produse/page.tsx`

Functionalitati:
- [x] Breadcrumbs
- [x] Titlu + descriere pagina
- [x] Sidebar cu filtre:
  - [x] Categorii (checkbox-uri)
  - [x] Pret (range slider sau min/max inputs)
  - [x] In stoc (checkbox)
  - [x] Tag-uri (daca avem)
- [x] Sortare dropdown
- [x] Grid produse cu ProductCard
- [x] Paginare (optional, pentru viitor)
- [x] URL params pentru toate filtrele (?categorie=X&sort=Y&price_min=Z)
- [x] Mobile: filtre in drawer/modal

### 3.2 Componente noi necesare
**Fisier:** `src/components/shop/ShopFilters.tsx`
- Sidebar cu toate filtrele
- Mobile-friendly (drawer)
- Sincronizare cu URL params

**Fisier:** `src/components/shop/CategoryFilter.tsx`
- Lista categorii cu checkbox
- Count produse per categorie (optional)

**Fisier:** `src/components/shop/PriceFilter.tsx`
- Input min/max pret
- Sau range slider

**Fisier:** `src/components/shop/ActiveFilters.tsx`
- Afiseaza filtrele active
- Buton clear all
- Remove individual

---

## 4. FISIERE DE MODIFICAT

### 4.1 Seeder magazin
**Fisier:** `src/seed/businesses/magazin.ts`

Modificari:
- Sterge crearea paginii CMS `/produse` (liniile 479-502)
- Actualizeaza navigatia header sa pointeze la `/produse`
- Sterge orice referinta la `/categorii/`

### 4.2 Navigatie Header
**Fisier:** `src/seed/seed-data.ts` sau `src/seed/businesses/magazin.ts`

Modificari:
- `{ label: 'Produse', link: '/produse' }` - ramane
- `{ label: 'Categorii', link: '/categorii' }` - STERGE sau transforma in dropdown cu link-uri `/produse?categorie=X`

### 4.3 Footer
**Fisier:** `src/seed/businesses/magazin.ts`

Modificari:
- Link-urile la categorii sa fie `/produse?categorie=cosmetice-naturale` in loc de `/categorii/cosmetice-naturale`

---

## 5. FISIERE DE STERS

### 5.1 Ruta categorii
**Folder:** `src/app/(frontend)/categorii/`
- Stergem intregul folder (sau pastram doar `/categorii/page.tsx` daca vrem o pagina index cu toate categoriile)

### 5.2 Bloc ProductListing
**Fisiere:**
- `src/blocks/ProductListing/config.ts`
- `src/blocks/ProductListing/Component.tsx`
- Referinte din `src/blocks/index.ts`
- Referinte din `src/blocks/RenderBlocks.tsx`

---

## 6. DESIGN CONFIGURABIL DIN ADMIN

### Optiunea A: Global Settings
**Fisier nou:** `src/globals/ShopSettings.ts`

```typescript
export const ShopSettings: GlobalConfig = {
  slug: 'shop-settings',
  label: 'Setari Magazin',
  access: { read: () => true },
  fields: [
    // Pagina Produse
    {
      name: 'productsPage',
      type: 'group',
      label: 'Pagina Produse',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Produsele Noastre' },
        { name: 'description', type: 'textarea' },
        { name: 'productsPerPage', type: 'number', defaultValue: 24 },
        { name: 'defaultSort', type: 'select', options: [
          { label: 'Cele mai noi', value: 'newest' },
          { label: 'Pret crescator', value: 'price_asc' },
          { label: 'Pret descrescator', value: 'price_desc' },
        ]},
        { name: 'showFilters', type: 'checkbox', defaultValue: true },
        { name: 'gridColumns', type: 'select', options: [
          { label: '3 coloane', value: '3' },
          { label: '4 coloane', value: '4' },
        ]},
      ]
    },
    // SEO
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ]
    },
    // Labels (pentru internationalizare)
    {
      name: 'labels',
      type: 'group',
      label: 'Texte',
      fields: [
        { name: 'filterTitle', type: 'text', defaultValue: 'Filtre' },
        { name: 'categoriesTitle', type: 'text', defaultValue: 'Categorii' },
        { name: 'priceTitle', type: 'text', defaultValue: 'Pret' },
        { name: 'sortLabel', type: 'text', defaultValue: 'Sorteaza' },
        { name: 'noProductsMessage', type: 'text', defaultValue: 'Nu am gasit produse.' },
        { name: 'clearFiltersLabel', type: 'text', defaultValue: 'Sterge filtrele' },
      ]
    }
  ]
}
```

### Utilizare in /produse/page.tsx:
```typescript
const shopSettings = await payload.findGlobal({ slug: 'shop-settings' })

// Apoi folosim:
// shopSettings.productsPage.title
// shopSettings.productsPage.gridColumns
// shopSettings.labels.filterTitle
// etc.
```

---

## 7. ORDINE IMPLEMENTARE

### Pasul 1: Pregatire (cleanup)
1. [ ] Sterge blocul ProductListing din `src/blocks/`
2. [ ] Sterge referintele din `src/blocks/index.ts`
3. [ ] Sterge referintele din `src/blocks/RenderBlocks.tsx`
4. [ ] Sterge codul adaugat in RenderBlocks (getProductsForListing, etc.)

### Pasul 2: Creez ShopSettings Global
1. [ ] Creez `src/globals/ShopSettings.ts`
2. [ ] Adaug in `payload.config.ts`
3. [ ] Rulez regenerare tipuri

### Pasul 3: Creez pagina /produse
1. [ ] Creez `src/app/(frontend)/produse/page.tsx` - versiune simpla
2. [ ] Testez ca functioneaza fetch produse
3. [ ] Adaug sortare
4. [ ] Adaug filtrare categorii
5. [ ] Adaug filtrare pret
6. [ ] Adaug filtrare stoc
7. [ ] Integrez ShopSettings

### Pasul 4: Componente filtre
1. [ ] Creez `src/components/shop/ShopFilters.tsx`
2. [ ] Creez `src/components/shop/CategoryFilter.tsx`
3. [ ] Creez `src/components/shop/PriceFilter.tsx`
4. [ ] Creez `src/components/shop/ActiveFilters.tsx`
5. [ ] Adaug mobile drawer pentru filtre

### Pasul 5: Cleanup categorii
1. [ ] Sterge `src/app/(frontend)/categorii/[slug]/`
2. [ ] Pastreaza sau sterge `src/app/(frontend)/categorii/page.tsx` (index)
3. [ ] Actualizeaza seeder-ul
4. [ ] Actualizeaza link-urile din navigatie

### Pasul 6: Testare
1. [ ] Test filtrare pe categorii
2. [ ] Test sortare
3. [ ] Test URL params (share-ability)
4. [ ] Test mobile
5. [ ] Test SEO (meta tags)

---

## 8. REFERINTA: Cod din Payload Clean-Ecommerce

### Shop Page Structure (adaptat pentru template-5):
```typescript
// src/app/(frontend)/produse/page.tsx
import { getPayload } from 'payload'
import { Breadcrumbs } from '@/components/ecommerce/Breadcrumbs'
import { ProductCard } from '@/components/ecommerce/ProductCard'
import { ProductSort } from '@/components/ecommerce/ProductSort'
import { ShopFilters } from '@/components/shop/ShopFilters'

interface PageProps {
  searchParams: Promise<{
    categorie?: string
    sort?: string
    price_min?: string
    price_max?: string
    in_stock?: string
    page?: string
  }>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams
  const payload = await getPayload({ config: configPromise })

  // Fetch shop settings
  const shopSettings = await payload.findGlobal({ slug: 'shop-settings' })

  // Fetch categories for filter
  const categories = await payload.find({
    collection: 'product-categories',
    limit: 100,
  })

  // Build query
  const where = {}
  if (params.categorie) {
    // Find category by slug
    const cat = categories.docs.find(c => c.slug === params.categorie)
    if (cat) where.category = { equals: cat.id }
  }
  if (params.price_min) {
    where.priceInRON = { ...where.priceInRON, greater_than_equal: Number(params.price_min) }
  }
  // ... etc

  // Fetch products
  const products = await payload.find({
    collection: 'products',
    where,
    sort: getSortParam(params.sort),
    limit: shopSettings.productsPage.productsPerPage || 24,
    depth: 2,
  })

  return (
    <main>
      <Breadcrumbs items={[{ label: shopSettings.productsPage.title || 'Produse' }]} />

      <div className="container grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <ShopFilters
            categories={categories.docs}
            settings={shopSettings}
          />
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="flex justify-between mb-6">
            <p>{products.totalDocs} produse</p>
            <ProductSort />
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-${shopSettings.productsPage.gridColumns || 3} gap-4`}>
            {products.docs.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
```

---

## 9. NOTE IMPORTANTE

1. **Breadcrumbs** - Deja avem componenta, o folosim
2. **ProductCard** - Deja avem componenta, o folosim
3. **ProductSort** - Deja avem componenta, o folosim
4. **URL Params** - Folosim Next.js searchParams (server-side)
5. **Mobile** - Filtrele vor fi in drawer pe mobile

---

## 10. TIMELINE ESTIMATA

- Pasul 1 (Cleanup): 15 min
- Pasul 2 (ShopSettings): 20 min
- Pasul 3 (Pagina /produse): 45 min
- Pasul 4 (Componente filtre): 30 min
- Pasul 5 (Cleanup categorii): 15 min
- Pasul 6 (Testare): 20 min

**Total estimat: ~2.5 ore**

---

## 11. DUPA IMPLEMENTARE

### Seeder va crea:
- Categorii in `product-categories`
- Produse in `products`
- ShopSettings global cu valorile default
- Link `/produse` in navigatie (fara submeniu categorii)

### Admin va putea configura:
- Titlu si descriere pagina produse
- Numar produse per pagina
- Sortare implicita
- Numar coloane grid
- Toate textele/label-urile
- SEO (meta title/description)

### Utilizatorul va vedea:
- Pagina `/produse` cu toate produsele
- Sidebar cu filtre (categorii, pret, stoc)
- Sortare dropdown
- URL care se actualizeaza cu filtrele selectate
- Link-uri shareable (`/produse?categorie=cosmetice&sort=price_asc`)
