'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

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
  const normalizedTopics = useMemo(() => topics ?? [], [topics])
  const topicIds = useMemo(() => normalizedTopics.map(topic => topic.id), [normalizedTopics])
  const defaultTopicId = topicIds[0] ?? ''
  const [activeId, setActiveId] = useState<string>(defaultTopicId)
  useEffect(() => {
    if (!topicIds.includes(activeId)) {
      setActiveId(defaultTopicId)
    }
  }, [activeId, defaultTopicId, topicIds])
  const active = normalizedTopics.find(topic => topic.id === activeId) ?? normalizedTopics[0]
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const focusTab = useCallback((id: string) => {
    setActiveId(id)
    const ref = buttonRefs.current[id]
    if (ref) {
      ref.focus()
    }
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const { key } = event
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return
      event.preventDefault()

      if (key === 'Home') {
        focusTab(topicIds[0])
        return
      }

      if (key === 'End') {
        focusTab(topicIds[topicIds.length - 1])
        return
      }

      const delta = key === 'ArrowLeft' ? -1 : 1
      let nextIndex = (index + delta + topicIds.length) % topicIds.length
      focusTab(topicIds[nextIndex])
    },
    [focusTab, topicIds]
  )

  if (!active) {
    return null
  }

  return (
    <div className="topic-showcase">
      <div className="topic-tabs" role="tablist" aria-label="Topic filters">
        {normalizedTopics.map((topic, index) => {
          const isActive = activeId === topic.id
          return (
          <button
            key={topic.id}
            type="button"
            role="tab"
            id={`topic-tab-${topic.id}`}
            aria-selected={isActive}
            aria-controls={`topic-panel-${topic.id}`}
            tabIndex={isActive ? 0 : -1}
            ref={element => {
              buttonRefs.current[topic.id] = element
            }}
            onClick={() => setActiveId(topic.id)}
            onKeyDown={event => handleKeyDown(event, index)}
            className={`topic-tab ${isActive ? 'topic-tab--active' : ''}`}
          >
            {topic.label}
          </button>
          )
        })}
      </div>

      <div
        className="topic-panel"
        role="tabpanel"
        id={`topic-panel-${active.id}`}
        aria-labelledby={`topic-tab-${active.id}`}
        tabIndex={0}
      >
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
