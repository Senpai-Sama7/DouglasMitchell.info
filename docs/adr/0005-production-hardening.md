# ADR 0005 — Production Hardening Post-Static Export

| Status | Deciders | Date |
| --- | --- | --- |
| Proposed | Codex & Claude | 2025-09-27 |

## Context
The portfolio previously relied on `output: 'export'` which disabled App Router API routes (`/api/metrics`, `/api/subscribe`). Static metrics and contact forms were brittle, unauthenticated, and difficult to govern.

## Decision
1. Remove `output: 'export'` and embrace dynamic rendering with `export const dynamic = 'force-dynamic'` on API endpoints to guarantee fresh data.
2. Introduce API-key enforcement (`METRICS_API_KEY`, `SUBSCRIBE_API_KEY`) using a reusable helper (`lib/auth.ts`).
3. Harden Neon access via memoised clients preferring `DATABASE_URL_UNPOOLED`, with detailed logging and unit coverage.
4. Implement rate-limited subscription handling backed by Upstash Redis (with in-memory fallback) and transactional email via Resend.
5. Add global security headers (CSP, HSTS, frame/permission policies) to comply with enterprise security guidelines.
6. Formalise secret management and rotation expectations in `docs/security.md`.
7. Update the build/deploy pipeline: `npm run typecheck` precedes `next build`, SWC fallback is enabled for Node v24, and `npm run deploy` wraps `npx vercel deploy --prebuilt`.

## Consequences
- **Pros**
  - Live metrics and subscription APIs function indoors (local dev) and production.
  - Security posture improves via multi-layer auth, rate limiting, and headers.
  - Observability increases thanks to structured logs and enforceable release checklist.
- **Cons**
  - Requires managed runtime (Vercel or Node server); no longer suitable for static hosting.
  - Additional dependencies (`@upstash/ratelimit`, `@upstash/redis`, `resend`) introduce new secrets to manage.
  - Local Node v24 builds need SWC wasm fallback until runtime aligns with supported binaries.

## Follow-up Actions
- Align CI runners to Node 20/22 LTS to drop SWC fallbacks.
- Prompt stakeholders to populate new secrets in Vercel before next deploy.
- Expand observability (Phase B2) with render duration metrics and coverage reporting, ensuring the release checklist includes artefact uploads.
