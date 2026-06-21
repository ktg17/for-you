import { useEffect, useState, useCallback } from 'react'

const EMOJI = ['🍦', '✨', '🎈', '🌸', '💫', '🩷']
let idSeq = 0

// Ambient floating hearts + an imperative burst (exposed via window event).
export default function FloatingHearts() {
  const [hearts, setHearts] = useState([])

  const spawn = useCallback((x) => {
    const id = idSeq++
    const heart = {
      id,
      left: x ?? Math.random() * window.innerWidth,
      emoji: EMOJI[Math.floor(Math.random() * EMOJI.length)],
      size: 16 + Math.random() * 22,
      dur: 5 + Math.random() * 4,
    }
    setHearts((h) => [...h, heart])
    setTimeout(() => setHearts((h) => h.filter((p) => p.id !== id)), heart.dur * 1000)
  }, [])

  useEffect(() => {
    const ambient = setInterval(() => spawn(), 1000)
    const onBurst = (e) => {
      const cx = e.detail?.x ?? window.innerWidth / 2
      for (let i = 0; i < 26; i++) {
        setTimeout(() => spawn(cx + (Math.random() - 0.5) * 280), i * 40)
      }
    }
    window.addEventListener('heart-burst', onBurst)
    return () => { clearInterval(ambient); window.removeEventListener('heart-burst', onBurst) }
  }, [spawn])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      <style>{`@keyframes rise {
        0% { transform: translateY(0) rotate(0); opacity: 0; }
        12% { opacity: .9; }
        100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
      }`}</style>
      {hearts.map((h) => (
        <span key={h.id} style={{
          position: 'absolute', bottom: -30, left: h.left, fontSize: h.size,
          animation: `rise ${h.dur}s linear forwards`,
        }}>{h.emoji}</span>
      ))}
    </div>
  )
}

export const burstHearts = (x) =>
  window.dispatchEvent(new CustomEvent('heart-burst', { detail: { x } }))
