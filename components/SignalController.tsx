'use client'

import { useMemo, useState } from 'react'

const immersionStages = [
  { max: 30, label: 'Observation mode — soft ambient telemetry.' },
  { max: 70, label: 'Ops mode — balanced throughput, stay aligned.' },
  { max: 100, label: 'Alert mode — full-spectrum response engaged.' }
]

export default function SignalController() {
  const [intensity, setIntensity] = useState<number>(60)

  const status = useMemo(() => {
    for (const stage of immersionStages) {
      if (intensity <= stage.max) {
        return stage.label
      }
    }
    return immersionStages[immersionStages.length - 1]?.label ?? ''
  }, [intensity])

  return (
    <section className="signal-controller" aria-label="Immersion controller">
      <header>
        <p className="signal-controller__eyebrow">Signal controller</p>
        <h2 className="signal-controller__title">Tune immersion</h2>
        <p className="signal-controller__description">Adjust how intense the dispatch feed should feel.</p>
      </header>
      <div className="signal-controller__panel">
        <label className="signal-controller__label" htmlFor="immersion">
          Immersion level
        </label>
        <input
          id="immersion"
          type="range"
          min={0}
          max={100}
          value={intensity}
          onChange={event => setIntensity(Number(event.target.value))}

        />
        <div className="signal-controller__scale" aria-hidden>
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      <p className="signal-controller__status">{status}</p>
    </section>
  )
}
