'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface BentoItem {
  id: string
  title: string
  description: string
  size: 'small' | 'medium' | 'large'
  type: 'project' | 'skill' | 'metric'
}

interface BentoGridProps {
  items: BentoItem[]
}

export default function BentoGrid({ items }: BentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const cards = gridRef.current.querySelectorAll('.bento-card')
    
    gsap.fromTo(cards, 
      { opacity: 0, y: 30, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }
    )
  }, [])

  return (
    <div 
      ref={gridRef}
      className="bento-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        gridAutoRows: '200px'
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`bento-card bento-${item.size}`}
          style={{
            gridRowEnd: item.size === 'large' ? 'span 2' : 
                       item.size === 'medium' ? 'span 1' : 'span 1',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{item.title}</h3>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>{item.description}</p>
        </div>
      ))}
    </div>
  )
}
