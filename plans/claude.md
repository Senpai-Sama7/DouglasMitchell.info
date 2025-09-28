# Parallel Execution Blueprint — Codex & Claude

To accelerate delivery, split the Codex 2.0 roadmap into two complementary work streams. Each track includes context, concrete file targets, example commands, and required validation (micro + macro). Update checklist items only after both validation layers pass. Coordinate via shared artefacts (`logs/`, `benchmarks/`, `docs/`) to prevent overlap.

---

## Track A — Codex Focus (Infrastructure, Security, Governance)

### Phase A0 – Preflight & Baselines
- [x] **Toolchain Verification**  
  _Context:_ Ensure pristine starting point.  
  _Action:_ `npm run lint -- --max-warnings=0`, `npm run build`; record findings in `logs/preflight.md`.  
  _Tests:_  
    • Micro: lint run shows 0 warnings.  
    • Macro: build succeeds; log `.next` output size.
- [x] **Metrics Snapshot**  
  _Action:_ `curl -H "Accept: application/json" http://localhost:3000/api/metrics > logs/baseline-metrics.json`; validate with `jq type`.  
  _Tests:_  
    • Micro: JSON schema passes.  
    • Macro: `npm run build` remains clean.

### Phase A1 – Build & Data Layer Stabilization
- [x] **Remove Static Export Constraint** (`next.config.js`)  
  _Action:_ Delete `output: 'export'`; run `grep -n "output" next.config.js` to confirm removal.  
  _Tests:_ Micro: ESLint on config; Macro: `npm run build`.
- [x] **Unified Deploy Script** (`package.json`)  
  _Action:_ Add `"deploy": "next build && npx vercel deploy --prebuilt"`; align CI workflow.  
  _Tests:_ Micro: `npm run deploy -- --dry-run`; Macro: `npm run lint && npm run build && npm run deploy -- --dry-run`.
- [x] **Neon Connection Hardening** (`lib/neon.ts`)  
  _Action:_ Memoise client, prefer `DATABASE_URL_UNPOOLED`, emit structured logs.  
  _Tests:_ Micro: `npm run test:unit -- lib-neon`; Macro: `npm run dev` ➜ load `/`.

### Phase A2 – Security & Secrets
- [x] **API Key Enforcement** (`lib/auth.ts`, API routes)  
  _Action:_ Implement `assertApiKey`; guard `/api/metrics`, `/api/subscribe`.  
  _Tests:_ Micro: unit tests; Macro: Playwright calling API with/without key.
- [x] **Security Headers** (`next.config.js`)  
  _Action:_ Add `headers()` returning HSTS, XFO, XCTO, CSP, Permissions-Policy.  
  _Tests:_ Micro: Jest snapshot; Macro: `curl -I http://localhost:3000` (dev).
- [x] **Secrets Runbook** (`docs/security.md`)  
  _Action:_ Document storage locations, rotation cadences, owners.  
  _Tests:_ Micro: Markdown lint; Macro: stakeholder sign-off recorded in doc.

### Phase A3 – Governance & Launch Readiness
- [x] **ADR 0005 – Production Hardening** (`docs/adr/0005-production-hardening.md`)  
  _Action:_ Capture decisions on build pipeline, API auth, observability.  
  _Tests:_ Micro: lint; Macro: architecture review acknowledgement. 
- [x] **Quality Gates Update** (`docs/quality-gates.md`)  
  _Action:_ Add lint/build/test, coverage ≥80%, Lighthouse ≥90/95, API key enforcement, bundle guard.  
  _Tests:_ Micro: doc lint; Macro: CI dry-run referencing gates.
- [x] **README Deployment Refresh** (`README.md`)  
  _Action:_ Replace static hosting guidance with dynamic deployment steps.  
  _Tests:_ Micro: Markdown lint; Macro: follow instructions on fresh clone.
- [ ] **Release Checklist Execution**  
  _Action:_ `npm run lint && npm run build && npm run test:unit && npx playwright test && npm run bench:metrics && npm run deploy`.  
  _Tests:_ Micro: individual commands; Macro: full chain success + artefacts archived.

---

## Track B — Claude Focus (Application Experience, Testing, Observability)

### Phase B0 – Shared Baseline Artefacts
- [ ] **Lighthouse Baseline**  
  _Action:_ After Codex’s toolchain check, run `npm run dev`, capture report into `benchmarks/lighthouse-preflight.json`.  
  _Tests:_ Micro: Audit collected; Macro: Confirm no new console errors during run.

### Phase B1 – API & Subscriber Experience
- [ ] **Dynamic Metrics API Enhancements** (`app/api/metrics/route.ts`)  
  _Action:_ Switch to `'force-dynamic'`, add cache-control headers, ensure error handling returns typed payloads.  
  _Tests:_ Micro: unit test via `supertest`; Macro: `curl` twice verifying freshness + headers.
- [x] **Subscribe Endpoint Implementation** (`app/api/subscribe/route.ts`)  
  _Action:_ Zod validation, Upstash rate limit, Resend/SES integration.  
  _Tests:_ Micro: integration test mocking email client; Macro: Playwright form fill.

### Phase B2 – Observability & Quality Gates
- [ ] **Render Duration Metric Wrapper** (`app/_metrics/page-timer.tsx`, `app/page.tsx`)  
  _Action:_ Inject timer wrapper around page render.  
  _Tests:_ Micro: unit test ensuring metric emitter invoked; Macro: manual page load verifying logs.
- [ ] **Unit Test Expansion** (`tests/unit/lib-metrics.test.ts`, `tests/unit/lib-neon.test.ts`)  
  _Action:_ Add histogram assertion and Neon mocks (success/empty/error).  
  _Tests:_ Micro: `npm run test:unit`; Macro: `npm run test:unit && npm run build`.
- [ ] **E2E Coverage** (`tests/e2e/functionality.spec.ts`, `tests/e2e/metrics-error.spec.ts`)  
  _Action:_ Add subscribe happy path + metrics failure fallback suites.  
  _Tests:_ Micro: Run targeted spec; Macro: `npx playwright test` (all suites).
- [ ] **Coverage Reporting Integration** (`package.json`, `scripts/run-unit-tests.mjs`, `logs/coverage/`)  
  _Action:_ Install/configure `nyc`, ensure reports archived.  
  _Tests:_ Micro: `npm run test:unit` produces coverage data; Macro: CI dry-run.
- [ ] **Observability Runbook Refresh** (`docs/observability.md`)  
  _Action:_ Document dashboards, alert thresholds, escalation.  
  _Tests:_ Micro: doc lint; Macro: share with ops, record sign-off.

### Phase B3 – Accessibility & Performance Enhancements
- [ ] **Motion & Pointer Guards** (`app/page.tsx`, `components/CustomCursor.tsx`)  
  _Action:_ Add `prefers-reduced-motion` and `pointer: fine` checks.  
  _Tests:_ Micro: unit tests mocking `matchMedia`; Macro: Playwright mobile run verifying behaviour.
- [ ] **AI Ideator A11y** (`components/AIProjectIdeator.tsx`)  
  _Action:_ Add heading, `aria-live="polite"`, focus management.  
  _Tests:_ Micro: RTL assertions; Macro: Axe audit.
- [ ] **Topic Showcase Tabs** (`components/TopicShowcase.tsx`)  
  _Action:_ Implement WAI-ARIA tab semantics, keyboard navigation.  
  _Tests:_ Micro: RTL keyboard navigation test; Macro: Axe + manual keyboard walkthrough.
- [ ] **Bundle Baseline & Guardrails** (`benchmarks/bundle-baseline.json`, `scripts/check-bundle.ts`)  
  _Action:_ Run `ANALYZE=true npm run build`, capture baseline, enforce thresholds.  
  _Tests:_ Micro: Node script verifying delta; Macro: `npm run build` with guard enabled.
- [ ] **GitHub Activity Refactor** (`app/api/github/route.ts`, consuming components)  
  _Action:_ Move fetch to API route with `revalidate: 3600`, server-render results, optional Redis cache.  
  _Tests:_ Micro: unit test ensuring revalidate option set; Macro: Playwright smoke ensuring section renders.
- [ ] **Speed Insights Integration** (`app/layout.tsx`)  
  _Action:_ Import `<SpeedInsights />` from `@vercel/speed-insights`.  
  _Tests:_ Micro: snapshot test; Macro: verify data appears in Speed Insights dashboard post-deploy.

---

## Coordination Notes
- Maintain joint status log in `logs/progress.md` with timestamps, blockers, handoffs.  
- Before starting dependent tasks, ping counterpart via the log to confirm prerequisites are complete.  
- Merge windows: Codex owns infra/security PRs; Claude owns application/testing PRs. Use feature branches per task to minimize merge conflicts.

## Validation Protocol
1. Perform micro test(s).  
2. Run macro/system-level validation.  
3. Document results + artefacts in the checklist item.  
4. Mark checkbox once both pass and artefacts are stored.

Stay in sync daily via the progress log; flag cross-track blockers immediately.
