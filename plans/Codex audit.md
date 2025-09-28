# Plan Portfolio Audit

## Amazon-Q-Developer-Production-Roadmap.md
- **Strengths**: Provides concrete defensive patterns like JWT issuance (`plans/Amazon-Q-Developer-Production-Roadmap.md:5-23`) and Redis rate limiting (`plans/Amazon-Q-Developer-Production-Roadmap.md:26-45`) that map to gaps in `/app/api`. sanitation snippet for contact payloads is also actionable (`plans/Amazon-Q-Developer-Production-Roadmap.md:48-66`).
- **Gaps**: Introduces a wholesale ORM migration to Drizzle plus prepared statements (`plans/Amazon-Q-Developer-Production-Roadmap.md:69-88`) even though the repo currently uses plain Neon SQL. Later phases jump to Prometheus/OpenTelemetry stacks and multi-format S3 pipelines (`plans/Amazon-Q-Developer-Production-Roadmap.md:492-535`), which would dwarf the portfolio’s scope and stall delivery.

## claude-enterprise-production-roadmap.md
- **Strengths**: Sets explicit enterprise SLOs and compliance criteria (`plans/claude-enterprise-production-roadmap.md:12-24`) and sketches a high-availability DB topology (`plans/claude-enterprise-production-roadmap.md:30-117`).
- **Gaps**: Assumes multiple replicas, Timescale hypertables, and SOC2/PCI programmes (`plans/claude-enterprise-production-roadmap.md:121-200`), none of which align with the single-instance Neon footprint. The plan reads more like a corporate transformation charter than an implementable sprint backlog tied to this codebase.

## Gemini.md
- **Strengths**: Starts with tangible hygiene such as fixing the misleading package description and running dependency audits (`plans/Gemini.md:11-19`), and it calls out the need for strict API validation (`plans/Gemini.md:53-72`).
- **Gaps**: Recommends reorganising the entire component tree into atomic design layers plus introducing Zustand stores (`plans/Gemini.md:27-50`), which would rewrite much of the UI without addressing current production blockers (e.g., missing `/api/subscribe`). Several sections stay aspirational—e.g., "consider" latest deps—without exit criteria.

## kiro-enterprise-production-roadmap.md
- **Strengths**: Emphasises observability and caching, providing concrete Redis-backed metric helpers (`plans/kiro-enterprise-production-roadmap.md:29-52`).
- **Gaps**: Keeps `output: 'export'` in the Next config while simultaneously proposing advanced caching and middleware (`plans/kiro-enterprise-production-roadmap.md:73-96`), which conflicts with the fact that API routes cannot run in a static export. The stack jump to Sentry, Prometheus, Datadog, Elasticsearch, and PCI compliance (`plans/kiro-enterprise-production-roadmap.md:1-96` and `plans/kiro-enterprise-production-roadmap.md:582-610`) is far beyond what the site needs to reach production-readiness.

## qodo.md
- **Strengths**: Prioritises current pain points—securing `/api/metrics` and moving content into Sanity (`plans/qodo.md:7-29`).
- **Gaps**: The document begins with a malformed heading (`plans/qodo.md:1`), suggesting it was never finalised. It also introduces a bespoke JWT auth service (`plans/qodo.md:10-14`) without explaining how tokens are issued to browsers for read-only metrics, and it keeps the static-export assumption in place, so the deployment conflict persists.

## Codex.md
- **Strengths**: Directly tackles the known blockers: removing the static export, wiring `/api/subscribe`, unfreezing metrics, and adding API guards (`plans/Codex.md:1-47`). Every step references real files and follow-up verification scripts.
- **Gaps**: Lacked the broader governance and instrumentation updates (observability docs, coverage reporting, accessibility retests) that some other plans mention.

## Codex 2.0.md (Best Overall)
- **Why it stands out**: Combines the pragmatic fixes from the original Codex plan with the most valuable upgrades surfaced in other documents. It resolves the export/build conflict and contact backend (`plans/Codex 2.0.md:7-15`), secures metrics with proper caching and key enforcement (`plans/Codex 2.0.md:17-25`), and folds in observability and accessibility guardrails backed by tests and runbooks (`plans/Codex 2.0.md:27-37`). The roadmap also formalises performance auditing, GitHub data caching, coverage reporting, and governance updates (`plans/Codex 2.0.md:39-59`). Each item ties to a specific repository path and a validation command, making it deliverable without spinning up unnecessary infrastructure.

## Recommendation
Adopt `plans/Codex 2.0.md` as the canonical production-readiness tracker. It keeps the scope grounded in the current Next.js/Neon architecture while layering in essential enterprise controls—security, observability, accessibility, and CI gates—ensuring the site can launch quickly and evolve responsibly.
