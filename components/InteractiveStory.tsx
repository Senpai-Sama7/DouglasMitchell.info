'use client'

import { useState, useEffect } from 'react'
import { gsap } from 'gsap'

interface StoryNode {
  id: string
  content: string
  choices: { text: string; next: string }[]
}

const storyNodes: Record<string, StoryNode> = {
  start: {
    id: 'start',
    content: "Welcome to my journey. What interests you most?",
    choices: [
      { text: "Technical Projects", next: "tech" },
      { text: "Creative Work", next: "creative" },
      { text: "Professional Experience", next: "experience" }
    ]
  },
  tech: {
    id: 'tech',
    content: "Dive into my technical projects featuring WebGL, AI, and cloud architecture.",
    choices: [
      { text: "View Projects", next: "projects" },
      { text: "See Skills", next: "skills" }
    ]
  },
  creative: {
    id: 'creative',
    content: "Explore my creative side through design, motion, and interactive experiences.",
    choices: [
      { text: "Design Portfolio", next: "design" },
      { text: "Back to Start", next: "start" }
    ]
  }
}

export default function InteractiveStory() {
  const [currentNode, setCurrentNode] = useState('start')
  const [history, setHistory] = useState<string[]>(['start'])

  const handleChoice = (nextNode: string) => {
    gsap.to('.story-content', {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        setCurrentNode(nextNode)
        setHistory(prev => [...prev, nextNode])
        gsap.fromTo('.story-content', 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3 }
        )
      }
    })
  }

  const node = storyNodes[currentNode]

  return (
    <div className="interactive-story" style={{ padding: '2rem', maxWidth: '600px' }}>
      <div className="story-content">
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{node?.content}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {node?.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice.next)}
              style={{
                padding: '1rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
              }}
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
