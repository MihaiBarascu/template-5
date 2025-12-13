# Next.js 16 - Modificări și Migrare

Documentație pentru compatibilitatea cu Next.js 16 (canary/beta).

## 1. Cache Imagini - Locație Nouă

În Next.js 16, structura folderului `.next` s-a schimbat. Cache-ul de imagini optimizate are acum locații diferite pentru dev și production.

### Locații cache imagini

| Mode | Cale | Versiune |
|------|------|----------|
| Development | `.next/dev/cache/images` | Next.js 16+ |
| Production (runtime) | `.next/cache/images` | Toate versiunile |

### Cod corect pentru ștergere cache

```typescript
// src/seed/index.ts - clearData function

// Clear Next.js image cache (supports both dev and production modes)
const imageCachePaths = [
  path.join(process.cwd(), '.next', 'cache', 'images'), // Production runtime (all versions)
  path.join(process.cwd(), '.next', 'dev', 'cache', 'images'), // Development mode (Next.js 16+)
];

let cacheCleared = false;
for (const cachePath of imageCachePaths) {
  if (fs.existsSync(cachePath)) {
    fs.rmSync(cachePath, { recursive: true, force: true });
    cacheCleared = true;
  }
}
if (cacheCleared) {
  console.log('   Next.js image cache cleared');
}
```

### Greșeală anterioară

```typescript
// NU FUNCȚIONEAZĂ în Next.js 16 dev mode!
const nextImageCacheDir = path.join(process.cwd(), '.next', 'cache', 'images');
```

Acest cod nu găsea cache-ul în development deoarece Next.js 16 îl mută în `.next/dev/cache/images`.

---

## 2. revalidateTag - Al Doilea Argument Obligatoriu

În Next.js 16, funcția `revalidateTag()` necesită un al doilea argument - un **cache profile**.

### Sintaxă nouă

```typescript
import { revalidateTag } from 'next/cache'

// Next.js 16+ - OBLIGATORIU al doilea argument
revalidateTag(tag, 'max')           // Recomandat - stale-while-revalidate
revalidateTag(tag, 'hours')         // Cache 1 oră
revalidateTag(tag, 'days')          // Cache 7 zile
revalidateTag(tag, { expire: 0 })   // Expirare imediată (pentru webhooks)
```

### Profile-uri disponibile

| Profile | Comportament |
|---------|--------------|
| `'max'` | **Recomandat** - SWR (stale-while-revalidate) pentru 24h |
| `'hours'` | Cache 1 oră |
| `'days'` | Cache 7 zile |
| `'minutes'` | Cache 5 minute |
| `{ expire: N }` | Custom - expirare după N secunde |

### Cod corect (src/app/api/revalidate/route.ts)

```typescript
import { revalidatePath, revalidateTag } from 'next/cache'

// Revalidare tags
for (const tag of tags) {
  revalidateTag(tag, 'max')  // Al doilea argument OBLIGATORIU
}

// revalidatePath rămâne la fel
revalidatePath('/', 'layout')
```

### Eroare TypeScript dacă lipsește

```
Type error: Expected 2 arguments, but got 1.
  revalidateTag(tag)
  ^
```

---

## 3. Structura `.next` în Next.js 16

```
.next/
├── cache/              # Production runtime cache
│   └── images/         # Imagini optimizate (production)
├── dev/                # NOU în Next.js 16 - Development artifacts
│   ├── cache/
│   │   ├── images/     # Imagini optimizate (development)
│   │   └── fetch-cache/
│   ├── build-manifest.json
│   └── package.json
├── server/
├── static/
└── trace/
```

---

## 4. API Route pentru Revalidare (Complet)

```typescript
// src/app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { secret, tags, paths } = body as {
      secret?: string
      tags?: string[]
      paths?: string[]
    }

    // Security check pentru production
    if (process.env.NODE_ENV === 'production') {
      const expectedSecret = process.env.REVALIDATE_SECRET
      if (expectedSecret && secret !== expectedSecret) {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
      }
    }

    const revalidated: { tags: string[]; paths: string[] } = { tags: [], paths: [] }

    // Revalidare tags - Next.js 16 necesită profile
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag, 'max')  // 'max' pentru SWR behavior
        revalidated.tags.push(tag)
      }
    }

    // Revalidare paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path, 'layout')
        revalidated.paths.push(path)
      }
    }

    return NextResponse.json({ success: true, revalidated })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
```

---

## 5. Trigger Revalidation din Seed

```typescript
// src/seed/helpers.ts

export async function triggerRevalidation(serverUrl?: string): Promise<void> {
  const baseUrl = serverUrl || 'http://localhost:3000'

  try {
    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tags: [
          'global_site-theme',
          'global_header',
          'global_footer',
          'global_logo',
          'global_business-info',
        ],
        paths: ['/'],
      }),
    })

    if (response.ok) {
      console.log('   Cache revalidation triggered successfully')
    }
  } catch (error) {
    // Server might not be running during seed - that's OK
    console.log('   Note: Could not trigger revalidation (server may not be running)')
  }
}
```

---

## Checklist Migrare Next.js 16

- [ ] Actualizat căile cache imagini pentru ambele moduri (dev + prod)
- [ ] Adăugat al doilea argument la toate apelurile `revalidateTag()`
- [ ] Verificat că `/api/revalidate` funcționează
- [ ] Testat seed cu dev server pornit
- [ ] Verificat că imaginile se încarcă corect după seed

---

## Resurse

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [revalidateTag Documentation](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)
