# Codex 2.0 Execution Blueprint

A phased, checklist-driven roadmap for DouglasMitchell.info. Every task includes context, concrete file targets, example commands, and mandatory micro + macro validation steps. Update the checkboxes as you land each deliverable—do not advance until both localised (micro) and system-wide (macro) tests pass.

---

## Phase 0 – Preflight Alignment (Day 0)
- [ ] **Toolchain Verification**  
  *Context:* Confirm the repo builds cleanly before touching config.  
  *Actions:* Run `npm run lint` and `npm run build`; if either fails, log fixes alongside the checkbox notes.  
  *Tests:*  
    - Micro: `npm run lint -- --max-warnings=0`  
    - Macro: `npm run build` and capture `.next` output size + warnings.  
  *Artefact:* Store a Lighthouse baseline (`npm run dev`, then Chrome DevTools) in `benchmarks/lighthouse-preflight.json`.
- [ ] **Metrics Snapshot**  
  *Context:* Preserve current API behaviour for regressions.  
  *Actions:* `curl -H "Accept: application/json" http://localhost:3000/api/metrics > logs/baseline-metrics.json`.  
  *Tests:*  
    - Micro: Validate JSON schema with `jq type logs/baseline-metrics.json`.  
    - Macro: Run `npm run build` again to ensure snapshotting didn’t alter code paths.

## Phase 1 – Build & Data Path Stabilization (Week 1)
- [ ] **Remove Static Export Constraint** (`next.config.js`)  
  *Context:* `output: 'export'` breaks App Router APIs.  
  *Actions:* Delete the `output` stanza; keep other settings.  
  *Tests:*  
    - Micro: `npm run lint next.config.js` (or ESLint rule run).  
    - Macro: `npm run build` to confirm API routes compile.  
  *Example:* After edit, run `grep -n "output" next.config.js`—should return nothing.
- [ ] **Unified Deploy Script** (`package.json`)  
  *Context:* Align developer, CI, and prod deployments.  
  *Actions:* Add `"deploy": "next build && npx vercel deploy --prebuilt"`; ensure CI references it.  
  *Tests:*  
    - Micro: `npm run deploy -- --dry-run` (Vercel CLI supports dry-run).  
    - Macro: Run `npm run lint && npm run build && npm run deploy -- --dry-run` sequentially.
- [ ] **Dynamic Metrics API** (`app/api/metrics/route.ts`)  
  *Context:* Remove forced static caching; add smart headers.  
  *Actions:* Replace `export const dynamic = 'force-static'` with `'force-dynamic'`; return `NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' } })`.  
  *Tests:*  
    - Micro: Add/Update unit test hitting handler via `supertest`.  
    - Macro: `curl` the endpoint twice ensuring timestamps differ while headers remain cacheable.
- [ ] **Neon Connection Hardening** (`lib/neon.ts`)  
  *Context:* Avoid cold starts and support pooled/unpooled URLs.  
  *Actions:* Memoise the client; prefer `DATABASE_URL_UNPOOLED`; add structured logs for connect/retry.  
  *Tests:*  
    - Micro: `npm run test:unit -- lib-neon` covering success/failure branches.  
    - Macro: `npm run dev` + load `/` to confirm metrics panel still renders.

## Phase 2 – Secure Surfaces & Secrets (Week 2)
- [ ] **API Key Enforcement** (`lib/auth.ts`, API routes)  
  *Context:* Gate metrics & subscribe endpoints.  
  *Actions:* Create `assertApiKey(request, envVar)` using `crypto.timingSafeEqual`; call it before DB work in `/api/metrics` and `/api/subscribe`.  
  *Tests:*  
    - Micro: Unit test `assertApiKey` with valid/invalid headers.  
    - Macro: E2E Playwright spec hitting `/api/metrics` with/without key.
- [ ] **Subscribe Endpoint** (`app/api/subscribe/route.ts`)  
  *Context:* Replace form POST placeholder with real handler.  
  *Actions:* Validate payload using `zod`, throttle via `@upstash/ratelimit`, send email via Resend/SES.  
  *Tests:*  
    - Micro: Integration test mocking Resend; confirm 201/4xx paths.  
    - Macro: Playwright test submitting hero form, verifying UI success + network 201.
- [ ] **Security Headers** (`next.config.js`)  
  *Context:* Enforce FAANG-grade defaults.  
  *Actions:* Add `headers()` returning HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Permissions-Policy`, and CSP limited to GitHub/Sanity origins.  
  *Tests:*  
    - Micro: Jest snapshot comparing header array.  
    - Macro: `curl -I https://localhost:3000` (via `npm run dev`) verifying headers.
- [ ] **Secrets Runbook** (`docs/security.md`)  
  *Context:* Track rotation cadences for `METRICS_API_KEY`, `SUBSCRIBE_API_KEY`, `RESEND_API_KEY`.  
  *Actions:* Document storage (`.env.local`, Vercel secrets), rotation schedule, owner.  
  *Tests:*  
    - Micro: Markdown lint (if configured).  
    - Macro: Share doc with stakeholders; capture sign-off in checklist notes.

## Phase 3 – Observability & Quality Gates (Week 3)
- [ ] **Render Duration Metric** (`app/_metrics/page-timer.tsx`, `app/page.tsx`)  
  *Context:* Provide SLA visibility.  
  *Actions:* Wrap page render, emitting `recordDurationMetric('axiom_page_render_duration_ms', start, performance.now())`.  
  *Tests:*  
    - Micro: Unit test ensuring metric emitter called.  
    - Macro: `npm run dev`, load homepage, confirm log output and metrics UI unaffected.
- [ ] **Metrics & Neon Tests** (`tests/unit/lib-metrics.test.ts`, `tests/unit/lib-neon.test.ts`)  
  *Context:* Guard against regressions.  
  *Actions:* Add histogram assertions; mock Neon client to cover success/empty/error.  
  *Tests:*  
    - Micro: `npm run test:unit`.  
    - Macro: `npm run test:unit && npm run build` ensure tests clean before bundling.
- [ ] **E2E Coverage Expansion** (`tests/e2e/functionality.spec.ts`, `tests/e2e/metrics-error.spec.ts`)  
  *Context:* Validate end-to-end flows with real browser.  
  *Actions:* Add subscribe happy path and metrics failure fallback scenarios.  
  *Tests:*  
    - Micro: Run targeted `npx playwright test tests/e2e/functionality.spec.ts`.  
    - Macro: `npx playwright test` (all suites) post-update.
- [ ] **Coverage Reporting** (`package.json`, `scripts/run-unit-tests.mjs`, `logs/coverage/`)  
  *Context:* Enforce 80%+ coverage via CI.  
  *Actions:* Install `nyc`; wrap unit script; configure CI artifact upload.  
  *Tests:*  
    - Micro: `npm run test:unit` ensures `coverage/` produced.  
    - Macro: Full CI dry-run (`npm run lint && npm run test:unit && npm run build`).
- [ ] **Observability Runbook** (`docs/observability.md`)  
  *Context:* Document dashboards, alert thresholds, escalation chain.  
  *Actions:* Include Grafana/Vercel URLs, error rate >2%, p95 >300 ms triggers.  
  *Tests:*  
    - Micro: Markdown lint.  
    - Macro: Share doc with ops stakeholders; note acknowledgements.

## Phase 4 – Experience & Performance (Week 4)
- [ ] **Motion & Pointer Guards** (`app/page.tsx`, `components/CustomCursor.tsx`)  
  *Context:* Respect reduced-motion and coarse pointer users.  
  *Actions:* Wrap GSAP init in `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)` and cursor behind `pointer: fine`.  
  *Tests:*  
    - Micro: Jest/RTL test toggling matchMedia mocks.  
    - Macro: Playwright run with `--device="Pixel 5"` verifying no cursor injection.
- [ ] **AI Ideator Accessibility** (`components/AIProjectIdeator.tsx`)  
  *Context:* Provide semantics and live updates.  
  *Actions:* Add `<h3 id="ai-ideator-heading">`; wrap rotating text in `aria-live="polite"`; ensure focus styles.  
  *Tests:*  
    - Micro: React Testing Library check for role/ID.  
    - Macro: Axe audit (`npx playwright test tests/e2e/accessibility.spec.ts`).
- [ ] **Topic Showcase Tabs** (`components/TopicShowcase.tsx`)  
  *Context:* Implement proper tab semantics.  
  *Actions:* Map `aria-controls`, `aria-selected`, keyboard navigation (`ArrowLeft/Right`), focus management.  
  *Tests:*  
    - Micro: RTL keyboard interaction test.  
    - Macro: Axe audit + manual keyboard walkthrough in browser.
- [ ] **Bundle Baseline & Guardrails** (`ANALYZE=true npm run build`, `benchmarks/bundle-baseline.json`, `scripts/check-bundle.ts`)  
  *Context:* Track JS payload regressions.  
  *Actions:* Run analyzer, capture metrics JSON, enforce thresholds in check script.  
  *Tests:*  
    - Micro: Node script verifying thresholds vs baseline.  
    - Macro: `npm run build` should pass with check script integrated.
- [ ] **GitHub Activity Refactor** (`app/api/github/route.ts`, relevant components)  
  *Context:* Server-rendered GitHub stats with caching.  
  *Actions:* Move fetch into API route using `fetch(..., { next: { revalidate: 3600 } })`; hydrate via server component; optionally cache with Redis.  
  *Tests:*  
    - Micro: Unit test mocking fetch to ensure revalidate param set.  
    - Macro: Playwright smoke verifying GitHub section still renders.
- [ ] **Speed Insights Integration** (`app/layout.tsx`)  
  *Context:* Capture field data.  
  *Actions:* Import `@vercel/speed-insights` and include `<SpeedInsights />`.  
  *Tests:*  
    - Micro: Snapshot to ensure component rendered.  
    - Macro: Deploy preview, confirm dashboard receives data.

## Phase 5 – Governance & Launch (Week 5)
- [ ] **ADR 0005 – Production Hardening** (`docs/adr/0005-production-hardening.md`)  
  *Context:* Record architectural decisions for posterity.  
  *Actions:* Document build changes, API security posture, observability tooling, testing gates.  
  *Tests:*  
    - Micro: Markdown lint.  
    - Macro: Architecture review sign-off (document in checklist notes).
- [ ] **Quality Gates Update** (`docs/quality-gates.md`)  
  *Context:* Align CI expectations with new tooling.  
  *Actions:* Add lint/build/test, coverage ≥80, Lighthouse ≥90/95, API-key verification, bundle checks.  
  *Tests:*  
    - Micro: Ensure doc links to scripts.  
    - Macro: Validate CI pipeline references the gates; run dry-run CI script.
- [ ] **README Deployment Refresh** (`README.md`)  
  *Context:* Guide contributors through dynamic deployment.  
  *Actions:* Replace static `index.html` guidance with steps for env vars, `npm run deploy`, API keys.  
  *Tests:*  
    - Micro: Markdown lint + broken link check.  
    - Macro: Follow README steps on fresh clone to ensure accuracy.
- [ ] **Release Checklist Execution**  
  *Context:* Final smoke before merge/deploy.  
  *Actions:* `npm run lint && npm run build && npm run test:unit && npx playwright test && npm run bench:metrics`; gather Lighthouse, bundle, coverage artefacts; execute `npm run deploy`.  
  *Tests:*  
    - Micro: Each command passes individually.  
    - Macro: Full chain executed in one script or CI job without failures.

---

## Progress Tracking Notes
Maintain a running log beneath each checkbox (e.g., `- [x] Step name — completed YYYY-MM-DD, tests: lint ✔, build ✔`). If a step fails, record remediation before reattempting. Do not check off subsequent items until the current item’s micro and macro tests both pass.
