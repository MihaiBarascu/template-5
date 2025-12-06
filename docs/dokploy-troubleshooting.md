# Dokploy Troubleshooting

## Problema: Connect Timeout Error

Cand deploy-ul esueaza cu "Connect Timeout Error":

### 1. Verifica conexiunea la GitHub
```bash
curl -I https://api.github.com
```
Daca returneaza `HTTP/2 200` - reteaua e OK.

### 2. Gaseste containerul Dokploy
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -i dok
```

### 3. Restart Dokploy
```bash
# Copiaza numele containerului principal (cel fara postgres/redis/traefik)
docker restart dokploy.1.XXXX
```

### 4. Verifica logurile
```bash
docker logs dokploy.1.XXXX --tail 50
```
Cauta "Server Started on: http://0.0.0.0:3000" = OK

### 5. Refresh browser + retry deploy

---

## Alte comenzi utile

### Vezi toate containerele Dokploy
```bash
docker ps | grep dok
```

### Restart toate serviciile Dokploy
```bash
docker restart $(docker ps -q --filter "name=dokploy")
```

### Vezi loguri in timp real
```bash
docker logs -f dokploy.1.XXXX
```

### Opreste/Porneste Dokploy complet
```bash
# Stop
docker stop dokploy.1.XXXX

# Start
docker start dokploy.1.XXXX
```
