# Codex Production Readiness Plan 2.0

This 2.0 roadmap distills the strongest elements from the existing Codex production plan into a single, execution-ready checklist. Every task maps to concrete repository files, shell commands, or infrastructure knobs so the portfolio can ship as an enterprise-grade, FAANG-calibre experience.

---

## 1. Build & Release Stability
- **Remove incompatible static export**: Edit `next.config.js` to delete the `output: 'export'` block (lines 3-5) and keep `distDir` only if required. Verify with `npm run build` to ensure App Router APIs compile.
- **Align scripts with deployment**: In `package.json`, add `"deploy": "next build && npx vercel deploy --prebuilt"` and ensure CI uses the same command chain (`npm run lint && npm run build`).
- **Regenerate Next type stubs**: Run `npx next telemetry disable` followed by `npx next lint` so `next-env.d.ts` reflects the upgraded build and the git workspace returns to clean state.

## 2. Contact Intake Service
- **Implement real backend**: Create `app/api/subscribe/route.ts` that (1) validates `{ name, email, context }` with `zod`, (2) rate limits via `@upstash/ratelimit`, and (3) forwards payloads to Resend (or SES) using credentials stored in `.env.local` (`RESEND_API_KEY`, `SUBSCRIBE_API_KEY`).
- **Modernise the form client**: Replace the static `action="/api/subscribe"` in `app/page.tsx:378` with a `use server` action that calls the route, sets a pending state on the submit button, and renders success or error copy inline.
- **Automate verification**: Extend `tests/e2e/functionality.spec.ts` with a `test('contact form submits successfully', ...)` that performs a happy-path submission and asserts the success toast plus a `201` network response.

## 3. Metrics Freshness & Data Access
- **Drop forced static mode**: Change `export const dynamic = 'force-static'` to `'force-dynamic'` in `app/api/metrics/route.ts` so the handler runs on every request.
- **Set caching directives**: Return `NextResponse.json({ metrics }, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' } })` to balance freshness and cost.
- **Harden Neon connectivity**: Update `lib/neon.ts` to prefer `DATABASE_URL_UNPOOLED` when defined, memoise the client in a module-level singleton, and add structured log emits for connection reuse and fallback events.

## 4. Security Controls
- **API key enforcement**: Add `lib/auth.ts` with an `assertApiKey` helper that compares `x-api-key` headers using `timingSafeEqual`. Guard both `/api/metrics` and `/api/subscribe` before any work executes.
- **Comprehensive headers**: In `next.config.js`, export `headers()` that applies HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, and a restrictive CSP covering the GitHub and Sanity endpoints already in use.
- **Secret hygiene docs**: Update `docs/security.md` (or create it) to list rotation cadences for `METRICS_API_KEY`, `SUBSCRIBE_API_KEY`, and email provider secrets, plus storage guidance (`.env.local`, Vercel project secrets).

## 5. Observability & SLOs
- **Emit required metric**: Wrap the page render in a server component helper (e.g., `app/_metrics/page-timer.tsx`) that records `recordDurationMetric('axiom_page_render_duration_ms', start, performance.now())` before returning children.
- **Unit guardrails**: Extend `tests/unit/lib-metrics.test.ts` to assert the presence of the render-duration histogram in snapshots.
- **Runbook updates**: Append to `docs/observability.md` the Grafana (or Vercel Analytics) dashboard URL, alert thresholds (error rate > 2%, p95 render > 300 ms), and the escalation rotation.

## 6. Accessibility & Interaction Discipline
- **Motion preference gating**: In `app/page.tsx`, short-circuit GSAP setup when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true.
- **Pointer awareness**: Guard `CustomCursor` initialisation behind `window.matchMedia('(pointer: fine)').matches` and rehydrate interactive targets on mutation to avoid stale listeners.
- **AI ideator semantics**: Give the ideator a real heading (`<h3 id="ai-ideator-heading">`) and wrap concept text in an `aria-live="polite"` element while rotating through multiple prompts/proofs for variety.
- **Tablist correctness**: Retrofit `components/TopicShowcase.tsx` with proper tab IDs, `aria-controls`, keyboard navigation, and focus management to satisfy Axe audits.
- **Re-run Axe**: Execute `npx playwright test tests/e2e/accessibility.spec.ts --project=chromium` and capture the updated `playwright-report/` artefacts for compliance evidence.

## 7. Performance & Data Fetching
- **Client bundle audit**: Run `ANALYZE=true npm run build` and copy `.next/analyze/client.html` metrics into `benchmarks/bundle-baseline.json` before setting a regression threshold in `scripts/check-bundle.ts`.
- **Server-render GitHub activity**: Move GitHub fetch logic into `app/api/github/route.ts` using `fetch(..., { next: { revalidate: 3600 } })`, cache responses in Redis if available, and hydrate the section via a server component to avoid client-side waterfalls.
- **Web vitals collection**: Add `@vercel/speed-insights` to `app/layout.tsx` so field data feeds the performance dashboards alongside existing `scripts/bench-metrics.ts` output.

## 8. Test & Coverage Expansion
- **Neon resilience unit tests**: Add `tests/unit/lib-neon.test.ts` mocking `@neondatabase/serverless` to verify success, empty result, and error fallbacks.
- **E2E failure path**: Create `tests/e2e/metrics-error.spec.ts` to intercept `/api/metrics` with a 500 response and assert the UI displays fallback values without console errors.
- **Coverage reporting**: Introduce `nyc` (`npm install nyc -D`) and update `scripts/run-unit-tests.mjs` invocation via `"test:unit": "nyc node scripts/run-unit-tests.mjs"`; publish the resulting JSON to `logs/coverage/` for every CI run.

## 9. Governance & Documentation
- **ADR cadence**: Capture major decisions (removing static export, new security controls, observability instrumentation) in `docs/adr/0005-production-hardening.md` following the repo’s ADR template.
- **Quality gates update**: Amend `docs/quality-gates.md` with the new CI checks (Lighthouse ≥ 90/95, coverage ≥ 80%, API-key verification test) and link artefact storage locations.
- **README refresh**: Rewrite the deployment section to describe the dynamic Next.js deployment path, required environment variables, and the new contact/metrics infrastructure instead of static `index.html` instructions.

## 10. Rollout & Verification Checklist
1. Run `npm run lint && npm run build` locally; ensure workspace is clean (`git status`).
2. Execute `npm run test:unit` and `npx playwright test` (all projects) to confirm green suites.
3. Run `npm run bench:metrics` and stash the JSON in `logs/` as part of the release artefacts.
4. Upload updated Lighthouse, bundle analysis, and coverage reports to the PR description.
5. Obtain approvals per `docs/quality-gates.md`, merge, and deploy using the new `npm run deploy` script.

Completing these steps delivers a verifiable, production-ready release: backend data flows are authenticated, observability meets the charter, accessibility is guaranteed via automated checks, and CI enforces performance and security gates.
