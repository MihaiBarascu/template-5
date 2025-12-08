# Plan Multi-Site Deployment cu Dokploy + Cloudflare Tunnel

## Viziune

Rulezi **5+ website-uri diferite** din **același repository Git** (main branch), fiecare cu **seed diferit** (frizerie, dentist, avocat, etc.), accesibile prin **subdomenii** pe domeniul tău.

**Naming Convention**: Folosim nume generice (`site-1`, `site-2`, etc.) pentru infrastructură. Tipul de business este definit doar prin `SEED_TYPE`.

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
│  │   site-1    │ │   site-2    │ │   site-3    │  ...       │
│  │             │ │             │ │             │            │
│  │ SEED_TYPE=  │ │ SEED_TYPE=  │ │ SEED_TYPE=  │            │
│  │ frizerie    │ │ dentist     │ │ avocat      │            │
│  │             │ │             │ │             │            │
│  │ [media-1]   │ │ [media-2]   │ │ [media-3]   │  volumes   │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘            │
│         │               │               │                    │
│         ▼               ▼               ▼                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  mongo-1    │ │  mongo-2    │ │  mongo-3    │  ...       │
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
                │ 1.multisite.org       │
                │ 2.multisite.org       │
                │ 3.multisite.org       │
                │ 4.multisite.org       │
                │ 5.multisite.org       │
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

#### 4.1 Creare Proiect

1. **Projects** → **Create Project** → "Multi Sites"

#### 4.2 Creare MongoDB pentru fiecare site

1. **Create Service** → **Database** → **MongoDB**
2. Configurează pe rând:

| Nume DB |
|---------|
| `mongo-1` |
| `mongo-2` |
| `mongo-3` |
| `mongo-4` |
| `mongo-5` |

#### 4.3 Creare Aplicație pentru fiecare site

1. **Create Service** → **Application**
2. Configurează:
   - **Name**: `site-1`
   - **Source**: Git Repository
   - **Repository URL**: `https://github.com/USER/template-5`
   - **Branch**: `main`
   - **Build Type**: Dockerfile
   - **Dockerfile Path**: `./Dockerfile`

3. Tab **Environment Variables**:
```env
DATABASE_URI=mongodb://mongo-1:27017/payload
PAYLOAD_SECRET=<generat-cu-openssl-rand-hex-32>
SEED_TYPE=frizerie
NEXT_PUBLIC_SERVER_URL=https://1.multisite.org
RESEND_API_KEY=re_xxxxx
```

4. Tab **Advanced** → **Volumes** (IMPORTANT pentru persistența fișierelor!):
   - Click **Add Volume**
   - **Type**: Volume
   - **Source**: `media-1`
   - **Target**: `/app/media`

5. Tab **Advanced** → **Ports** (pentru Cloudflare Tunnel):
   - **Published Port**: `3001` (pentru site-1)
   - **Target Port**: `3000`

6. Tab **Domains**:
   - Adaugă: `1.multisite.org`

7. Tab **Network**:
   - Asigură-te că e în aceeași rețea cu `mongo-1`

8. **Deploy**

9. **Repetă pentru celelalte site-uri** cu valorile corespunzătoare:

| App    | Port Extern | Volume  | Domeniu         |
|--------|-------------|---------|-----------------|
| site-1 | 3001        | media-1 | 1.multisite.org |
| site-2 | 3002        | media-2 | 2.multisite.org |
| site-3 | 3003        | media-3 | 3.multisite.org |
| site-4 | 3004        | media-4 | 4.multisite.org |
| site-5 | 3005        | media-5 | 5.multisite.org |

---

### Pas 5: Configurare Public Hostnames în Cloudflare

În **Cloudflare Dashboard** → **Zero Trust** → **Tunnels** → click pe tunnel → **Public Hostname**:

| Subdomain | Domain        | Service                 |
|-----------|---------------|-------------------------|
| 1         | multisite.org | http://localhost:3001   |
| 2         | multisite.org | http://localhost:3002   |
| 3         | multisite.org | http://localhost:3003   |
| 4         | multisite.org | http://localhost:3004   |
| 5         | multisite.org | http://localhost:3005   |

**Notă**: În Dokploy, configurează portul extern pentru fiecare aplicație (3001, 3002, etc.) în **Advanced** → **Ports**.

---

### Pas 6: Seeding Inițial

După primul deploy, rulează seed-ul pentru fiecare site.

În Dokploy, pentru fiecare aplicație:
1. Click pe aplicație → **Terminal** (sau **Logs** → **Shell**)
2. Rulează:
```bash
sh run-seed.sh frizerie
```

SAU prin SSH pe VPS:
```bash
docker exec -it site-1 sh run-seed.sh frizerie
docker exec -it site-2 sh run-seed.sh dentist
docker exec -it site-3 sh run-seed.sh avocat
# etc.
```

**Tipuri disponibile pentru seed**: `frizerie`, `dentist`, `avocat`, `restaurant`, `auto-service`, `constructii`, `salon`, `pensiune`, `magazin`, `fitness`, `curatenie`, `transport`, `foto-video`, `producator`

---

## Environment Variables per Site

| App    | SEED_TYPE  | DATABASE_URI                   | NEXT_PUBLIC_SERVER_URL      | Volume   |
|--------|------------|--------------------------------|-----------------------------|----------|
| site-1 | frizerie   | mongodb://mongo-1:27017/payload | https://1.multisite.org    | media-1  |
| site-2 | dentist    | mongodb://mongo-2:27017/payload | https://2.multisite.org    | media-2  |
| site-3 | avocat     | mongodb://mongo-3:27017/payload | https://3.multisite.org    | media-3  |
| site-4 | restaurant | mongodb://mongo-4:27017/payload | https://4.multisite.org    | media-4  |
| site-5 | salon      | mongodb://mongo-5:27017/payload | https://5.multisite.org    | media-5  |

**Important**: Fiecare site are nevoie de un `PAYLOAD_SECRET` unic! Generează 5 secrete:
```bash
for i in 1 2 3 4 5; do echo "SITE-$i: $(openssl rand -hex 32)"; done
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

| URL                      | Business Type | Admin Panel                    | Local URL           |
|--------------------------|---------------|--------------------------------|---------------------|
| https://1.multisite.org  | Frizerie      | https://1.multisite.org/admin  | localhost:3001      |
| https://2.multisite.org  | Dentist       | https://2.multisite.org/admin  | localhost:3002      |
| https://3.multisite.org  | Avocat        | https://3.multisite.org/admin  | localhost:3003      |
| https://4.multisite.org  | Restaurant    | https://4.multisite.org/admin  | localhost:3004      |
| https://5.multisite.org  | Salon         | https://5.multisite.org/admin  | localhost:3005      |

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

### Servicii care trebuie să ruleze:

1. **Docker** - gestionează containerele (Dokploy, aplicații, MongoDB)
2. **Cloudflared** - tunelul către Cloudflare

### Verificare status:

```bash
# Verifică Docker
sudo systemctl status docker

# Verifică cloudflared
sudo systemctl status cloudflared

# Verifică containerele
sudo docker ps
```

### Pornire automată (configurare o singură dată):

```bash
# Docker să pornească automat la boot
sudo systemctl enable docker

# Cloudflared să pornească automat la boot
sudo systemctl enable cloudflared
```

### Dacă nu pornesc automat după restart:

```bash
# 1. Pornește Docker
sudo systemctl start docker

# 2. Așteaptă 30 secunde (containerele pornesc automat)
sleep 30

# 3. Pornește cloudflared
sudo systemctl start cloudflared

# 4. Verifică
sudo docker ps
```

### Dacă containerele Dokploy nu apar:

```bash
# Repornește Docker complet
sudo systemctl restart docker

# Așteaptă 1-2 minute
sleep 90

# Verifică din nou
sudo docker ps
```

### Comenzi utile:

```bash
# Vezi toate containerele (inclusiv oprite)
sudo docker ps -a

# Logs pentru un container
sudo docker logs <container-name>

# Restart manual cloudflared
sudo systemctl restart cloudflared
```

### Accesare:

| Serviciu   | URL Local             | URL Public              |
|------------|-----------------------|-------------------------|
| Dokploy    | http://localhost:3000 | https://admin.multisite.org |
| Site 1     | http://localhost:3001 | https://1.multisite.org |
| Site 2     | http://localhost:3002 | https://2.multisite.org |
| Site 3     | http://localhost:3003 | https://3.multisite.org |
| Site 4     | http://localhost:3004 | https://4.multisite.org |
| Site 5     | http://localhost:3005 | https://5.multisite.org |

### Ordine pornire după restart:

1. Docker pornește automat → containerele pornesc
2. Cloudflared pornește automat → tunelul se conectează
3. După ~1-2 minute totul e funcțional

---

## Surse și Referințe

- [Payload CMS Docker Deployment](https://payloadcms.com/docs/production/deployment)
- [How to Run Payload CMS in Docker](https://sliplane.io/blog/how-to-run-payload-cms-in-docker)
- [Dokploy Documentation](https://docs.dokploy.com/)
- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Next.js Standalone Output](https://nextjs.org/docs/pages/api-reference/next-config-js/output)
