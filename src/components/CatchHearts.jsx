import { useEffect, useRef, useState } from 'react'
import { config } from '../config.js'
import { burstHearts } from './FloatingHearts.jsx'

const EMOJI = ['🍦', '🍨', '🍧', '🍦', '🍨']
let hid = 0

// Ice creams fall; catch them by clicking/tapping. Reach the goal to unlock a message.
export default function CatchHearts() {
  const goal = config.catchGoal
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [hearts, setHearts] = useState([])
  const [won, setWon] = useState(false)
  const spawnRef = useRef(null)

  const start = () => {
    setScore(0); setWon(false); setHearts([]); setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    spawnRef.current = setInterval(() => {
      const id = hid++
      const h = {
        id, left: 6 + Math.random() * 84,
        emoji: EMOJI[Math.floor(Math.random() * EMOJI.length)],
        dur: 2.6 + Math.random() * 1.6,
        size: 26 + Math.random() * 14,
      }
      setHearts((hs) => [...hs, h])
      setTimeout(() => setHearts((hs) => hs.filter((p) => p.id !== id)), h.dur * 1000)
    }, 650)
    return () => clearInterval(spawnRef.current)
  }, [running])

  const catchOne = (id, e) => {
    e.stopPropagation()
    setHearts((hs) => hs.filter((p) => p.id !== id))
    setScore((s) => {
      const ns = s + 1
      if (ns >= goal) {
        setRunning(false); setWon(true)
        clearInterval(spawnRef.current)
        burstHearts()
      }
      return ns
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 16, marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>Caught: <span className="accent">{score}</span> / {goal}</span>
        {!running && (
          <button className="btn" onClick={start} style={{ padding: '10px 22px' }}>
            {won ? 'Play again 🔁' : score === 0 ? 'Start 🎯' : 'Restart'}
          </button>
        )}
      </div>

      <div style={{
        position: 'relative', height: 360, borderRadius: 20, overflow: 'hidden',
        border: '1px solid var(--border)', background: 'var(--card)', backdropFilter: 'blur(8px)',
      }}>
        <style>{`@keyframes fall { from { top: -50px; } to { top: 110%; } }`}</style>
        {hearts.map((h) => (
          <button key={h.id} onClick={(e) => catchOne(h.id, e)} aria-label="catch ice cream"
            style={{
              position: 'absolute', left: h.left + '%', top: -50, fontSize: h.size,
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              animation: `fall ${h.dur}s linear forwards`,
            }}>{h.emoji}</button>
        ))}

        {!running && won && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            padding: 24, textAlign: 'center' }}>
            <p className="script accent" style={{ fontSize: 26, margin: 0 }}>{config.catchReward}</p>
          </div>
        )}
        {!running && !won && score === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            color: 'var(--muted)' }}>
            Tap “Start”, then catch the falling ice creams 🍦
          </div>
        )}
      </div>
    </div>
  )
}
