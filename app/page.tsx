import Starfield from '@/components/Starfield'
import GameCanvas from '@/components/GameCanvas'
import dynamic from 'next/dynamic'
const DashboardCharts = dynamic(() => import('@/components/DashboardCharts'), { ssr: false })

async function Projects() {
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/gh`, { cache: 'no-store' })
  const repos = await r.json().catch(()=>[])
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {Array.isArray(repos) && repos.length ? repos.map((p:any)=>(
        <a key={p.name} href={p.url} className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 transition">
          <div className="text-lg font-semibold">{p.name}</div>
          <div className="opacity-70">⭐ {p.stars}</div>
        </a>
      )) : <div className="opacity-60">No projects found (configure NEXT_PUBLIC_GITHUB_USER)</div>}
    </div>
  )
}

export default async function Page(){
  return (
    <main className="mx-auto max-w-6xl p-6 space-y-16">
      <section className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold">Ultimate Dynamic Portfolio</h1>
        <p className="opacity-80 max-w-2xl">Edge-fast, dynamic, and actually maintainable. Starfield hero, interactive charts, API-backed sections, and a tiny game for flair.</p>
        <Starfield />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Live Metrics</h2>
        <DashboardCharts />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        {/* @ts-expect-error Async Server Component */}
        <Projects />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Mini-Game</h2>
        <GameCanvas />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Idea Generator</h2>
        <form action="/api/ideate" method="post" className="flex gap-2">
          <input name="prompt" placeholder="Pitch me…" className="flex-1 px-3 py-2 rounded-md text-black" />
          <button className="px-4 py-2 rounded-md bg-cyan-500 text-black font-semibold">Ideate</button>
        </form>
        <p className="text-sm opacity-70">Enable by setting <code>IDEATOR_ENABLED=true</code> (stubbed serverless route).</p>
      </section>
    </main>
  )
}
