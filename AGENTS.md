# Repository Guidelines

## Project Structure & Module Organization
- `app/page.tsx` renders the Axiom Protocol experience (hero, skills, projects, lab, community) using data from `content/site-data.ts` and GSAP-driven motion.
- `components/` contains reusable interface modules: navigation + theme switching (`NavBar`, `ThemeToggle`), interaction layers (`CustomCursor`, `AIProjectIdeator`, `KpiCounters`, `GitHubFeed`), and layout primitives.
- `app/api/metrics/route.ts` surfaces live delivery metrics from Neon using lightweight SQL helpers in `lib/neon.ts`.
- Styling is consolidated in `app/globals.css`; CSS custom properties and section-specific classes power the white-on-black premium aesthetic. Keep new styles consistent with the spacing scale and naming already in place.

## Build, Test & Development Commands
- `npm run dev` boots Next.js with GSAP animations and API routes; ensure `DATABASE_URL` is present for local Neon checks.
- `npm run lint` validates TypeScript + ESLint; CI expects a clean run.
- `npm run build` confirms server/client boundaries before shipping.
- `npx playwright test` (optional) exercises the historical specs in `tests/`; update selectors if sections shift.

## Coding Style & Naming Conventions
- TypeScript is strict—favour typed props, early returns, and keep client components isolated in `components/` with `'use client'`.
- Use `camelCase` for variables, `PascalCase` for components, and reuse the `axiom-*` CSS namespace and spacing tokens.
- GSAP animations live inside the page-level component; keep selectors scoped (e.g., `.axiom-section`). Respect the custom cursor and smooth-scroll behaviours.

## Testing Guidelines
- Run `npm run lint` and, when motion is updated, sanity-check with Playwright or manual throttle to keep animations within 60fps budgets.
- Neon metrics should fall back gracefully when `DATABASE_URL` is absent; add regression checks if you extend the schema.

## Commit & Pull Request Guidelines
- Follow the imperative, scoped style (`Feat:`, `Fix:`, `Docs:`). Reference any motion, accessibility, or performance testing you executed.
- Include before/after captures for major visual shifts and note Neon schema changes in the PR body.
- Ensure secrets remain in `.env.local`; never commit values from `/home/donovan/Videos/me/me_ina_db/cred`.

## Configuration & Security Notes
- Required env vars: `DATABASE_URL` (Neon pooled URL), optional `DATABASE_URL_UNPOOLED` for long-running scripts. Store them in `.env.local`.
- Create `axiom_metrics` with columns `(id text primary key, label text, value numeric, unit text, detail text, sort_order int)` to feed the metrics API. The site gracefully falls back to static values if the table is empty.
- Motion-heavy sections rely on IntersectionObserver and transform/opacity animations; ensure new work respects `prefers-reduced-motion` and keeps payloads lean.
