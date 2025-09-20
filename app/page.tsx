import Link from 'next/link'
import TopicShowcase from '@/components/TopicShowcase'
import SignalController from '@/components/SignalController'
import {
  heroContent,
  dispatches,
  bentoGridItems,
  showcaseTopics,
  mediaReleases,
  faqEntries,
  aboutCopy,
  contactChannels
} from '@/content/site-data'

export default function Page() {
  return (
    <main>
      <HeroSection />
      <DispatchSection />
      <GridSection />
      <TopicsSection />
      <MediaSection />
      <AboutSection />
      <FaqSection />
      <SubscribeSection />
    </main>
  )
}

function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="container hero__grid">
        <header className="hero__copy">
          <p className="hero__eyebrow">{heroContent.initializationLabel}</p>
          <div className="hero__status" aria-hidden>
            <span>{heroContent.initializationValue}</span>
            <span>complete</span>
          </div>
          <h1>{heroContent.title}</h1>
          <p className="hero__subtitle">{heroContent.subtitle}</p>
          <p className="hero__description">{heroContent.description}</p>
          <div className="hero__actions">
            <Link href={heroContent.primaryCta.href} className="button button--primary">
              {heroContent.primaryCta.label}
            </Link>
            <Link href={heroContent.secondaryCta.href} className="button">
              {heroContent.secondaryCta.label}
            </Link>
          </div>
        </header>
        <aside className="hero__meta" aria-label="Featured dispatch highlight">
          <div className="hero__meta-card">
            <p className="hero__meta-label">Dispatch console</p>
            <p className="hero__meta-text">Personal atlas documenting logistics futures through essays, prototypes, and audio.</p>
            <p className="hero__meta-footnote">Hover over cards below to reveal contextual signals.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function DispatchSection() {
  return (
    <section id="dispatches" className="section">
      <div className="container section__header">
        <div>
          <p className="section__eyebrow">Latest dispatches</p>
          <h2 className="section__title">Multi-format releases curated by Douglas Mitchell</h2>
        </div>
        <p className="section__description">
          Each entry blends logistics research with tactile storytelling — essays, audio logs, and interface studies that trace the
          Halcyon network.
        </p>
      </div>
      <div className="container dispatch-grid">
        {dispatches.map(dispatch => (
          <article key={dispatch.id} className="dispatch-card">
            <header>
              <p className="dispatch-card__format">{dispatch.format}</p>
              <h3>{dispatch.title}</h3>
            </header>
            <p className="dispatch-card__summary">{dispatch.summary}</p>
            <ul className="dispatch-card__tags">
              {dispatch.tags.map(tag => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <Link href={dispatch.href} className="dispatch-card__link">
              Open dispatch
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

function GridSection() {
  return (
    <section id="grid" className="section">
      <div className="container section__header">
        <div>
          <p className="section__eyebrow">Bento grid</p>
          <h2 className="section__title">Brand assets & interface elements assembled in harmony</h2>
        </div>
        <p className="section__description">
          Inspired by Halcyon Logistics branding, each tile holds a fragment — typography samples, device mockups, and soft alerts aligned
          for rapid comprehension.
        </p>
      </div>
      <div className="container bento-grid">
        {bentoGridItems.map(item => (
          <article key={item.id} className={`bento-grid__item bento-grid__item--${item.size}`}>
            <p className="bento-grid__eyebrow">{item.eyebrow}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function TopicsSection() {
  return (
    <section id="topics" className="section">
      <div className="container topics-section">
        <div className="topics-section__copy">
          <p className="section__eyebrow">Topics</p>
          <h2 className="section__title">Rotate between systems, UI, and media focus</h2>
          <p className="section__description">
            Toggle the showcase to surface different strands of the blog — everything is designed to feel intentional and calm, even when the
            subject matter spans complex logistics.
          </p>
        </div>
        <TopicShowcase topics={showcaseTopics} />
        <SignalController />
      </div>
    </section>
  )
}

function MediaSection() {
  return (
    <section id="media" className="section">
      <div className="container section__header">
        <div>
          <p className="section__eyebrow">Media bay</p>
          <h2 className="section__title">Different channels, one narrative</h2>
        </div>
        <p className="section__description">
          Video, audio, and photography flow through the same calm interface language. Future integrations will stream live via Mux and swap in
          seconds using the modular deck.
        </p>
      </div>
      <div className="container media-grid">
        {mediaReleases.map(media => (
          <article key={media.id} className="media-card">
            <p className="media-card__type">{media.type}</p>
            <h3>{media.title}</h3>
            <p>{media.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container about-panel">
        <div className="about-panel__copy">
          <p className="section__eyebrow">About</p>
          <h2 className="section__title">{aboutCopy.headline}</h2>
          <p className="section__description">{aboutCopy.body}</p>
        </div>
        <div className="about-panel__details">
          <p className="about-panel__note">Philosophy</p>
          <ul>
            <li>Calm is a design principle.</li>
            <li>Evidence beats hype.</li>
            <li>Community is the operating system.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section id="faq" className="section">
      <div className="container section__header">
        <div>
          <p className="section__eyebrow">FAQ</p>
          <h2 className="section__title">Common questions about the dispatch</h2>
        </div>
        <p className="section__description">
          Transparent, welcoming, and clear. Each response keeps the Halcyon ethos grounded in care and rigor.
        </p>
      </div>
      <div className="container faq-list">
        {faqEntries.map(entry => (
          <details key={entry.question} className="faq-item">
            <summary>{entry.question}</summary>
            <p>{entry.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function SubscribeSection() {
  return (
    <section id="contact" className="section section--subscribe">
      <div className="container subscribe-panel">
        <div>
          <p className="section__eyebrow">Subscribe</p>
          <h2 className="section__title">Join the manifest</h2>
          <p className="section__description">
            Receive dispatch alerts, behind-the-scenes prototypes, and invitations to collaborative logistics sessions.
          </p>
        </div>
        <form className="subscribe-form" action="/api/subscribe" method="post">
          <label htmlFor="email" className="subscribe-form__label">
            Email address
          </label>
          <input id="email" type="email" name="email" placeholder="you@example.com" required />
          <button type="submit" className="button button--primary">
            Join manifest
          </button>
        </form>
      </div>
    </section>
  )
}
