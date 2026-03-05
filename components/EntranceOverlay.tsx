'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const HOLD_MS = 2000

export function EntranceOverlay() {
  const [visible, setVisible] = useState(true)
  const barRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  useEffect(() => {
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      const p = Math.min(((now - startRef.current) / HOLD_MS) * 100, 100)
      if (barRef.current) barRef.current.style.width = `${p}%`
      if (numRef.current) numRef.current.textContent = Math.round(p).toString().padStart(3, '0')
      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setVisible(false), 80)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="entrance-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            userSelect: 'none',
            background:
              'radial-gradient(ellipse 120% 80% at 50% 60%, #12062e 0%, #07021a 55%, #000000 100%)',
          }}
        >
          {/* Ambient purple glow */}
          <div
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 30% 40%, rgba(139,92,246,0.18) 0%, transparent 55%), ' +
                'radial-gradient(circle at 72% 62%, rgba(79,70,229,0.12) 0%, transparent 50%)',
            }}
          />

          {/* Fine grain noise texture */}
          <div
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              opacity: 0.04,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: '300px 300px',
            }}
          />

          {/* ── Center content ── */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 40,
            }}
          >
            {/* Monogram with rotating outer ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.06, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Slow-spinning dashed ring */}
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  border: '1px dashed rgba(139,92,246,0.40)',
                  pointerEvents: 'none',
                }}
              />
              {/* Inner glow disc */}
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(139,92,246,0.16) 0%, rgba(79,70,229,0.06) 100%)',
                  border: '1px solid rgba(139,92,246,0.32)',
                  boxShadow:
                    '0 0 36px rgba(139,92,246,0.22), inset 0 0 18px rgba(139,92,246,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-space-grotesk, sans-serif)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.93)',
                  }}
                >
                  DM
                </span>
              </div>
            </motion.div>

            {/* Name — clipped slide-up reveal */}
            <div style={{ overflow: 'hidden' }}>
              <motion.h1
                initial={{ y: 64, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.30, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'var(--font-space-grotesk, sans-serif)',
                  fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                Douglas Mitchell
              </motion.h1>
            </div>

            {/* Divider rule + tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.75, ease: 'easeOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 1,
                  background:
                    'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.45em',
                  textTransform: 'uppercase',
                  color: 'rgba(167,139,250,0.62)',
                  margin: 0,
                }}
              >
                Portfolio&nbsp;&nbsp;·&nbsp;&nbsp;2026
              </p>
            </motion.div>
          </div>

          {/* ── Progress bar (rAF-driven, no React re-renders) ── */}
          <div
            style={{
              position: 'absolute',
              bottom: '9%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 8,
            }}
          >
            <motion.span
              ref={numRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.38 }}
              transition={{ delay: 0.45 }}
              style={{
                fontFamily: 'var(--font-space-grotesk, monospace)',
                fontSize: '0.58rem',
                letterSpacing: '0.22em',
                color: 'white',
                fontVariantNumeric: 'tabular-nums',
                display: 'block',
                textAlign: 'right',
              }}
            >
              000
            </motion.span>
            <div
              style={{
                width: '100%',
                height: 1,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 9999,
                overflow: 'hidden',
              }}
            >
              <div
                ref={barRef}
                style={{
                  height: '100%',
                  width: '0%',
                  background:
                    'linear-gradient(90deg, rgba(139,92,246,0.5), rgba(99,102,241,1), rgba(168,85,247,0.85))',
                  borderRadius: 9999,
                  boxShadow: '0 0 8px rgba(139,92,246,0.65)',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
