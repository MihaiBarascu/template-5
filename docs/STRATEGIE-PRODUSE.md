# Strategie: 2 Produse Separate

## 1. MultiWebsite = Platformă Multi-Tenant (SaaS pe abonament)

### De ce o singură platformă multi-tenant:

| Aspect | Site-uri Individuale | Multi-Tenant |
|---|---|---|
| Infrastructură pentru 10 clienți | 10 MongoDB + 10 containere = ~800€/lună | 1 MongoDB + 1 container = ~150€/lună |
| Timp onboarding client nou | 3-4 ore setup | 13 minute (doar seed) |
| Bug fix / Feature nou | Deploy în 10 locuri separate | 1 singur deploy |
| Update securitate Payload/Next.js | 10 update-uri manuale | 1 update, toți clienții actualizați |
| Risc la deployment | Fiecare client = punct de failure separat | Infrastructură testată, stabilă |

### Complexitatea template-5 care justifică multi-tenant:

- **350+ fișiere TypeScript** - imposibil de menținut în 10+ copii
- **47 blocuri** (1.2MB componente) - orice bug trebuie fixat o singură dată
- **19 colecții** + **8 plugin-uri Payload** - schema complexă
- **11 tipuri de business** deja configurate în seeders
- **15+ variabile de mediu** per deployment - nightmare de configurat individual

**Concluzie**: MultiWebsite e prea complex pentru deployments individuale. Multi-tenant = scalabil, profitabil, mentenabil.

---

## 2. Astro.js + Pages CMS = Site-uri Individuale (vânzare one-time)

### De ce Astro pentru site-uri individuale:

| Aspect | Template-5 (Next.js + Payload) | Astro + Pages CMS |
|---|---|---|
| Build output | Server-side (necesită Node.js) | Static HTML (hosting gratuit) |
| Hosting cost client | 20-50€/lună (VPS) | 0€ (Netlify/Vercel free tier) |
| Complexitate mentenanță | Necesită developer | Editabil din GitHub/CMS simplu |
| Dependențe | 350+ fișiere, 8 plugins | HTML/CSS/JS minimal |
| Viteză | ~300ms TTFB | ~50ms TTFB (static) |
| Customizare client | Limitată la admin panel | Poate modifica direct codul |

### Avantaje strategice:

- Clientul **primește cod sursă** și poate face ce vrea cu el
- **Noi nu avem obligație de suport** după livrare
- **Preț one-time** (500-2000€) vs. abonament lunar
- Dacă vrea features avansate → îl migrăm pe MultiWebsite (upsell)

---

## Rezumat Strategie

| Produs | Target | Model | Tech Stack |
|---|---|---|---|
| **MultiWebsite** | Clienți care vor site gestionat, fără bătăi de cap | Abonament lunar (15-50€/lună) | Next.js + Payload Multi-Tenant |
| **Astro Sites** | Clienți care vor să dețină codul, buget mic | One-time (500-2000€) | Astro + Pages CMS (sau alt backend) |

**Demo Astro**: https://stupendous-mooncake-d98c7b.netlify.app/terapii/eliberare-tensiuni/
