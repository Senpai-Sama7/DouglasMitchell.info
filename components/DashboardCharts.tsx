'use client'
import { useEffect, useRef } from 'react'

export default function DashboardCharts(){
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(()=>{
    let chart: any
    let disposed = false
    const io = new IntersectionObserver(async ([e],obs)=>{
      if(!e.isIntersecting) return
      const { Chart } = await import('chart.js/auto')
      if(disposed) return
      const ctx = canvasRef.current!.getContext('2d')!
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({length: 24}, (_,i)=>`${i}`),
          datasets: [{ label: 'Velocity', data: Array.from({length:24},()=>Math.random()*100) }]
        },
        options: { responsive: true, animation: false }
      })
      obs.disconnect()
    },{threshold:.3})
    io.observe(canvasRef.current!)
    return ()=>{ disposed=true; if(chart) chart.destroy(); io.disconnect() }
  },[])
  return <canvas ref={canvasRef} className="w-full h-64 bg-slate-900/40 rounded-xl" />
}
