import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Typewriter from '../components/Typewriter.jsx'
import StepDots from '../components/StepDots.jsx'
import { config } from '../config.js'
import { globalAudio } from '../components/MusicPlayer.jsx'

export default function Tell() {
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // Mute & pause the global background music while on this page
    globalAudio.suppressed = true
    const bg = globalAudio.ref
    if (bg) {
      bg.volume = 0
      bg.pause()
    }

    return () => {
      // Leaving page — stop lover, restore bg music
      globalAudio.suppressed = false
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (bg && globalAudio.playing) {
        bg.volume = 0.35
        bg.play().catch(() => {})
      }
    }
  }, [])

  // Called directly by the button — inside user gesture context
  const handleStart = () => {
    setStarted(true)
    // Small timeout so React re-renders the <audio> tag first
    setTimeout(() => {
      const a = audioRef.current
      if (a) {
        a.volume = 0.38
        a.loop = true
        a.play().then(() => {
          setPaused(false)
        }).catch(err => {
          console.error('lover.mp3 play error:', err)
        })
      }
    }, 50)
  }

  const toggleMusic = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      a.play().catch(() => {})
      setPaused(false)
    } else {
      a.pause()
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
          {/* Real <audio> element rendered in DOM — most reliable for autoplay after gesture */}
          <audio
            ref={audioRef}
            src="/lover.mp3"
            loop
            preload="auto"
            style={{ display: 'none' }}
          />

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
