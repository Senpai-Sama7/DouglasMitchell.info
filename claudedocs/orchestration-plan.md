# System Improvement Orchestration Plan
**Generated**: 2025-09-30
**Source**: Code Analysis Report + /sc:spawn Meta-Orchestration
**Strategy**: Adaptive (Security-first → Performance → Quality)

---

## Epic Overview: Production Hardening & Optimization

**Objective**: Transform 4/5 codebase into 5/5 production-ready system through coordinated security, performance, and quality improvements.

**Scope**: 3 critical security fixes, 3 high-priority performance optimizations, 4 quality enhancements
**Estimated Impact**:
- Security: Critical vulnerability elimination (weak nonce → crypto-secure)
- Performance: -60-80KB bundle size (~30% reduction)
- Quality: Production-ready logging, improved maintainability

---

## Task Hierarchy & Dependency Map

```
EPIC: Production Hardening & Optimization
├─ STORY 1: Security Hardening (Critical - Sequential) ⚡ PARALLEL READY
│  ├─ Task 1.1: Fix Weak Nonce Generation [CRITICAL] 🔴
│  │  └─ Subtask: Replace Math.random with crypto.randomBytes in middleware.ts
│  ├─ Task 1.2: Remove CSP unsafe-inline [HIGH] 🟡
│  │  └─ Subtask: Remove unsafe-inline from next.config.js static CSP
│  └─ Task 1.3: Sanitize dangerouslySetInnerHTML [MEDIUM] 🟡
│     ├─ Subtask: Integrate DOMPurify library
│     └─ Subtask: Wrap BlogPost.tsx dangerouslySetInnerHTML with sanitization
│
├─ STORY 2: Performance Optimization (High - Adaptive) ⚡ PARALLEL READY
│  ├─ Task 2.1: Consolidate Animation Libraries [CRITICAL] 🔴
│  │  ├─ Subtask: Audit GSAP vs Framer Motion usage patterns
│  │  ├─ Subtask: Migrate GSAP ScrollTrigger → Framer Motion scroll
│  │  └─ Subtask: Remove GSAP dependency, update imports
│  ├─ Task 2.2: Implement Code Splitting [HIGH] 🟡
│  │  ├─ Subtask: Dynamic import Lab Section, Community Section
│  │  ├─ Subtask: Lazy load AIProjectIdeator, GitHubFeed
│  │  └─ Subtask: Add loading states for dynamic components
│  └─ Task 2.3: Add Resource Hints [MEDIUM] 🟢
│     └─ Subtask: Preconnect to cdn.sanity.io, api.github.com in layout.tsx
│
├─ STORY 3: Code Quality Enhancement (Medium - Parallel) ⚡ PARALLEL READY
│  ├─ Task 3.1: Replace Console Statements [CRITICAL] 🔴
│  │  ├─ Subtask: Replace console in app/page.tsx with lib/log
│  │  ├─ Subtask: Replace console in hooks/usePerformanceMonitor.ts
│  │  ├─ Subtask: Replace console in components/ErrorBoundary.tsx
│  │  └─ Subtask: Replace console in lib/error-monitoring.js
│  ├─ Task 3.2: Enable React Hooks ESLint Rule [MEDIUM] 🟡
│  │  ├─ Subtask: Add exhaustive-deps to .eslintrc.json
│  │  └─ Subtask: Fix violations in NavBar, TopicShowcase, blog, AIProjectIdeator
│  ├─ Task 3.3: Extract Animation Variants [LOW] 🟢
│  │  └─ Subtask: Create lib/motion-variants.ts with common patterns
│  └─ Task 3.4: Convert to Server Components [MEDIUM] 🟡
│     ├─ Subtask: Analyze HeroSection for static conversion
│     └─ Subtask: Extract client-only animations to leaf components
│
└─ STORY 4: Documentation & Validation (Low - Sequential)
   ├─ Task 4.1: Create Implementation ADR
   ├─ Task 4.2: Update Quality Gates Baseline
   ├─ Task 4.3: Run Full CI Pipeline
   └─ Task 4.4: Generate Completion Report
```

---

## Execution Strategy: Adaptive Coordination

### Phase 1: Critical Security (Sequential - 30 min)
**Dependencies**: None → Can start immediately
**Parallelization**: Tasks 1.1, 1.2, 1.3 are independent → PARALLEL EXECUTION

**Execution Order**:
1. Task 1.1 (5 min) → middleware.ts nonce fix
2. Task 1.2 (5 min) → next.config.js CSP cleanup
3. Task 1.3 (20 min) → DOMPurify integration

**Validation Gates**:
- ✓ `npm run build` succeeds
- ✓ CSP headers validated via curl
- ✓ No console errors in browser

### Phase 2: Performance Optimization (Adaptive - 4-6 hours)
**Dependencies**: Phase 1 complete (security baseline established)
**Parallelization**: Task 2.3 parallel with 2.1/2.2

**Execution Order**:
1. Task 2.3 (15 min) → Resource hints (quick win, no conflicts)
2. Task 2.1 (2-4 hours) → Animation consolidation (major refactor)
3. Task 2.2 (2-3 hours) → Code splitting (after 2.1 to avoid conflicts)

**Validation Gates**:
- ✓ `npm run analyze` shows bundle reduction
- ✓ `npm run check:bundle` passes
- ✓ Web Vitals maintained or improved

### Phase 3: Code Quality (Parallel - 3-4 hours)
**Dependencies**: Can run parallel with Phase 2 (different files)
**Parallelization**: All Task 3.x independent → FULL PARALLEL

**Execution Order** (parallel execution):
- Task 3.1 (2 hours) → Console cleanup across 20 files
- Task 3.2 (1 hour) → ESLint rule + fixes
- Task 3.3 (30 min) → Animation variants extraction
- Task 3.4 (2 hours) → Server component conversion

**Validation Gates**:
- ✓ `npm run lint` zero warnings
- ✓ `npm run typecheck` passes
- ✓ `npm run test:e2e` all green

### Phase 4: Documentation & Final Validation (Sequential - 1 hour)
**Dependencies**: Phases 1-3 complete
**Parallelization**: None (sequential documentation)

**Execution Order**:
1. Task 4.1 (20 min) → ADR-006-production-hardening.md
2. Task 4.2 (10 min) → Update bundle baseline
3. Task 4.3 (20 min) → `npm run ci:quality`
4. Task 4.4 (10 min) → Completion report

---

## Resource Allocation & Coordination

### File Conflict Matrix
```
High Conflict (Sequential Required):
- middleware.ts: Task 1.1 only
- next.config.js: Task 1.2 only
- hooks/useScrollAnimations.ts: Task 2.1 → Task 3.3 (sequential)
- app/page.tsx: Task 2.2 → Task 3.1 → Task 3.4 (sequential)

No Conflict (Parallel Safe):
- Task 1.1 ∥ Task 1.2 ∥ Task 1.3
- Task 2.3 ∥ Task 2.1
- Task 3.1 ∥ Task 3.2 (different rule sets)
- Task 3.2 ∥ Task 3.3 (different files)
```

### Token Budget Estimation
- Phase 1: ~15K tokens (small file edits, validation)
- Phase 2: ~40K tokens (major refactoring, migration)
- Phase 3: ~30K tokens (multi-file cleanup, type fixes)
- Phase 4: ~10K tokens (documentation, reporting)
- **Total**: ~95K tokens (within 200K budget, 47% utilization)

---

## Risk Mitigation & Rollback Plan

### Critical Risks

**Risk 1**: Animation library migration breaks existing animations
- **Mitigation**: Feature flag animation system, A/B test in staging
- **Rollback**: Git revert Task 2.1, restore GSAP imports
- **Detection**: Visual regression tests, manual QA

**Risk 2**: Server component conversion causes hydration errors
- **Mitigation**: Incremental conversion, test each component
- **Rollback**: Revert to 'use client', maintain client boundaries
- **Detection**: Browser console errors, E2E test failures

**Risk 3**: Console cleanup breaks error tracking
- **Mitigation**: lib/log.ts already exists, structured logging ready
- **Rollback**: Restore console statements, disable removeConsole config
- **Detection**: Production error monitoring gaps

### Validation Checkpoints

**After Each Phase**:
```bash
npm run lint           # ESLint validation
npm run typecheck      # TypeScript validation
npm run build          # Dynamic build validation
npm run build:static   # Static export validation
npm run test:e2e       # E2E regression testing
npm run check:bundle   # Bundle size validation
```

**Pre-Deployment**:
```bash
npm run ci:quality     # Full CI pipeline
npm run verify:adr     # ADR documentation check
```

---

## Success Metrics

### Security Hardening
- ✅ CSP nonce generation: Math.random → crypto.randomBytes (CVSS 7.5 → 0.0)
- ✅ CSP unsafe-inline eliminated from static config
- ✅ XSS protection: DOMPurify sanitization for user content

### Performance Optimization
- ✅ Bundle size reduction: -60-80KB (~30% improvement)
- ✅ Animation library count: 2 → 1 (Framer Motion only)
- ✅ Initial load time: 30-40% faster (below-fold lazy loading)
- ✅ First Load JS: <150KB target (current ~200KB)

### Code Quality
- ✅ Console statements: 20 files → 0 files (production-ready logging)
- ✅ ESLint warnings: 0 (with exhaustive-deps enabled)
- ✅ TypeScript strict: Maintained at 100% coverage
- ✅ Server Components: +3 components converted (reduced client bundle)

### Documentation
- ✅ ADR-006 created with implementation details
- ✅ Bundle baseline updated in benchmarks/
- ✅ CLAUDE.md updated with new patterns
- ✅ Quality gates validated and documented

---

## Implementation Timeline

**Immediate (Today)**:
- Phase 1: Security Hardening (30 min)
- Phase 2.3: Resource Hints (15 min)

**Short-term (This Week)**:
- Phase 2.1-2.2: Performance Optimization (1-2 days)
- Phase 3.1-3.2: Console cleanup + ESLint (1 day)

**Medium-term (Next Sprint)**:
- Phase 3.3-3.4: Animation variants + Server components (2-3 days)
- Phase 4: Documentation & Final validation (1 day)

**Total Estimated Effort**: 5-7 days (with parallel execution: 3-4 days)

---

## Coordination Commands

### Execute Full Orchestration
```bash
# Phase 1: Security (parallel execution)
/sc:spawn "fix critical security vulnerabilities" --strategy parallel

# Phase 2: Performance (adaptive execution)
/sc:spawn "optimize bundle size and loading performance" --strategy adaptive

# Phase 3: Quality (parallel execution)
/sc:spawn "replace console statements and improve code quality" --strategy parallel

# Phase 4: Documentation (sequential execution)
/sc:spawn "document changes and validate improvements" --strategy sequential
```

### Individual Story Execution
```bash
# Story 1: Security only
/sc:implement "security hardening per ADR-006" --focus security

# Story 2: Performance only
/sc:implement "performance optimization per ADR-006" --focus performance

# Story 3: Quality only
/sc:implement "code quality improvements per ADR-006" --focus quality
```

### Validation Commands
```bash
# After each phase
npm run ci:quality

# Bundle size validation
npm run check:bundle

# Security header validation
curl -I https://douglasmitchell.info | grep -i "content-security-policy"
```

---

## Next Steps

1. **Review & Approval**: Stakeholder review of orchestration plan
2. **Environment Preparation**: Ensure dev environment ready (Node 20+, npm 10+)
3. **Baseline Capture**: Run `npm run bench:metrics` and `npm run analyze` for pre-improvement baseline
4. **Phase 1 Execution**: Start with critical security fixes (30 min, low risk)
5. **Progressive Enhancement**: Continue through phases with validation gates

**Recommended Start**: Phase 1 (Security Hardening) - immediate execution, low risk, critical impact.
