# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Testing
npm run test:unit        # Unit tests via custom script
npm run test:e2e         # End-to-end tests with Playwright

# Quality checks
npm run bench:metrics    # Performance benchmarking
npm run check:bundle     # Bundle size analysis
npm run verify:adr       # Architecture decision record validation
npm run ci:quality       # Complete CI pipeline (lint + build + tests + checks)

# Static export
npm run export
```

## Architecture Overview

This is a **Next.js 14 + Sanity CMS** portfolio site with a dual-layer architecture:

### Static Layer (Primary)
- **Static site**: `index.html` + `styles.css` + `script.js` - ultra-light standalone portfolio
- **GitHub Pages deployment**: Direct static hosting via workflow
- **No build required**: Open `index.html` directly in browser for development

### Dynamic Layer (Enhanced)
- **Next.js App Router**: Modern React application in `/app` directory
- **Sanity CMS**: Headless CMS integration for content management
- **Studio access**: `/studio` route for content editing
- **API routes**: `/api/bundle` and `/api/revalidate` for dynamic functionality

### Content Architecture
- **Site data**: Centralized in `/content/site-data.ts` with typed exports
- **Sanity schemas**: Located in `/sanity/schemas/` for CMS content types
- **Component library**: Reusable UI components in `/components/`

### Key Patterns
- **Bento grid design**: Main UI pattern inspired by logistics/dashboard aesthetics
- **Halcyon Logistics theme**: Fictional logistics company as design framework
- **TypeScript**: Strict typing with path aliases (`@/*` points to project root)
- **Modular content**: All copy, navigation, and data exported from `site-data.ts`

## Environment Setup

Required environment variables for Sanity integration:
```
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
```

## Project Structure Notes

- **Dual deployment**: Can function as static site OR Next.js application
- **Content-driven**: UI components consume data from centralized `site-data.ts`
- **Component isolation**: Each component is self-contained with clear data contracts
- **Quality pipeline**: Custom test suite with unit tests, E2E tests, and performance benchmarks
- **Path aliases**: Use `@/` prefix for imports (maps to project root)
- **Script automation**: Custom utilities in `/scripts/` for build optimization, testing, and validation

## Development Workflow

1. **Static development**: Modify `index.html`, `styles.css`, `script.js` directly
2. **Dynamic development**: Use `npm run dev` for Next.js features
3. **Content updates**: Edit `/content/site-data.ts` for copy changes
4. **Sanity content**: Access `/studio` route when running dev server
5. **Deployment**: Static files deploy automatically via GitHub Actions

## Key Files

- `app/page.tsx`: Main application entry point with all sections
- `content/site-data.ts`: Centralized content and configuration
- `sanity.config.ts`: Sanity CMS configuration
- `index.html`: Standalone static version
- `components/`: Reusable UI components with clear data interfaces
- `scripts/`: Custom automation utilities (testing, benchmarking, validation)
- `tests/unit/`: Unit test files
- `tests/e2e/`: Playwright end-to-end tests

## Important Configuration Notes

- **Next.js export mode**: Configured for static export via `output: 'export'` in `next.config.js`
- **Husky pre-commit**: Lint-staged setup enforces code quality on commit
- **Node version**: Requires Node >=20.0.0 and npm >=10.0.0 as specified in `engines`