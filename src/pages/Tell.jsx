import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Typewriter from '../components/Typewriter.jsx'
import StepDots from '../components/StepDots.jsx'
import { config } from '../config.js'

export default function Tell() {
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // Suppress & pause global bg music
    window._bgSuppressed = true
    const bg = window._bgAudio
    if (bg && !bg.paused) {
      bg.pause()
    }
    return () => {
      // Restore bg music when leaving
      window._bgSuppressed = false
      if (audioRef.current) audioRef.current.pause()
      const bg2 = window._bgAudio
      if (bg2 && bg2.paused) {
        bg2.volume = 0.35
        bg2.play().catch(() => {})
      }
    }
  }, [])

  const handleStart = () => {
    setStarted(true)
    // Play directly in click handler - guaranteed user gesture
    const a = audioRef.current
    if (a) {
      a.currentTime = 0
      a.volume = 0.38
      a.play().then(() => setPaused(false)).catch(e => console.warn(e))
    }
  }

  const toggleMusic = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) { a.play().catch(() => {}); setPaused(false) }
    else { a.pause(); setPaused(true) }
  }

  return (
    <div className="page" style={{ textAlign: 'center', display: 'flex',
      flexDirection: 'column', alignItems: 'center', minHeight: '70vh', justifyContent: 'center' }}>

      {/* Audio always in DOM so ref is available before click */}
      <audio ref={audioRef} src="/lover.mp3" loop preload="auto" style={{ display: 'none' }} />

      <h1 className="h1">{config.tellTitle}</h1>

      {!started ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 24 }}>
          <div style={{ fontSize: 52, animation: 'bob 2s ease-in-out infinite' }}>🎵</div>
          <p className="lead" style={{ maxWidth: 420, margin: 0 }}>
            something i wanted to say 🌸
          </p>
          <button className="btn" style={{ marginTop: 8 }} onClick={handleStart}>
            read it 💬
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 18 }}>{paused ? '🔇' : '🎵'}</span>
            <button onClick={toggleMusic}
              style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 20,
                padding: '4px 14px', cursor: 'pointer', color: 'var(--muted)', fontSize: 12
              }}>
              {paused ? '▶ play' : '⏸ pause'}
            </button>
          </div>

          <div className="card" style={{ maxWidth: 560, marginTop: 4, textAlign: 'left' }}>
            <Typewriter
              text={config.tellMessage}
              start={started}
              speed={28}
              style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text)' }}
            />
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 30 }}>
        <Link to="/games" className="btn" style={{ background: 'transparent', color: 'var(--accent)',
          border: '2px solid var(--accent)', boxShadow: 'none' }}>← back</Link>
        <Link to="/ask" className="btn">{config.tellButton}</Link>
      </div>

      <StepDots current={2} />
    </div>
  )
}
