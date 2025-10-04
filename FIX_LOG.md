# Fix Log

- 2025-10-04: Restored build and CI by adding required runtime deps and types. Added unit-test script and tooling (esbuild, c8). Added next-env bootstrap. Removed unsupported `outputFileTracingRoot` from Next config. Introduced CI evidence generator and workflow.
- 2025-10-04: Added authenticated `/api/metrics` route and `/api/telemetry/page` endpoint. Registered `@playwright/test` dev dependency. Captured curl evidence for metrics/telemetry and attempted Playwright run (blocked by system deps).
