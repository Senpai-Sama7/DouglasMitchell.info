/**
 * Motion accessibility utilities for respecting user preferences
 * Implements WCAG 2.1 AA prefers-reduced-motion guidelines
 */

export interface MotionConfig {
  respectReducedMotion: boolean
  fallbackToCSS: boolean
  logMotionState: boolean
}

const defaultConfig: MotionConfig = {
  respectReducedMotion: true,
  fallbackToCSS: true,
  logMotionState: false
}

/**
 * Check if user prefers reduced motion
 * Returns true if motion should be reduced/disabled
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mediaQuery.matches
}

/**
 * Get motion configuration based on user preferences
 */
export function getMotionConfig(overrides: Partial<MotionConfig> = {}): MotionConfig {
  return { ...defaultConfig, ...overrides }
}

/**
 * Create motion-aware GSAP animation settings
 * Returns modified settings that respect user motion preferences
 */
export function createMotionSafeGSAP(
  normalSettings: gsap.TweenVars,
  reducedSettings: Partial<gsap.TweenVars> = {},
  config: Partial<MotionConfig> = {}
): gsap.TweenVars {
  const motionConfig = getMotionConfig(config)

  if (!motionConfig.respectReducedMotion || !prefersReducedMotion()) {
    return normalSettings
  }

  // For reduced motion, provide instant or minimal animation
  const reducedMotionDefaults: gsap.TweenVars = {
    duration: 0.01, // Near-instant but not completely instant to maintain GSAP functionality
    ease: 'none',
    // Remove complex transforms that might cause vestibular disorders
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    // Preserve final state but remove motion
    opacity: normalSettings.opacity,
    x: normalSettings.x,
    y: normalSettings.y,
    ...reducedSettings
  }

  if (motionConfig.logMotionState) {
    console.log('🎭 Motion reduced: applying reduced motion settings', {
      normal: normalSettings,
      reduced: reducedMotionDefaults
    })
  }

  return reducedMotionDefaults
}

/**
 * Create motion-aware ScrollTrigger settings
 * Disables or simplifies scroll-based animations for reduced motion
 */
export function createMotionSafeScrollTrigger(
  normalTrigger: ScrollTrigger.Vars,
  config: Partial<MotionConfig> = {}
): ScrollTrigger.Vars | undefined {
  const motionConfig = getMotionConfig(config)

  if (!motionConfig.respectReducedMotion || !prefersReducedMotion()) {
    return normalTrigger
  }

  // For reduced motion, disable scroll-based animations
  // but preserve the trigger for content visibility
  const reducedTrigger: ScrollTrigger.Vars = {
    ...normalTrigger,
    scrub: false,
    pin: false
  }

  if ('snap' in reducedTrigger) {
    delete (reducedTrigger as Record<string, unknown>).snap
  }

  return reducedTrigger
}

/**
 * CSS-based animation fallback for when GSAP is disabled
 * Returns CSS class names for reduced motion animations
 */
export function getReducedMotionCSS(): string {
  return prefersReducedMotion() ? 'motion-reduced' : 'motion-safe'
}

/**
 * Initialize motion preferences and add appropriate CSS classes
 * Should be called early in the application lifecycle
 */
export function initializeMotionPreferences(): void {
  if (typeof window === 'undefined') return

  const bodyElement = document.body
  const motionClass = getReducedMotionCSS()

  // Add motion preference class to body
  bodyElement.classList.add(motionClass)

  // Listen for changes in motion preferences
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  const handleMotionChange = (e: MediaQueryListEvent) => {
    bodyElement.classList.remove('motion-safe', 'motion-reduced')
    bodyElement.classList.add(e.matches ? 'motion-reduced' : 'motion-safe')

    console.log('🎭 Motion preference changed:', e.matches ? 'reduced' : 'safe')
  }

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleMotionChange)
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleMotionChange)
  }
}

/**
 * Utility to conditionally apply animations based on motion preferences
 */
export function withMotionSafety<T>(
  normalValue: T,
  reducedValue: T,
  config: Partial<MotionConfig> = {}
): T {
  const motionConfig = getMotionConfig(config)

  if (!motionConfig.respectReducedMotion || !prefersReducedMotion()) {
    return normalValue
  }

  return reducedValue
}
