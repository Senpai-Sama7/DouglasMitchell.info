'use client'

import { useState } from 'react'

type Topic = {
  id: string
  label: string
  summary: string
  highlights: string[]
}

type TopicShowcaseProps = {
  topics: Topic[]
}

export default function TopicShowcase({ topics }: TopicShowcaseProps) {
  const [activeId, setActiveId] = useState<string>(topics[0]?.id ?? '')
  const active = topics.find(topic => topic.id === activeId) ?? topics[0]

  if (!active) {
    return null
  }

  return (
    <div className="topic-showcase">
      <div className="topic-tabs" role="tablist" aria-label="Topic filters">
        {topics.map(topic => (
          <button
            key={topic.id}
            type="button"
            role="tab"
            aria-selected={activeId === topic.id}
            onClick={() => setActiveId(topic.id)}
            className={`topic-tab ${activeId === topic.id ? 'topic-tab--active' : ''}`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      <div className="topic-panel" role="tabpanel">
        <p className="topic-panel__label">{active.label}</p>
        <p className="topic-panel__summary">{active.summary}</p>
        <ul className="topic-panel__grid">
          {active.highlights.map(item => (
            <li key={item} className="topic-panel__item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
