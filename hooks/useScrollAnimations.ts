'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createMotionSafeScrollTrigger, prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationOptions {
  parallaxElements?: boolean
  sectionAnimations?: boolean
  onAnimationComplete?: () => void
}

export function useScrollAnimations({
  parallaxElements = true,
  sectionAnimations = true,
  onAnimationComplete
}: ScrollAnimationOptions = {}) {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = prefersReducedMotion()
    
    const ctx = gsap.context(() => {
      // Section animations
      if (sectionAnimations) {
        gsap.utils.toArray<HTMLElement>('.axiom-section').forEach(section => {
          const inner = section.querySelector('.axiom-section__inner')
          if (!inner) return

          const triggerConfig = createMotionSafeScrollTrigger(
            {
              trigger: section,
              start: 'top 72%',
              toggleActions: 'play none none reverse'
            },
            {}
          )

          if (!triggerConfig) {
            gsap.set(inner, { opacity: 1, y: 0 })
            return
          }

          gsap.fromTo(
            inner,
            { opacity: 0, y: 56 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
              scrollTrigger: triggerConfig
            }
          )
        })
      }

      // Parallax effects
      if (parallaxElements && !reduceMotion) {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(layer => {
          const speed = Number(layer.dataset.parallax) || 0.1
          gsap.to(layer, {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: layer,
              scrub: true
            }
          })
        })
      } else if (parallaxElements) {
        gsap.set('[data-parallax]', { yPercent: 0 })
      }

      onAnimationComplete?.()
    }, containerRef)

    // Intersection Observer for section visibility
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting)
        })
      },
      { threshold: 0.7 }
    )

    containerRef.current?.querySelectorAll('.axiom-section').forEach(section => 
      observer.observe(section)
    )

    return () => {
      ctx.revert()
      observer.disconnect()
    }
  }, [parallaxElements, sectionAnimations, onAnimationComplete])

  return containerRef
}