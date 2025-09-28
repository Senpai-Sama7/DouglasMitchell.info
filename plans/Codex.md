# Codex Production Readiness Plan

The following worklist converts the current portfolio into a production-ready, enterprise-grade deployment. Each item references the exact files, configuration knobs, and verification commands required to meet FAANG-quality expectations.

## 1. Restore a Deployable Build Pipeline
1. Edit `next.config.js` and delete the `output: 'export'` stanza (lines 3-5). Keep `distDir: 'out'` only if static export is no longer relied upon. Rerun `npm run build` to confirm App Router API routes compile without export errors.
2. Update `package.json` scripts so `export` invokes `next build` (already correct) and add `"deploy": "next build && npx vercel deploy --prebuilt"` for parity with CI deployments.
3. Regenerate `next-env.d.ts` via `npx next telemetry disable && npx next lint` to clear the current dirty Git status, then commit the clean build artifacts.

## 2. Implement the Contact Intake Backend
1. Create `app/api/subscribe/route.ts` with a POST handler that validates `{ name, email, context }` using `zod`, throttles via `@upstash/ratelimit`, and delivers payloads to a transactional inbox (e.g., Resend API) using the API key stored in `.env.local`.
2. Replace the form action in `app/page.tsx` (line 378) with a client action that calls `fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(...) })`, adds loading/error states, and displays success confirmation inline.
3. Add Playwright coverage in `tests/e2e/functionality.spec.ts` to submit valid data and assert a 200 response plus UI acknowledgement.

## 3. Unfreeze Metrics Data Fetching
1. Change `export const dynamic = 'force-static'` to `'force-dynamic'` in `app/api/metrics/route.ts` so each request bypasses the static cache.
2. Attach `NextResponse.json(payload, { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=120' } })` to balance freshness and cost.
3. Extend `lib/neon.ts` to honour `DATABASE_URL_UNPOOLED` when available, using pooled connections for long-lived processes and memoising the Neon client per server instance.

## 4. Harden API Security
1. Introduce `lib/auth.ts` exposing `assertApiKey(request: NextRequest, secretEnv: string)` that compares the `x-api-key` header via `timingSafeEqual`.
2. Apply the guard inside `app/api/metrics/route.ts` and the new `subscribe` handler before performing any work, logging attempts with `logger.warn`.
3. Document the new requirement in `docs/security.md`, listing rotation cadence and storage instructions for `METRICS_API_KEY` and `SUBSCRIBE_API_KEY`.

## 5. Enforce Observability Contracts
1. Instrument page render timing by adding a server component wrapper in `app/page.tsx` that records `performance.now()` before returning JSX and calls `recordDurationMetric('axiom_page_render_duration_ms', startTime, performance.now())` after the component resolves.
2. Update `tests/unit/lib-metrics.test.ts` with an assertion that `snapshot.histograms` contains `axiom_page_render_duration_ms` after rendering the page in a Node test harness.
3. Expand `docs/observability.md` with the dashboard URL, alert routing, and drill-down procedures.

## 6. Accessibility & Interaction Safeguards
1. In `app/page.tsx`, guard GSAP timelines with `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;` and skip registration when motion is reduced.
2. Update `components/CustomCursor.tsx` to check `window.matchMedia('(pointer: fine)').matches` before mounting, and detach listeners on navigation by observing DOM mutations.
3. Refactor `components/AIProjectIdeator.tsx` to expose a visible `<h3 id="ai-ideator-heading">`, trigger rotating prompts, and emit updates through `aria-live="polite"`.
4. Apply full WAI-ARIA tab semantics in `components/TopicShowcase.tsx` by mapping `aria-controls`, `id`, keyboard navigation (`ArrowLeft/Right`), and focus management.
5. Regenerate accessibility tests: run `npx playwright test tests/e2e/accessibility.spec.ts --project=chromium` and store the passing report in `playwright-report/`.

## 7. Performance & Bundle Discipline
1. Execute `npm run build` and feed the resulting `.next/analyze/client.html` (enable via `ANALYZE=true`) to document the current JS payload. Record baseline numbers in `benchmarks/bundle-baseline.json`.
2. Replace static GitHub fetch in `components/GitHubFeed.tsx` with a server action that caches responses in `app/api/github/route.ts` using `fetch(..., { next: { revalidate: 3600 } })`, and render results via a streamed React Server Component to avoid client hydration cost.
3. Add a Lighthouse CI job (`.github/workflows/lighthouse.yml`) targeting `http://127.0.0.1:3100` ensuring performance ≥ 90, accessibility ≥ 95.

## 8. Test Coverage Expansion
1. Create `tests/unit/lib-neon.test.ts` mocking `neon` to verify fallback logging and empty table handling.
2. Add Playwright spec `tests/e2e/metrics-error.spec.ts` that stubs `/api/metrics` failure via `page.route` and verifies the UI fallback appears.
3. Configure coverage reporting by introducing `nyc` with `"test:unit": "nyc node scripts/run-unit-tests.mjs"` and upload coverage summaries to `logs/coverage/`.

## 9. Documentation & Governance
1. Draft ADR `docs/adr/0005-production-hardening.md` capturing the migration from static export to dynamic deployment, API security posture, and observability contract updates.
2. Update `docs/quality-gates.md` to include new CI gates: Lighthouse threshold, coverage minimum (80%), and API key validation checks.
3. Refresh `README.md` to reflect the dynamic deployment path (remove references to plain `index.html`) and add explicit setup steps for required environment variables.

Completing every task above delivers a verifiable, FAANG-caliber release: dynamic APIs function in production, observability metrics align with runbooks, accessibility is enforced through automated gates, and security controls meet enterprise expectations. Execute tasks in numerical order, validating each with the specified commands and documentation updates before progressing.
