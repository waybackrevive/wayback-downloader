# wayback-frontend

Elm 0.19.1 SPA — the customer-facing UI for Wayback Download. Communicates with `wayback-backend` over HTTP using Protocol Buffers.

## Prerequisites

- Node.js 18+
- npm

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend URL

`src/Environment.elm` automatically targets `http://0.0.0.0:5000` when running on `localhost` and `https://api.wayback.download` in production. No manual change needed for local dev.

### 3. Start the dev server

```bash
npm start               # elm-spa server on http://localhost:1234
```

The Elm compiler watches for changes and rebuilds automatically.

## Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/` | — | Home — domain lookup, pricing, FAQ |
| `/order` | required | Add archive.org URLs to cart and checkout |
| `/subscription` | required | Manage bulk subscription ($95/mo) |
| `/dashboard` | required | View restore history |
| `/login` | — | Cognito login |
| `/signup` | — | Cognito signup |
| `/contact` | — | Contact form |
| `/about` | — | About page |

## Pricing

| Plan | Price |
|------|-------|
| HTML Recovery — 1st domain | $19 |
| HTML Recovery — each additional domain | $12 |
| WordPress Conversion | $70/domain |
| Bulk Subscription | $95/month (up to 10 restores) |

## Generate protobuf stub

Only needed when `wayback-backend/src/protobuf/response.proto` changes:

```bash
protoc --elm_out=src/Proto src/Proto/response.proto
```

Never manually edit the generated `src/Proto/Response.elm`.
