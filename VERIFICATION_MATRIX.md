| ID   | Feature                                  | Command                         | Expected signal                                              | Status    | Evidence |
|------|------------------------------------------|---------------------------------|--------------------------------------------------------------|-----------|----------|
| F001 | Next.js production build                 | npm run build                   | Route size summary emitted with no compilation errors        | VERIFIED  | [build](evidence/build.log) |
| F002 | Unit tests for BentoGrid & VisualEditor  | node scripts/run-unit-tests.mjs | Test summary reports all tests passed                        | VERIFIED  | [unit-tests](evidence/unit-tests.log) |
| F003 | ESLint static analysis                   | npm run lint                    | "No ESLint warnings or errors" displayed                     | VERIFIED  | [lint](evidence/lint.log) |
