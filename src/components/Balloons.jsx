import { useState } from 'react'
import { config } from '../config.js'
import { burstHearts } from './FloatingHearts.jsx'

const COLORS = ['#ff6f91', '#b98bff', '#6ea8ff', '#ff9d6e', '#ffb3d1', '#7ee0c0']

// A scatter of balloons; pop each to reveal a hidden sweet message.
export default function Balloons() {
  const items = config.balloonMessages
  const [popped, setPopped] = useState(() => items.map(() => false))

  const pop = (i, e) => {
    if (popped[i]) return
    burstHearts(e.clientX)
    setPopped((p) => p.map((v, idx) => (idx === i ? true : v)))
  }
  const allPopped = popped.every(Boolean)

  return (
    <div>
      <div style={{
        display: 'grid', gap: 16, marginTop: 18,
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      }}>
        {items.map((msg, i) => (
          <div key={i} style={{ display: 'grid', placeItems: 'center', minHeight: 170 }}>
            {popped[i] ? (
              <div className="card" style={{ padding: 16, textAlign: 'center', fontSize: 15,
                animation: 'fadeUp .4s ease both' }}>
                {msg}
              </div>
            ) : (
              <button onClick={(e) => pop(i, e)} aria-label="pop balloon"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  animation: `bob 3.${i}s ease-in-out infinite` }}>
                <Balloon color={COLORS[i % COLORS.length]} />
              </button>
            )}
          </div>
        ))}
      </div>

      {allPopped && (
        <p className="script accent" style={{ textAlign: 'center', fontSize: 28, marginTop: 24,
          animation: 'fadeUp .5s ease both' }}>
          …and a million more I didn’t have balloons for. 🎈
        </p>
      )}
    </div>
  )
}

function Balloon({ color }) {
  return (
    <div style={{ position: 'relative', width: 86, height: 110 }}>
      <div style={{
        width: 86, height: 104, borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
        background: `radial-gradient(circle at 32% 28%, #fff8, ${color} 55%)`,
        boxShadow: `inset -6px -8px 12px rgba(0,0,0,.15)`,
      }} />
      {/* knot */}
      <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
        borderBottom: `9px solid ${color}` }} />
      {/* string */}
      <div style={{ position: 'absolute', bottom: -26, left: '50%', width: 1.5, height: 30,
        background: 'var(--muted)' }} />
    </div>
  )
}
