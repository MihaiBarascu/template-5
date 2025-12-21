# INDEX DOCUMENTATIE - Universal Business Website Template

> **CLAUDE CODE: CITESTE ACEST FISIER INTAI!**
> Acest index este SINGURA SURSA DE ADEVAR pentru documentatia proiectului.

**Ultima actualizare:** 2025-12-21
**Versiune Payload CMS:** 3.68.5
**Versiune Next.js:** 16.1.0
**Status Proiect:** ✅ HEALTHY (vezi [Audit Report](PROJECT-AUDIT-2025-12-21.md))

---

## DESPRE PROIECT

Template website multi-business pentru Romania cu:
- Website de prezentare (pagini, blog, servicii, echipa)
- Magazin online E-commerce (produse, cos, checkout, comenzi)
- Admin panel Payload CMS complet
- 11 tipuri de business pre-configurate (seeders)
- Per-page header customization
- Ecommerce control (master switch)

---

## DOCUMENTE ESENTIALE (citeste doar astea!)

| Document | Scop | Link |
|----------|------|------|
| **_INDEX.md** | Entry point (acest fisier) | - |
| **PROJECT-AUDIT-2025-12-21.md** | Audit complet proiect | [link](PROJECT-AUDIT-2025-12-21.md) |
| **_ARCHITECTURE.md** | Decizii tehnice (ADR-uri) | [link](_ARCHITECTURE.md) |
| **LESSONS-INDEX.md** | Index lectii (quick ref) | [link](lessons/_LESSONS-INDEX.md) |
| **LESSONS-LEARNED.md** | Greseli de evitat (detaliat) | [link](lessons/LESSONS-LEARNED.md) |
| **payload-cms.md** | Best practices Payload | [link](active/practices/payload-cms.md) |
| **ecommerce.md** | Plan sistem ecommerce | [link](active/plans/ecommerce.md) |

---

## LESSONS LEARNED CRITICE

| Topic | Fix |
|-------|-----|
| **Ecommerce Control** | `shopSettings.enabled` = master switch; `clearData()` reseteaza la false |
| **Per-page Header** | `headerSettings` in Pages cu `inherit` default |
| Cart 404 | Adauga `read: () => true` in carts access |
| ProductCard | Foloseste `AddToCart` (DB) nu `AddToCartButton` (localStorage) |
| Order Status | Plugin accepta: `processing`, `completed`, `cancelled`, `refunded` - NU `pending` |
| Inventory | Plugin-ul face decrementare AUTOMATA - nu decrementa manual |
| Role JWT | Adauga `saveToJWT: true` la field role in Users |
| Local API | Foloseste `overrideAccess: false` cand pasezi `user` |

[Vezi toate lectiile →](lessons/_LESSONS-INDEX.md)

---

## GHIDURI (optional, pentru task-uri specifice)

| Ghid | Cand | Link |
|------|------|------|
| Blocks | Cand creezi bloc nou | [link](active/guides/blocks.md) |
| Seeding | Cand creezi seeder business | [link](active/guides/seeding.md) |
| Deployment | Cand faci deploy | [link](active/guides/deployment.md) |
| Design System | Cand stilizezi componente | [link](active/practices/design-system.md) |
| Testing | Cand scrii teste | [link](active/practices/testing.md) |

---

## COMENZI RAPIDE

```bash
# Seed business (11 tipuri disponibile)
SEED_TYPE=frizerie pnpm seed
SEED_TYPE=magazin pnpm seed        # cu ecommerce
SEED_TYPE=terapii-energetice pnpm seed
# Toate: frizerie, dentist, avocat, restaurant, auto-service,
#        constructii, salon, magazin, fitness, multiweb, terapii-energetice

# Development
pnpm dev              # port 3100

# Build
pnpm build

# Types
pnpm generate:types

# Teste
pnpm test:e2e
```

---

## SKILLS CLAUDE CODE

- **`/payload`** - Payload CMS skill cu referinta completa (FOLOSESTE-L!)

---

## REGULI PENTRU CLAUDE CODE

1. **INTAI** citeste `_INDEX.md` (acest fisier)
2. Pentru Payload → foloseste `/payload` skill + `payload-cms.md`
3. Verifica `LESSONS-LEARNED.md` inainte de modificari ecommerce
4. Inainte de decizii arhitecturale → verifica `_ARCHITECTURE.md`
5. **NU citi** documente din `archive/` - sunt outdated

---

## ARHIVA (NU FOLOSI!)

Documente mutate in `archive/` sunt **INLOCUITE** sau **OUTDATED**.

---

*Document creat: 2025-12-08*
*Simplificat: 2025-12-08 - eliminat noise, pastrat doar esential*
