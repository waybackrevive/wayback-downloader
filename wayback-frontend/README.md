# wayback-frontend

Elm 0.19.1 SPA — the customer-facing UI for Wayback Download (`wayback.download`). Communicates with `wayback-backend` over HTTP using Protocol Buffers.

## Prerequisites

- Node.js 20+
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

## Production build

```bash
npm run build
sudo cp -r public/* /var/www/wayback.download/
```

## Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/` | — | Home — domain lookup, pricing, FAQ |
| `/order` | required | Add archive.org URLs to cart and checkout |
| `/subscription` | required | Choose Basic or Premium subscription plan |
| `/dashboard` | required | View restore history |
| `/login` | — | Cognito login |
| `/signup` | — | Cognito signup |
| `/forgot-password` | — | Cognito password reset |
| `/contact` | — | Contact form (hCaptcha protected) |
| `/about` | — | About page |
| `/admin` | admin | Admin orders dashboard |

## Pricing

| Plan | Price |
|------|-------|
| HTML Recovery — 1st domain | $29 |
| HTML Recovery — each additional domain | $19 |
| WordPress Conversion | $89/domain (coming soon) |
| Basic Subscription | $39/month (up to 12 HTML restores) |
| Premium Subscription | $95/month (up to 100 HTML restores) |

These values live in `src/Environment.elm` (`itemCost`, `multiItemCost`, `basicSubscriptionCost`, `subscriptionCost`).

## Key files

| File | Purpose |
|------|---------|
| `src/Environment.elm` | Server URL + all pricing constants |
| `src/Common/NavBar.elm` | Navigation bar + announcement banner |
| `src/Pages/Home_.elm` | Landing page with pricing cards |
| `src/Pages/Subscription.elm` | Basic / Premium subscription plan cards |
| `src/Pages/Order.elm` | Cart + one-time checkout |
| `src/Pages/Dashboard.elm` | Restore history |
| `src/Proto/Response.elm` | Generated protobuf stub — **do not edit** |

## Generate protobuf stub

Only needed when `wayback-backend/src/protobuf/response.proto` changes:

```bash
protoc --elm_out=src/Proto src/Proto/response.proto
```

Never manually edit the generated `src/Proto/Response.elm`.
