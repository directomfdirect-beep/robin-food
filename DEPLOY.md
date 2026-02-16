# Robin Food — Deployment Guide

## Server Info

| Parameter | Value |
|-----------|-------|
| **IP** | `85.239.47.69` |
| **Domain** | `robin-food.ru` |
| **OS** | Ubuntu 24.04 |
| **VPS** | Timeweb Cloud, 2 vCPU / 4 GB RAM / 50 GB NVMe |

## Architecture

```
Client (browser)
  |
  | HTTPS :443
  v
Nginx (reverse proxy + static files)
  |
  |-- / --> /var/www/robin-food/ (React SPA)
  |-- /api/* --> 127.0.0.1:8100 (Kong API Gateway)
                    |
                    |-- /rest/v1/* --> PostgREST
                    |-- /auth/v1/* --> GoTrue
                    |-- /realtime/v1/* --> Realtime (WebSocket)
                    |-- /storage/v1/* --> Storage API
                                            |
                                            v
                                        PostgreSQL 15
```

## Prerequisites

- SSH access: `ssh root@85.239.47.69`
- Node.js 18+ (for building frontend locally)
- Docker and Docker Compose (already installed on server)

## Quick Deploy (update frontend)

```bash
# 1. Build locally with production env vars
VITE_SUPABASE_URL=https://robin-food.ru/api \
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxMjc4NTY1LCJleHAiOjIwODY2Mzg1NjV9.VpIFLtLAlS4bYiiOPQ8pF0rLO2utULlhvYQkW-pq9lA \
npm run build

# 2. Upload to server
rsync -avz dist/ root@85.239.47.69:/var/www/robin-food/
```

No nginx restart needed — static files are served directly.

## Full Deploy from Scratch

### 1. Connect to server

```bash
ssh root@85.239.47.69
```

### 2. Install dependencies (if fresh server)

```bash
curl -fsSL https://get.docker.com | sh
apt install -y nginx certbot python3-certbot-nginx ufw rsync
systemctl enable docker nginx
```

### 3. Upload project

```bash
# From local machine:
rsync -avz --exclude=node_modules --exclude=dist --exclude=.git \
  docker/ root@85.239.47.69:/opt/robin-food/docker/
rsync -avz nginx/ root@85.239.47.69:/opt/robin-food/nginx/
```

### 4. Configure production environment

On the server, ensure `/opt/robin-food/docker/robin-food/.env` contains:

```env
POSTGRES_PASSWORD=robin-food-super-secret-password-2024
POSTGRES_DB=robin_food
SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_KEY=<your_service_key>
JWT_SECRET=<your_jwt_secret>
KONG_HTTP_PORT=8100
STUDIO_PORT=4000
META_PORT=9083
STORAGE_PORT=6000
GOTRUE_PORT=10000
PROJECT_NAME=robin-food
```

### 5. Start Supabase stack

```bash
cd /opt/robin-food/docker/robin-food
docker compose up -d
```

Wait 30s for all services to start, then verify:

```bash
docker compose ps
```

All 9 containers should be running: db, kong, auth, rest, realtime, storage, meta, imgproxy, studio.

### 6. Fix DB permissions (first time only)

```bash
docker exec -i robin-food-db psql -U postgres -d robin_food -c "
  DROP FUNCTION IF EXISTS auth.uid();
  DROP FUNCTION IF EXISTS auth.role();
  ALTER ROLE supabase_auth_admin WITH SUPERUSER;
  ALTER ROLE supabase_storage_admin WITH SUPERUSER;
  GRANT CREATE ON SCHEMA public TO supabase_auth_admin, supabase_storage_admin, authenticator, anon, authenticated, service_role, supabase_admin;
  ALTER SCHEMA auth OWNER TO supabase_auth_admin;
  ALTER SCHEMA storage OWNER TO supabase_storage_admin;
"
docker compose restart auth storage
```

### 7. Deploy frontend

```bash
# Build locally (see Quick Deploy above), then:
rsync -avz dist/ root@85.239.47.69:/var/www/robin-food/
```

### 8. Configure Nginx

```bash
cp /opt/robin-food/nginx/robin-food.conf /etc/nginx/sites-available/robin-food
ln -sf /etc/nginx/sites-available/robin-food /etc/nginx/sites-enabled/robin-food
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### 9. SSL certificate

```bash
certbot --nginx -d robin-food.ru -d www.robin-food.ru \
  --non-interactive --agree-tos --email admin@robin-food.ru
```

Certificate auto-renews via systemd timer (`certbot.timer`).

### 10. Firewall

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 10050/tcp  # Zabbix monitoring (Timeweb)
ufw enable
```

## Docker Services

| Container | Image | Port (internal) | Description |
|-----------|-------|-----------------|-------------|
| robin-food-db | supabase/postgres:15.1.1.61 | 5432 | PostgreSQL database |
| robin-food-kong | kong:2.8.1 | 127.0.0.1:8100 | API Gateway |
| robin-food-auth | supabase/gotrue:v2.143.0 | 9999 | Authentication |
| robin-food-rest | postgrest/postgrest:v12.0.1 | 3000 | REST API |
| robin-food-realtime | supabase/realtime:v2.28.32 | 4000 | WebSocket subscriptions |
| robin-food-storage | supabase/storage-api:v0.46.4 | 5000 | File storage |
| robin-food-meta | supabase/postgres-meta:v0.80.0 | 8080 | Schema introspection |
| robin-food-imgproxy | darthsim/imgproxy:v3.8.0 | 8080 | Image transformations |
| robin-food-studio | supabase/studio:20240422-5cf8f30 | 127.0.0.1:4000 | Admin dashboard |

## Common Operations

### Restart all services
```bash
cd /opt/robin-food/docker/robin-food
docker compose restart
```

### View logs
```bash
docker compose logs -f --tail=50           # all services
docker compose logs -f --tail=50 auth      # specific service
```

### Access Supabase Studio (via SSH tunnel)
```bash
# From local machine:
ssh -L 4000:127.0.0.1:4000 root@85.239.47.69
# Then open http://localhost:4000 in browser
```

### Reset database (WARNING: deletes all data)
```bash
cd /opt/robin-food/docker/robin-food
docker compose down -v
docker compose up -d
# Then re-run permission fixes (step 6)
```

### Check server resources
```bash
free -h                    # RAM usage
df -h /                    # Disk usage
docker stats --no-stream   # Per-container resources
```
