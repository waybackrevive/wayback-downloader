# wayback-restore

Long-polling AWS SQS worker — downloads websites from archive.org, zips the output, uploads to S3, and emails the download link via SES.

## How it works

1. Polls AWS SQS (`SQS_NAME`) for restore job messages sent by `wayback-backend`
2. Each message contains: `domain`, `timestamp`, `action` (`restore` or `resend`), `id`
3. For `restore`: runs `WaybackRestore` (wraps the `wayback_machine_downloader` Ruby gem), zips output, uploads to S3, emails the customer
4. For `resend`: looks up existing S3 URL in DB and re-emails the customer
5. Updates job status in MySQL after each step

## Prerequisites

- Python 3.11+ (runs in Docker — no host install needed)
- Ruby + `wayback_machine_downloader` gem (installed in Docker image)
- AWS account with SQS, S3, and SES configured
- MySQL 8+

## Local Development

### 1. Install dependencies

```bash
pip install -r requirements.txt
gem install wayback_machine_downloader
```

### 2. Set environment variables

```bash
# Database
export DATABASE_USERNAME=wayback
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

# Other
export WAYBACK_OUTPUT_DIR=/tmp/wayback-output
```

### 3. Start the worker

```bash
python src/main.py
```

The worker runs indefinitely, long-polling SQS. Stop with `Ctrl+C`.

## Testing

```bash
pytest
pylint src/
```

## Production

Runs as a Docker container managed by `docker compose`. See root `DEPLOYMENT.md`.

```bash
docker build -t wayback-restore .
docker run --env-file .env wayback-restore
```

## SQS message format

Messages are sent by `wayback-backend` via `boto3`. Each message body is a JSON-serialised `Client` dict. Message attributes:

| Attribute | Type | Description |
|-----------|------|-------------|
| `domain` | String | Domain to restore (e.g. `example.com`) |
| `timestamp` | String | 14-digit Wayback timestamp (e.g. `20210101120000`) |
| `action` | String | `restore` or `resend` |
| `id` | String | UUID matching the `Restore` DB record |

## Restore job status codes (DB)

| Status ID | Meaning |
|-----------|---------|
| 1 | Pending (awaiting payment confirmation) |
| 2 | In Progress |
| 3 | Queued |
| 4 | Complete |
| 5 | Failed |
