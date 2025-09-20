# Engineering Delivery Charter

## Purpose
Set the non-negotiable delivery standards for the DouglasMitchell.info codebase. Every change must land production-ready code, comprehensive verification, and supporting documentation that meets the charter’s bar for robustness, observability, and reproducibility.

## Delivery Principles
- **Production-grade outputs**: ship secure, scalable, observable features; no placeholders or TODOs in committed code.
- **Deterministic diffs**: avoid dead code, keep patches reversible, and ensure lint/type/test suites stay green.
- **Backward compatibility**: version interfaces, document deprecations, and include migrations or adapters when behavior shifts.
- **Observability-first**: emit structured logs, metrics, and traces with clear owners and dashboards ready to wire into monitoring.
- **Truthful reporting**: surface assumptions, limits, and open risks alongside measurable outcomes and benchmarks.

## Process Requirements
- Code, tests, docs, ADR, benchmarks, and security notes ship together.
- Tests cover unit, integration, and end-to-end flows with deterministic seeds and fast execution budgets.
- Static analysis (ESLint/TypeScript, Playwright linting as relevant) must pass; vulnerability scans recorded when run.
- Benchmarks report latency, throughput, memory, and domain metrics with baseline deltas.
- Operational readiness includes runbooks, feature flags, rollback plans, and idempotent deployment steps.

## HRM + NLP Extensions
- **HRM systems**: decompose goals via manager policies, option critics, and termination guards; log plan steps and evaluate against flat-policy baselines.
- **NLP systems**: document task schemas, retrieval augmentation, metrics (ROUGE/BLEU/F1, etc.), and robustness probes (toxicity, adversarial prompts).
- Prefer Transformers; justify any GNN/RNN/SSM usage with profiled improvements and ablation data.

## Compliance Tracking
- Record verification evidence (test logs, benchmark outputs, observability checks) alongside each change request.
- Store ADRs under `docs/adr/`; update `docs/quality-gates.md` with lint/test/perf thresholds; maintain `docs/observability.md` for logging/metric contracts.
- Reject merges lacking required artifacts or with unverifiable claims.

## Security & Configuration
- Secrets live outside the repo; configurations ship as templates with rotation procedures.
- Document authn/z boundaries, rate limits, and supply-chain risks for any dependency additions.
- Enforce guardrails for HRM/NLP agents, including rollback primitives and policy shields.
