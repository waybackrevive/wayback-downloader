# Wayback Platform — Production Deployment Blueprint

**Domain:** `wayback.download`  
**API:** `api.wayback.download`  
**Stack:** Elm SPA · Flask/Gunicorn · SQS Worker · MySQL 8 · Docker Compose · Nginx · Ubuntu 22.04

> **How to use this guide:** Follow every phase top to bottom. Every command block is copy-paste ready.  
> Replace `YOUR_*` placeholders with your real values when you see them.

---

## What Runs Where

| Service | Runtime | Host or Docker |
|---|---|---|
| wayback-frontend | Nginx (static files) | Host |
| wayback-backend | Python 3.11 / Gunicorn | Docker |
| wayback-restore | Python 3.11 / SQS worker | Docker |
| MySQL 8 | Database | Docker |
| Nginx | Reverse proxy + SSL | Host |

> **Python 3.11 runs inside Docker containers — you do NOT need to install Python on the server.**

---

## Third-Party Accounts You Need

- [AWS Console](https://console.aws.amazon.com) — Cognito, SQS, S3, SES
- [Whop](https://whop.com) — payments
- [hCaptcha](https://www.hcaptcha.com) — bot protection
- Domain DNS panel for `wayback.download` (e.g. Hostinger)

---

---

# PHASE 1 — AWS Setup

---

## Step 1.1 — Create IAM User

1. AWS Console → **IAM** → **Users** → **Create user**
2. Username: `wayback-app`
3. Select **Attach policies directly**, attach:
   - `AmazonSQSFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonSESFullAccess`
4. Click **Create user**
5. Click the new user → **Security credentials** → **Create access key**
6. Select: **Application running outside AWS**
7. **SAVE these — fill them into the .env in Phase 7:**
   ```
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   ```

---

## Step 1.2 — Create Cognito User Pool

1. AWS Console → **Cognito** → **Create user pool**
2. Settings:
   - Sign-in: **Email**
   - Password policy: default
   - MFA: **No MFA**
3. App client:
   - App type: **Confidential client**
   - Name: `wayback-app`
   - Client secret: **Generate a client secret** ✅
   - Auth flows: enable `ALLOW_USER_PASSWORD_AUTH` and `ALLOW_REFRESH_TOKEN_AUTH`
4. **Region: `eu-north-1`** — this is hardcoded in the app. ✅ Already done.
5. ✅ **Already created** — User pool ID: `eu-north-1_b1rL6aco4`
6. **SAVE:**
   ```
   COGNITO_USERPOOL_ID=eu-north-1_b1rL6aco4
   COGNITO_APP_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
   COGNITO_APP_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

---

## Step 1.3 — Create SQS Queue

1. AWS Console → **SQS** → **Create queue**
2. Type: **Standard**
3. Name: `wayback-queue`
4. Visibility timeout: `600` seconds
5. All other settings: default → Create queue
6. **SAVE:**
   ```
   SQS_NAME=wayback-queue
   SQS_REGION=eu-north-1
   ```

---

## Step 1.4 — Create S3 Bucket

1. AWS Console → **S3** → **Create bucket**
2. Bucket name: `wayback-restore-files` (must be globally unique — add numbers if taken)
3. Region: `eu-north-1` (same region as all other services)
4. Block all public access: **ON** — keep it enabled
5. Create bucket
6. Add lifecycle rule: Bucket → **Management** → **Create lifecycle rule**
   - Rule name: anything (e.g. `expire-30-days`)
   - Scope: select **"Apply to all objects in the bucket"** (do NOT add tags or prefix)
   - Action: tick **"Expire current versions of objects"**
   - Days after object creation: `30`
   - Click **Create rule**
7. **SAVE:**
   ```
   S3_NAME=wayback-restore-files
   S3_REGION=eu-north-1
   ```

---

## Step 1.5 — Setup SES (Email)

1. AWS Console → **SES** → **Verified identities** → **Create identity**
2. Select: **Domain** → enter: `wayback.download`
3. DKIM: **Easy DKIM** → RSA 2048 → Create identity
4. AWS shows 3 CNAME records — **copy all of them**
5. Go to your DNS panel (Hostinger) and add all 3 CNAME records
6. Wait 5–10 minutes → refresh SES → status should show **Verified**

> **New AWS accounts are in SES sandbox** and can only send to verified email addresses.  
> To send to any email: SES → Account dashboard → **Request production access** → submit form.  
> AWS usually approves within 24 hours.

---

---

# PHASE 2 — Whop Setup (Payments)

---

## Step 2.1 — Create Products and Plans

1. Login to [whop.com](https://whop.com) → **Dashboard → Products**
2. Create product: **"Wayback HTML Recovery"**
   - Add a **one-time plan** → price `$19`
   - Note the Plan ID (format: `plan_XXXX`) → this is `WHOP_SINGLE_PLAN_ID`
3. Create product: **"Wayback Bulk Subscription"**
   - Add a **recurring plan** → price `$95/month`
   - Note the Plan ID → this is `WHOP_SUBSCRIPTION_PLAN_ID`

## Step 2.2 — Get API Key

1. Whop → **Settings → Developer → API Keys** → Create new key
2. **SAVE:**
   ```
   WHOP_API_KEY=whop_sk_XXXXXXXXXXXX
   ```

## Step 2.3 — Create Webhook

1. Whop → **Settings → Webhooks → Add endpoint**
2. URL: `https://api.wayback.download/webhook`
3. Events: `membership.went_valid`, `payment.succeeded`
4. Create → reveal signing secret
5. **SAVE:**
   ```
   WHOP_WEBHOOK_SECRET=whsec_XXXXXXXXXXXX
   ```

---

---

# PHASE 3 — hCaptcha Setup

---

1. [hcaptcha.com](https://www.hcaptcha.com) → login → **Sites → New Site**
2. Site name: `wayback.download`
3. Hostnames: `wayback.download` and `www.wayback.download`
4. **SAVE:**
   ```
   HCAPTCHA_SITE_KEY=YOUR_SITE_KEY
   HCAPTCHA_SECRET=YOUR_SECRET_KEY
   ```

---

---

# PHASE 4 — DNS Records

---

In your DNS panel, add:

| Type | Name | Value |
|---|---|---|
| A | `@` | YOUR_VPS_IP |
| A | `www` | YOUR_VPS_IP |
| A | `api` | YOUR_VPS_IP |
| CNAME | (from SES step 1.5) | (from SES) |
| CNAME | (from SES step 1.5) | (from SES) |
| CNAME | (from SES step 1.5) | (from SES) |

> DNS propagation takes 5–30 minutes. Verify at: https://intodns.com/wayback.download  
> All A records must show your VPS IP before continuing to Phase 12 (SSL).

---

---

# PHASE 5 — VPS Server Setup

---

SSH into your server:
```bash
ssh deploy@YOUR_VPS_IP
```

## Step 5.1 — Update the server

```bash
sudo apt update && sudo apt upgrade -y
```

## Step 5.2 — Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
docker --version
```

## Step 5.3 — Install Docker Compose plugin

```bash
sudo apt install -y docker-compose-plugin
docker compose version
```

## Step 5.4 — Install Node.js 20 (needed only to build the Elm frontend)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

## Step 5.5 — Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Step 5.6 — Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

> That is all — no Python 3.11, no Ruby, no pip needed on the host.  
> All of that is handled automatically inside the Docker containers.

---

---

# PHASE 6 — Upload Code to Server

---

**Option A — Clone from GitHub (recommended)**

On your server:
```bash
git clone https://github.com/YOUR_ORG/wayback-downloader.git /opt/wayback
```

**Option B — Copy from your local Windows machine (no GitHub)**

Run this in PowerShell on your local machine:
```powershell
scp -r "C:\Users\UsEr\Downloads\wayback-downloader\." deploy@YOUR_VPS_IP:/opt/wayback
```

---

---

# PHASE 7 — Create the Environment File

---

```bash
sudo nano /opt/wayback/.env
```

Paste the block below. Fill in **every** `YOUR_*` / `CHOOSE_*` value before saving:

```env
# ── Database ───────────────────────────────────────────
DATABASE_USERNAME=wayback
DATABASE_PASSWORD=CHOOSE_A_STRONG_PASSWORD_HERE
DATABASE_HOST=mysql
DATABASE_NAME=wayback

# ── AWS credentials ────────────────────────────────────
AWS_ACCESS_KEY_ID=YOUR_IAM_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_IAM_SECRET_KEY
AWS_DEFAULT_REGION=eu-north-1

# ── SQS ───────────────────────────────────────────
SQS_NAME=wayback-queue
SQS_REGION=eu-north-1

# ── S3 ────────────────────────────────────────────
S3_NAME=wayback-restore-files
S3_REGION=eu-north-1

# ── SES (email) ─────────────────────────────────
SES_REGION=eu-north-1
SES_FROM_EMAIL=noreply@wayback.download

# ── Cognito ───────────────────────────────────────────
COGNITO_USERPOOL_ID=eu-north-1_b1rL6aco4
COGNITO_APP_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
COGNITO_APP_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXX

# ── Whop (payments) ───────────────────────────────────
WHOP_API_KEY=whop_sk_XXXXXXXXXXXX
WHOP_WEBHOOK_SECRET=whsec_XXXXXXXXXXXX
WHOP_SINGLE_PLAN_ID=plan_XXXXXXXXXXXX
WHOP_SUBSCRIPTION_PLAN_ID=plan_XXXXXXXXXXXX
APP_DOMAIN=https://wayback.download

# ── hCaptcha ──────────────────────────────────────────
HCAPTCHA_SECRET=YOUR_HCAPTCHA_SECRET_KEY
HCAPTCHA_SITE_KEY=YOUR_HCAPTCHA_SITE_KEY

# ── General ───────────────────────────────────────────
CONTACT_EMAIL=support@wayback.download
SWAGGER_UI=False
SWAGGER_DEBUG=False
PYTHONUNBUFFERED=1
WAYBACK_OUTPUT_DIR=/tmp/wayback-output
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

Lock down the file:
```bash
sudo chmod 600 /opt/wayback/.env
```

---

---

# PHASE 8 — Create Docker Compose File

---

```bash
sudo nano /opt/wayback/docker-compose.yml
```

Paste exactly:

```yaml
services:

  mysql:
    image: mysql:8
    restart: always
    environment:
      MYSQL_DATABASE: ${DATABASE_NAME}
      MYSQL_USER: ${DATABASE_USERNAME}
      MYSQL_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - wayback
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      retries: 5

  wayback-backend:
    build:
      context: ./wayback-backend
    restart: always
    env_file: .env
    environment:
      DATABASE_HOST: mysql
    ports:
      - "127.0.0.1:5000:5000"
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - wayback

  wayback-restore:
    build:
      context: ./wayback-restore
    restart: always
    env_file: .env
    environment:
      DATABASE_HOST: mysql
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - wayback

volumes:
  mysql_data:

networks:
  wayback:
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

---

---

# PHASE 9 — Build and Start the Docker Stack

---

```bash
cd /opt/wayback
docker compose up -d --build
```

> First build takes **5–10 minutes** — it downloads base images and compiles both Python services.

Watch progress:
```bash
docker compose logs -f
```

Press `Ctrl+C` to stop following logs (containers keep running).

## Verify all 3 containers are up

```bash
docker compose ps
```

You should see all three as **Up**:
```
NAME                    STATUS
wayback-mysql-1         Up (healthy)
wayback-backend-1       Up
wayback-restore-1       Up
```

If any container shows an error:
```bash
docker compose logs wayback-backend
docker compose logs wayback-restore
docker compose logs mysql
```

## Initialise the database schema

```bash
docker compose exec wayback-backend python build_database.py
```

---

---

# PHASE 10 — Build and Deploy the Frontend

---

```bash
cd /opt/wayback/wayback-frontend
npm install
npm run build
```

Copy compiled files to the Nginx webroot:
```bash
sudo mkdir -p /var/www/wayback.download
sudo cp -r public/* /var/www/wayback.download/
sudo chown -R www-data:www-data /var/www/wayback.download
```

---

---

# PHASE 11 — Configure Nginx

---

## Step 11.1 — Frontend site

```bash
sudo nano /etc/nginx/sites-available/wayback-frontend
```

Paste:
```nginx
server {
    listen 80;
    server_name wayback.download www.wayback.download;

    root /var/www/wayback.download;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|svg|ico|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

## Step 11.2 — Backend API proxy

```bash
sudo nano /etc/nginx/sites-available/wayback-api
```

Paste:
```nginx
server {
    listen 80;
    server_name api.wayback.download;

    location / {
        proxy_pass         http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        client_max_body_size 2M;
    }
}
```

## Step 11.3 — Enable sites and reload Nginx

```bash
sudo ln -s /etc/nginx/sites-available/wayback-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/wayback-api      /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

---

# PHASE 12 — SSL Certificates

---

> DNS must be propagated first (Phase 4). Run this only after `https://intodns.com/wayback.download` shows your VPS IP.

```bash
sudo certbot --nginx \
  -d wayback.download \
  -d www.wayback.download \
  -d api.wayback.download
```

- Enter your email when prompted
- Agree to terms
- Certbot automatically updates your Nginx configs for HTTPS

Verify auto-renewal works:
```bash
sudo certbot renew --dry-run
```

---

---

# PHASE 13 — Create Admin Account

---

## Step 13.1 — Register on the website

Go to `https://wayback.download` → sign up with your email address.

## Step 13.2 — Grant admin rights in the database

```bash
docker compose -f /opt/wayback/docker-compose.yml exec mysql \
  mysql -u wayback -p wayback
```

Enter your `DATABASE_PASSWORD` when prompted, then run:

```sql
UPDATE clients SET admin = 1 WHERE email = 'YOUR_EMAIL_HERE';
EXIT;
```

---

---

# PHASE 14 — Final Verification Checklist

---

```bash
# 1. All containers running
docker compose -f /opt/wayback/docker-compose.yml ps

# 2. Backend responding
curl -I https://api.wayback.download

# 3. Frontend responding
curl -I https://wayback.download

# 4. Follow backend logs live
docker compose -f /opt/wayback/docker-compose.yml logs -f wayback-backend

# 5. Follow restore worker logs live
docker compose -f /opt/wayback/docker-compose.yml logs -f wayback-restore
```

**Manual checks:**

- [ ] `https://wayback.download` loads the homepage
- [ ] Sign up with a new email — confirmation email arrives
- [ ] Login works
- [ ] Admin panel visible at `/admin` (after setting admin flag)
- [ ] Place a test order — Whop checkout page opens
- [ ] Whop dashboard shows webhook received after payment
- [ ] Restore job appears in admin panel
- [ ] Download link emailed after restore completes (requires SES production access)

---

---

# Ongoing Operations

---

## Deploy an update

```bash
cd /opt/wayback
git pull origin main

# Rebuild backend and restore containers
docker compose up -d --build wayback-backend wayback-restore

# Rebuild and redeploy frontend
cd wayback-frontend && npm install && npm run build
sudo cp -r public/* /var/www/wayback.download/
```

## Useful daily commands

```bash
# View all container status
docker compose -f /opt/wayback/docker-compose.yml ps

# Follow all logs
docker compose -f /opt/wayback/docker-compose.yml logs -f

# Restart one service
docker compose -f /opt/wayback/docker-compose.yml restart wayback-backend

# Restart everything
docker compose -f /opt/wayback/docker-compose.yml restart

# Enter MySQL shell
docker compose -f /opt/wayback/docker-compose.yml exec mysql mysql -u wayback -p wayback
```

---

---

# Troubleshooting

---

| Problem | Cause | Fix |
|---|---|---|
| `python3.11` not found on server | Host doesn't need Python — it runs in Docker | Skip host Python install. Use `docker compose up`. |
| Website not loading | DNS not propagated yet | Wait 30 min, check intodns.com |
| 502 Bad Gateway on API | Backend container down | `docker compose logs wayback-backend` |
| Login fails | Cognito misconfigured | Check all `COGNITO_*` values in `.env` |
| Payment page doesn't load | Whop plan IDs wrong | Check `WHOP_SINGLE_PLAN_ID` and `WHOP_SUBSCRIPTION_PLAN_ID` |
| No emails sent | SES still in sandbox | Request production access in SES console |
| Restore job stuck "In Progress" | SQS name/region wrong | Check `SQS_NAME` and `SQS_REGION` in `.env` |
| SSL cert fails | DNS not pointing to VPS yet | Confirm A records are set, wait for propagation |
| `docker compose up` build fails | Dockerfile error | `docker compose logs` to see the specific error |
