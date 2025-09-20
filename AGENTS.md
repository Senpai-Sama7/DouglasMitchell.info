# Repository Guidelines

## Project Structure & Module Organization
- `app/page.tsx` orchestrates the Axiom Protocol landing flow—hero, skills, projects, lab, community—binding data from `content/site-data.ts` to GSAP timelines.
- UI primitives live in `components/` (e.g., `NavBar`, `AIProjectIdeator`, `CustomCursor`, `KpiCounters`); treat each as an isolated client module with clear props.
- Server logic sits in `app/api/metrics/route.ts` and shared helpers under `lib/`, especially `lib/neon.ts` for Neon SQL access. Visual assets and experiment captures reside in `assets/` and `evidence/`.
- Playwright specs and artefacts are under `tests/` and `playwright-report/`; keep selectors stable when adjusting DOM structure.

## Build, Test & Development Commands
- `npm run dev` — start Next.js with live reload and API routes (requires `DATABASE_URL` for Neon parity).
- `npm run lint` — enforce ESLint + TypeScript rules; the pipeline blocks on failures.
- `npm run build` — validate server/client boundaries before deploying to Vercel or static export.
- `npx playwright test` — optional end-to-end regression sweep across hero interactions and metrics fallback.

## Coding Style & Naming Conventions
- Prefer TypeScript with explicit interfaces, early returns, and descriptive prop names; stick to `camelCase` variables and `PascalCase` components.
- Keep client-only logic in `components/` with `'use client'` headers; server utilities remain in `lib/` or API routes.
- Follow the established white-on-black aesthetic by extending tokens in `app/globals.css` (e.g., `--axiom-spacing-` scale, `.axiom-section` scope).
- Coordinate GSAP animations inside page-level hooks, and wrap motion in `prefers-reduced-motion` guards.
- In Next 15, App Router `params` are delivered as Promises; `await` them before reading values (see `app/projects/[slug]/page.tsx`).
- Delivery artefacts (ADR, benchmarks, security notes) accompany every change; see `docs/engineering-charter.md` for the charter and `docs/quality-gates.md` for mandatory checks.

## Testing Guidelines
- Run `npm run lint` before committing; add targeted Playwright specs when altering motion timing, cursor behaviour, or Neon metrics.
- Use descriptive test file names (`metrics.spec.ts`) and reset database fixtures to keep Neon reads idempotent.

## Commit & Pull Request Guidelines
- Use imperative, scoped commits (`Feat:`, `Fix:`, `Docs:`) and reference relevant tickets or Notion docs.
- PRs should outline behavioural changes, include screenshots or short clips for motion tweaks, and call out Neon schema or env updates.

## Security & Configuration Tips
- Store `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in `.env.local`; rely on statics when unavailable.
- Avoid committing artefacts from `/home/donovan/Videos/me/me_ina_db/cred`; scrub logs before sharing.
- Keep payloads lean—debounce network calls, lazy-load heavy components, and honour reduced-motion preferences.
