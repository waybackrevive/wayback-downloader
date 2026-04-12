# Wayback Download

> Restore archived websites from the [Wayback Machine](https://web.archive.org/) — delivered as a downloadable ZIP via S3.

**Live site:** https://wayback.download  |  **API:** https://api.wayback.download

---

## Architecture

Three independently deployable services communicate through **AWS SQS** and a shared **MySQL 8** database:

```
[wayback-frontend]  ──HTTP/Protobuf──►  [wayback-backend]
      (Elm SPA)                          (Flask/Connexion)
                                               │
                                      MySQL  ──┤──  AWS SQS
                                               │          │
                                        [wayback-restore] ◄── long-poll
                                               │
                                    AWS S3 (zips)  +  AWS SES (email)
```

| Service | Stack | Description |
|---|---|---|
| `wayback-backend/` | Python 3.11, Flask/Connexion, Gunicorn | REST API — auth, Whop payments, SQS dispatch |
| `wayback-restore/` | Python 3.11, Ruby gem | SQS worker — downloads, zips, uploads to S3, emails user |
| `wayback-frontend/` | Elm 0.19.1, elm-spa v6 | Single-page app served as static files |

---

## Pricing

| Product | Price |
|---|---|
| One-time restore — first domain | $19 |
| One-time restore — each additional domain | $12 |
| Monthly subscription (10 restores/month) | $95 |

Payments are processed by **Whop**. S3 download links expire after **30 days**.

---

## Services

### wayback-backend

REST API built with Flask + Connexion (OpenAPI 2). All request/response bodies are **Protocol Buffers** (`application/protobuf`). Routes are declared in `swagger/wayback.yaml`; controllers live in `src/controllers/`.

Key features:
- AWS Cognito JWT authentication
- hCaptcha validation
- Whop checkout link creation (one-time + subscription)
- Whop webhook verification (HMAC-SHA256, `Whop-Signature` header)
- SQS job dispatch to restore worker
- AWS SES transactional emails

See [wayback-backend/README.md](wayback-backend/README.md) for full setup and environment variable reference.

### wayback-restore

Long-polling SQS worker. For each message it:
1. Runs `wayback_machine_downloader` (Ruby gem) to download the archived site
2. Zips the output
3. Uploads the ZIP to S3 (`wayback-restore-files`, `eu-north-1`)
4. Emails the download link to the user via SES
5. Updates the restore status in MySQL

See [wayback-restore/README.md](wayback-restore/README.md) for full setup.

### wayback-frontend

Elm SPA compiled to a single `elm.js` bundle, served as static HTML/CSS/JS. Communicates with the backend exclusively over protobuf.

See [wayback-frontend/README.md](wayback-frontend/README.md) for build instructions.

---

## Quick Start (Docker Compose)

### Prerequisites

- Docker Engine ≥ 24 with the Compose plugin
- AWS credentials with access to SQS, S3, SES, and Cognito (region `eu-north-1`)
- A Whop account with two plans configured (one-time and subscription)
- A MySQL 8 instance (or use the Docker Compose database service)

### 1 — Clone & configure

```bash
git clone https://github.com/your-org/wayback-downloader.git
cd wayback-downloader
cp .env.example .env   # edit with your values
```

Environment variables (set in `.env` or your host environment):

| Variable | Description |
|---|---|
| `DATABASE_USERNAME` | MySQL username |
| `DATABASE_PASSWORD` | MySQL password |
| `DATABASE_HOST` | MySQL host |
| `DATABASE_NAME` | MySQL database name |
| `SQS_NAME` | SQS queue name (e.g. `wayback-queue`) |
| `SQS_REGION` | AWS region for SQS (e.g. `eu-north-1`) |
| `COGNITO_USERPOOL_ID` | Cognito User Pool ID |
| `COGNITO_APP_CLIENT_ID` | Cognito App Client ID |
| `COGNITO_APP_CLIENT_SECRET` | Cognito App Client Secret |
| `WHOP_API_KEY` | Whop company API key |
| `WHOP_WEBHOOK_SECRET` | Whop webhook signing secret |
| `WHOP_SINGLE_PLAN_ID` | Whop plan ID for one-time purchases |
| `WHOP_SUBSCRIPTION_PLAN_ID` | Whop plan ID for subscriptions |
| `APP_DOMAIN` | Public frontend URL (e.g. `https://wayback.download`) |
| `HCAPTCHA_SECRET` | hCaptcha secret key |
| `HCAPTCHA_SITE_KEY` | hCaptcha site key |
| `CONTACT_EMAIL` | Destination address for contact-form emails |
| `SES_REGION` | AWS SES region (default: `eu-north-1`) |

### 2 — Create the database schema

```bash
cd wayback-backend
pip install -r requirements.txt
python src/build_database.py
```

### 3 — Run

```bash
docker compose up --build
```

- Backend API: http://localhost:5000
- Frontend: http://localhost:1234

---

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full step-by-step production guide covering:
- Ubuntu server setup
- Docker installation
- Nginx + SSL (Let's Encrypt)
- Environment variable injection
- Database initialisation
- Service startup and health checks

---

## Development

### Backend

```bash
cd wayback-backend
pip install -r requirements.txt
python -m src.server          # dev server on :5000
pytest                        # unit + integration tests
pytest --cov                  # with coverage report
pylint src/
```

### Restore worker

```bash
cd wayback-restore
pip install -r requirements.txt
gem install wayback_machine_downloader
python src/main.py
pytest
```

### Frontend

```bash
cd wayback-frontend
npm install
npm start                     # dev server on http://localhost:1234
```

---

## AWS Infrastructure (eu-north-1)

| Resource | Name / ID |
|---|---|
| Region | `eu-north-1` (Stockholm) |
| SQS queue | `wayback-queue` |
| S3 bucket | `wayback-restore-files` (30-day lifecycle) |
| Cognito User Pool | `eu-north-1_b1rL6aco4` |
| SES identity | `support@wayback.download` |

---

## Webhook Events

Whop sends signed webhooks to `/webhook`. Handled events:

| Event | Handler |
|---|---|
| `membership.went_valid` | Activates subscription, links membership ID to user account |
| `payment.succeeded` | Records payment, triggers order processing and receipt email |

Signature verification uses HMAC-SHA256 with the `Whop-Signature` header.

---

## License

Private — all rights reserved.
