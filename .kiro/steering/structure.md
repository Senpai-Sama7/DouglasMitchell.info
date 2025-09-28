# Project Structure & Organization

## App Directory (Next.js App Router)
```
app/
├── layout.tsx          # Root layout with fonts, metadata, nav/footer
├── page.tsx           # Main homepage with all sections
├── globals.css        # Global styles and CSS variables
├── api/               # API routes
│   ├── bundle/        # Bundle analysis endpoint
│   ├── metrics/       # Real-time metrics API
│   └── revalidate/    # Cache revalidation
├── projects/[slug]/   # Dynamic project detail pages
└── resume/           # Resume page
```

## Components
- **Modular React components** in `/components` directory
- Each component handles specific UI concerns (NavBar, Footer, ProjectCard, etc.)
- GSAP animations integrated directly in components
- Custom cursor and theme toggle functionality

## Content & Data
```
content/
└── site-data.ts       # Centralized content configuration
```
- All site content exported from single source file
- Includes navigation, hero content, project data, testimonials
- Structured data for easy maintenance and updates

## Library Functions
```
lib/
├── metrics.ts         # Performance and analytics utilities
├── projects.ts        # Project data processing
├── sanity.client.ts   # Sanity CMS integration
├── neon.ts           # Database operations
└── mux.ts            # Video/media handling
```

## Testing Structure
```
tests/
├── e2e/              # Playwright end-to-end tests
│   ├── accessibility.spec.ts
│   ├── functionality.spec.ts
│   └── metrics.spec.ts
└── unit/             # Unit tests for lib functions
```

## Scripts & Automation
```
scripts/
├── bench-metrics.ts   # Performance benchmarking
├── check-bundle.ts    # Bundle size validation
├── run-unit-tests.mjs # Unit test runner
└── verify-adr.js     # Architecture decision validation
```

## Documentation
```
docs/
├── adr/              # Architecture Decision Records
├── engineering-charter.md
├── observability.md
└── quality-gates.md
```

## Configuration Files
- **Root level configs**: next.config.js, tsconfig.json, playwright.config.js
- **Linting**: .eslintrc.json, .stylelintrc.json
- **Git hooks**: .husky/ directory with pre-commit validation
- **Deployment**: Static export optimized for GitHub Pages

## Asset Organization
- **Static assets** in `/assets` directory
- **Generated output** in `/out` (gitignored)
- **Logs and benchmarks** in `/logs` and `/benchmarks`
- **Test artifacts** in `/test-results`