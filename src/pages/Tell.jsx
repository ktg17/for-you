import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Typewriter from '../components/Typewriter.jsx'
import StepDots from '../components/StepDots.jsx'
import { config } from '../config.js'

export default function Tell() {
  const [started, setStarted] = useState(false)
  const audioRef = useRef(null)

  const handleStart = () => {
    setStarted(true)
    // Play the music file from /public/lover.mp3
    if (audioRef.current) {
      audioRef.current.volume = 0.35
      audioRef.current.play().catch(() => {})
    }
  }

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }

  return (
    <div className="page" style={{ textAlign: 'center', display: 'flex',
      flexDirection: 'column', alignItems: 'center', minHeight: '70vh', justifyContent: 'center' }}>

      {/* Hidden audio element — src points to public/lover.mp3 in your repo */}
      <audio ref={audioRef} src="/lover.mp3" loop preload="auto" />

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
            <span style={{ fontSize: 18 }}>🎵</span>
            <button onClick={toggleMusic}
              style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 20,
                padding: '4px 14px', cursor: 'pointer', color: 'var(--muted)', fontSize: 12
              }}>
              pause / play
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
