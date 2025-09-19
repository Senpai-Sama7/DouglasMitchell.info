import Link from 'next/link'
import {
  heroContent,
  bios,
  values,
  skillsTaxonomy,
  toolkit,
  projects,
  roles,
  education,
  writingCategories,
  communityHighlights,
  labStreams,
  contactChannels,
  watcherReflection,
  llmBundle,
  deckSlots
} from '@/content/site-data'
import { KpiCounters } from '@/components/KpiCounters'
import { SectionHeading } from '@/components/SectionHeading'
import { ProjectCard } from '@/components/ProjectCard'
import { GitHubFeed } from '@/components/GitHubFeed'
import { AIProjectIdeator } from '@/components/AIProjectIdeator'

const skillEntries = Object.values(skillsTaxonomy)

export default function Page() {
  return (
    <main>
      {deckSlots.map(slot => {
        switch (slot) {
          case 'hero':
            return <HeroSection key={slot} />
          case 'kpi-strip':
            return <KpiSection key={slot} />
          case 'about':
            return <AboutSection key={slot} />
          case 'skills':
            return <SkillsSection key={slot} />
          case 'projects-featured':
            return <ProjectsSection key={slot} />
          case 'writing':
            return <WritingSection key={slot} />
          case 'toolkit':
            return <ToolkitSection key={slot} />
          case 'github-feed':
            return <GitHubSection key={slot} />
          case 'ai-ideator':
            return <IdeatorSection key={slot} />
          case 'lab':
            return <LabSection key={slot} />
          case 'community':
            return <CommunitySection key={slot} />
          case 'watcher':
            return <WatcherSection key={slot} />
          case 'contact':
            return <ContactSection key={slot} />
          default:
            return null
        }
      })}
    </main>
  )
}

function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div>
          <h1>{heroContent.headline}</h1>
          <p className="hero-subtext">{heroContent.subheadline}</p>
          <div className="hero-actions">
            <Link href={heroContent.primaryCta.href} className="button button-primary">
              {heroContent.primaryCta.label}
            </Link>
            <Link href={heroContent.secondaryCta.href} className="button">
              {heroContent.secondaryCta.label}
            </Link>
          </div>
        </div>
        <aside className="quote-card" aria-label="Elevator pitch">
          <p>
            “A Conscious Network Hub and systems architect with 85% technical centrality, building production-ready solutions and
            codifying them so others can execute without dependency.”
          </p>
          <Link href="#projects" className="project-link">
            Read architecture, validation paths, and operating outcomes
          </Link>
        </aside>
      </div>
    </section>
  )
}

function KpiSection() {
  return (
    <section aria-labelledby="kpi-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Quality-first metrics"
          title="Evidence-backed delivery footprint"
          description="Initial values seeded from current portfolio telemetry. Wired for truth data as analytics integrations activate."
        />
        <KpiCounters stats={heroContent.stats} />
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading">
      <div className="container">
        <SectionHeading
          eyebrow="About"
          title="Systems Architect & Conscious Network Hub"
          description={bios.short}
        />
        <div className="metrics-grid">
          <article className="value-card">
            <h3>Medium bio</h3>
            <p>{bios.medium}</p>
          </article>
          <article className="value-card">
            <h3>Long-form narrative</h3>
            <p>{bios.long}</p>
          </article>
        </div>
        <div className="values-grid" aria-label="Core values">
          {values.map(value => (
            <div key={value} className="value-card">
              <h3>{value}</h3>
              <p className="muted">Operationalized through architecture reviews, documentation, and community practices.</p>
            </div>
          ))}
        </div>
        <div className="metrics-grid" aria-label="Experience timeline">
          <article className="value-card">
            <h3>Experience</h3>
            <ul className="community-list">
              {roles.map(role => (
                <li key={role.organization}>
                  <strong>{role.organization}</strong> · {role.dates}
                  <ul className="bridge-list">
                    {role.bullets.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </article>
          <article className="value-card">
            <h3>Education & Training</h3>
            <ul className="community-list">
              {education.map(entry => (
                <li key={entry.program}>
                  <strong>{entry.program}</strong>
                  <div className="muted">{entry.status}</div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Skills taxonomy"
          title="Quality-first capabilities with cross-contextual consistency"
          description="Architecture, AI, security, community influence, and documentation protocols—sequenced to move from sensing to validation to resilient delivery."
        />
        <div className="skills-grid">
          {skillEntries.map(skill => (
            <article key={skill.title} className="skill-card">
              <h3>{skill.title}</h3>
              <p className="muted">{skill.description}</p>
              <ul>
                {skill.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Projects"
          title="Featured engagements and outcomes"
          description="Each project ties architecture choices to validation plans and measurable results across AI, multimedia, and security domains."
        />
        <div className="project-grid">
          {projects.map(project => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

function WritingSection() {
  return (
    <section id="writing" aria-labelledby="writing-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Writing"
          title="Strategic research threads"
          description="A taxonomy of essays under development—spanning environmental justice, advanced AI, health optimization, and influence psychology."
        />
        <div className="skills-grid">
          {writingCategories.map(category => (
            <article key={category.category} className="skill-card">
              <h3>{category.category}</h3>
              <p className="muted">{category.description}</p>
              <ul>
                {category.prompts.map(prompt => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolkitSection() {
  return (
    <section id="skills-toolkit" aria-labelledby="toolkit-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Toolkit"
          title="Production-ready stack"
          description="Aligned to consulting services and lab experiments—ready for CMS-driven daily decks, ISR, and Mux-powered media."
          actions={
            <Link href="/api/bundle" className="button">
              Download LLM bundle
            </Link>
          }
        />
        <div className="values-grid" aria-label="Toolkit grid">
          {toolkit.map(item => (
            <div key={item} className="value-card">
              <h3>{item}</h3>
            </div>
          ))}
        </div>
        <aside className="security-ribbon" aria-label="Security ribbon">
          <h3>Security vigilance</h3>
          <p>Multi-factor authentication everywhere. SIEM-backed monitoring. Incident response drills with documented lessons.</p>
          <ul>
            <li>On-demand ISR with signed revalidation endpoints</li>
            <li>Automated dependency and secret scanning</li>
            <li>Red-team rehearsals before major launches</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}

function GitHubSection() {
  return (
    <section id="lab" aria-labelledby="github-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Latest from GitHub"
          title="Active repos & signals"
          description="Live feed pulls recent commits to evidence ongoing work across AI agents, multimedia pipelines, and security labs."
        />
        {/* @ts-expect-error Async Server Component */}
        <GitHubFeed />
      </div>
    </section>
  )
}

function IdeatorSection() {
  return (
    <section id="lab-ideator" aria-labelledby="ai-ideator-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Lab"
          title="AI Project Ideator"
          description="Generate experiments aligned to narrative pillars and skill domains. Fuel daily deck slots with validated, impact-ready ideas."
        />
        <AIProjectIdeator pillars={writingCategories} skills={llmBundle.skills} />
      </div>
    </section>
  )
}

function LabSection() {
  return (
    <section id="lab-streams" aria-labelledby="lab-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Research lab"
          title="Daily deck ready for Sanity + Mux"
          description="Sanity Studio manages Article, Media, Live Event, Game, and Daily Deck content types. On-demand ISR keeps static performance while allowing real-time curation."
        />
        <div className="metrics-grid">
          <article className="lab-card">
            <h3>Research streams</h3>
            <ul className="community-list">
              {labStreams.research.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="lab-card">
            <h3>Security drills</h3>
            <ul className="community-list">
              {labStreams.securityDrills.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

function CommunitySection() {
  return (
    <section id="community" aria-labelledby="community-heading">
      <div className="container community-grid">
        <SectionHeading
          eyebrow="Community"
          title="Houston Oil Airs & network bridges"
          description={communityHighlights.missionStatement}
        />
        <article className="community-card">
          <h3>Bridge stories</h3>
          <ul className="bridge-list">
            {communityHighlights.bridgeStories.map(story => (
              <li key={story.title}>
                <strong>{story.title}</strong>
                <div>{story.summary}</div>
              </li>
            ))}
          </ul>
        </article>
        <article className="community-card">
          <h3>Care signals</h3>
          <ul className="community-list">
            {communityHighlights.careSignals.map(signal => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
          <Link href="#lab" className="project-link">
            See how technical rigor powers environmental justice and collective safety
          </Link>
        </article>
      </div>
    </section>
  )
}

function WatcherSection() {
  return (
    <section id="watcher" aria-labelledby="watcher-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Presence"
          title={watcherReflection.title}
          description={watcherReflection.body}
        />
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Engage"
          title="Route to consulting, collaborations, and community work"
          description="Premium engagements welcome—AI/ML, security, systems architecture, and community infrastructure."
        />
        <div className="metrics-grid">
          <article className="value-card">
            <h3>Consulting & leadership</h3>
            <p>Architect production-ready systems with measured validation. Ideal for AI platform audits, observability upgrades, and resilient service launches.</p>
            <Link href={contactChannels.consulting} className="button button-primary">
              Book a consultation
            </Link>
          </article>
          <article className="value-card">
            <h3>Community coordination</h3>
            <p>Activate Conscious Network Hub protocols across legal, nonprofit, and technical alliances.</p>
            <Link href={contactChannels.linkedin} className="button">
              Coordinate in Houston
            </Link>
          </article>
          <article className="value-card">
            <h3>Direct contact</h3>
            <p>Email for collaboration, writing inquiries, or media requests.</p>
            <Link href={`mailto:${contactChannels.email}`} className="button">
              {contactChannels.email}
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}
