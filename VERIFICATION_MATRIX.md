| ID | Feature | Command | Expected signal | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| F1 | Hero kicker proclaims AXIOM PROTOCOL ONLINE status. | `rg "AXIOM PROTOCOL ONLINE" content/site-data.ts` | Output shows the hero kicker string set to AXIOM PROTOCOL ONLINE. | VERIFIED | [F1](evidence/F1.txt) |
| F2 | Project showcase lists the Ultimate AI Agent — Production-Ready Edition case study. | `rg "Ultimate AI Agent — Production-Ready Edition" content/site-data.ts` | Result reveals the Ultimate AI Agent project title inside the showcase configuration. | VERIFIED | [F2](evidence/F2.txt) |
| F3 | Lab streams include the Security Drills log feed. | `rg "Security Drills" content/site-data.ts` | Search output confirms the Security Drills lab stream entry. | VERIFIED | [F3](evidence/F3.txt) |
| F4 | Topic showcase renders accessible tablist controls. | `rg "role=\"tablist\"" components/TopicShowcase.tsx` | Component source includes a div with role="tablist" labelling the topic filters. | VERIFIED | [F4](evidence/F4.txt) |
| F5 | Contact form primary action invites visitors to Initiate contact. | `rg "Initiate contact" app/page.tsx` | Output contains the Initiate contact button label within the contact form actions. | VERIFIED | [F5](evidence/F5.txt) |
| F6 | Production build compiles via CI=1 npx --no-install next build. | `CI=1 npx --no-install next build` | Command completes without module resolution, type checking, or prerender errors. | VERIFIED | [F6](evidence/F6.txt) |
