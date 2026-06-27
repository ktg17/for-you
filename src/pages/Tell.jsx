import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Typewriter from '../components/Typewriter.jsx'
import StepDots from '../components/StepDots.jsx'
import { config } from '../config.js'
import { globalAudio } from '../components/MusicPlayer.jsx'

export default function Tell() {
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const loverRef = useRef(null)

  useEffect(() => {
    // Create lover.mp3 audio
    const lover = new Audio('/lover.mp3')
    lover.loop = true
    lover.volume = 0.38
    loverRef.current = lover

    // Suppress the global music.mp3 player
    globalAudio.suppressed = true
    const bgAudio = globalAudio.ref
    if (bgAudio && !bgAudio.paused) {
      bgAudio.pause()
    }

    // On unmount: stop lover, restore global music
    return () => {
      lover.pause()
      lover.src = ''
      globalAudio.suppressed = false
      // Resume background music if it was playing before
      if (bgAudio && globalAudio.playing) {
        bgAudio.play().catch(() => {})
      }
    }
  }, [])

  const handleStart = () => {
    setStarted(true)
    const lover = loverRef.current
    if (lover) {
      lover.currentTime = 0
      lover.play().then(() => setPaused(false)).catch(err => console.warn('lover play failed:', err))
    }
  }

  const toggleMusic = () => {
    const lover = loverRef.current
    if (!lover) return
    if (lover.paused) {
      lover.play().catch(() => {})
      setPaused(false)
    } else {
      lover.pause()
      setPaused(true)
    }
  }

  return (
    <div className="page" style={{ textAlign: 'center', display: 'flex',
      flexDirection: 'column', alignItems: 'center', minHeight: '70vh', justifyContent: 'center' }}>

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
