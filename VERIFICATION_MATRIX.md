# Verification Matrix

| ID   | Feature                     | Command                                   | Expected signal                                       | Status    | Evidence |
|------|-----------------------------|-------------------------------------------|-------------------------------------------------------|-----------|----------|
| F001 | Next.js production build    | `npm run build`                           | Route summary emitted with no compilation errors      | VERIFIED  | [build](evidence/build.log) |
| F002 | ESLint static analysis      | `npm run lint`                            | Output reports "No ESLint warnings or errors"        | VERIFIED  | [lint](evidence/lint.log) |
| F003 | Unit tests + coverage       | `node scripts/run-unit-tests.mjs --coverage` | Summary shows all tests passed with coverage details | VERIFIED  | [unit-tests](evidence/unit-tests.log) |
| F004 | Evidence integrity checksum | `cat evidence/sha256sums.txt`             | sha256 sums exist for each evidence log               | VERIFIED  | [sha256sums](evidence/sha256sums.txt) |
