'use client'

import { useState } from 'react'

type Topic = {
  id: string
  label: string
  summary: string
  highlights: string[]
}

const topics: Topic[] = [
  {
    id: 'field-ops',
    label: 'Field Operations',
    summary:
      'Behind-the-scenes walkthroughs from live logistics experiments — from real-time rerouting to designing resilient handoff rituals.',
    highlights: ['Live case studies', 'Service blueprints', 'Operator interviews'],
  },
  {
    id: 'design-systems',
    label: 'Design Systems',
    summary:
      'Reusable bento grids, typography matrices, and calm interface palettes engineered to keep high-stakes teams aligned.',
    highlights: ['Bento grid templates', 'Color automation', 'Figma kits + code'],
  },
  {
    id: 'immersive-media',
    label: 'Immersive Media',
    summary:
      'Audio dispatches, narrative essays, and visual zines that translate technical logistics into tangible human stories.',
    highlights: ['Audio mixes', 'Narrative essays', 'Limited-run zines'],
  },
]

export default function TopicShowcase() {
  const [activeId, setActiveId] = useState<string>(topics[0].id)
  const active = topics.find(topic => topic.id === activeId) ?? topics[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {topics.map(topic => (
          <button
            key={topic.id}
            type="button"
            onClick={() => setActiveId(topic.id)}
            aria-pressed={activeId === topic.id}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition focus:outline-none focus:ring-2 focus:ring-cyan-300/60 ${
              activeId === topic.id
                ? 'border-cyan-300/60 bg-cyan-500/20 text-cyan-100'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100'
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5 text-sm text-cyan-100">
        <p className="text-base font-semibold text-cyan-50">{active.label}</p>
        <p className="text-sm text-cyan-100/80">{active.summary}</p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {active.highlights.map(item => (
            <li key={item} className="rounded-2xl border border-cyan-300/30 bg-black/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
