# wayback-backend

Flask/Connexion REST API — handles user accounts, Whop payments, and enqueues website restore jobs to AWS SQS.

## Prerequisites

- Python 3.11+
- MySQL 8+ (production) — SQLite is used automatically during tests
- AWS account with SQS, S3, SES, and Cognito configured
- Whop account with products, plans, and webhook configured

## Local Development

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

> **Windows note:** `mysqlclient` requires MySQL C headers. Either install [MySQL Connector/C](https://dev.mysql.com/downloads/connector/c/) first, or replace `mysqlclient` with `PyMySQL` in `requirements.txt` and add `import pymysql; pymysql.install_as_MySQLdb()` to `src/server.py`.

### 2. Set environment variables

```bash
# Database
export DATABASE_USERNAME=root
export DATABASE_PASSWORD=yourpassword
export DATABASE_HOST=localhost
export DATABASE_NAME=wayback

# AWS
export SQS_NAME=wayback-queue
export SQS_REGION=eu-north-1
export S3_NAME=wayback-restore-files
export S3_REGION=eu-north-1
export SES_REGION=eu-north-1
export SES_FROM_EMAIL=noreply@wayback.download

# AWS Cognito (region hardcoded to eu-north-1)
# App client MUST have ALLOW_USER_PASSWORD_AUTH enabled
export COGNITO_USERPOOL_ID=eu-north-1_b1rL6aco4
export COGNITO_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
export COGNITO_APP_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Whop payments
export WHOP_API_KEY=whop_sk_xxxxxxxxxxxx
export WHOP_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
export WHOP_COMPANY_ID=biz_xxxxxxxxxxxx
export WHOP_SINGLE_PLAN_ID=plan_xxxxxxxxxxxx
export WHOP_BASIC_PLAN_ID=plan_xxxxxxxxxxxx
export WHOP_SUBSCRIPTION_PLAN_ID=plan_xxxxxxxxxxxx
export APP_DOMAIN=http://localhost:1234

# hCaptcha (use test keys locally)
export HCAPTCHA_SECRET=0x0000000000000000000000000000000AA
export HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001

# Other
export CONTACT_EMAIL=support@wayback.download
export SWAGGER_UI=True
export SWAGGER_DEBUG=True
```

### 3. Create the database

```bash
python src/build_database.py
```

### 4. Start the dev server

```bash
python -m src.server        # http://localhost:5000
```

Swagger UI (if `SWAGGER_UI=True`): http://localhost:5000/ui

## Testing

```bash
pytest                      # all tests (uses in-memory SQLite, no real DB needed)
pytest --cov                # with coverage report
pylint src/                 # lint check
```

## Production

```bash
gunicorn --config gunicorn_config.py --chdir src server:app
# 4 workers × 4 threads, binds to 0.0.0.0:5000
```

Or via Docker (production uses `docker compose` — see root `DEPLOYMENT.md`):

```bash
docker build -t wayback-backend .
docker run -p 5000:5000 --env-file .env wayback-backend
```

## Generate protobuf stub

Only needed when `src/protobuf/response.proto` schema changes:

```bash
protoc --python_out=src/protobuf src/protobuf/response.proto
```

Never manually edit the generated `response_pb2.py`.

## API Overview

All request/response bodies are **Protocol Buffers** (`Content-Type: application/protobuf`). Routes are defined in `src/swagger/wayback.yaml`.

### Authentication
- **AWS Cognito** (`eu-north-1`) — `USER_PASSWORD_AUTH` flow via `initiate_auth`
- JWT validated on protected routes via `@cognito_auth_header_required_api` / `@cognito_auth_header_optional_api`
- Admin endpoints additionally require `@admin_required` (checks `Client.admin` flag in DB)
- CAPTCHA: **hCaptcha** on login, signup, forgot-password, and contact

### Payments
- **Whop API v1** (`https://api.whop.com/api/v1`)
- One-time checkouts use inline `plan` object with `company_id`, `currency`, `initial_price`, `plan_type: "one_time"`
- Subscription checkouts reference an existing Whop `plan_id`
- Webhooks verified with HMAC-SHA256 (`Whop-Signature` header)
- Webhook events handled: `membership.went_valid`, `payment.succeeded`

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/login` | — | Cognito login (hCaptcha required) |
| POST | `/signup` | — | Cognito signup (hCaptcha required) |
| POST | `/confirm-signup` | — | Verify Cognito email confirmation code |
| POST | `/forgot-password` | — | Trigger Cognito password reset email |
| POST | `/forgot-password-confirm` | — | Submit new password with reset token |
| POST | `/contact` | — | Contact form (hCaptcha required) |
| POST | `/checkout` | optional | One-time restore checkout — **$29 first domain, $19 each additional** |
| POST | `/subscription-checkout-session?plan=basic\|premium` | required | Subscription checkout — **Basic $39/mo** or **Premium $95/mo** |
| POST | `/customer-portal` | required | Get Whop hub URL to manage subscription |
| POST | `/webhook` | — | Whop webhook handler (HMAC-SHA256 verified) |
| POST | `/process` | required | Subscriber direct restore (no new payment) |
| GET | `/user` | required | Current user profile + subscription status |
| GET | `/restores` | required | User's restore history |
| GET | `/admin/orders` | admin | All orders (admin only) |

### Pricing logic

```python
# One-time HTML restore
total_price = 29.00 if n == 1 else 29.00 + (n - 1) * 19.00

# Subscription plans
# Basic  ($39/mo)   — WHOP_BASIC_PLAN_ID
# Premium ($95/mo)  — WHOP_SUBSCRIPTION_PLAN_ID
```
