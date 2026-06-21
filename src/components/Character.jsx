import { useEffect, useRef, useState } from 'react'

// A cute floating character: eyes follow the cursor, blinks naturally,
// wears a little heart antenna, and waves + beams when you click it.
export default function Character({ size = 210 }) {
  const eyeL = useRef(null)
  const eyeR = useRef(null)
  const [blink, setBlink] = useState(false)
  const [happy, setHappy] = useState(false)

  // eye tracking
  useEffect(() => {
    const move = (e) => {
      ;[eyeL.current, eyeR.current].forEach((eye) => {
        if (!eye) return
        const pupil = eye.firstChild
        const r = eye.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const ang = Math.atan2(e.clientY - cy, e.clientX - cx)
        const d = Math.min(9, Math.hypot(e.clientX - cx, e.clientY - cy) / 14)
        pupil.style.transform =
          `translate(calc(-50% + ${Math.cos(ang) * d}px), calc(-50% + ${Math.sin(ang) * d}px))`
      })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  // natural blinking
  useEffect(() => {
    let t
    const tick = () => {
      setBlink(true)
      setTimeout(() => setBlink(false), 140)
      t = setTimeout(tick, 2400 + Math.random() * 3200)
    }
    t = setTimeout(tick, 1800)
    return () => clearTimeout(t)
  }, [])

  const react = () => { setHappy(true); setTimeout(() => setHappy(false), 700) }

  const s = size
  const eye = {
    position: 'absolute', top: s * 0.40, width: s * 0.21, height: s * 0.25,
    background: '#fff', borderRadius: '50%',
    boxShadow: 'inset 0 -3px 6px rgba(0,0,0,.08)',
  }
  const pupil = {
    position: 'absolute', top: '50%', left: '50%', width: s * 0.115, height: s * 0.115,
    borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #4a3f6b, #221c38 70%)',
    transform: 'translate(-50%,-50%)', transition: 'transform .07s linear',
  }
  const shine = (top, left, sz) => ({
    position: 'absolute', top, left, width: sz, height: sz, borderRadius: '50%',
    background: '#fff', opacity: .95, pointerEvents: 'none',
  })
  const lid = {
    position: 'absolute', top: s * 0.40, width: s * 0.21,
    height: blink ? s * 0.25 : 0, background: 'var(--char)', borderRadius: '50%',
    transition: 'height .08s',
  }
  const arm = (side) => ({
    position: 'absolute', top: s * 0.55, [side]: s * 0.02,
    width: s * 0.12, height: s * 0.12, borderRadius: '50%', background: 'var(--char)',
    boxShadow: 'inset 0 -2px 5px rgba(0,0,0,.08)',
    transformOrigin: side === 'left' ? 'right center' : 'left center',
    transform: happy ? `rotate(${side === 'left' ? -35 : 35}deg) translateY(-6px)` : 'rotate(0)',
    transition: 'transform .25s cubic-bezier(.34,1.56,.64,1)',
  })

  return (
    <div
      onClick={react}
      style={{
        width: s, height: s * 1.15, position: 'relative', margin: '0 auto',
        filter: 'drop-shadow(0 18px 30px color-mix(in srgb, var(--char-shadow) 60%, transparent))',
        animation: 'bob 4s ease-in-out infinite',
        transform: happy ? 'scale(1.07)' : 'scale(1)',
        transition: 'transform .25s cubic-bezier(.34,1.56,.64,1)', cursor: 'pointer',
      }}
    >
      <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes pulse{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.18)}}`}</style>

      {/* heart antenna */}
      <div style={{ position: 'absolute', top: -s * 0.04, left: '50%', transform: 'translateX(-50%)',
        width: 3, height: s * 0.12, background: 'var(--char-shadow)' }} />
      <div style={{ position: 'absolute', top: -s * 0.10, left: '50%', fontSize: s * 0.13,
        transform: 'translateX(-50%)', animation: 'pulse 1.6s ease-in-out infinite' }}>💖</div>

      {/* arms */}
      <div style={arm('left')} />
      <div style={arm('right')} />

      {/* body with soft gradient */}
      <div style={{ position: 'absolute', top: s * 0.08, left: 0, width: s, height: s,
        background: 'radial-gradient(circle at 40% 28%, color-mix(in srgb, var(--char) 100%, #fff 12%), var(--char) 60%, color-mix(in srgb, var(--char-shadow) 35%, var(--char)))',
        borderRadius: '48% 48% 46% 46%' }} />

      {/* eyes */}
      <div ref={eyeL} style={{ ...eye, left: s * 0.25 }}>
        <div style={pupil} />
        <div style={shine(s * 0.05, s * 0.05, s * 0.045)} />
        <div style={shine(s * 0.13, s * 0.12, s * 0.022)} />
      </div>
      <div ref={eyeR} style={{ ...eye, right: s * 0.25 }}>
        <div style={pupil} />
        <div style={shine(s * 0.05, s * 0.05, s * 0.045)} />
        <div style={shine(s * 0.13, s * 0.12, s * 0.022)} />
      </div>
      {/* eyelids */}
      <div style={{ ...lid, left: s * 0.25 }} />
      <div style={{ ...lid, right: s * 0.25 }} />

      {/* cheeks */}
      <div style={{ position: 'absolute', top: s * 0.60, left: s * 0.20, width: s * 0.14,
        height: s * 0.075, borderRadius: '50%', background: 'var(--cheek)', opacity: .8, filter: 'blur(1.5px)' }} />
      <div style={{ position: 'absolute', top: s * 0.60, right: s * 0.20, width: s * 0.14,
        height: s * 0.075, borderRadius: '50%', background: 'var(--cheek)', opacity: .8, filter: 'blur(1.5px)' }} />

      {/* smile — wider when happy */}
      <div style={{ position: 'absolute', top: s * 0.64, left: '50%', transform: 'translateX(-50%)',
        width: happy ? s * 0.22 : s * 0.15, height: happy ? s * 0.15 : s * 0.08,
        border: `3px solid #2b2440`, borderTop: 'none', borderRadius: '0 0 40px 40px',
        transition: 'all .2s' }} />
    </div>
  )
}
