---
status: ACTIVE
type: guide
created: 2025-12-05
updated: 2025-12-08
related:
  - ../plans/multisite.md
tags: [deployment, dokploy, docker, vercel]
---

# Ghid Deployment

> **Metode:** Dokploy (Docker) sau Vercel
> **Regula:** HTTPS obligatoriu in productie

---

## 1. Environment Variables

```bash
# .env.production

# Database
MONGODB_URI=mongodb://...
DATABASE_URI=mongodb://...

# Payload
PAYLOAD_SECRET=secret-cel-putin-32-caractere
PAYLOAD_PUBLIC_SERVER_URL=https://domain.com

# Next.js
NEXT_PUBLIC_SERVER_URL=https://domain.com

# Email (Resend)
RESEND_API_KEY=re_...
```

---

## 2. Dokploy (Docker)

### Setup Initial

```bash
# Pe server
curl -sSL https://dokploy.com/install.sh | sh
```

### Configurare Proiect

1. New Application > Git repository
2. Branch: main
3. Build Type: Dockerfile
4. Environment variables din .env.production

### Dockerfile

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 3. Vercel

### Deploy

```bash
# Install CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### vercel.json

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

---

## 4. MongoDB Atlas

1. Create cluster (free tier OK pentru start)
2. Create database user
3. Whitelist IP (0.0.0.0/0 pentru orice)
4. Get connection string

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

---

## 5. Storage (Cloudflare R2)

### Setup

1. Create R2 bucket in Cloudflare
2. Generate API token cu R2 permissions
3. Configure in Payload

```typescript
// payload.config.ts
import { cloudflareR2Adapter } from '@payloadcms/plugin-cloud-storage/r2'

export default buildConfig({
  plugins: [
    cloudflareR2({
      collections: { media: true },
      bucket: process.env.R2_BUCKET,
      // ...
    }),
  ],
})
```

---

## 6. Domain Setup

### Dokploy
1. Add domain in Dokploy settings
2. Enable HTTPS (Let's Encrypt)
3. Wait for certificate

### Vercel
1. Add domain in project settings
2. Update DNS records (A or CNAME)
3. HTTPS automatic

---

## 7. Post-Deploy Checklist

- [ ] Site loads cu HTTPS
- [ ] Admin panel accesibil (/admin)
- [ ] Imagini se incarca corect
- [ ] Formular contact trimite email
- [ ] SEO meta prezente
- [ ] Sitemap.xml generat
- [ ] Robots.txt corect
- [ ] Analytics configurat

---

## 8. Troubleshooting

### Build fails
```bash
# Clear cache
rm -rf .next node_modules
pnpm install
pnpm build
```

### Database connection error
- Verifica MONGODB_URI
- Verifica IP whitelist in Atlas
- Verifica credentials

### Images not loading
- Verifica storage adapter config
- Verifica CORS settings
- Verifica bucket permissions

---

*Ghid activ - se actualizeaza*
