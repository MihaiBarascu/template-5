# Plan Multi-Site Deployment cu Dokploy + Cloudflare Tunnel

## Viziune

Rulezi **5 website-uri diferite** din **același repository Git** (main branch), fiecare cu **seed diferit** (frizerie, dentist, avocat, etc.), accesibile prin **subdomenii** pe domeniul tău.

---

## Arhitectura Finală

```
                    ┌─────────────────────┐
                    │   GitHub / GitLab   │
                    │   (un singur repo)  │
                    └──────────┬──────────┘
                               │
                               │ git pull (automat la push)
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         DOKPLOY                               │
│                    (pe VPS-ul tău)                           │
│                                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   App 1     │ │   App 2     │ │   App 3     │  ...       │
│  │  frizerie   │ │  dentist    │ │   avocat    │            │
│  │             │ │             │ │             │            │
│  │ SEED_TYPE=  │ │ SEED_TYPE=  │ │ SEED_TYPE=  │            │
│  │ frizerie    │ │ dentist     │ │ avocat      │            │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘            │
│         │               │               │                    │
│         ▼               ▼               ▼                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  MongoDB 1  │ │  MongoDB 2  │ │  MongoDB 3  │  ...       │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                               │
│                    Traefik (reverse proxy)                   │
└───────────────────────────┬──────────────────────────────────┘
                            │
                ┌───────────▼───────────┐
                │   CLOUDFLARE TUNNEL   │
                │     (cloudflared)     │
                └───────────┬───────────┘
                            │
                ┌───────────▼───────────┐
                │      CLOUDFLARE       │
                │   (DNS + SSL automat) │
                │                       │
                │ frizerie.domain.com   │
                │ dentist.domain.com    │
                │ avocat.domain.com     │
                │ restaurant.domain.com │
                │ salon.domain.com      │
                └───────────────────────┘
```

---

## De ce această strategie?

| Avantaj | Explicație |
|---------|------------|
| **Zero fișiere locale** | Nu creezi docker-compose pe PC |
| **Auto-deploy** | Push pe Git → Dokploy rebuild automat |
| **Un singur repo** | Toate site-urile din același cod |
| **Izolare date** | Fiecare site = MongoDB separat |
| **SSL automat** | Cloudflare se ocupă |
| **Ușor de scalat** | Adaugi App nouă în Dokploy = site nou |

---

## Pași de Implementare

### Pas 1: Pregătire Repository (în template-5)

#### 1.1 Adaugă `output: 'standalone'` în next.config.js

```javascript
// next.config.js
import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // <-- OBLIGATORIU pentru Docker!
  images: {
    remotePatterns: [
      {
        hostname: new URL(NEXT_PUBLIC_SERVER_URL).hostname,
        protocol: new URL(NEXT_PUBLIC_SERVER_URL).protocol.replace(':', ''),
      },
    ],
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
```

#### 1.2 Creează Dockerfile (în rădăcina repo-ului)

```dockerfile
# Dockerfile
# Sursa: Template oficial Payload CMS
# IMPORTANT: Necesită output: 'standalone' în next.config.js

FROM node:22.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager (auto-detect)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build cu package manager-ul detectat
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Pentru uploads (media files)
RUN mkdir -p media && chown -R nextjs:nodejs media

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js
```

#### 1.3 Push pe GitHub/GitLab

```bash
git add .
git commit -m "Add Docker support for multi-site deployment"
git push origin main
```

---

### Pas 2: Instalare Dokploy pe VPS

```bash
# Pe VPS-ul tău (Ubuntu/Debian)
curl -sSL https://dokploy.com/install.sh | sh
```

Accesezi Dokploy la `http://IP-VPS:3000` și creezi cont admin.

---

### Pas 3: Configurare Cloudflare Tunnel

#### 3.1 Creare Tunnel

1. Mergi la **Cloudflare Dashboard** → **Zero Trust** → **Networks** → **Tunnels**
2. Click **Create a tunnel** → Selectează **Cloudflared**
3. Dă-i un nume (ex: `dokploy-multisite`)
4. **Copiază token-ul** generat

#### 3.2 Instalare cloudflared pe VPS

În Dokploy:
1. **Projects** → **Create Project** → nume: "Infrastructure"
2. **Create Service** → **Docker** → **Docker Run**
3. Configurează:

```
Image: cloudflare/cloudflared:latest
Command: tunnel --no-autoupdate run --token TOKENUL_TAU_AICI
```

SAU prin SSH pe VPS:

```bash
docker run -d --name cloudflared --restart always \
  --network dokploy-network \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --token TOKENUL_TAU_AICI
```

---

### Pas 4: Creare Aplicații în Dokploy

Pentru **fiecare site** (frizerie, dentist, avocat, restaurant, salon):

#### 4.1 Creare Proiect

1. **Projects** → **Create Project** → "Business Sites"

#### 4.2 Creare MongoDB pentru fiecare site

1. **Create Service** → **Database** → **MongoDB**
2. Nume: `mongo-frizerie`
3. Repetă pentru: `mongo-dentist`, `mongo-avocat`, `mongo-restaurant`, `mongo-salon`

#### 4.3 Creare Aplicație pentru fiecare site

1. **Create Service** → **Application**
2. Configurează:
   - **Name**: `site-frizerie`
   - **Source**: Git Repository
   - **Repository URL**: `https://github.com/USER/template-5`
   - **Branch**: `main`
   - **Build Type**: Dockerfile
   - **Dockerfile Path**: `./Dockerfile`

3. Tab **Environment Variables**:
```env
DATABASE_URI=mongodb://mongo-frizerie:27017/payload
PAYLOAD_SECRET=secret-unic-frizerie-minim-32-caractere
SEED_TYPE=frizerie
NEXT_PUBLIC_SERVER_URL=https://frizerie.tudomeniu.com
RESEND_API_KEY=re_xxxxx
```

4. Tab **Domains**:
   - Adaugă: `frizerie.tudomeniu.com`

5. Tab **Network**:
   - Asigură-te că e în aceeași rețea cu `mongo-frizerie`

6. **Deploy**

7. **Repetă pentru celelalte 4 site-uri** cu valorile corespunzătoare

---

### Pas 5: Configurare Public Hostnames în Cloudflare

În **Cloudflare Dashboard** → **Zero Trust** → **Tunnels** → click pe tunnel → **Public Hostname**:

| Subdomain  | Domain         | Service                    |
|------------|----------------|----------------------------|
| frizerie   | tudomeniu.com  | http://site-frizerie:3000  |
| dentist    | tudomeniu.com  | http://site-dentist:3000   |
| avocat     | tudomeniu.com  | http://site-avocat:3000    |
| restaurant | tudomeniu.com  | http://site-restaurant:3000|
| salon      | tudomeniu.com  | http://site-salon:3000     |

**Notă**: Numele serviciului trebuie să fie exact cum l-ai numit în Dokploy.

---

### Pas 6: Seeding Inițial

După primul deploy, rulează seed-ul pentru fiecare site.

În Dokploy, pentru fiecare aplicație:
1. Click pe aplicație → **Terminal** (sau **Logs** → **Shell**)
2. Rulează:
```bash
node -e "import('./src/seed/index.js')"
```

SAU prin SSH pe VPS:
```bash
docker exec -it site-frizerie sh -c "node -e \"import('./src/seed/index.js')\""
```

---

## Environment Variables per Site

| Site       | SEED_TYPE  | DATABASE_URI                        | NEXT_PUBLIC_SERVER_URL              |
|------------|------------|-------------------------------------|-------------------------------------|
| Frizerie   | frizerie   | mongodb://mongo-frizerie:27017/payload   | https://frizerie.tudomeniu.com    |
| Dentist    | dentist    | mongodb://mongo-dentist:27017/payload    | https://dentist.tudomeniu.com     |
| Avocat     | avocat     | mongodb://mongo-avocat:27017/payload     | https://avocat.tudomeniu.com      |
| Restaurant | restaurant | mongodb://mongo-restaurant:27017/payload | https://restaurant.tudomeniu.com  |
| Salon      | salon      | mongodb://mongo-salon:27017/payload      | https://salon.tudomeniu.com       |

**Important**: Fiecare site are nevoie de un `PAYLOAD_SECRET` unic! Generează cu:
```bash
openssl rand -hex 32
```

---

## Workflow de Actualizare

După setup, când vrei să actualizezi toate site-urile:

```bash
# Pe PC-ul tău local
git add .
git commit -m "Update: new feature"
git push origin main

# Dokploy detectează automat și rebuild-uiește toate aplicațiile
# (dacă ai activat auto-deploy)
```

SAU în Dokploy: click **Redeploy** pe fiecare aplicație.

---

## Rezultat Final

| URL                              | Business Type | Admin Panel                                |
|----------------------------------|---------------|--------------------------------------------|
| https://frizerie.tudomeniu.com   | Frizerie      | https://frizerie.tudomeniu.com/admin      |
| https://dentist.tudomeniu.com    | Dentist       | https://dentist.tudomeniu.com/admin       |
| https://avocat.tudomeniu.com     | Avocat        | https://avocat.tudomeniu.com/admin        |
| https://restaurant.tudomeniu.com | Restaurant    | https://restaurant.tudomeniu.com/admin    |
| https://salon.tudomeniu.com      | Salon         | https://salon.tudomeniu.com/admin         |

---

## Cerințe Hardware VPS

Pentru 5 site-uri Payload CMS + 5 MongoDB:

| Resursă | Minim | Recomandat |
|---------|-------|------------|
| RAM     | 8 GB  | 16 GB      |
| CPU     | 4 cores | 6+ cores |
| Storage | 50 GB SSD | 100 GB SSD |

Fiecare instanță Next.js/Payload consumă ~200-400MB RAM.

---

## Checklist Pre-Deployment

**În repository (template-5):**
- [ ] `next.config.js` are `output: 'standalone'`
- [ ] `Dockerfile` există în rădăcina proiectului
- [ ] `pnpm-lock.yaml` există
- [ ] Repo-ul e push-uit pe GitHub/GitLab

**În Dokploy:**
- [ ] 5 instanțe MongoDB create
- [ ] 5 aplicații create, fiecare cu ENV vars corecte
- [ ] Rețeaua corectă configurată între app și mongo
- [ ] Domeniile configurate

**În Cloudflare:**
- [ ] Tunnel creat și cloudflared rulează
- [ ] Public Hostnames configurate pentru toate subdomeniile
- [ ] DNS-ul domeniului principal pointează la Cloudflare

---

## Troubleshooting

### Build eșuează cu "standalone output not found"
→ Adaugă `output: 'standalone'` în `next.config.js`

### Container-ul nu pornește - "ECONNREFUSED mongodb"
→ Verifică că MongoDB-ul e în aceeași rețea Docker cu aplicația

### Uploads nu funcționează
→ Adaugă volume persistent pentru `/app/media` sau folosește S3/R2

### Site-ul nu e accesibil prin subdomeniu
→ Verifică Public Hostname în Cloudflare Tunnel + numele serviciului

### "PAYLOAD_SECRET must be at least 32 characters"
→ Generează secret mai lung: `openssl rand -hex 32`

---

## Ghid Pornire După Restart PC

### Verificare status (ar trebui să pornească automat):

```bash
# Verifică cloudflared
sudo systemctl status cloudflared

# Verifică Docker containers
sudo docker ps
```

### Dacă nu pornesc automat:

```bash
# Pornește cloudflared
sudo systemctl start cloudflared

# Pornește Docker
sudo systemctl start docker

# Așteaptă 30 sec, apoi verifică containerele
sudo docker ps
```

### Dacă Dokploy nu apare în docker ps:

```bash
# Repornește Docker complet
sudo systemctl restart docker

# Așteaptă 1 minut
sleep 60

# Verifică din nou
sudo docker ps
```

### Accesare:

- **Dokploy local**: http://localhost:3000
- **Dokploy public**: https://admin.multiwebsite.org

---

## Surse și Referințe

- [Payload CMS Docker Deployment](https://payloadcms.com/docs/production/deployment)
- [How to Run Payload CMS in Docker](https://sliplane.io/blog/how-to-run-payload-cms-in-docker)
- [Dokploy Documentation](https://docs.dokploy.com/)
- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Next.js Standalone Output](https://nextjs.org/docs/pages/api-reference/next-config-js/output)
