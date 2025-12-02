# Payload CMS - TypeScript Best Practices

Documentație bazată pe sesiunea de fixing TypeScript/ESLint warnings.

## 1. Folosește Tipurile Generate de Payload

Payload generează automat tipuri în `src/payload-types.ts`. **Folosește-le întotdeauna** în loc să scrii tipuri custom.

### Import tipuri din payload-types.ts

```typescript
// Bine - folosește tipurile generate
import type { Page, Media, DesignVariant, Config } from '@/payload-types'

// Rău - tipuri custom
interface MyPage {
  title: string
  slug: string
}
```

### Extragere subtipuri cu TypeScript utility types

```typescript
// Extrage tipul hero din Page
type HeroData = NonNullable<Page['hero']>

// Extinde cu proprietăți adiționale
type ExtendedHero = NonNullable<Page['hero']> & {
  height?: 'small' | 'medium' | 'large' | 'fullscreen' | null
  overlayOpacity?: string | null
}

// Extrage tipul unui element din array
type CTAButton = NonNullable<NonNullable<Page['hero']>['ctaButtons']>[number]

// Extrage cheile collections pentru tipare dinamice
type CollectionSlug = keyof Config['collections']
```

## 2. Pattern-uri pentru Relații (Relationships)

Payload folosește union types pentru relații: `string | RelatedType | null`

### Helper function pattern

```typescript
// Payload returnează string (ID) sau obiectul populat
function getImageData(image: HeroData['image']): { url: string; alt: string } | null {
  // Verifică dacă e null sau string (ID nepopulat)
  if (!image || typeof image === 'string') return null
  // Verifică dacă are URL
  if (!image.url) return null
  return { url: image.url, alt: image.alt || '' }
}
```

### Verificare tip în componente

```typescript
// Pentru referințe în Footer/Header links
const refValue = link.reference?.value
const refSlug = refValue && typeof refValue !== 'string' ? refValue.slug : ''
const href = link.type === 'reference' ? `/${refSlug || ''}` : link.url || '#'
```

## 3. Null vs Undefined

Payload folosește `| null` pentru câmpuri opționale, dar React/Next.js preferă `| undefined`.

### Conversie null → undefined

```typescript
// În funcții care primesc date de la Payload pentru componente
businessName: businessInfo?.name ?? undefined,
businessPhone: businessInfo?.phone ?? undefined,
```

### Null coalescing pentru valori default

```typescript
// Folosește ?? pentru null/undefined, nu ||
const hasSubmenu = item.hasSubmenu && (item.submenu?.length ?? 0) > 0
const message = (contact.message || '').replace(/\n/g, '<br>')
```

## 4. Type Assertions pentru Seed Data

Când seed data e mai flexibil decât tipurile stricte Payload:

### Cast la tipul Payload

```typescript
import type { DesignVariant } from '@/payload-types'

// Cast businessType la union type specific
businessType: DesignVariant['businessType']

// Cast variantIndex la enum string
variantIndex: String(data.variantIndex) as DesignVariant['variantIndex']

// Cast heroType la union type
heroType: (data.heroType || 'centered') as HeroType
```

### Index signature pentru obiecte flexibile

```typescript
interface BlockConfig {
  blockType: string
  variant?: string
  heading?: string
  // ... alte proprietăți cunoscute
  [key: string]: unknown  // Permite proprietăți adiționale
}
```

## 5. Lexical Rich Text Format

Payload folosește Lexical pentru rich text. Structura necesită `version` pe noduri.

```typescript
{
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ text: 'Content text', version: 1 }],
        version: 1,  // IMPORTANT: version pe paragraph
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,  // IMPORTANT: version pe root
  },
}
```

## 6. Access Control Functions

Tipuri pentru funcțiile de access control în Payload config:

```typescript
interface EcommerceUser {
  id?: string
  role?: string
}

// User poate fi null în access functions
adminOnly: ({ req }: { req: { user?: EcommerceUser | null } }) => {
  const user = req.user
  if (user && 'role' in user) return user.role === 'admin'
  return false
},
```

## 7. Import Types din Payload Plugins

### Plugin Search

```typescript
import type { BeforeSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ searchDoc, originalDoc }) => {
  // ...
}
```

## 8. Evitare Erori Comune

### Unused @ts-expect-error

Dacă tipurile s-au actualizat, elimină comentariile vechi:

```typescript
// Rău - eroare la build dacă tipul există acum
// @ts-expect-error - replyTo may not be in types
replyTo: options.replyTo,

// Bine - folosește direct
replyTo: options.replyTo,
```

### Unused variables

Prefixează cu `_` variabilele neutilizate:

```typescript
} catch (_error) {
  // error nu e folosit
}

const _contentType = response.headers.get('content-type')
```

### Optional array length

```typescript
// Rău - .length pe undefined
item.submenu?.length > 0

// Bine - null coalescing
(item.submenu?.length ?? 0) > 0
```

## 9. Pattern pentru Override Types

Când ai un tip Payload cu proprietăți opționale ce pot fi null:

```typescript
import type { DesignVariant as PayloadDesignVariant } from '@/payload-types'

// Extrage tipul override fără null
const override = designVariantGlobal.override as NonNullable<PayloadDesignVariant['override']>

// Folosește ?? pentru fallback la valoarea din bază
return {
  ...baseVariant,
  hero: {
    ...baseVariant.hero,
    type: override.heroType ?? baseVariant.hero.type,
  },
} as DesignVariant
```

## 10. Regenerare Tipuri

După modificări la collections/globals, regenerează tipurile:

```bash
npm run generate:types
# sau
npx payload generate:types
```

## Checklist pentru Code Review

- [ ] Folosesc tipuri din `payload-types.ts`, nu custom
- [ ] Helper functions pentru relații (`string | Type | null`)
- [ ] Null coalescing (`??`) pentru valori default
- [ ] Version pe nodurile Lexical rich text
- [ ] Index signature pe interfețe flexibile
- [ ] User `| null` în access functions
- [ ] Prefix `_` pe variabile neutilizate
- [ ] Fără `@ts-expect-error` învechite
