# Observability Contract

## Logging
- Emit structured JSON logs with fields: `timestamp`, `event`, `component`, `severity`, `requestId`, `durationMs`, `userAgent`.
- API handlers (`app/api/*/route.ts`) must log failure paths with `severity:error` and include sanitized error details.
- Client-side telemetry should prefer `console.info` gated behind `NODE_ENV !== 'production'` or feature flags.
- Use `getLogger(component)` from `lib/log.ts` for structured output; avoid raw `console.log` in server code.

## Metrics
- Metric namespace: `axiom_*`.
- Required counters/gauges:
  - `axiom_metrics_fetch_success_total`
  - `axiom_metrics_fetch_failure_total`
  - `axiom_page_render_duration_ms`
- Integrate with Neon or alternative exporters via `lib/metrics.ts` (to be implemented when wiring real telemetry backends).
- Server handlers should call `incrementMetric`/`recordDurationMetric` in `lib/metrics.ts` to track success, failure, and latency.

## Tracing
- Adopt W3C Trace Context headers when calling downstream services.
- Wrap long-running operations (Neon queries, external fetches) with span annotations capturing `durationMs`, `resource`, `status`.

## Dashboards & Alerts
- Provide Grafana/DataDog templates covering:
  - Success/error rate for metrics API
  - Page render latency distribution
  - Bundle size trend per release
- Configure alerts for error rate >2% or latency p95 > 300ms sustained for 5 minutes.

## Verification
- Include observability checks in CI where possible (linting for required log keys, synthetic metrics smoke test).
- Document manual dashboard validation steps in the release runbook.
