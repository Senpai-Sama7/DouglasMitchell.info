# Performance Optimization Plan

## Current Issues
- CSS: 50KB+ (target: <10KB)
- JavaScript: Complex GSAP animations
- Fonts: Unoptimized loading
- Memory: Global registry leaks

## Immediate Fixes

### 1. CSS Optimization
```bash
# Install CSS optimization tools
npm install --save-dev cssnano postcss-cli

# Create optimized CSS build
npx postcss styles.css --use cssnano --output styles.min.css
```

### 2. Font Optimization
```html
<!-- Optimized font loading -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
```

### 3. Animation Performance
```javascript
// Replace GSAP with CSS animations for simple effects
.hero-letter {
  animation: slideUp 0.6s ease-out forwards;
  animation-delay: calc(var(--index) * 0.05s);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 4. Memory Leak Fixes
```typescript
// lib/metrics.ts - Add cleanup
export function cleanupMetrics() {
  if (globalThis.__axiomMetricsRegistry) {
    globalThis.__axiomMetricsRegistry.reset();
    globalThis.__axiomMetricsRegistry = undefined;
  }
}

// Call cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupMetrics);
}
```

## Bundle Analysis
```bash
# Analyze current bundle
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer .next/static/chunks/
```

## Performance Targets
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Total Bundle Size**: <200KB (or <10KB for lean version)
- **JavaScript**: <50KB (or <2KB for lean version)