'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const cursor = cursorRef.current
    if (!cursor) return

    const pointerFine = window.matchMedia('(pointer: fine)').matches
    if (!pointerFine || prefersReducedMotion()) {
      cursor.style.display = 'none'
      return
    }

    const handleMove = (event: MouseEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
    }

    const handlePointerEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target) return
      if (target.closest('a,button,[role="button"],.axiom-project-card')) {
        cursor.classList.add('is-active')
      }
    }

    const handlePointerLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target) return
      if (target.closest('a,button,[role="button"],.axiom-project-card')) {
        cursor.classList.remove('is-active')
      }
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handlePointerEnter, true)
    document.addEventListener('mouseout', handlePointerLeave, true)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handlePointerEnter, true)
      document.removeEventListener('mouseout', handlePointerLeave, true)
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor" aria-hidden />
}
