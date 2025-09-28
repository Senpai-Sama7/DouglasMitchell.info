# Architecture Decision: Choose Your Path

## Current State Analysis
- **Claimed**: Lean, no frameworks, <2KB JS
- **Actual**: Next.js, React, GSAP, 50KB+ CSS, complex build
- **Problem**: Fundamental misalignment causing technical debt

## Option A: True Lean Portfolio (Recommended for Simplicity)

### Implementation
```bash
# Keep only essential files
├── index.html (optimized)
├── styles.css (compressed to <10KB)
├── script.js (compressed to <2KB)
├── assets/
│   └── icon.svg
└── manifest.webmanifest
```

### Benefits
- Matches stated goals
- Zero build complexity
- Maximum performance
- Easy maintenance
- True static deployment

### Optimized CSS Structure
```css
/* Minimal CSS - Target <10KB */
:root {
  --bg: #0b0b0b;
  --fg: #e7e7e7;
  --accent: #7dd3fc;
  --space: clamp(1rem, 2vw, 2rem);
}

/* Remove: Complex animations, gradients, custom cursors */
/* Keep: Essential layout, typography, responsive design */
```

### Optimized JavaScript
```javascript
// Target <2KB compressed
(() => {
  // Essential functionality only
  const nav = document.querySelector('.nav');
  const btn = document.getElementById('navToggle');
  
  if (btn && nav) {
    btn.onclick = () => {
      const exp = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', (!exp).toString());
    };
  }
  
  // Theme toggle
  const theme = localStorage.getItem('theme') || 
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.style.colorScheme = theme;
  
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const current = getComputedStyle(document.documentElement).colorScheme;
    const next = current.includes('dark') ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    document.documentElement.style.colorScheme = next;
  });
  
  // Current year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
```

## Option B: Honest Modern Framework

### Updated README
```markdown
# Modern Portfolio with Next.js
Full-featured portfolio built with Next.js, React, and modern tooling.

**Stack**: Next.js 15, React 18, TypeScript, GSAP, Tailwind CSS
**Bundle Size**: ~200KB (optimized)
**Features**: Animations, CMS integration, analytics
```

### Performance Optimizations
- Code splitting by route
- Image optimization
- Font subsetting
- CSS purging
- Bundle analysis

### Security Hardening
- Input validation
- Rate limiting
- CSRF protection
- Secure headers
- Environment validation

## Recommendation: Choose Option A

**Rationale:**
1. Aligns with stated goals
2. Eliminates technical debt
3. Maximizes performance
4. Reduces maintenance burden
5. Provides learning opportunity in constraint-based design

**Migration Path:**
1. Extract content from Next.js components
2. Optimize static HTML structure
3. Compress CSS (remove animations, complex layouts)
4. Minimize JavaScript functionality
5. Test across devices
6. Deploy via GitHub Pages