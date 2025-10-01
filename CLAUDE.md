# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DouglasMitchell.info** is a dual-deployment Next.js 15 portfolio/blog platform that:
- Deploys dynamically to Vercel (with API routes, real-time data)
- Exports statically to GitHub Pages (API routes excluded, fallback data)
- Integrates Sanity CMS for content management
- Implements production-grade observability, security headers, and quality gates

**Tech Stack**: Next.js 15.5.3, React 18.3.1, TypeScript 5.6.2, Sanity CMS, Framer Motion, GSAP, Tailwind CSS

## Essential Commands

### Development
```bash
npm run dev                    # Start Next.js dev server (port 3000)
npm run lint                   # ESLint CLI (zero warnings required)
npm run typecheck              # TypeScript validation (tsc --noEmit)
npm run build                  # Dynamic build with API routes (for Vercel)
npm run build:static           # Static export for GitHub Pages (excludes API routes)
npm run start                  # Production server (after build)
```

### Testing
```bash
npm run test:unit              # Run unit tests with coverage
npm run test:unit:coverage     # Unit tests with coverage reporting
npm run test:e2e               # Playwright E2E tests (requires dev server on port 3100)
npx playwright test            # Direct Playwright execution
npx playwright test --ui       # Playwright UI mode for debugging

# Important: E2E tests expect dev server on 127.0.0.1:3100
# Stop conflicting servers or set PLAYWRIGHT_TEST_BASE_URL to override
# Use timeout wrapper locally: timeout 180 PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test
```

### Quality Gates & Verification
```bash
npm run verify:adr             # Validate ADR documentation completeness
npm run bench:metrics          # Benchmark /api/metrics latency
npm run check:bundle           # Validate bundle size against baseline
npm run analyze                # Build with bundle analyzer (ANALYZE=true)
npm run ci:quality             # Full CI pipeline (lint + build + test + benchmarks)
npm run ci:quality:static      # CI for static builds (GitHub Pages)
```

## Architecture Overview

### Dual Build Strategy

This project supports **two distinct build outputs**:

1. **Dynamic Build** (`npm run build`)
   - Includes `app/api/*` routes for real-time data (metrics, subscriptions)
   - Connects to Neon database, Sanity CMS, external APIs
   - Deployed to Vercel with serverless functions
   - Environment: `NEXT_EXPORT` is unset

2. **Static Export** (`npm run build:static`)
   - Executes `scripts/exclude-api-routes.js` to temporarily move `app/api/` to `.temp-api-backup/`
   - Sets `NEXT_EXPORT=true` → triggers `output: 'export'` in next.config.js
   - Generates static HTML/JS to `out/` directory
   - API routes excluded; components use fallback data from `content/site-data.ts`
   - Deployed to GitHub Pages
   - After build, API routes are automatically restored

**Critical**: Never commit code that breaks either build mode. Test both builds before merging.

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Content Sources                                              │
│  • Sanity CMS (lib/sanity.client.ts) → Blog, Projects       │
│  • Neon Database (lib/neon.ts) → Metrics, Analytics         │
│  • Static Fallback (content/site-data.ts) → Default data    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Next.js App Router                                           │
│  • app/layout.tsx → Root layout with security headers       │
│  • app/page.tsx → Home (client-side metrics fetch)          │
│  • app/blog/page.tsx → Blog listing                         │
│  • app/projects/[slug]/page.tsx → Dynamic project pages     │
│  • app/api/* → Serverless routes (excluded in static build) │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Component Architecture                                       │
│  • components/sections/* → Page sections (Hero, Projects)   │
│  • components/* → Reusable UI (BentoGrid, ErrorBoundary)   │
│  • hooks/* → Custom hooks (useScrollAnimations, usePerf)    │
│  • lib/* → Business logic, utilities, clients               │
└─────────────────────────────────────────────────────────────┘
```

**Key Pattern**: Client components (app/page.tsx) gracefully degrade when API routes are unavailable (static build) by using fallback data from `content/site-data.ts`.

### Security Architecture

**Multi-Layer Defense**:
1. **Middleware** (middleware.ts)
   - Generates CSP nonces for every request
   - Sets security headers before Next.js processing
   - Runs on all routes except `/api`, `/_next/static`, images

2. **Next.js Headers** (next.config.js)
   - Static CSP, HSTS, X-Frame-Options, X-Content-Type-Options
   - Referrer-Policy, Permissions-Policy
   - Applied globally via `headers()` config

3. **API Authentication** (lib/auth.ts)
   - Timing-safe API key validation using `timingSafeEqual`
   - Environment-based secrets (never in code)
   - Structured error responses without information leakage
   - Example: `requireApiKey(request, { envVar: 'METRICS_API_KEY' })`

**Environment Variables**:
- `SANITY_PROJECT_ID`, `SANITY_DATASET` → CMS connection
- `DATABASE_URL` → Neon PostgreSQL
- `METRICS_API_KEY`, `SUBSCRIBE_API_KEY` → API protection
- Client-side vars must be prefixed `NEXT_PUBLIC_*`

### Observability Infrastructure

**Structured Logging** (lib/log.ts):
```typescript
import { getLogger } from '@/lib/log'
const logger = getLogger('component-name')

logger.info({ event: 'action', requestId, durationMs })
logger.error({ event: 'failure', error: sanitized })
```

**Required Fields**: `timestamp`, `event`, `component`, `severity`, `requestId`, `durationMs`

**Metrics** (lib/metrics.ts):
- Namespace: `axiom_*`
- Track: `axiom_metrics_fetch_success_total`, `axiom_page_render_duration_ms`

**Performance Monitoring**:
- Client: `hooks/usePerformanceMonitor.ts` (threshold-based slow component detection)
- Server: Web Vitals reporting via `lib/performance.ts`
- Benchmarks stored in `logs/` and compared against `benchmarks/bundle-baseline.json`

## Critical Development Patterns

### Path Aliasing
All imports use `@/` alias (configured in tsconfig.json):
```typescript
import { sanityClient } from '@/lib/sanity.client'
import { HeroSection } from '@/components/sections/HeroSection'
```

### Client vs Server Components
- **Client Components**: Require `'use client'` directive (animations, hooks, interactivity)
- **Server Components**: Default; use for static content, data fetching
- **Pattern**: Push `'use client'` boundary as low as possible to minimize bundle

### Animation Strategy
Project uses **both** Framer Motion and GSAP:
- **Framer Motion**: React-native animations, component transitions, layout animations
- **GSAP**: Complex scroll-triggered animations, parallax effects (hooks/useScrollAnimations.ts)
- **Motion Safety**: All animations respect `prefers-reduced-motion` via `lib/motion.ts`

### Error Handling
- **Component-Level**: `ErrorBoundary` wraps page sections (components/ErrorBoundary.tsx)
- **API Routes**: Return structured JSON errors with proper HTTP status codes
- **Client Fetch**: Graceful degradation with fallback data (see app/page.tsx:39-67)

## Quality Requirements

### Pre-Commit Standards (from docs/quality-gates.md)
- ✓ Zero ESLint warnings/errors (`npm run lint`)
- ✓ Zero TypeScript errors (`npm run typecheck`)
- ✓ All tests passing (`npm run test:unit`, `npm run test:e2e`)
- ✓ Bundle size within baseline (+5% max)
- ✓ ADR documented for feature changes (`npm run verify:adr`)

### Forbidden Patterns
- ❌ No `@ts-ignore` or `@ts-nocheck` (use proper typing)
- ❌ No TODO comments in committed code (complete features or create tickets)
- ❌ No placeholder implementations (production-ready only)
- ❌ No console.log in production code (use `lib/log.ts`)
- ❌ No secrets in code (environment variables only)
- ❌ No breaking either build mode (test `npm run build` AND `npm run build:static`)

### Required Deliverables (from docs/engineering-charter.md)
Every change must include:
1. **Code** → Feature implementation
2. **Tests** → Unit + E2E coverage
3. **Docs** → ADR in `docs/adr/`
4. **Benchmarks** → Performance measurements
5. **Security Notes** → Threat model updates

### ADR Process
- Template: `docs/adr/ADR-000-template.md`
- Numbering: Sequential (ADR-001, ADR-002, etc.)
- Required sections: Context, Options, Decision, Verification, Security, Migration
- Stored in: `docs/adr/ADR-XXX-description.md`
- Validation: `npm run verify:adr` checks for ADR updates

## Build System Details

### Static Export Mechanism
The `build:static` script performs:
```bash
1. node scripts/exclude-api-routes.js clean  # Remove old backups
2. npm run typecheck                         # Validate types
3. node scripts/exclude-api-routes.js move   # Move app/api → .temp-api-backup
4. NEXT_EXPORT=true next build               # Build to out/ directory
5. node scripts/exclude-api-routes.js restore # Restore app/api
```

**Important**: API routes marked `export const dynamic = 'force-static'` can be included in static builds but won't execute server-side logic.

### Bundle Analysis
```bash
npm run analyze  # Opens bundle analyzer in browser
npm run check:bundle  # Validates against baseline

# Baseline stored in: benchmarks/bundle-baseline.json
# Flag regressions >5% for review
```

### TypeScript Configuration
- Strict mode enabled (`tsconfig.json:16`)
- Target: ES2017 (modern but compatible)
- Module: esnext with Node resolution
- Incremental compilation enabled
- No `skipLibCheck` (validate all types)

## Testing Architecture

### Unit Tests
- Runner: Custom script (`scripts/run-unit-tests.mjs`)
- Coverage: C8 integration (`COVERAGE=true npm run test:unit:coverage`)
- Pattern: Tests colocated or in `tests/unit/`

### E2E Tests (Playwright)
- Config: `playwright.config.js`
- Specs: `tests/e2e/*.spec.ts`
- Server: Auto-starts on `127.0.0.1:3100` (configurable via `PLAYWRIGHT_TEST_BASE_URL`)
- Coverage: Accessibility (axe), functionality, metrics, subscriptions
- **Critical**: If tests hang, kill local dev server on port 3100 or use `PLAYWRIGHT_SKIP_WEBSERVER=1`

### Accessibility Testing
- Every E2E test runs `injectAxe()` and `checkA11y()` (tests/e2e/accessibility.spec.ts)
- WCAG 2.1 AA compliance required
- Violations fail tests

## Component Patterns

### BentoGrid System
- Flexible grid layout system (components/BentoGrid.tsx)
- Item types: hero, stats, about, newsletter, activity, feature, blog
- Sizes: small, medium, large, wide
- Editable mode for admin customization
- Default items in `defaultBentoItems` export

### Section Components
Pattern for page sections (components/sections/*):
```typescript
export function SectionName() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section content */}
      </div>
    </section>
  )
}
```

### Animation Hooks
```typescript
import { useScrollAnimations } from '@/hooks/useScrollAnimations'

const containerRef = useScrollAnimations({
  parallaxElements: true,
  sectionAnimations: true,
  onAnimationComplete: () => console.log('Animations ready')
})

return <div ref={containerRef}>{/* content */}</div>
```

## Deployment

### Vercel (Dynamic)
- Build command: `npm run build`
- Output: `.next/` directory with serverless functions
- Environment variables configured in Vercel dashboard
- Automatic deployments on push to main

### GitHub Pages (Static)
- Build command: `npm run build:static`
- Output: `out/` directory (static HTML/JS)
- Deploy via GitHub Actions or manual push to `gh-pages` branch
- No server-side logic; uses fallback data

## Known Issues & Workarounds

### Build Timeout
- Full build may timeout in CI/CD (>30s)
- Solution: Use `npm run build:static` for faster static builds
- Alternative: Increase timeout in CI config

### Port Conflicts (E2E Tests)
- Playwright expects port 3100 for dev server
- Conflict error: Kill existing server or set `PLAYWRIGHT_TEST_BASE_URL`
- Local workaround: `timeout 180 PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test`

### Dual Animation Libraries
- Both Framer Motion and GSAP imported (~100KB combined)
- Future: Consolidate to single library for bundle size reduction
- Current: Keep both for compatibility (migration planned)

## Documentation Locations

- **Architecture Decisions**: `docs/adr/ADR-*.md`
- **Quality Standards**: `docs/quality-gates.md`
- **Engineering Charter**: `docs/engineering-charter.md`
- **Observability Contract**: `docs/observability.md`
- **Code Analysis**: `claudedocs/code-analysis-report.md` (if generated)

## Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (copy from .env.example if exists)
cp .env.example .env.local
# Add: SANITY_PROJECT_ID, SANITY_DATASET, DATABASE_URL, etc.

# 3. Verify setup
npm run typecheck
npm run lint
npm run build:static  # Test static build first (faster)

# 4. Run dev server
npm run dev
# Open http://localhost:3000

# 5. Run tests
npm run test:e2e  # May need port 3100 free
```

## Key Files to Understand

- `next.config.js` → Security headers, build configuration, dual build support
- `middleware.ts` → CSP nonce generation, per-request security headers
- `lib/auth.ts` → API authentication with timing-safe comparison
- `content/site-data.ts` → Fallback data for static builds
- `scripts/exclude-api-routes.js` → Static build API route exclusion
- `hooks/useScrollAnimations.ts` → GSAP scroll effects with motion safety
- `components/ErrorBoundary.tsx` → Component-level error handling
