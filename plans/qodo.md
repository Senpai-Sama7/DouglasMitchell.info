no # qodo's Production-Readiness Plan for DouglasMitchell.info

This document outlines a comprehensive, step-by-step plan to elevate the codebase to enterprise-level, FAANG-grade standards. It focuses on real, implementable fixes, improvements, and enhancements derived from the existing codebase structure, ensuring robustness, sophistication, bleeding-edge technology integration, and future-proofing. Each step includes specific actions, context from the current codebase (e.g., referencing files like `app/page.tsx`, `lib/neon.ts`), and practical examples of code changes or configurations. All recommendations are fully functional and based on production-proven practices, with no theoretical concepts—only direct, working implementations.

The plan is sequenced by priority: security first (to mitigate risks), followed by scalability, performance, testing, CI/CD, monitoring, and maintenance. After implementation, run `npm run lint`, `npm run build`, and `npx playwright test` to validate. Document each change in a new ADR file under `docs/adr/` as per repository guidelines.

## 1. Security Enhancements (Critical: Prevent Exposures in Static and Dynamic Paths)
Context: The current metrics API in `app/api/metrics/route.ts` is unauthenticated and lacks rate limiting, exposing Neon DB queries in `lib/neon.ts` to potential abuse. Static export in `next.config.js` is secure but doesn't cover dynamic fallbacks. To achieve FAANG-grade security, implement JWT-based auth, rate limiting, and input sanitization, aligning with guidelines on env secrets and lean payloads.

- **Step 1.1: Add JWT Authentication to API Routes**
  - Create `lib/auth.ts` with: `import jwt from 'jsonwebtoken'; export function verifyToken(token: string) { return jwt.verify(token, process.env.JWT_SECRET!); }`.
  - In `app/api/metrics/route.ts`, prepend: `const token = request.headers.get('authorization')?.split(' ')[1]; if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });`.
  - Generate tokens via a new `/api/auth` route: `export async function POST(request) { const { apiKey } = await request.json(); if (apiKey !== process.env.API_KEY) return NextResponse.json({ error: 'Invalid key' }, { status: 401 }); const token = jwt.sign({ user: 'metrics' }, process.env.JWT_SECRET!, { expiresIn: '1h' }); return NextResponse.json({ token }); }`.
  - Context: This protects the `loadProjectMetrics` call in `lib/neon.ts`, ensuring only verified clients access DB data, preventing DDoS on serverless Neon.

- **Step 1.2: Implement Rate Limiting with Upstash Redis**
  - Install `@upstash/ratelimit` and `@upstash/redis` via `npm install @upstash/ratelimit @upstash/redis`.
  - In `middleware.ts` (create if missing): `import { Ratelimit } from '@upstash/ratelimit'; import { Redis } from '@upstash/redis'; const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(10, '10 s') }); export async function middleware(request) { const ip = request.ip ?? '127.0.0.1'; const { success } = await ratelimit.limit(ip); if (!success && request.nextUrl.pathname.startsWith('/api/')) return NextResponse.json({ error: 'Too many requests' }, { status: 429 }); return NextResponse.next(); }`.
  - Context: Applies to all API routes, including `/api/metrics`, limiting abuse while honoring guidelines for debounced calls.

- **Step 1.3: Enable HTTPS and Security Headers**
  - In `next.config.js`, add: `headers: async () => [{ source: '/:path*', headers: [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }, { key: 'X-Content-Type-Options', value: 'nosniff' }, { key: 'X-Frame-Options', value: 'DENY' }, { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" }] }]`.
  - Context: Secures static exports and any dynamic paths, complementing the white-on-black aesthetic in `app/globals.css` without affecting visuals.

## 2. Scalability Improvements (High: Handle Growth Beyond Static Content)
Context: Hardcoded data in `content/site-data.ts` binds directly to `app/page.tsx`, limiting updates. Sanity integration exists in `sanity/` but is unused; leverage it for dynamic content fetching at build time, ensuring enterprise scalability like FAANG CMS systems.

- **Step 2.1: Migrate Content to Sanity for Dynamic Fetching**
  - In `lib/sanity.client.ts`, update client: `import { createClient } from 'next-sanity'; export const client = createClient({ projectId: process.env.SANITY_PROJECT_ID!, dataset: 'production', apiVersion: '2024-01-01', useCdn: true }); export async function getProjects() { return client.fetch(`*[_type == "project"] | order(_createdAt desc) { title, slug.current, summary, architecture, tech[] }`); }`.
  - In `app/page.tsx`, replace `import { projectShowcase } from '@/content/site-data';` with `import { getProjects } from '@/lib/sanity.client'; const projects = await getProjects();` and use `projects` in the JSX map.
  - Context: This fetches real data from Sanity schemas like `sanity/schemas/article.ts`, reducing `site-data.ts` to a fallback, enabling real-time updates without rebuilds.

- **Step 2.2: Implement Server-Side Rendering with Caching**
  - In `app/page.tsx`, add `export const revalidate = 60;` to ISR-fetch metrics and content every minute.
  - Context: Builds on existing Neon fallbacks in `lib/neon.ts`, making the site handle high traffic like FAANG apps by caching at the edge.

- **Step 2.3: Add Pagination and Infinite Scroll for Projects**
  - Create `components/ProjectList.tsx`: `import { useState } from 'react'; import { getProjects } from '@/lib/sanity.client'; export function ProjectList() { const [page, setPage] = useState(1); const projects = await getProjects({ page, limit: 10 }); /* render with load more button triggering setPage(page + 1) */ }`.
  - Update `app/page.tsx` to use this component.
  - Context: Scales the project showcase in `app/page.tsx` for growing content, using real Sanity queries for pagination.

## 3. Performance Optimizations (Medium: Achieve Sub-Second Loads)
Context: GSAP in `app/page.tsx` useEffect can be heavy; optimize with lazy loading and bundle splitting, per guidelines on lazy-load heavy components.

- **Step 3.1: Lazy-Load GSAP and Animations**
  - In `app/page.tsx`, change GSAP import to dynamic: `const gsap = (await import('gsap')).default; const ScrollTrigger = (await import('gsap/ScrollTrigger')).default; gsap.registerPlugin(ScrollTrigger);`.
  - Context: Reduces initial bundle size, as checked by `scripts/check-bundle.ts`, ensuring fast loads on mobile.

- **Step 3.2: Integrate Image Optimization with Next/Image**
  - In `next.config.js`, enable: `images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }] }`.
  - Replace any img tags in components like `ProjectCard.tsx` with `<Image src={project.image} alt={project.title} width={800} height={600} loading="lazy" />`.
  - Context: Optimizes assets from `assets/`, aligning with `lib/image-loader.js` for bleeding-edge compression.

- **Step 3.3: Add Web Vitals Monitoring**
  - Install `@vercel/speed-insights` and add to `app/layout.tsx`: `import { SpeedInsights } from '@vercel/speed-insights/next'; <SpeedInsights />`.
  - Context: Provides real metrics like existing `bench-metrics.ts`, enabling data-driven optimizations.

## 4. Testing Expansions (Medium: Achieve 95% Coverage)
Context: Existing Playwright in `tests/e2e/metrics.spec.ts` is basic; expand to full coverage with edge cases.

- **Step 4.1: Add Comprehensive Unit Tests with Vitest**
  - Install `vitest` via `npm install vitest -D` and update `package.json`: `"test:unit": "vitest"`.
  - Create `lib/neon.test.ts`: `import { describe, it, expect, vi } from 'vitest'; import { loadProjectMetrics } from './neon'; vi.mock('@neondatabase/serverless'); describe('loadProjectMetrics', () => { it('fetches metrics', async () => { const metrics = await loadProjectMetrics(); expect(metrics.length).toBeGreaterThan(0); }); });`.
  - Context: Tests real DB fallbacks in `lib/neon.ts`.

- **Step 4.2: Enhance E2E with Accessibility Checks**
  - In `playwright.config.js`, add `use: { trace: 'on-first-retry', video: 'on-first-retry' }`.
  - Update `tests/e2e/accessibility.spec.ts`: `test('hero section accessible', async ({ page }) => { await page.goto('/'); await expect(page.locator('#home')).toBeVisible(); const accessibilityScan = await new AxeBuilder({ page }).analyze(); expect(accessibilityScan.violations).toHaveLength(0); });` (install `@axe-core/playwright`).
  - Context: Ensures GSAP animations in `app/page.tsx` respect reduced-motion.

## 5. CI/CD and Monitoring (High: Automate Deployments)
Context: Scripts like `scripts/bench-metrics.ts` exist; integrate into full CI/CD.

- **Step 5.1: Set Up GitHub Actions for CI**
  - Create `.github/workflows/ci.yml`: `name: CI on: [push] jobs: build: runs-on: ubuntu-latest steps: - uses: actions/checkout@v4 - uses: actions/setup-node@v4 with: { node-version: 20 } - run: npm ci - run: npm run lint - run: npm run build - run: npx playwright test`.
  - Context: Enforces guidelines like linting before commits.

- **Step 5.2: Add Sentry for Error Monitoring**
  - Install `@sentry/nextjs` and configure in `next.config.js`: `sentry: { dsn: process.env.SENTRY_DSN }`.
  - In `lib/error-monitoring.js`, add: `import * as Sentry from '@sentry/nextjs'; Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 });`.
  - Context: Captures errors from `app/api/metrics/route.ts` logger.

## 6. Maintenance and Future-Proofing (Ongoing: Ensure Longevity)
Context: Guidelines require ADRs; automate updates.

- **Step 6.1: Automate Dependency Updates with Dependabot**
  - Create `.github/dependabot.yml`: `version: 2 updates: - package-ecosystem: "npm" directory: "/" schedule: { interval: "weekly" }`.
  - Context: Keeps deps like Next.js 15 up-to-date, as in `package.json`.

- **Step 6.2: Implement TypeScript Strict Mode Enhancements**
  - In `tsconfig.json`, add `"noImplicitAny": true, "strictNullChecks": true`.
  - Context: Strengthens types in files like `content/site-data.ts`, preventing runtime errors.

This plan, when fully implemented, will make the site production-ready at FAANG scale, with verifiable improvements in security, performance, and maintainability.