# Project Guidelines

## Build And Test

- Run the app locally with `elm-spa server` from the repository root. The README is the only existing project doc and should remain the source of truth for basic setup details.
- Regenerate protobuf bindings only when `src/Proto/response.proto` changes: `protoc --elm_out=. response.proto`.
- No automated test suite is configured in this repository. If you need validation, prefer compiling or running the app instead of inventing test commands.

## Architecture

- This is a single Elm SPA built with `ryan-haskell/elm-spa`.
- Shared cross-page state lives in `src/Shared.elm` and includes the current year, persisted `Storage`, JS port messages, and environment configuration.
- Routes are implemented as page modules under `src/Pages/`. Protected pages use `Page.protected.element` together with `src/Auth.elm`.
- Reusable UI and helpers live under `src/Common/`. Domain types live under `src/Domain/`.
- Browser interop is handled in `public/js/main.js` through Elm ports for Bootstrap modals, hCaptcha, Stripe redirects, and localStorage persistence.

## Conventions

- Preserve the existing Elm style in touched files. The codebase uses explicit type annotations broadly and simple `Model` / `Msg` / `init` / `update` / `view` page structure.
- Keep page-specific behavior inside the page module unless the logic is clearly shared across routes.
- Reuse helpers in `src/Common/` and `src/Storage.elm` before adding duplicate parsing, HTTP, pagination, alert, or persistence logic.
- HTTP calls generally use protobuf request bodies and `Common.CustomHttp.expectProto` for responses. Follow the existing endpoint patterns before introducing JSON handling.
- `src/Environment.elm` hardcodes dev and prod endpoints plus Stripe keys based on host. Treat changes there as configuration changes, not casual refactors.

## Generated And Archive Files

- Do not manually edit `src/Proto/Response.elm`; it is generated from `src/Proto/response.proto`.
- Ignore the `__MACOSX/` tree. It contains archive artifacts and binary `._*` files that are not part of the real source tree.

## Practical Notes

- The app bootstraps from `public/index.html` and expects the compiled Elm bundle plus the existing JS assets to remain in place.
- Storage persistence flows through ports in `src/Storage.elm` and `src/Shared.elm`. Be careful to keep Elm and `public/js/main.js` in sync when changing port payloads.
- When changing auth, checkout, subscription, or captcha flows, inspect both the page module and the corresponding JS port handling before editing.
- For setup and local run basics, link to `README.md` instead of duplicating its content elsewhere.