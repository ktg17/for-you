import { useEffect, useRef } from 'react'

// Soft floating particles that gently drift and push away from the cursor.
// Colour follows the active theme's --accent.
export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w, h, dpr, raf
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const readAccent = () =>
      getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#b98bff'
    let color = readAccent()

    // recolour on theme change
    const obs = new MutationObserver(() => { color = readAccent() })
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] })

    const COUNT = window.innerWidth < 600 ? 28 : 54
    const parts = []
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.width = innerWidth * dpr
      h = canvas.height = innerHeight * dpr
      canvas.style.width = innerWidth + 'px'
      canvas.style.height = innerHeight + 'px'
    }
    resize()
    for (let i = 0; i < COUNT; i++) {
      parts.push({
        x: Math.random() * w, y: Math.random() * h,
        r: (1 + Math.random() * 2.4) * dpr,
        vx: (Math.random() - 0.5) * 0.3 * dpr,
        vy: (Math.random() - 0.5) * 0.3 * dpr,
        a: 0.2 + Math.random() * 0.5,
      })
    }

    const mouse = { x: -9999, y: -9999 }
    const onMove = (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        // repel from cursor
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const dist2 = dx * dx + dy * dy
        const R = 120 * dpr
        if (dist2 < R * R) {
          const d = Math.sqrt(dist2) || 1
          const force = (R - d) / R * 0.8
          p.vx += (dx / d) * force
          p.vy += (dy / d) * force
        }
        p.x += p.vx; p.y += p.vy
        p.vx *= 0.96; p.vy *= 0.96
        // gentle drift floor
        if (Math.abs(p.vx) < 0.1 * dpr) p.vx += (Math.random() - 0.5) * 0.04 * dpr
        if (Math.abs(p.vy) < 0.1 * dpr) p.vy += (Math.random() - 0.5) * 0.04 * dpr
        // wrap
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0

        ctx.globalAlpha = p.a
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    if (!reduce) draw()
    else { /* static frame for reduced-motion */ draw(); cancelAnimationFrame(raf) }

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.55,
    }} />
  )
}
