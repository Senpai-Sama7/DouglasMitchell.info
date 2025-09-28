# Implementation Roadmap - Systematic Solutions

## Phase 1: Critical Security Fixes (Immediate - Day 1)

### Solution 1: Secure Bundle API
**Target**: `app/api/bundle/route.ts`
**Timeline**: 2 hours
**Impact**: Eliminates data exposure vulnerability

**Step-by-Step Implementation**:

1. **Create Filtered Data Structure**:
```typescript
// NEW FILE: lib/public-data.ts
import {
  navigationLinks,
  seo,
  heroContent,
  projectShowcase // Only public projects
} from '@/content/site-data'

export const publicBundle = {
  navigation: navigationLinks,
  seo: seo,
  hero: {
    headline: heroContent.headline,
    tagline: heroContent.tagline,
    // Remove internal CTAs and sensitive content
  },
  projects: projectShowcase.map(project => ({
    id: project.id,
    title: project.title,
    summary: project.summary,
    // Remove architecture details and internal links
  }))
}
```

2. **Update Bundle Route**:
```typescript
// UPDATED: app/api/bundle/route.ts
import { publicBundle } from '@/lib/public-data'

export async function GET() {
  return NextResponse.json(publicBundle, {
    headers: {
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
    }
  })
}
```

3. **Add Rate Limiting**:
```typescript
// NEW FILE: lib/rate-limiter.ts
const requests = new Map<string, number[]>()

export function rateLimit(ip: string, limit = 10, window = 60000) {
  const now = Date.now()
  const userRequests = requests.get(ip) || []

  // Remove old requests outside window
  const validRequests = userRequests.filter(time => now - time < window)

  if (validRequests.length >= limit) {
    return false
  }

  validRequests.push(now)
  requests.set(ip, validRequests)
  return true
}
```

**Verification Commands**:
```bash
# Test data exposure
curl localhost:3000/api/bundle | jq 'keys'
# Should only show: navigation, seo, hero, projects

# Test rate limiting
for i in {1..15}; do curl -w "%{http_code}\n" localhost:3000/api/bundle; done
# Should show 429 after 10 requests
```

### Solution 2: Fix CustomCursor Memory Leaks
**Target**: `components/CustomCursor.tsx`
**Timeline**: 1 hour

**Step-by-Step Implementation**:

1. **Use Event Delegation Pattern**:
```typescript
// REFACTORED: components/CustomCursor.tsx
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const cursor = cursorRef.current
    if (!cursor) return

    const handleMove = (event: MouseEvent) => {
      const x = event.clientX
      const y = event.clientY
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    // EVENT DELEGATION: Single listener on document
    const handleInteraction = (event: MouseEvent) => {
      const target = event.target as Element
      const isInteractive = target.closest('a, button, .axiom-project-card, [role="button"]')

      if (event.type === 'mouseover' && isInteractive) {
        cursor.classList.add('is-active')
      } else if (event.type === 'mouseout' && isInteractive) {
        cursor.classList.remove('is-active')
      }
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleInteraction)
    document.addEventListener('mouseout', handleInteraction)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleInteraction)
      document.removeEventListener('mouseout', handleInteraction)
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor" aria-hidden />
}
```

**Benefits**:
- Single event listener instead of N listeners
- Automatic support for dynamic elements
- No memory leaks with frequent mounting

---

## Phase 2: Architectural Refactoring (Week 1-2)

### Solution 3: Decompose Monolithic Page Component
**Target**: `app/page.tsx` (405 lines → 4 focused components)
**Timeline**: 8 hours
**Impact**: Improved maintainability, testability, and performance

**Component Decomposition Strategy**:

1. **Extract Animation Logic**:
```typescript
// NEW FILE: components/PageAnimations.tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function PageAnimations() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Move all GSAP animation logic here
      gsap.from('.hero-letter', {
        yPercent: 120,
        opacity: 0,
        rotateX: -50,
        delay: 0.3,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.05
      })

      // Other animations...
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return <div ref={rootRef} className="animation-root" />
}
```

2. **Extract Data Fetching Logic**:
```typescript
// NEW FILE: hooks/useProjectMetrics.ts
import { useEffect, useState } from 'react'
import { projectMetrics as fallbackMetrics } from '@/content/site-data'

export function useProjectMetrics() {
  const [metrics, setMetrics] = useState(fallbackMetrics)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchMetrics() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/metrics', { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const payload = await response.json()
        if (!cancelled && payload.metrics?.length) {
          setMetrics(payload.metrics)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load metrics')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchMetrics()
    return () => { cancelled = true }
  }, [])

  return { metrics, loading, error }
}
```

3. **Extract Section Components**:
```typescript
// NEW FILE: components/sections/HeroSection.tsx
import { heroContent, kpiStats, toolkitStacks } from '@/content/site-data'
import { KpiCounters } from '@/components/KpiCounters'
import { HeroAnimations } from '@/components/HeroAnimations'

export function HeroSection() {
  return (
    <section id="home" className="axiom-section axiom-section--hero">
      <div className="axiom-section__inner">
        <HeroAnimations headline={heroContent.headline} />
        <header className="axiom-section__header">
          <p className="axiom-eyebrow">{heroContent.kicker}</p>
          {/* Hero content */}
        </header>
        <KpiCounters stats={kpiStats} />
        {/* Toolkit grid */}
      </div>
    </section>
  )
}
```

4. **Refactored Main Page**:
```typescript
// REFACTORED: app/page.tsx (Now ~80 lines)
import { PageAnimations } from '@/components/PageAnimations'
import { CustomCursor } from '@/components/CustomCursor'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { AboutSection } from '@/components/sections/AboutSection'
// ... other sections

export default function Page() {
  return (
    <main className="axiom-main">
      <CustomCursor />
      <PageAnimations />

      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      {/* Other sections */}
    </main>
  )
}
```

### Solution 4: Optimize GSAP Usage
**Timeline**: 4 hours
**Impact**: Reduce bundle size by ~6MB

**Implementation Strategy**:

1. **Code Splitting for GSAP**:
```typescript
// NEW FILE: components/animations/GSAPProvider.tsx
import { lazy, Suspense } from 'react'

const LazyAnimations = lazy(() => import('./PageAnimations'))

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LazyAnimations />
      {children}
    </Suspense>
  )
}
```

2. **Alternative CSS Implementation**:
```typescript
// NEW FILE: components/animations/CSSAnimations.tsx
import { useEffect, useRef } from 'react'

export function CSSAnimations() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = rootRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return <div ref={rootRef} className="css-animations-root" />
}
```

3. **CSS Animation Styles**:
```css
/* Add to globals.css */
.hero-letter {
  opacity: 0;
  transform: translateY(120%) rotateX(-50deg);
  animation: hero-letter-in 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.hero-letter:nth-child(n) {
  animation-delay: calc(var(--letter-index, 0) * 0.05s + 0.3s);
}

@keyframes hero-letter-in {
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(56px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}
```

---

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Create comprehensive deep-dive analysis report with sequential reasoning", "status": "completed", "activeForm": "Creating comprehensive deep-dive analysis report with sequential reasoning"}, {"content": "Document critical security vulnerabilities with specific examples", "status": "completed", "activeForm": "Documenting critical security vulnerabilities with specific examples"}, {"content": "Provide architectural solutions with step-by-step implementation guides", "status": "completed", "activeForm": "Providing architectural solutions with step-by-step implementation guides"}, {"content": "Create performance optimization roadmap with specific metrics", "status": "in_progress", "activeForm": "Creating performance optimization roadmap with specific metrics"}, {"content": "Generate code refactoring recommendations with concrete examples", "status": "pending", "activeForm": "Generating code refactoring recommendations with concrete examples"}]