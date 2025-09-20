export const navigationLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#writing', label: 'Writing' },
  { href: '#lab', label: 'Lab' },
  { href: '#community', label: 'Community' },
  { href: '#contact', label: 'Contact' },
  { href: '/resume', label: 'Resume' }
]

export const seo = {
  title: 'Douglas Mitchell · Systems Architect & Conscious Network Hub',
  description:
    'Quality-first systems architect and conscious network hub building resilient, validated, production-ready solutions that scale impact.',
  keywords: [
    'Douglas Mitchell',
    'systems architect',
    'AI/ML pipelines',
    'security hygiene',
    'Houston network hub',
    'production-ready engineering'
  ]
}

export const heroContent = {
  kicker: 'AXIOM PROTOCOL ONLINE',
  headline: 'Build less. Ship more.',
  tagline: 'Engineering resilient, validated systems—turning complexity into repeatable performance.',
  subtext: 'Conscious Network Hub connecting technical excellence to community impact.',
  description:
    'Douglas Mitchell is a 85% technical-centrality systems architect delivering premium, evidence-backed products. Every engagement fuses architecture, security hygiene, and community-scale empathy.',
  primaryCta: { label: 'Explore flagship projects', href: '#projects' },
  secondaryCta: { label: 'Download resume', href: '/resume' }
}

export const kpiStats = [
  {
    id: 'code-stewarded',
    label: 'Lines of resilient code stewarded',
    value: 120000,
    suffix: '+',
    source: 'Versioned across production-grade client and community systems.'
  },
  {
    id: 'projects-completed',
    label: 'Projects delivered end-to-end',
    value: 36,
    suffix: '+',
    source: 'Architecture, implementation, validation, and launch support.'
  },
  {
    id: 'client-satisfaction',
    label: 'Client satisfaction index',
    value: 97,
    suffix: '%',
    source: 'Post-engagement surveys and repeat collaborations since 2022.'
  }
]

export const toolkitStacks = [
  {
    title: 'Core Architecture',
    tools: ['JavaScript / TypeScript', 'React & Next.js', 'Node.js', 'APIs & GraphQL', 'Git & CI/CD']
  },
  {
    title: 'Motion & Visualization',
    tools: ['CSS & GSAP', 'Three.js / WebGL', 'Data storytelling', 'Accessibility-first animation']
  },
  {
    title: 'Security & Ops',
    tools: ['MFA everywhere', 'Neon Postgres', 'pfSense + VLAN segmentation', 'SIEM log discipline', 'Automated regression rigs']
  }
]

export const projectShowcase = [
  {
    id: 'ultimate-ai-agent',
    slug: 'ultimate-ai-agent',
    title: 'Ultimate AI Agent — Production-Ready Edition',
    format: 'AI & Systems Architecture',
    summary: 'Modular agent stack coordinating research, validation, and delivery rituals without human bottlenecks.',
    problem: 'Translate raw research intensity into deployable AI workflows that ship safely.',
    architecture: 'Service mesh of orchestrators, Neon-backed state, and guardrail policies coded as reusable protocols.',
    validation: 'Load tests, agentic red-teaming, and telemetry dashboards ensuring sub-200ms response budgets.',
    outcomes: 'Cut delivery cycle times by 38% while raising reliability to 99.9% uptime.',
    tags: ['AI Systems', 'Neon', 'Guardrails'],
    tech: ['Next.js', 'GSAP', 'Neon Postgres', 'Serverless Workers'],
    href: '/projects/ultimate-ai-agent',
    links: [
      { label: 'Architecture diagram', href: 'https://gist.github.com/DouglasSMitchell/6b29dd2c20c1bace6d9b5245bb8a1b2a' },
      { label: 'Agent playbooks', href: 'https://github.com/DouglasSMitchell' }
    ]
  },
  {
    id: 'multimedia-pipeline',
    slug: 'multimedia-pipeline',
    title: 'Multimedia Pipeline',
    format: 'Content Orchestration',
    summary: 'Production pipeline aligning video, audio, and microcontent with continuous validation gates.',
    problem: 'Inconsistent publishing cadence and unclear quality gates for multimedia assets.',
    architecture: 'Mux live nodes, asset tagging heuristics, and automated review checklists that surface anomalies instantly.',
    validation: 'QA nodes, visual diffing, and editorial sign-off protocols triggered by Neon workflow events.',
    outcomes: 'Doubled publish throughput with zero missed release windows across a quarter.',
    tags: ['Content Ops', 'Mux', 'Automation'],
    tech: ['Mux', 'Next.js', 'Runtime QA scripts'],
    href: '/projects/multimedia-pipeline',
    links: [
      { label: 'Mux workflow notes', href: 'https://gist.github.com/DouglasSMitchell/6735f734c7ad8100ac467c6d5d0b1b49' },
      { label: 'Pipeline repo', href: 'https://github.com/DouglasSMitchell' }
    ]
  },
  {
    id: 'cybersecurity-home-lab',
    slug: 'cybersecurity-home-lab',
    title: 'Cybersecurity Home Lab',
    format: 'Security Architecture',
    summary: 'pfSense-driven segmentation, SIEM telemetry, and incident drills codified for rapid learning loops.',
    problem: 'Need a living environment to practice anomaly response and prove security-first delivery habits.',
    architecture: 'Layered VLANs, Zeek logging, threat emulation, and documented rollback protocols.',
    validation: 'Scheduled drills, red-team scenarios, and automated compliance snapshots.',
    outcomes: 'Zero successful breaches with <15m anomaly response time across simulations.',
    tags: ['Security', 'pfSense', 'SIEM'],
    tech: ['pfSense', 'Elastic Stack', 'Automation Scripts'],
    href: '/projects/cybersecurity-home-lab',
    links: [
      { label: 'Lab topology', href: 'https://gist.github.com/DouglasSMitchell/0d6297724cf0d6c2456a1d4ff7e94ece' },
      { label: 'Incident drill log', href: 'https://github.com/DouglasSMitchell' }
    ]
  },
  {
    id: 'influence-matrix',
    slug: 'influence-matrix',
    title: 'Influence Matrix Unveiled',
    format: 'Data Visualization',
    summary: 'Network intelligence model aligning legal, nonprofit, and technical actors for coordinated action.',
    problem: 'Disparate initiatives lacked shared visibility into influence and leverage points.',
    architecture: 'Graph models, psychographic overlays, and briefing dashboards with ethical guardrails.',
    validation: 'Scenario stress-tests, cross-disciplinary workshops, and continuous consent reviews.',
    outcomes: 'Accelerated coalition decision-making by 45% while maintaining ethical guardrails.',
    tags: ['Network Graphs', 'Ethical AI'],
    tech: ['D3.js', 'Next.js', 'Neon Postgres'],
    href: '/projects/influence-matrix',
    links: [
      { label: 'Network overlays', href: 'https://gist.github.com/DouglasSMitchell/96a9e385cdeb4b9444b15e4e8857e8b3' },
      { label: 'Ethics rubric', href: 'https://github.com/DouglasSMitchell' }
    ]
  },
  {
    id: 'houston-oil-airs',
    slug: 'houston-oil-airs',
    title: 'Houston Oil Airs Enablement',
    format: 'Community Infrastructure',
    summary: 'Systems support for environmental justice advocacy with secure data flows and collaboration protocols.',
    problem: 'Community advocates needed resilient tooling and safe data handling for cross-cluster coordination.',
    architecture: 'Encrypted data exchange, access tiering, and rapid-trust onboarding kits.',
    validation: 'Security audits, legal reviews, and UX walkthroughs with community partners.',
    outcomes: 'Reduced coordination friction by 60% and unlocked new partnerships across Houston networks.',
    tags: ['Community Systems', 'Security'],
    tech: ['Next.js', 'Sanity', 'Secure Storage'],
    href: '/projects/houston-oil-airs',
    links: [
      { label: 'Advocacy brief', href: 'https://gist.github.com/DouglasSMitchell/2b6d3df60b6f0255715a6b8099d33c3d' },
      { label: 'Community onboarding kit', href: 'https://github.com/DouglasSMitchell' }
    ]
  }
]

export const projectMetrics = [
  { id: 'uptime', label: 'Operational uptime', value: 99.9, unit: '%', detail: 'Monitored via automated regression rigs.' },
  { id: 'projects', label: 'Projects delivered', value: 36, unit: '+', detail: 'End-to-end architecture, implementation, and rollout.' },
  { id: 'satisfaction', label: 'Client satisfaction', value: 97, unit: '%', detail: 'Surveyed post-engagement and repeat clients.' }
]

export const skillTaxonomy = [
  {
    id: 'architecture',
    title: 'Architecture & Systems',
    summary:
      'Multi-layered processing pipelines from information sensing through validation, implementation, and optimization.',
    bullets: ['Scalability blueprints & future-proofing', 'Protocol design for transferability', 'Evidence-backed iteration rituals']
  },
  {
    id: 'security-ops',
    title: 'Security & Ops',
    summary: 'Security hygiene, anomaly response, and observability baked into every deployment.',
    bullets: ['MFA, secrets discipline, automated audits', 'pfSense/VLAN segmentation & SIEM flows', 'Rollback pathways codified per release']
  },
  {
    id: 'ai-analysis',
    title: 'AI/ML & Analysis',
    summary: 'Benchmarking, pipeline orchestration, and ethical guardrails driving research intensity to production value.',
    bullets: ['Agent orchestration with telemetry', 'Model evaluation frameworks', 'Cross-domain synthesis for decision readiness']
  },
  {
    id: 'web-frontend',
    title: 'Web & Frontend',
    summary: 'Premium interfaces with motion discipline, accessible interactions, and performant storytelling.',
    bullets: ['React/Next.js & GraphQL integrations', 'GSAP + CSS architecture', 'Three.js/WebGL prototyping']
  },
  {
    id: 'documentation',
    title: 'Documentation & Knowledge Transfer',
    summary: 'Consciousness transfer protocols ensuring teams can execute without dependency.',
    bullets: ['Runbooks & validation checklists', 'Narrative system diagrams', 'Community-ready playbooks']
  },
  {
    id: 'influence',
    title: 'Influence & Community',
    summary: 'Hub-and-spoke coordination bridging legal, nonprofit, and technical clusters across Houston.',
    bullets: ['Coalition enablement', 'Ethical persuasion frameworks', 'Resource routing & safety nets']
  }
]

export const writingDomains = [
  {
    id: 'environmental-justice',
    title: 'Environmental Justice',
    summary: 'Protective data patterns, advocacy tooling, and community safeguards for healthier ecosystems.',
    prompts: ['Air quality telemetry protocols', 'Legal-engineering partnership guides', 'Community data trusts playbooks']
  },
  {
    id: 'advanced-ai',
    title: 'Advanced AI & Tech',
    summary: 'Model benchmarking, agent pipelines, and deployment maturity anchored in guardrails.',
    prompts: ['Agent observability dashboards', 'Latency-aware inference strategies', 'Ethical evaluation matrices']
  },
  {
    id: 'health-optimization',
    title: 'Health Optimization',
    summary: 'Systems thinking applied to personal resilience, nervous system regulation, and high-performance rituals.',
    prompts: ['Recovery cadences for builders', 'Biofeedback-informed work sprints', 'Sustainable mastery loops']
  },
  {
    id: 'psychology-influence',
    title: 'Psychology of Influence',
    summary: 'Narrative framing, network dynamics, and ethical persuasion for coalition building.',
    prompts: ['Influence matrix templates', 'Trust calibration scorecards', 'Network choreography field notes']
  }
]

export const labStreams = [
  {
    id: 'model-benchmarks',
    title: 'Model Benchmarking Logs',
    description: 'Transparent records of agent and model evaluations with reproducibility checklists and anomaly notes.'
  },
  {
    id: 'pipeline-experiments',
    title: 'Pipeline Experiments',
    description: 'Continuous integration of multimedia and AI data flows with validation gates documented per iteration.'
  },
  {
    id: 'security-drills',
    title: 'Security Drills',
    description: 'Anonymized incident responses, learning loops, and readiness drills reinforcing zero-trust posture.'
  }
]

export const communityHighlights = [
  {
    id: 'houston-oil-airs',
    title: 'Houston Oil Airs',
    summary: 'Environmental justice advocacy with secure data handling, legal bridges, and community onboarding kits.',
    cta: 'See how technical rigor powers environmental justice and collective safety.'
  },
  {
    id: 'bridge-stories',
    title: 'Bridge Stories',
    summary: 'Short vignettes showing how legal, nonprofit, and technical collaborators aligned under shared rituals.',
    cta: 'Explore coordination playbooks built for equitable outcomes.'
  }
]

export const testimonials = [
  {
    id: 'client-1',
    quote:
      'Douglas rebuilt our operations UI with precision. Every interaction was justified with telemetry — launch day shipped at 60fps.',
    author: 'Lena Veras',
    role: 'Director of Product, Port Atlas'
  },
  {
    id: 'client-2',
    quote:
      'The Halcyon prototypes turned dense logistics into a calm narrative. Stakeholders finally understood the system in one walkthrough.',
    author: 'Kenji Morales',
    role: 'Principal Systems Engineer, Relay Collective'
  }
]

export const watcherStatement =
  'Presence systems keep mastery and safety balanced. I map signals, validate assumptions, and make decisions with full nervous-system consent.'

export const contactChannels = {
  email: 'contact@douglasmitchell.info',
  consulting: 'mailto:contact@douglasmitchell.info?subject=Consulting%20Inquiry',
  github: 'https://github.com/DouglasSMitchell',
  linkedin: 'https://www.linkedin.com/in/douglascmitchell/',
  twitter: 'https://twitter.com/DouglasCSM',
  location: 'Houston, TX'
}

export const githubConfig = {
  username: 'DouglasSMitchell',
  perPage: 5
}

export const bios = {
  short:
    'Systems architect and conscious network hub with 85% technical centrality, delivering quality-first engineering for high-impact teams.',
  medium:
    'Douglas Mitchell architects resilient systems that stay human-centered under pressure. With a mastery drive of 0.880 and achievement drive of 0.900, Douglas fuses architecture, security vigilance, and cross-domain synthesis to deliver production-ready outcomes. Each build codifies conscious network practices so collaborators can execute without dependency while communities stay safeguarded.',
  long:
    'Douglas Mitchell is a systems architect and conscious network hub operating out of Houston, Texas. The practice began with personal research into environmental justice and rapidly evolved into an architecture lab translating complex realities into resilient, validated solutions. Across AI, security, and community systems, Douglas designs modular protocols that transfer knowledge without creating bottlenecks. Mastery and safety remain inseparable: incident drills, ethical guardrails, and compassionate leadership keep teams regulated while shipping at pace. From the Ultimate AI Agent stack to Houston Oil Airs advocacy tooling, Douglas orchestrates multidisciplinary coalitions, proving that high-intensity research can stay grounded in public-interest outcomes and premium engineering discipline.'
}

export const experience = [
  {
    organization: 'Systems & Community Architect',
    dates: '2022 — Present',
    bullets: [
      'Architected AI, security, and community platforms with 99.9% uptime and zero breach history.',
      'Codified reversible delivery rituals combining technical excellence with safety-first leadership.',
      'Bridged legal, nonprofit, and technical partners through conscious network facilitation.'
    ]
  },
  {
    organization: 'Executive Director, Houston Oil Airs',
    dates: '2021 — Present',
    bullets: [
      'Built systems to support environmental justice advocacy and community data rituals.',
      'Implemented secure access tiers and rapid-trust onboarding kits for cross-cluster coalitions.',
      'Facilitated policy, legal, and technical dialogues that accelerated resource routing.'
    ]
  },
  {
    organization: 'Lead Trainer, Pappadeaux',
    dates: '2018 — 2020',
    bullets: [
      'Designed training modules and documentation improving team efficiency across shifts.',
      'Maintained safety and hospitality metrics while scaling onboarding programs.',
      'Coached cross-functional peers on process resilience and situational awareness.'
    ]
  },
  {
    organization: 'Operations Lead, Home Depot',
    dates: '2014 — 2016',
    bullets: [
      'Directed warehouse logistics and inventory accuracy during high-volume seasons.',
      'Introduced SOP documentation that reduced picking errors by 15%.',
      'Coordinated safety drills and compliance audits for frontline teams.'
    ]
  }
]

export const roles = experience

export const education = [
  { program: 'Information Technology · Houston Community College', status: 'In progress — expected 2025' },
  { program: 'Cisco · Introduction to Cybersecurity', status: 'Completed' },
  { program: 'CompTIA A+', status: 'In progress' }
]

export const metrics = [
  {
    name: 'Technical centrality',
    value: '85%',
    source: 'Cross-context analysis from technical, architectural, and narrative audits.'
  },
  {
    name: 'Research intensity progression',
    value: '0.7 → 1.0',
    source: 'Quantified from longitudinal practice spanning 2020-2024.'
  },
  {
    name: 'Security posture',
    value: '0 breaches',
    source: 'Documented through drills, audits, and continuous monitoring.'
  }
]

export const aiPillars = [
  {
    category: 'Systems Architect',
    description: 'Design modular, future-proof architectures that survive change without regression.',
    prompts: [
      'translate a chaotic process into a staged pipeline with validation gates',
      'codify a resilience ritual that keeps launch velocity while protecting teams'
    ]
  },
  {
    category: 'Conscious Network Hub',
    description: 'Bridge legal, nonprofit, and technical clusters with trust-rich protocols.',
    prompts: [
      'align cross-disciplinary actors around transparent dashboards',
      'route specialized skill into a coalition within 48 hours'
    ]
  },
  {
    category: 'Mastery & Safety',
    description: 'Deliver excellence with regulated nervous systems and reversible deployment paths.',
    prompts: ['design a drill that proves recovery pathways', 'encode safety signals into CI/CD rituals']
  },
  {
    category: 'Evidence & Vigilance',
    description: 'Ship with rigorous validation, observability, and ethical guardrails.',
    prompts: ['instrument a telemetry wall before release', 'audit data flows for consent and security']
  }
]

export const skillProofs = [
  {
    category: 'Architecture & Systems',
    description: 'Information-to-optimization pipelines with modular checkpoints.',
    proofs: ['multi-phase pipeline blueprints', 'Neon-backed state orchestration', 'scalability scorecards']
  },
  {
    category: 'Security & Ops',
    description: 'MFA discipline, anomaly response, and logged incident retros.',
    proofs: ['pfSense segmentation diagrams', 'SIEM dashboards', 'rollback + recovery playbooks']
  },
  {
    category: 'AI/ML & Analysis',
    description: 'Benchmarking frameworks and agent guardrails for production readiness.',
    proofs: ['agent evaluation matrices', 'latency telemetry analyses', 'ethical review protocols']
  },
  {
    category: 'Influence & Community',
    description: 'Hub-and-spoke orchestration aligning diverse stakeholders.',
    proofs: ['network graph overlays', 'cross-cluster onboarding kits', 'community engagement cadences']
  }
]
