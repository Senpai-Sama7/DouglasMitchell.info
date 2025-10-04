# Fix 001 — Dependency remediation for build pipeline

## Summary
- Added missing runtime and tooling packages required by the application (`lucide-react`, `gsap`, Sanity/Neon/Mux clients, etc.).
- Declared supporting type packages (`@types/react`, `@types/styled-components`, etc.) to satisfy TypeScript checks.
- Installed build/test utilities (`esbuild`, `c8`, `dotenv`).

## Commands
```bash
npm install
npm run build
node scripts/run-unit-tests.mjs
npm run lint
```

## Evidence
- Production build: evidence/build.log
- Unit tests: evidence/unit-tests.log
- ESLint: evidence/lint.log
