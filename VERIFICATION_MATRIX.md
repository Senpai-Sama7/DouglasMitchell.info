| ID | Feature | Command | Expected signal | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| F1 | Hero names Halcyon Logistics Dispatch with initialization readout. | `rg "Halcyon Logistics Dispatch" content/site-data.ts` | Output lists the Halcyon Logistics Dispatch title defined for the hero and metadata. | VERIFIED | [F1](evidence/F1.txt) |
| F2 | Bento grid includes the smartphone operations mock tile. | `rg "Smartphone interface" content/site-data.ts` | Command finds the device mock description referencing the smartphone interface. | VERIFIED | [F2](evidence/F2.txt) |
| F3 | Dispatch roster highlights the Night Shift audio log entry. | `rg "Night Shift Audio Log" content/site-data.ts` | Result shows the dispatch title for the Night Shift Audio Log release. | VERIFIED | [F3](evidence/F3.txt) |
| F4 | Topic showcase renders accessible tablist controls. | `rg "role=\"tablist\"" components/TopicShowcase.tsx` | Component source includes a div with role="tablist" labelling the topic filters. | VERIFIED | [F4](evidence/F4.txt) |
| F5 | Subscribe form provides the Join manifest CTA. | `rg "Join manifest" app/page.tsx` | Search output contains the Join manifest button label within the subscribe form. | VERIFIED | [F5](evidence/F5.txt) |
| F6 | Production build compiles via npx --no-install next build. | `npx --no-install next build` | Command completes without module resolution, type checking, or prerender errors. | UNVERIFIED | [F6](evidence/F6.txt) |
