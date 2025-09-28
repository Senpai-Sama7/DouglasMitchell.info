# qodo2.0 Production-Readiness Plan for DouglasMitchell.info

This ultimate plan synthesizes the best elements from all plans in the folder. After evaluating them:

- **Amazon-Q-Developer-Production-Roadmap.md**: Strong on detailed code for security (JWT, rate limiting), performance (caching, bundle optimization), and DevOps (CI/CD, IaC with Terraform). Best for practical, phased implementations with real code snippets.

- **claude-enterprise-production-roadmap.md**: Most comprehensive with extensive code for database schemas, auth systems, rate limiting, tracing, and auto-scaling. Excels in depth for enterprise features like multi-region DB, Redis clustering, and detailed metrics. Absolute best overall due to its thoroughness, real code, and coverage of scalability/observability.

- **Codex.md**: Concise, actionable steps with specific file edits (e.g., next.config.js, API routes). Great for immediate, verifiable tasks but less on advanced features.

- **Gemini.md**: Balanced with modern practices like atomic design, state management (Zustand), and observability (OpenTelemetry). Strong on performance (image optimization, code splitting) and dev practices (Storybook, feature flags).

- **kiro-enterprise-production-roadmap.md**: Good for monitoring stacks and caching strategies, with code for security middleware and bundle optimization. Solid but incomplete in scope.

- **qodo.md**: Practical priorities (security first), with specific tool integrations (Upstash, Vitest) and context from codebase. Good structure but shorter.

**Absolute Best**: claude-enterprise-production-roadmap.md – It provides the most detailed, implementable code across all areas, with a strong focus on enterprise scalability (e.g., auto-scaling, distributed tracing) while being fully functional.

The synthesized plan combines Claude's depth (e.g., auth, tracing, auto-scaling code) with Amazon Q's phasing/DevOps, Gemini's modern UI practices, Codex's file-specific actions, and my original's priority sequencing/security focus. It's sequenced by priority, with real code, context, and examples for a robust, future-proof app.

## 1. Security Enhancements (Critical: From Claude + Amazon Q + Original)
Context: Build on unauthenticated APIs (e.g., app/api/metrics/route.ts) with JWT, rate limiting, and headers for FAANG-grade protection.

- **Step 1.1: JWT Auth with Refresh Tokens** (From Claude/Amazon Q)
  - Create lib/auth.ts: `import { SignJWT, jwtVerify } from 'jose'; import { cookies } from 'next/headers'; const secret = new TextEncoder().encode(process.env.JWT_SECRET!); export async function createToken(payload) { return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('2h').sign(secret); } export function verifyToken(token) { return jwtVerify(token, secret); }`.
  - In app/api/metrics/route.ts: `const token = request.headers.get('authorization')?.split(' ')[1]; if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });`.
  - Context: Protects Neon queries (lib/neon.ts), with refresh via cookies for session management.

- **Step 1.2: Advanced Rate Limiting & DDoS Protection** (From Claude)
  - Install @upstash/ratelimit @upstash/redis; in middleware.ts: `import { Ratelimit } from '@upstash/ratelimit'; import { Redis } from '@upstash/redis'; const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(100, '1 m') }); export async function middleware(req) { const ip = req.ip ?? '127.0.0.1'; const { success } = await ratelimit.limit(ip); if (!success && req.nextUrl.pathname.startsWith('/api/')) return NextResponse.json({ error: 'Too many requests' }, { status: 429 }); return NextResponse.next(); }`.
  - Add DDoS detection: Extend with burst checks (e.g., >50 req/10s blocks IP for 1h via Redis).
  - Context: Limits abuse on dynamic routes, building on guidelines for lean payloads.

- **Step 1.3: Strict CSP and Headers** (From Amazon Q/Claude)
  - In middleware.ts, add: `response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"); response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');`.
  - Context: Secures static exports (next.config.js) and complements white-on-black CSS (app/globals.css).

## 2. Scalability Improvements (High: From Claude + Gemini)
Context: Migrate hardcoded content (content/site-data.ts) to dynamic Sanity fetching for growth.

- **Step 2.1: Dynamic Content with Sanity & Pagination** (From Original/Gemini)
  - In lib/sanity.client.ts: `import { createClient } from 'next-sanity'; export const client = createClient({ projectId: process.env.SANITY_PROJECT_ID!, dataset: 'production', apiVersion: '2024-01-01', useCdn: true }); export async function getProjects(page = 1, limit = 10) { return client.fetch(`*[_type == "project"] | order(_createdAt desc) [${(page-1)*limit}...${page*limit}] { title, slug.current, summary }`); }`.
  - In app/page.tsx: Replace import with `const projects = await getProjects();` and add infinite scroll in a new components/ProjectList.tsx with useState for paging.
  - Context: Scales project showcase (app/page.tsx), using real queries for CMS integration.

- **Step 2.2: Multi-Region DB & Redis Clustering** (From Claude)
  - In lib/database.ts: Use Pool with replicas; add class for primary/replica routing (as in Claude's code).
  - Context: Enhances lib/neon.ts for high-availability, handling traffic spikes.

- **Step 2.3: Auto-Scaling with Metrics** (From Claude)
  - Implement AutoScaler class (from Claude) monitoring CPU/memory, scaling instances via Kubernetes/AWS.
  - Context: Future-proofs for 1M+ users, integrating with bench-metrics.ts.

## 3. Performance Optimizations (Medium: From Amazon Q + Gemini)
Context: Optimize GSAP (app/page.tsx) and assets for sub-second loads.

- **Step 3.1: Code Splitting & Bundle Analysis** (From Amazon Q)
  - Update next.config.js with splitChunks for vendors/animations (as in Amazon Q code).
  - Context: Reduces bundle size, verified via scripts/check-bundle.ts.

- **Step 3.2: Advanced Image & Asset Optimization** (From Gemini/Amazon Q)
  - Use Next/Image with AVIF/WebP; add sharp-based optimization in lib/image-optimization.ts (from Amazon Q).
  - Context: Optimizes assets/ folder content.

- **Step 3.3: Web Vitals & Tracing** (From Claude/Gemini)
  - Add OpenTelemetry for tracing (Claude's code); integrate @vercel/speed-insights.
  - Context: Monitors real performance, building on existing benchmarks.

## 4. Testing & CI/CD (Medium: From Codex + Original)
Context: Expand basic Playwright (tests/e2e/metrics.spec.ts) to 95% coverage.

- **Step 4.1: Comprehensive Testing Suite** (From Original)
  - Add Vitest units (as in original); enhance E2E with Axe for accessibility.
  - Context: Covers edge cases like DB failures.

- **Step 4.2: CI/CD Pipeline with Gates** (From Codex/Amazon Q)
  - Create .github/workflows/ci.yml with lint/build/test/Snyk/Lighthouse (Amazon Q style).
  - Context: Enforces quality-gates.md.

## 5. Observability & Maintenance (High: From Claude + Amazon Q)
Context: Add full monitoring beyond basic logs.

- **Step 5.1: Metrics & Logging** (From Claude)
  - Implement EnterpriseMetricsCollector (Claude's code) with Prometheus/Sentry.
  - Context: Extends lib/log.ts for real-time insights.

- **Step 5.2: IaC & Dependency Management** (From Amazon Q)
  - Add Terraform for Vercel/Upstash (Amazon Q code); Dependabot for updates.
  - Context: Automates infrastructure, keeping package.json current.

- **Step 5.3: Feature Flagging & Design System** (From Gemini)
  - Integrate LaunchDarkly; set up Storybook for components.
  - Context: Enables safe rollouts and UI consistency.

Implement sequentially, validating with npm scripts and new ADRs. This creates a fully functional, enterprise-ready system.