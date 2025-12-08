---
status: ACTIVE
type: plan
created: 2025-12-07
updated: 2025-12-08
related:
  - ../guides/seeding.md
  - ../../_ARCHITECTURE.md
tags: [multisite, agency, seeding, deployment]
---

# Multi-Site Seeds - Plan Activ

> **Status:** IN DEZVOLTARE
> **Scop:** Website agentie + 8 demo-uri business

---

## 1. Business Types Disponibile

| Tip | Seed | Status |
|-----|------|--------|
| frizerie | `pnpm seed:frizerie` | COMPLET |
| dentist | `pnpm seed:dentist` | COMPLET |
| restaurant | `pnpm seed:restaurant` | COMPLET |
| magazin | `pnpm seed:magazin` | COMPLET (Ecommerce) |
| salon | `pnpm seed:salon` | COMPLET |
| auto-service | `pnpm seed:auto-service` | COMPLET |
| fitness | `pnpm seed:fitness` | COMPLET |
| avocat | `pnpm seed:avocat` | TODO |
| agentie | `pnpm seed:agentie` | TODO |

---

## 2. Workflow Creare Site Nou

```bash
# 1. Clone proiect
git clone ... && cd template-5

# 2. Configurare environment
cp .env.example .env
# Editeaza MONGODB_URI, etc.

# 3. Seed business type
SEED_TYPE=frizerie pnpm seed

# 4. Start development
pnpm dev

# 5. Personalizare din admin
# http://localhost:3000/admin

# 6. Deploy
pnpm build && pnpm start
```

---

## 3. Structura Seeder

Fiecare seeder creeaza:

1. **Media** - Imagini hero, servicii, echipa
2. **Services** - Serviciile oferite
3. **Team** - Membri echipa (daca e cazul)
4. **Pages** - Home, Servicii, Despre, Contact
5. **Globals** - Site settings, Theme, Business info

---

## 4. Agency Website (TODO)

Website pentru agentia web cu:
- Hero spectaculos cu animatii
- Portfolio cu cele 8 demo-uri live
- Servicii oferite
- Proces de lucru (timeline)
- Testimoniale clienti
- Formular contact/brief

---

## 5. Deployment Multi-Site

### Dokploy (Docker)
```bash
# Fiecare site = container separat
# Shared MongoDB sau DB per site
```

### Vercel
```bash
# Deploy from branch
# Environment variables per project
```

---

## 6. Checklist Deploy

- [ ] Seeder rulat cu succes
- [ ] Imagini optimizate
- [ ] SEO meta setate (title, description)
- [ ] Favicon si logo uploadate
- [ ] Google Analytics configurat
- [ ] Formular contact functional
- [ ] HTTPS activ
- [ ] Robots.txt si sitemap.xml

---

*Plan activ - se actualizeaza*
