# Tech Stack & Build System

## Framework & Runtime
- **Next.js 15.5.3** with App Router architecture
- **React 18.3.1** with TypeScript 5.6.2
- **Node.js >=20.0.0** and **npm >=10.0.0** required
- Static site generation with `output: 'export'` configuration

## Core Dependencies
- **@sanity/client** - Content management and data fetching
- **@neondatabase/serverless** - Database operations
- **@mux/mux-node** - Video/media processing
- **gsap** - Animations and scroll triggers
- **groq** - Sanity query language

## Development Tools
- **ESLint** with Next.js config and custom rules
- **Playwright** for E2E testing across browsers
- **Husky** for git hooks and pre-commit validation
- **tsx** for TypeScript script execution

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run export       # Generate static export
```

### Quality Assurance
```bash
npm run lint         # ESLint validation
npm run test:unit    # Run unit tests
npm run test:e2e     # Playwright E2E tests
npm run ci:quality   # Full CI pipeline
```

### Monitoring & Analysis
```bash
npm run bench:metrics    # Performance benchmarking
npm run check:bundle     # Bundle size analysis
npm run verify:adr       # Architecture decision validation
```

## Build Configuration
- Static export to `/out` directory
- Unoptimized images for static hosting
- Console removal in production
- Single CPU/worker thread optimization
- Trailing slash handling for GitHub Pages