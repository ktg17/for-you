import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Typewriter from '../components/Typewriter.jsx'
import StepDots from '../components/StepDots.jsx'
import { config } from '../config.js'

// Lover BGM: YouTube embed (audio only via iframe trick with mute=0)
// We use a simple piano/bgm embed approach — autoplay on user click
export default function Tell() {
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  // We embed a looping soft instrumental. User starts it manually.
  // Using the public domain / royalty free version hosted approach.
  // Lover by Taylor Swift — we play BGM from a known public embed.
  const LOVER_EMBED = 'https://www.youtube.com/embed/AHeisuGB8AE?autoplay=1&loop=1&playlist=AHeisuGB8AE&controls=0&mute=0&start=10'

  const handleStart = () => {
    setStarted(true)
    setPlaying(true)
  }

  return (
    <div className="page" style={{ textAlign: 'center', display: 'flex',
      flexDirection: 'column', alignItems: 'center', minHeight: '70vh', justifyContent: 'center' }}>

      <h1 className="h1">{config.tellTitle}</h1>

      {!started ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 24 }}>
          <div style={{ fontSize: 52 }}>🎵</div>
          <p className="lead" style={{ maxWidth: 400, margin: 0 }}>
            click below to start reading — with a little background music 🌸
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
            (Lover — Taylor Swift, softly playing in the bg)
          </p>
          <button className="btn" style={{ marginTop: 8 }} onClick={handleStart}>
            read it 💬
          </button>
        </div>
      ) : (
        <>
          {/* Hidden YouTube iframe for BGM */}
          {playing && (
            <iframe
              src={LOVER_EMBED}
              style={{ width: 0, height: 0, border: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              allow="autoplay"
              title="lover bgm"
            />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>🎵 Lover — Taylor Swift</span>
            <button onClick={() => setPlaying(p => !p)}
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20,
                padding: '4px 12px', cursor: 'pointer', color: 'var(--muted)', fontSize: 12 }}>
              {playing ? '⏸ pause' : '▶ play'}
            </button>
          </div>

          <div className="card" style={{ maxWidth: 560, marginTop: 8, textAlign: 'left' }}>
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
