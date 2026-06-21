import { useEffect, useRef } from 'react'

// A glowing dot + soft light that smoothly trails the cursor.
export default function CursorFollower() {
  const dot = useRef(null)
  const glow = useRef(null)

  useEffect(() => {
    // disable on touch devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let mx = innerWidth / 2, my = innerHeight / 2
    let gx = mx, gy = my
    let raf

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`
    }
    const loop = () => {
      gx += (mx - gx) * 0.12
      gy += (my - gy) * 0.12
      if (glow.current) glow.current.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={glow} style={{
        position: 'fixed', left: 0, top: 0, width: 420, height: 420, borderRadius: '50%',
        pointerEvents: 'none', zIndex: 0, filter: 'blur(24px)',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent), transparent 65%)',
      }} />
      <div ref={dot} style={{
        position: 'fixed', left: 0, top: 0, width: 12, height: 12, borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999, background: 'var(--accent)',
        boxShadow: '0 0 14px var(--accent)',
      }} />
    </>
  )
}
