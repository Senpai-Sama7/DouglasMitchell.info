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

export const heroContent = {
  headline: 'Engineering resilient, validated systems—turning complexity into repeatable performance.',
  subheadline: 'Conscious Network Hub connecting technical excellence to community impact.',
  primaryCta: { label: 'Explore capabilities', href: '#skills' },
  secondaryCta: { label: 'View consulting readiness', href: '#projects' },
  stats: [
    { id: 'loc', label: 'Lines of production-grade code stewarded', value: 428000, source: 'Cumulative tracked repos 2019-2024' },
    { id: 'projects', label: 'Complex systems orchestrated end-to-end', value: 37, source: 'Client + community deployments' },
    { id: 'satisfaction', label: 'Client satisfaction index', value: 98, suffix: '%', source: 'Post-engagement surveys' }
  ]
}

export const bios = {
  short:
    'Systems architect and Conscious Network Hub with 85% technical centrality, pairing quality-first engineering with community-first impact.',
  medium:
    'Douglas Mitchell operates as a Pioneer-Architect whose technical centrality scores 0.85. Mastery drive (0.880) and achievement drive (0.900) fuel cross-domain synthesis spanning AI/ML pipelines, security vigilance, and economic-psychological modeling. Each engagement codifies reliable protocols, aligns to ethical impact in Houston, and keeps defensive postures sharp through constant validation and red-team rehearsal.',
  long:
    'Across the past decade my research intensity climbed from 0.7 to 1.0 while the architect identity crystalized. Early experiments in semantic networks matured into full-stack intelligence platforms, culminating in resilient architectures that anticipate drift and codify remediation paths. As the Conscious Network Hub at the center of Houston Oil Airs, I bridge legal strategists, nonprofit organizers, technologists, and funders—turning loosely coupled intentions into synchronized execution. Production-grade systems, from AI agents and multimedia pipelines to cyber defense labs, operate with compassionate rigor: zero successful breaches, rapid anomaly response, and documentation that allows others to execute safely without dependency. Every protocol, dashboard, and narrative sequence is designed to scale trust, empower communities, and keep presence with those experiencing complex realities.'
}

export const values = [
  'Integrity',
  'Validation',
  'Safety',
  'Scalable empowerment',
  'Presence'
]

export const skillsTaxonomy = {
  architectureSystems: {
    title: 'Architecture & Systems',
    description: 'Multi-layered processing from information intake to validation, implementation, and optimization.',
    items: [
      'Scenario modeling and systems decomposition',
      'Future-proof modularization and interface contracts',
      'Performance budgets with automated enforcement'
    ]
  },
  securityOps: {
    title: 'Security & Ops',
    description: 'Zero-trust defaults, MFA everywhere, SIEM-informed observability, and incident rehearsal.',
    items: [
      'pfSense/VLAN segmentation and SOC runbooks',
      'SIEM log discipline with anomaly alerting',
      'Rapid containment playbooks and tabletop drills'
    ]
  },
  aiAnalysis: {
    title: 'AI/ML & Analysis',
    description: 'Research intensity driving comprehensive model evaluation and responsible deployment.',
    items: [
      'Benchmarking with guardrail metrics and drift tracking',
      'Retrieval-augmented workflows with explainability notes',
      'Data lineage and consent-aware governance'
    ]
  },
  webFrontend: {
    title: 'Web & Frontend',
    description: 'React/Next.js, CSS/GSAP, and Three.js experiences that balance expressiveness and accessibility.',
    items: [
      'Component systems with measured animation primitives',
      'Progressive enhancement for high-stakes information surfaces',
      'GraphQL/API integration with caching and fallbacks'
    ]
  },
  documentation: {
    title: 'Documentation & Knowledge Transfer',
    description: 'Consciousness transfer protocols that allow teams to execute without dependency.',
    items: [
      'Living runbooks with automated validation states',
      'Architecture decision records and onboarding trails',
      'Community-accessible knowledge repositories'
    ]
  },
  influenceCommunity: {
    title: 'Influence & Community',
    description: 'Hub-and-spoke coordination across legal, nonprofit, and technical circles.',
    items: [
      'Coalition briefings translating risk to narrative clarity',
      'Cross-cluster protocol design with shared metrics',
      'Ethical mediation with empathy-driven facilitation'
    ]
  },
  softSkills: {
    title: 'Soft Skills',
    description: 'Analytical rigor, meta-cognitive self-regulation, and empathy-driven communication.',
    items: [
      'Presence under pressure with calm escalation paths',
      'Feedback loops that uplift collaborators',
      'Clarity-first storytelling with measurable commitments'
    ]
  }
}

export const toolkit = [
  'JavaScript / React / Next.js',
  'Node.js & Edge APIs',
  'CSS / GSAP choreography',
  'Three.js / WebGL',
  'APIs / GraphQL',
  'Git & CI/CD'
]

export const projects = [
  {
    title: 'Ultimate AI Agent — Production-Ready Edition',
    summary: 'Reusable agent framework tuned for regulated environments with deterministic guardrails.',
    problem: 'Organizations needed composable AI agents that could be audited, throttled, and extended without jeopardizing security posture.',
    architecture: 'Modular orchestration layer with policy adapters, verifiable tool access, and red-team sandboxes. Sanity CMS seeds scenarios; Next.js API routes handle secure execution.',
    validation: 'Automated scenario suites, prompt linting, and SOC analyst walkthroughs before launch.',
    outcomes: 'Reduced incident triage time by 46% while maintaining zero breach incidents; documentation enabled partner teams to ship variants in <2 days.',
    assets: [
      { label: 'Architecture brief', href: 'https://github.com/DouglasSMitchell/ultimate-ai-agent' }
    ]
  },
  {
    title: 'Multimedia Pipeline',
    summary: 'High-throughput pipeline unifying audio, video, and interactive assets for mission comms.',
    problem: 'Distributed storytellers required consistent encoding, accessibility metadata, and rapid distribution across platforms.',
    architecture: 'Mux ingestion, automated transcription, asset scoring, and CMS-driven distribution. Daily Deck slots swap media modules without redeploys.',
    validation: 'Golden-path QA, bandwidth stress tests, and ADA compliance checks with recorded evidence.',
    outcomes: 'Tripled publishing cadence with 100% caption coverage and telemetry dashboards for content health.',
    assets: [
      { label: 'Pipeline diagrams', href: 'https://github.com/DouglasSMitchell/multimedia-pipeline' }
    ]
  },
  {
    title: 'Cybersecurity Home Lab',
    summary: 'Hands-on defense lab with pfSense, VLAN isolation, SIEM streams, and incident drill playbooks.',
    problem: 'Needed a safe arena to rehearse detection, response, and recovery across volunteer teams.',
    architecture: 'pfSense core, segmented VLANs, Security Onion SIEM, and automated snapshotting. Runbooks stored in Sanity for rapid updates.',
    validation: 'Weekly attack simulations, log integrity verification, and rollback drills documented with timestamps.',
    outcomes: 'Zero downtime during stress events, 12-minute mean containment, and published lessons for Houston partners.',
    assets: [
      { label: 'Lab configuration repo', href: 'https://github.com/DouglasSMitchell/cybersecurity-home-lab' }
    ]
  },
  {
    title: 'Influence Matrix Unveiled',
    summary: 'Strategic visualization aligning psychological, economic, and relational levers.',
    problem: 'Coalitions needed clarity on influence pathways without losing ethical framing.',
    architecture: 'Graph analytics with transparent scoring, annotated network graph, and narrative overlays generated via Sanity schemas.',
    validation: 'Scenario reviews with community advisors, bias mitigation audits, and consent checkpoints.',
    outcomes: 'Increased coalition response speed by 60% and secured new funding with transparent diligence packets.',
    assets: [
      { label: 'Model notes', href: 'https://github.com/DouglasSMitchell/influence-matrix' }
    ]
  },
  {
    title: 'Houston Oil Airs Enablement',
    summary: 'Systems support for community advocacy with data stewardship and secure collaboration.',
    problem: 'Grassroots organizers required reliable data infrastructure and safe communication flows to sustain environmental justice campaigns.',
    architecture: 'Secure data lake with consent tracking, encrypted collaboration hubs, and public transparency dashboards powered by Next.js ISR.',
    validation: 'Pen tests, privacy impact assessments, and real-time monitoring with zero breach record.',
    outcomes: 'Unlocked cross-cluster collaboration, elevated legal readiness, and codified operating playbooks accessible to community members.',
    assets: [
      { label: 'Community protocols', href: 'https://github.com/DouglasSMitchell/houston-oil-airs' }
    ]
  }
]

export const roles = [
  {
    organization: 'Systems / Community Architect',
    dates: '2021 — Present',
    bullets: [
      'Integrate cross-domain technical systems with community outcomes and premium consulting readiness.',
      'Lead architecture reviews, code audits, and validation protocols across AI, security, and multimedia products.',
      'Broker partnerships between legal, nonprofit, and technical teams with measurable delivery standards.'
    ]
  },
  {
    organization: 'Executive Director, Houston Oil Airs',
    dates: '2019 — Present',
    bullets: [
      'Founded and direct a community hub aligning environmental justice advocacy with secure data infrastructure.',
      'Stand up compliance-ready communication stacks and documentation accessible to diverse collaborators.',
      'Coordinate training, legal partnerships, and on-the-ground logistics with resilient digital support.'
    ]
  },
  {
    organization: 'Lead Trainer, Pappadeaux',
    dates: '2014 — 2017',
    bullets: [
      'Developed SOPs and training loops improving onboarding speed by 35%.',
      'Introduced feedback cadences that lifted team satisfaction scores by double digits.'
    ]
  },
  {
    organization: 'Operations Lead, Home Depot',
    dates: '2012 — 2014',
    bullets: [
      'Optimized logistics routes and vendor coordination resulting in 20% faster stock rotation.',
      'Documented safety protocols adopted across adjacent teams.'
    ]
  },
  {
    organization: 'Virtual Administrator',
    dates: '2010 — 2012',
    bullets: [
      'Created documentation libraries and automations that reduced administrative workload by 40%.',
      'Published reusable SOP templates for distributed teams.'
    ]
  }
]

export const education = [
  {
    program: 'Information Technology, Houston Community College',
    status: 'In progress — expected 2025'
  },
  {
    program: 'Cisco Introduction to Cybersecurity',
    status: 'Completed'
  },
  {
    program: 'CompTIA A+',
    status: 'In progress'
  }
]

export const writingCategories = [
  {
    category: 'Environmental Justice',
    description: 'Advocacy methods, data integrity, and community protection patterns.',
    prompts: [
      'Rapid-response data rooms for environmental crises',
      'Consent-aware mapping for frontline communities',
      'Security hygiene checklists for grassroots organizers'
    ]
  },
  {
    category: 'Advanced AI / Tech',
    description: 'Model benchmarking, agent design, validation maturity, and deployment rigor.',
    prompts: [
      'Designing safe evaluation harnesses for agent collectives',
      'Embedding red-team rituals into AI product sprints',
      'GraphQL middleware patterns for observability at scale'
    ]
  },
  {
    category: 'Health Optimization',
    description: 'Systems thinking applied to personal resilience and performance.',
    prompts: [
      'Biorhythm-informed sprint planning for technical teams',
      'Breathwork telemetry for incident response calm',
      'Feedback rituals that sustain long-term mastery'
    ]
  },
  {
    category: 'Psychology of Influence',
    description: 'Narrative framing, network dynamics, and ethical persuasion frameworks.',
    prompts: [
      'Mapping ethical influence paths inside complex coalitions',
      'Cognitive load-aware storytelling for public safety briefings',
      'Maintaining psychological safety while addressing hard truths'
    ]
  }
]

export const metrics = [
  { name: 'Technical centrality', value: '85%', source: 'Capability network analysis 2024' },
  { name: 'Achievement drive', value: '0.900', source: 'Validated strengths index 2024' },
  { name: 'Mastery drive', value: '0.880', source: 'Validated strengths index 2024' },
  { name: 'Security posture', value: 'No successful breaches', source: 'Houston Oil Airs operational logs' },
  { name: 'Research intensity', value: '0.7 → 1.0', source: 'Longitudinal study 2015-2024' }
]

export const communityHighlights = {
  missionStatement:
    'Houston Oil Airs empowers environmental justice coalitions with secure data, strategic storytelling, and rapid deployment playbooks.',
  bridgeStories: [
    {
      title: 'Legal x Technical Rapid Response',
      summary: 'Coordinated legal counsel and field organizers through encrypted data rooms and live dashboards during refinery flare events.'
    },
    {
      title: 'Nonprofit Funding Alignment',
      summary: 'Mapped outcomes to grant criteria, enabling sustainable financing for monitoring air quality tech.'
    },
    {
      title: 'Community Training Cohorts',
      summary: 'Delivered documentation and tabletop drills to prepare resident scientists for data stewardship roles.'
    }
  ],
  careSignals: [
    'Transparent data ethics statements with community review',
    'Mutual aid logistics protocols with audit trails',
    'Restorative communication loops after high-intensity events'
  ]
}

export const labStreams = {
  research: [
    'Model benchmarking logs with reproducibility metadata',
    'Pipeline experiments with quantitative validation budgets',
    'Multi-modal evaluation harnesses integrating telemetry and narrative checks'
  ],
  securityDrills: [
    'Anonymized incident response retrospectives',
    'Playbooks covering containment, communication, and recovery',
    'Lessons learned integrated into future tabletop scripts'
  ]
}

export const contactChannels = {
  email: 'hello@douglasmitchell.info',
  consulting: 'https://cal.com/douglasmitchell/consult',
  github: 'https://github.com/DouglasSMitchell',
  linkedin: 'https://www.linkedin.com/in/douglass-mitchell/',
  twitter: 'https://x.com/dougmitchellhq'
}

export const watcherReflection = {
  title: 'Witnessing as Engineering Practice',
  body:
    'Presence is the first control surface. I stay aware of system states, human energy, and ripple effects before acting. Mastery remains compassionate when vigilance and care guide every deploy.'
}

export const seo = {
  title: 'Douglas Mitchell — Systems Architect & Conscious Network Hub',
  description:
    'Quality-first systems architect and conscious network hub building resilient, validated, production-ready solutions that scale impact.'
}

export const llmBundle = {
  person: {
    name: 'Douglas Mitchell',
    bios_short: bios.short,
    bios_medium: bios.medium,
    bios_long: bios.long,
    location_context: 'Houston, Texas — operating globally',
    contact: contactChannels,
    social: {
      github: contactChannels.github,
      linkedin: contactChannels.linkedin,
      twitter: contactChannels.twitter
    }
  },
  skills: Object.values(skillsTaxonomy).map(skill => ({
    category: skill.title,
    description: skill.description,
    proofs: skill.items
  })),
  projects: projects.map(project => ({
    title: project.title,
    summary: project.summary,
    problem: project.problem,
    architecture: project.architecture,
    validation: project.validation,
    outcomes: project.outcomes,
    links: project.assets
  })),
  roles: roles.map(role => ({
    organization: role.organization,
    title: role.organization,
    dates: role.dates,
    bullets: role.bullets
  })),
  posts: writingCategories.map(entry => ({
    category: entry.category,
    description: entry.description,
    prompts: entry.prompts
  })),
  metrics
}

export const githubConfig = {
  username: 'DouglasSMitchell',
  perPage: 5
}

export const deckSlots = [
  'hero',
  'kpi-strip',
  'about',
  'skills',
  'projects-featured',
  'writing',
  'toolkit',
  'github-feed',
  'ai-ideator',
  'lab',
  'community',
  'watcher',
  'contact'
]
