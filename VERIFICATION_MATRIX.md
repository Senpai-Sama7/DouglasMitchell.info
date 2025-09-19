| ID | Feature | Command | Expected signal | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| F1 | Hero states systems architect positioning with Conscious Network Hub subtext. | `rg "Engineering resilient" content/site-data.ts` | Hero headline text appears within the hero section markup. | VERIFIED | [F1](evidence/F1.txt) |
| F2 | KPI strip lists three counters sourced from heroContent stats. | `rg "heroContent.stats" -n app/page.tsx` | Page references heroContent.stats when rendering the KPI counters. | VERIFIED | [F2](evidence/F2.txt) |
| F3 | Projects section enumerates Ultimate AI Agent and Houston Oil Airs initiatives. | `rg "Houston Oil Airs Enablement" content/site-data.ts` | Project dataset includes the Houston Oil Airs initiative alongside other featured work. | VERIFIED | [F3](evidence/F3.txt) |
| F4 | GitHub feed renders latest repositories when API succeeds. | `rg "https://api.github.com" components/GitHubFeed.tsx` | GitHub feed component fetches repository data from the GitHub API. | VERIFIED | [F4](evidence/F4.txt) |
| F5 | /api/bundle endpoint returns the LLM bundle JSON. | `curl -s http://localhost:3000/api/bundle | jq '.person.name'` | Endpoint responds with JSON payload containing the LLM bundle data. | VERIFIED | [F5](evidence/F5.txt) |
