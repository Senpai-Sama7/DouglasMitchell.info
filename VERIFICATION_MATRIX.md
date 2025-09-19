| ID  | Feature | Command | Expected signal | Status | Evidence |
| --- | ------- | ------- | --------------- | ------ | -------- |
| F1 | Hero proclaims the Halcyon Logistics identity and outlines multi-format content. | `rg "Halcyon Logistics" app/page.tsx` | Matches display the Halcyon Logistics label and supporting references in the hero card. | VERIFIED | [F1](evidence/F1.txt) |
| F2 | Topic showcase enables switching between logistics, design systems, and media focuses. | `rg "Field Operations" components/TopicShowcase.tsx` | The Field Operations label appears within the interactive topic dataset. | VERIFIED | [F2](evidence/F2.txt) |
| F3 | Signal controller presents a range slider for tuning immersion level feedback. | `rg "type=\"range\"" components/SignalController.tsx` | The command surfaces the range input definition used for the immersion control. | VERIFIED | [F3](evidence/F3.txt) |
| F4 | Dispatch #014 audio log is highlighted among latest posts. | `rg "Dispatch #014" app/page.tsx` | Output shows the Dispatch #014 entry inside the posts data block. | VERIFIED | [F4](evidence/F4.txt) |
| F5 | Subscribe section includes the Join manifest call-to-action. | `rg "Join manifest" app/page.tsx` | Result contains the Join manifest button label within the subscription form. | VERIFIED | [F5](evidence/F5.txt) |
