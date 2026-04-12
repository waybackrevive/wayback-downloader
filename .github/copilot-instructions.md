# Project Guidelines

## Architecture

Three independent services communicating via **AWS SQS** and a shared **MySQL** database:

```
[wayback-frontend]  ──HTTP/Protobuf──►  [wayback-backend]
                                               │
                                        MySQL DB  +  AWS SQS
                                               │          │
                                        [wayback-restore] ◄─ SQS consumer
                                               │
                                       AWS S3 (archives) + AWS SES (email)
```

| Service | Description |
|---------|-------------|
| `wayback-backend/` | Flask/Connexion REST API — user accounts, Whop payments, enqueues SQS restore jobs |
| `wayback-restore/` | Long-polling SQS worker — downloads from archive.org, zips, uploads to S3, emails via SES |
| `wayback-frontend/` | Elm SPA — see `wayback-frontend/.github/copilot-instructions.md` for frontend-specific rules |

## Build and Test

**wayback-backend**
```bash
pip install -r requirements.txt
python -m src.server          # dev server on :5000
pytest                        # runs all tests
pytest --cov                  # with coverage
pylint src/
```

**wayback-restore**
```bash
pip install -r requirements.txt
gem install wayback_machine_downloader   # Ruby gem required at runtime
python src/main.py            # starts SQS worker
pytest
pylint src/
```

**wayback-frontend**
```bash
npm install
npm start                     # dev server on http://localhost:1234
protoc --elm_out=. response.proto   # only when proto schema changes
```

Production backend: `gunicorn --config gunicorn_config.py --chdir src server:app` (4 workers × 4 threads, port 5000).

## Conventions

**API wire format**: All HTTP request/response bodies are **Protocol Buffers** (`application/protobuf`), not JSON. Proto schema is in `wayback-backend/src/protobuf/response.proto`; never manually edit the generated `_pb2.py` or `src/Proto/Response.elm` stubs.

**API routing**: Connexion maps OpenAPI `operationId` fields in `swagger/wayback.yaml` to Python controller functions — route definitions live in the YAML, not in Flask decorators.

**Response helpers**: Use `ProtobufResponse().success(...)` / `.failure(...)` from `src/lib/response.py`; don't construct raw Flask responses in controllers.

**Authentication**: AWS Cognito JWTs validated via `@cognito_auth_header_required_api` / `@cognito_auth_header_optional_api` decorators. Admin endpoints also need `@admin_required` (checks `Client.admin` in DB). CAPTCHA is **hCaptcha**, not reCAPTCHA.

**Payments**: **Whop** (not Stripe). One-time restores ($19 first domain, $12 each additional) and subscriptions ($95/mo) use Whop checkout links created via `POST https://api.whop.com/api/v5/checkout/links`. Webhooks arrive with events `membership.went_valid` and `payment.succeeded`, verified with HMAC-SHA256 (`Whop-Signature` header). DB tables are `whop_session` and `whop_payment`. `Client.whopUserId` and `Client.whopMembershipId` replace the old Stripe customer/subscription IDs.

**ORM**: Flask-SQLAlchemy 3.x in backend, plain SQLAlchemy 2.x in restore worker. Models use `SerializerMixin`. Connection: `mysql://USERNAME:PASSWORD@HOST/NAME` from env vars.

**Logging**: Configure via `logging.yaml`, accessed per-module as `log = logging.getLogger(__name__)`. Never use `print()` for application output.

## Environment Variables

All config is injected via environment; no `.env` file is committed.

| Group | Variables |
|-------|-----------|
| Database | `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_HOST`, `DATABASE_NAME` |
| AWS | `SQS_NAME`, `SQS_REGION` |
| Cognito | `COGNITO_USERPOOL_ID`, `COGNITO_APP_CLIENT_ID`, `COGNITO_APP_CLIENT_SECRET` (region hardcoded: `eu-north-1`) |
| Whop | `WHOP_API_KEY`, `WHOP_WEBHOOK_SECRET`, `WHOP_SINGLE_PLAN_ID`, `WHOP_SUBSCRIPTION_PLAN_ID`, `APP_DOMAIN` |
| Other | `HCAPTCHA_SECRET`, `HCAPTCHA_SITE_KEY`, `CONTACT_EMAIL`, `SWAGGER_UI`, `SWAGGER_DEBUG` |

For tests, `src/test_config.py` substitutes an in-memory SQLite DB — don't rely on MySQL in unit tests.

## Test Structure

Backend tests use pytest with a `client` fixture that spins up the full Connexion app in testing mode:
- `tests/controllers/` — full HTTP integration tests with serialized protobuf payloads
- `tests/lib/` — unit tests for response helpers
- `tests/model/` — unit tests for ORM models

## Ignore

The `__MACOSX/` trees throughout the repo are archive artifacts. Do not modify files there.
