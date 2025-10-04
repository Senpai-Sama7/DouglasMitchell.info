# Fix 002 — Metrics and Telemetry APIs

## Summary
- Implemented `app/api/metrics/route.ts` with API key enforcement, dynamic caching headers, and structured logging.
- Added `app/api/telemetry/page/route.ts` to accept client telemetry payloads with validation and metric recording.
- Registered Playwright dependency to exercise metrics flows in CI/local runs.

## Commands
```bash
npm install -D @playwright/test@1.55.1
```

## Verification
See `VERIFICATION_MATRIX.md` entries F001–F005 for curl and Playwright evidence.
