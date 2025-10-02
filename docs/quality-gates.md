# Quality Gates

## Automation
- **Reality Check CI** (`.github/workflows/reality-check.yml`) runs linting, unit tests, static export, and the bundle regression guard on every pull request. Review the workflow logs instead of maintaining manual evidence files.
- Extended gates (Playwright, bundle metrics, ADR verification) continue to run via `quality.yml` and `quality-gates.yml` workflows.

## Static Analysis
- `npm run lint` (ESLint + TypeScript) — zero warnings/errors; deterministic across runs.
- `npm run typecheck` — `tsc --noEmit`; no explicit type errors permitted.
- `npm run build` — succeeds with `NEXT_SKIP_TYPE_CHECK=1`; log SWC fallback usage until Node 20/22 LTS is standard.
- Dependency scanning — run `npm audit` or approved SCA weekly; document findings and mitigation.
- `npm run verify:adr` — every change set must include an ADR update.

## Testing Requirements
- **Unit**: cover critical utils and components with deterministic seeds (`npm run test:unit`).
- **Integration**: exercise API routes (`app/api`) against Neon fallback adapters or local fakes.
- **End-to-end**: Playwright specs for hero motion, metrics fallback, and project navigation (`npx playwright test`); ensure <5 minute total runtime.
- E2E harness starts Next dev on `127.0.0.1:3100`; stop any local servers on that port or override via `PLAYWRIGHT_TEST_BASE_URL` when necessary.
- CI logs are the source of truth for pass/fail status; link to the latest successful workflow run in the PR conversation when approvals are granted.

## Performance & Observability
- Capture build output bundle sizes and First Load JS delta; flag >5% regression. Store analyzer output in `benchmarks/bundle-baseline.json`.
- Enforce `npm run check:bundle` against the baseline; adjust baseline only with documented approval.
- Record latency/throughput/memory metrics for new endpoints or workers; compare to prior release.
- Run `npm run bench:metrics` to snapshot `/api/metrics` latency each PR; store JSON output in `logs/`.
- Verify structured logs include `event`, `component`, `severity`, `requestId`; ensure metrics emit `axiom_*` namespace as defined in `docs/observability.md`.

## Security Gates
- Secrets sourced from environment (`.env.local`, Vercel) per `docs/security.md`; no plaintext secrets in repo.
- API requests authenticated via `METRICS_API_KEY`/`SUBSCRIBE_API_KEY`; include verification in PR test evidence.
- Input validation and rate limiting reviewed for every API change.
- Supply chain review for new dependencies (version, license, known CVEs).

## Approval Checklist
- ADR committed for each feature/change set.
- Confirm Reality Check CI and supporting quality workflows are green before requesting review; manual evidence attachments are no longer required.
- When running Playwright locally, wrap the command with `timeout` (e.g., `timeout 180 PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test`) to avoid hanging if the dev server misbehaves.
- Lighthouse + coverage artefacts attached when motion or bundle changes occur.
- Rollback plan and feature flag strategy listed for any behavioral change.
