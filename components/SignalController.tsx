'use client'

import { useMemo, useState } from 'react'

export default function SignalController() {
  const [intensity, setIntensity] = useState<number>(60)

  const status = useMemo(() => {
    if (intensity < 35) return 'Drift mode — ambient insights'
    if (intensity < 70) return 'Mission ready — balanced signal'
    return 'Priority dispatch — rapid response'
  }, [intensity])

  return (
    <div className="space-y-5 text-sm text-slate-200/80">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">Signal controller</h2>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">Adjust how deep you want to dive.</p>
      </div>
      <div className="rounded-3xl border border-cyan-400/20 bg-black/40 p-5">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100" htmlFor="signal">
          Immersion level
        </label>
        <input
          id="signal"
          type="range"
          min={0}
          max={100}
          value={intensity}
          onChange={event => setIntensity(Number(event.target.value))}
          className="mt-4 w-full accent-cyan-400"
        />
        <div className="mt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      <div className="rounded-3xl border border-cyan-300/30 bg-cyan-500/10 p-4 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
        {status}
      </div>
    </div>
  )
}
