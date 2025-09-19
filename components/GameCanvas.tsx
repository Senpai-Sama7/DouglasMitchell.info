'use client'
import { useEffect, useRef } from 'react'
export default function GameCanvas(){
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(()=>{
    const c = ref.current!, ctx = c.getContext('2d')!
    let w=0,h=0, raf=0, active=false, t=0
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    function resize(){ w=c.clientWidth; h=c.clientHeight; c.width=w*DPR; c.height=h*DPR; ctx.setTransform(DPR,0,0,DPR,0,0) }
    const ro = new ResizeObserver(resize); ro.observe(c); resize()
    function step(){
      t+=0.016; ctx.clearRect(0,0,w,h)
      ctx.fillStyle='#0ea5e9'; ctx.beginPath()
      const x = (Math.sin(t)*0.5+0.5)*(w-40)+20
      ctx.arc(x,h/2,18,0,Math.PI*2); ctx.fill()
      raf=requestAnimationFrame(step)
    }
    const io=new IntersectionObserver(([e])=>{
      if(e.isIntersecting && !document.hidden){ active=true; raf=requestAnimationFrame(step) }
      else { active=false; cancelAnimationFrame(raf) }
    }); io.observe(c)
    const vis=()=>{ if(document.hidden){ cancelAnimationFrame(raf) } else if(active){ raf=requestAnimationFrame(step) } }
    document.addEventListener('visibilitychange', vis)
    return ()=>{ cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', vis) }
  },[])
  return <canvas ref={ref} className="w-full h-64 rounded-xl bg-slate-900/40" />
}
