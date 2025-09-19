import TopicShowcase from '@/components/TopicShowcase'
import SignalController from '@/components/SignalController'

const posts = [
  {
    title: 'Orbital Supply Lines & Human-Centered Navigation',
    type: 'Longform Report',
    summary:
      'Mapping the choreography between automated freighters and the humans who rely on them. Includes field sketches, route models, and resilience heuristics.',
    readingTime: '8 min read',
    tags: ['Systems', 'Operations', 'Story']
  },
  {
    title: 'Designing Calm Control Rooms',
    type: 'Essay',
    summary:
      'Notes from prototyping ambient dashboards that fade between alert levels without overwhelming crews. Features typography studies and color logic.',
    readingTime: '6 min read',
    tags: ['UI/UX', 'Color', 'Accessibility']
  },
  {
    title: 'Dispatch #014 — Frequencies for Focus',
    type: 'Audio Log',
    summary:
      'A 12-minute ambient mix for deep work flights, recorded between waypoint calibrations.',
    readingTime: '12 min listen',
    tags: ['Audio', 'Mood', 'Tools']
  },
  {
    title: 'Field Guide: Responsive Bento Grids',
    type: 'Toolkit',
    summary:
      'Step-by-step patterns for assembling multi-density grids that flex across mission briefs and screen sizes.',
    readingTime: '9 min read',
    tags: ['Layout', 'Design Systems']
  }
]

const quickReleases = [
  {
    label: 'Tactical Brief',
    description: 'How I choreograph logistics forecasts with personal storytelling to keep projects human.',
    action: 'Read the brief'
  },
  {
    label: 'Studio Screens',
    description: 'Device mockups and motion studies fresh from the Halcyon design bay.',
    action: 'View gallery'
  },
  {
    label: 'Dispatch Archive',
    description: 'Every audio mix, zine, and sketch dropped in chronological order.',
    action: 'Open archive'
  }
]

export default function Page() {
  return (
    <main className="relative">
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_55%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-20 px-6 py-16 md:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8 rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-10 backdrop-blur">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Halcyon Logistics
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-cyan-50 md:text-5xl">
              Field notes, prototypes, and transmissions from my personal logistics lab.
            </h1>
            <p className="max-w-2xl text-lg text-slate-200/80">
              I document how supply chains, interface design, and narrative worldbuilding overlap. Expect longform essays, ambient mixes, and interactive experiments shipped on a steady cadence.
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-200">
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Weekly drops
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" /> Essays · Audio · UI kits
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-5 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                href="#posts"
              >
                Browse latest releases
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/20 bg-slate-800/60 px-5 py-3 font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:text-cyan-100"
                href="#subscribe"
              >
                Subscribe for transmissions
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-8 shadow-2xl shadow-violet-500/20">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-200/80">Now playing</h2>
              <p className="mt-4 text-xl font-semibold text-violet-50">Deckhand Session 07 — Drifting Through Docklights</p>
              <p className="mt-2 text-sm text-violet-100/70">
                A layered ambient set mixed to pair with deep-focus writing. Includes tactile foley from cargo bays and synth washes.
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm text-violet-100">
                <button className="rounded-full border border-violet-200/30 bg-violet-500/20 px-4 py-2 transition hover:bg-violet-400/30">
                  ▶︎ Play preview
                </button>
                <button className="rounded-full border border-transparent bg-black/20 px-4 py-2 transition hover:border-violet-200/30">
                  Save to archive
                </button>
              </div>
            </div>
            <div className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">Quick releases</h2>
              <ul className="mt-6 space-y-4">
                {quickReleases.map(item => (
                  <li key={item.label} className="group flex items-start justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-cyan-400/40 hover:bg-cyan-400/10">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100/80">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-200/80">{item.description}</p>
                    </div>
                    <button className="mt-1 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition group-hover:bg-cyan-400/20">
                      {item.action}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-12" id="posts">
          <article className="md:col-span-8 rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">Latest drop</h2>
            <div className="mt-6 flex flex-col gap-6">
              <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/80 to-violet-500/10 p-6">
                <h3 className="text-2xl font-semibold text-cyan-50">{posts[0].title}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100/70">{posts[0].type}</p>
                <p className="mt-4 text-base text-slate-200/80">{posts[0].summary}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/70">
                  <span className="rounded-full border border-cyan-300/40 bg-cyan-500/10 px-3 py-1">{posts[0].readingTime}</span>
                  {posts[0].tags.map(tag => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {posts.slice(1).map(post => (
                  <div key={post.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/40 hover:bg-cyan-500/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-200/70">{post.type}</p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-50">{post.title}</h3>
                    <p className="mt-2 text-sm text-slate-200/75">{post.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300/70">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{post.readingTime}</span>
                      {post.tags.map(tag => (
                        <span key={tag} className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-white/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">Mobile mission deck</h2>
              <p className="mt-2 text-sm text-slate-200/70">
                Tap through prototype navigation flows built for crews in constant motion.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="relative aspect-[9/19] w-40 rounded-[2rem] border border-white/20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3 shadow-2xl">
                  <div className="absolute inset-x-8 top-2 h-1.5 rounded-full bg-white/10" />
                  <div className="mt-6 flex h-full flex-col justify-between rounded-[1.5rem] border border-cyan-400/10 bg-slate-900/80 p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
                        <span>Itinerary</span>
                        <span>02:17</span>
                      </div>
                      <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-transparent p-3 text-[11px] text-cyan-50">
                        Dock 07 → Waypoint HN-4
                      </div>
                      <div className="space-y-2 text-[10px] text-slate-200/70">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-2">Crew status · Green</div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-2">Cargo integrity · 98%</div>
                      </div>
                    </div>
                    <button className="rounded-xl border border-cyan-300/30 bg-cyan-500/20 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-100">
                      Begin route
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6">
              <TopicShowcase />
            </div>
            <div className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6">
              <SignalController />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" id="subscribe">
          <div className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">Transmission log</h2>
            <p className="mt-4 text-lg text-slate-200/80">
              Monthly summaries arrive with behind-the-scenes sketches, logistic frameworks, and a curated soundtrack.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@station.mail"
                className="w-full flex-1 rounded-full border border-white/10 bg-black/40 px-5 py-3 text-sm text-cyan-100 placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-500/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100 transition hover:bg-cyan-400/30"
              >
                Join manifest
              </button>
            </form>
            <p className="mt-3 text-xs text-slate-400/80">
              No spam. Just field-tested insights and prototypes you can adapt for your own missions.
            </p>
          </div>

          <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-slate-900/70 to-cyan-500/10 p-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-100/80">Latest artifacts</h2>
            <div className="mt-6 space-y-5 text-sm text-slate-200/80">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-slate-50">Halcyon Logistics branding set</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Vector kit · Updated weekly</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-slate-50">Interactive Bento grid templates</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Figma + code pack</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-slate-50">Ambient Logistics — Issue 02 zine</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Print ready · Limited run</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-full border border-violet-200/30 bg-black/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-violet-100 transition hover:border-violet-200/50">
              Download asset index
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
