'use client'
import { useEffect, useRef } from 'react'

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0, active = false
    let width = 0, height = 0, stars: {x:number;y:number;z:number}[] = []

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const MAX_STARS = reduced ? 120 : (DPR < 1.5 ? 220 : 360)

    function resize(){
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      ctx.setTransform(DPR,0,0,DPR,0,0)
      if(stars.length === 0){
        for(let i=0;i<MAX_STARS;i++){
          stars.push({ x: Math.random()*width, y: Math.random()*height, z: Math.random()*1 })
        }
      }
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)

    function step(){
      ctx.clearRect(0,0,width,height)
      for (const s of stars){
        s.x += (1.5 + s.z*2)
        if(s.x > width) { s.x = 0; s.y = Math.random()*height; s.z = Math.random()*1 }
        const size = 0.6 + s.z*1.2
        ctx.globalAlpha = 0.7 + s.z*0.3
        ctx.fillRect(s.x, s.y, size, size)
      }
      raf = requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(([e]) => {
      const shouldRun = e.isIntersecting && !reduced
      if(shouldRun && !active){ active = true; raf = requestAnimationFrame(step) }
      else if(!shouldRun && active){ active = false; cancelAnimationFrame(raf) }
    },{threshold: .1})
    io.observe(canvas)

    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect() }
  }, [])
  return <canvas ref={ref} className="w-full h-[60vh] rounded-2xl shadow-2xl" />
}
