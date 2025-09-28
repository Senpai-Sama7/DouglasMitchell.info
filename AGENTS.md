# Repository Guidelines

## Project Structure & Module Organization
Source views live in `app/`, with `app/page.tsx` coordinating the hero, skills, projects, lab, and community sections via GSAP timelines that pull data from `content/site-data.ts`. Client-side primitives sit in `components/` (e.g., `NavBar`, `AIProjectIdeator`, `CustomCursor`, `KpiCounters`) and should expose clear props for reuse. API handlers and shared utilities belong in `app/api/` and `lib/` respectively; `lib/neon.ts` wraps Neon SQL access. Visual assets, motion captures, and research artefacts are kept in `assets/` and `evidence/`. Playwright specs and reports live under `tests/` and `playwright-report/`; keep DOM hooks stable when touching animated sections.

## Build, Test & Development Commands
- `npm run dev` – start the Next.js app with API routes; expect Neon reads if `DATABASE_URL` is set.
- `npm run lint` – enforce ESLint + TypeScript conventions before commits; fails block the pipeline.
- `npm run build` – validate server/client boundaries prior to Vercel deploys or static export.
- `npx playwright test` – run E2E regressions covering hero motions and metrics fallbacks.

## Coding Style & Naming Conventions
Use TypeScript with explicit interfaces, early returns, and descriptive prop names. Follow `camelCase` for variables, `PascalCase` for components, and maintain `'use client'` headers for browser-only modules. Extend the monochrome design tokens in `app/globals.css` (e.g., `--axiom-spacing-*`, `.axiom-section`) and gate GSAP animations behind `prefers-reduced-motion` checks. Next 15 App Router `params` arrive as Promises—`await` them before use (see `app/projects/[slug]/page.tsx`).

## Testing Guidelines
Name Playwright specs descriptively (`metrics.spec.ts`) and reset Neon fixtures to keep reads idempotent. Run `npm run lint` plus targeted Playwright suites when adjusting motion timing, cursor behaviour, or metrics handling. Capture failures under `playwright-report/` for review.

## Commit & Pull Request Guidelines
Adopt imperative, scoped commits (`Feat:`, `Fix:`, `Docs:`) referencing tickets or Notion docs. PRs should summarise behaviour changes, link relevant ADRs, and include screenshots or clips for motion tweaks. Call out Neon schema or env updates explicitly.

## Security & Configuration Tips
Store `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in `.env.local`; rely on static fallbacks otherwise. Exclude artefacts from `/home/donovan/Videos/me/me_ina_db/cred` and scrub logs of sensitive data. Debounce network calls, lazy-load heavy modules, and honour reduced-motion preferences to respect user settings.
