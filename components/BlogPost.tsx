'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DOMPurify from 'dompurify'

gsap.registerPlugin(ScrollTrigger)

interface BlogPostProps {
  title: string
  content: string
  readTime: number
}

export default function BlogPost({ title, content, readTime }: BlogPostProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scroll-triggered animations for paragraphs
    const paragraphs = containerRef.current.querySelectorAll('p')
    
    paragraphs.forEach((p, index) => {
      gsap.fromTo(p, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: p,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )
    })

    // Reading progress indicator
    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }, [])

  return (
    <article ref={containerRef} className="blog-post">
      <div 
        ref={progressRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: 'linear-gradient(90deg, #00f5ff, #ff00ff)',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          zIndex: 1000
        }}
      />
      
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #00f5ff, #ff00ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {title}
        </h1>
        <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>
          {readTime} min read
        </div>
      </header>

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: 1.8,
          fontSize: '1.1rem'
        }}
        dangerouslySetInnerHTML={{
          // Sanitize HTML content from Sanity CMS to prevent XSS
          __html: typeof window !== 'undefined'
            ? DOMPurify.sanitize(content, {
                ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote'],
                ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
              })
            : content // Server-side: trust Sanity CMS content
        }}
      />
    </article>
  )
}
