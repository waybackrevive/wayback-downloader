# wayback-backend

Flask/Connexion REST API — handles user accounts, Whop payments, and enqueues website restore jobs to AWS SQS.

## Prerequisites

- Python 3.11+
- MySQL 8+ (production) — SQLite is used automatically during tests
- AWS account with SQS, S3, SES, and Cognito configured
- Whop account with webhook endpoint

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
export SQS_NAME=wayback-restore-queue
export SQS_REGION=eu-north-1

# AWS Cognito (region is hardcoded to eu-north-1)
export COGNITO_USERPOOL_ID=eu-north-1_b1rL6aco4
export COGNITO_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
export COGNITO_APP_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Whop payments
export WHOP_API_KEY=whop_sk_xxxxxxxxxxxx
export WHOP_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
export WHOP_SINGLE_PLAN_ID=plan_xxxxxxxxxxxx
export WHOP_SUBSCRIPTION_PLAN_ID=plan_xxxxxxxxxxxx
export APP_DOMAIN=http://localhost:1234

# hCaptcha
export HCAPTCHA_SECRET=0x0000000000000000000000000000000AA
export HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001

# Other
export CONTACT_EMAIL=support@yourdomain.com
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

Or via Docker:

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

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/login` | — | Cognito login |
| POST | `/signup` | — | Cognito signup |
| POST | `/checkout` | optional | Create Whop one-time checkout ($19 first domain, $12 each additional) |
| POST | `/subscription-checkout-session` | required | Create Whop subscription checkout ($95/mo) |
| POST | `/customer-portal` | required | Get Whop hub URL (manage subscription) |
| POST | `/webhook` | — | Whop webhook handler (HMAC-SHA256 verified) |
| POST | `/process` | required | Subscriber direct restore (no new payment) |
| GET | `/user` | required | Get current user profile + subscription status |
| GET | `/restores` | required | List user's restore history |
| GET | `/admin/orders` | admin | All orders (admin only) |
