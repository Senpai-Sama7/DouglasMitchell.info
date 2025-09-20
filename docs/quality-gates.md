# Quality Gates

## Static Analysis
- `npm run lint` (ESLint + TypeScript) — zero warnings/errors; deterministic across runs.
- `npm run build` — succeeds without type errors; minification enabled unless justified; no invalid config warnings.
- Dependency scanning — run `npm audit` or approved SCA weekly; document findings and mitigation.
- `npm run verify:adr` — every change set must include an ADR update.

## Testing Requirements
- **Unit**: cover critical utils and components with deterministic seeds.
- **Integration**: exercise API routes (`app/api`) against Neon fallback adapters or local fakes.
- **End-to-end**: Playwright specs for hero motion, metrics fallback, and project navigation; ensure <5 minute total runtime.
- E2E harness starts Next dev on `127.0.0.1:3100`; stop any local servers on that port or override via `PLAYWRIGHT_TEST_BASE_URL` when necessary.
- Record pass/fail logs with timestamps alongside PRs.

## Performance & Observability
- Capture build output bundle sizes and First Load JS delta; flag >5% regression.
- Enforce `npm run check:bundle` against `benchmarks/bundle-baseline.json`; adjust baseline only with documented approval.
- Record latency/throughput/memory metrics for new endpoints or workers; compare to prior release.
- Run `npm run bench:metrics` to snapshot `/api/metrics` latency each PR; store JSON output in `logs/`.
- Verify structured logs include `event`, `component`, `severity`, `requestId`; ensure metrics emit `axiom_*` namespace as defined in `docs/observability.md`.

## Security Gates
- Secrets sourced from environment (`.env.local`); no plaintext secrets in repo.
- Input validation and rate limiting reviewed for every API change.
- Supply chain review for new dependencies (version, license, known CVEs).

## Approval Checklist
- ADR committed for each feature/change set.
- Benchmarks and test evidence attached to PR description.
- Rollback plan and feature flag strategy listed for any behavioral change.
