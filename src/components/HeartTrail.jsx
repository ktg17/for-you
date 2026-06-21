import { useEffect, useState, useRef } from 'react'

const EMOJI = ['✨', '🍦', '💫', '🎈', '🌸', '🩷']
let seq = 0

// Small hearts that sparkle and drift wherever she moves or taps.
export default function HeartTrail() {
  const [bits, setBits] = useState([])
  const last = useRef(0)

  useEffect(() => {
    const add = (x, y) => {
      const now = performance.now()
      if (now - last.current < 55) return // throttle
      last.current = now
      const id = seq++
      const bit = {
        id, x, y,
        dx: (Math.random() - 0.5) * 40,
        emoji: EMOJI[Math.floor(Math.random() * EMOJI.length)],
        size: 12 + Math.random() * 12,
      }
      setBits((b) => [...b, bit])
      setTimeout(() => setBits((b) => b.filter((p) => p.id !== id)), 900)
    }
    const onMove = (e) => add(e.clientX, e.clientY)
    const onTouch = (e) => { const t = e.touches[0]; if (t) add(t.clientX, t.clientY) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 40, overflow: 'hidden' }}>
      <style>{`@keyframes trail {
        0% { transform: translate(-50%,-50%) scale(.4); opacity: 0; }
        20% { opacity: .9; }
        100% { transform: translate(calc(-50% + var(--dx)), calc(-50% - 40px)) scale(1); opacity: 0; }
      }`}</style>
      {bits.map((b) => (
        <span key={b.id} style={{
          position: 'absolute', left: b.x, top: b.y, fontSize: b.size,
          '--dx': `${b.dx}px`, animation: 'trail .9s ease-out forwards',
        }}>{b.emoji}</span>
      ))}
    </div>
  )
}
