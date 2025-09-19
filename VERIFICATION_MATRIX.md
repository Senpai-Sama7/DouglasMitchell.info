| ID | Feature | Command | Expected signal | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| F1 | Hero letters animate with GSAP staggered timeline. | `rg -n "hero-letter" app/page.tsx` | Output lists hero-letter markup and GSAP query registration. | VERIFIED | [F1](evidence/F1.txt) |
| F2 | Sticky navigation renders a scroll progress indicator tied to progressRef. | `rg -n "nav-progress" app/page.tsx` | Matches show the progress container and ref-linked bar. | VERIFIED | [F2](evidence/F2.txt) |
| F3 | Sections and text reveals are controlled by IntersectionObserver thresholds. | `rg -n "IntersectionObserver" app/page.tsx` | Results surface both observers responsible for section and text activation. | VERIFIED | [F3](evidence/F3.txt) |
| F4 | Architecture constellation draws animated node connections via SVG paths. | `rg -n "network-line" app/page.tsx` | Command prints the network-line paths used for the constellation graphic. | VERIFIED | [F4](evidence/F4.txt) |
| F5 | FAQ accordion panels animate height transitions in global styles. | `rg -n "faq-panel" app/globals.css` | Output enumerates the CSS rules controlling accordion panel animation. | VERIFIED | [F5](evidence/F5.txt) |
