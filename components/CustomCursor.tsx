'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const cursor = cursorRef.current
    if (!cursor) return

    const handleMove = (event: MouseEvent) => {
      const x = event.clientX
      const y = event.clientY
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const interactiveSelector = 'a, button, .axiom-project-card, [role="button"]'
    const handleEnter = () => cursor.classList.add('is-active')
    const handleLeave = () => cursor.classList.remove('is-active')

    window.addEventListener('mousemove', handleMove)

    const interactiveElements = Array.from(document.querySelectorAll(interactiveSelector))
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleEnter)
      element.addEventListener('mouseleave', handleLeave)
    })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleEnter)
        element.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor" aria-hidden />
}
