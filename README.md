# DouglasMitchell.info

Modern portfolio running on Next.js 15, GSAP motion, and real-time metric/subscription APIs. This README explains how to set up the dynamic workflow introduced in ADR 0005.

## Prerequisites

- Node.js ≥ 20 (local Node 24 works with SWC fallback; prefer Node 20/22 LTS in CI).
- npm ≥ 10.
- Optional: Vercel CLI for deployments (`npm install -g vercel`).

## Environment Variables

Create `.env.local` with the following keys (see `docs/security.md` for details and rotation cadence):

```
METRICS_API_KEY=your-metrics-key
SUBSCRIBE_API_KEY=your-subscribe-key
DATABASE_URL=postgres://...
DATABASE_URL_UNPOOLED=postgres://...
# Optional integrations
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
SUBSCRIBE_FORWARD_TO=alerts@example.com
```

## Install & Validate

```bash
npm install
npm run lint
npm run typecheck
npm run test:unit
npx playwright test
npm run build
```

- The build script automatically runs `npm run typecheck` and then `next build` with SWC wasm fallback.
- Use `npm run test:unit -- <filter>` to target individual suites (e.g., `lib-neon`, `api-subscribe`).

## Local Development

```bash
npm run dev
```

- App serves at `http://localhost:3000`.
- Playwright tests expect the server on `127.0.0.1:3000`; override via `PLAYWRIGHT_TEST_BASE_URL` if needed.

## Production Deployments

```bash
# Ensure secrets are set in Vercel environment first
npm run deploy
```

- `npm run deploy` runs `npm run build` and then `npx vercel deploy --prebuilt`.
- Authenticate the Vercel CLI (`vercel login`) before first deploy.
- Attach artefacts (coverage, bundle report, Lighthouse) to release PRs per `docs/quality-gates.md`.

## Static GitHub Pages Variant

- A standalone static build lives in `gh-pages/index.html`. It mirrors the cinematic aesthetic using only client-side assets (no API routes).
- Deploy by copying the `gh-pages` folder to a `gh-pages` branch (or publishing the folder via GitHub Pages settings). A helper script is available:
  ```bash
  ./scripts/deploy-gh-pages.sh
  ```
  (Requires clean git state and remote `origin`.)
- Assets rely on external CDNs/Unsplash and will work without additional configuration.

## Testing & Quality Gates

- `npm run lint`
- `npm run typecheck`
- `npm run test:unit`
- `PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test` (with a dev server already running)
- `npm run bench:metrics`
- `npm run check:bundle`
- `npm run verify:adr`

Document the results in `logs/progress.md` for each change set.

### Playwright Tips

1. Start the dev server manually:
   ```bash
   npm run dev -- --hostname 127.0.0.1 --port 3100
   ```
2. Run the suite in another terminal (with a safety timeout to avoid hangs):
   ```bash
   timeout 180 PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test
   ```

- The config still auto-spawns the server when `PLAYWRIGHT_SKIP_WEBSERVER` is unset (e.g., in CI). Lower timeout (30 s) prevents the harness from hanging if watcher limits are hit.

## Observability & Security

- Metrics API emits structured logs and respects `METRICS_API_KEY`.
- Subscribe API uses rate limiting (Upstash when configured, in-memory fallback) and sends Resend notifications when credentials exist.
- Global security headers (CSP, HSTS, etc.) are defined in `next.config.js`.
- See `docs/observability.md` and `docs/security.md` for runbooks.

## Legacy Static Artefacts

The old `index.html`/`styles.css` remain for reference but are no longer part of the deployment path.
