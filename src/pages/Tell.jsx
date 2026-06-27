import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Typewriter from '../components/Typewriter.jsx'
import StepDots from '../components/StepDots.jsx'
import { config } from '../config.js'

// Lover by Taylor Swift instrumental — using SoundCloud embed (works after user gesture)
const SC_EMBED = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/631279692&color=%23ff6f91&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"

export default function Tell() {
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(true)
  const iframeRef = useRef(null)

  const handleStart = () => {
    setStarted(true)
    setPlaying(true)
  }

  const toggleMusic = () => {
    setPlaying(p => !p)
  }

  return (
    <div className="page" style={{ textAlign: 'center', display: 'flex',
      flexDirection: 'column', alignItems: 'center', minHeight: '70vh', justifyContent: 'center' }}>

      <h1 className="h1">{config.tellTitle}</h1>

      {!started ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 24 }}>
          <div style={{ fontSize: 52, animation: 'bob 2s ease-in-out infinite' }}>🎵</div>
          <p className="lead" style={{ maxWidth: 420, margin: 0 }}>
            click below to read — with <em>Lover</em> by Taylor Swift playing softly 🌸
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
            make sure your volume is on 🔊
          </p>
          <button className="btn" style={{ marginTop: 8 }} onClick={handleStart}>
            read it 💬
          </button>
        </div>
      ) : (
        <>
          {/* SoundCloud embed — loads after user click so autoplay works */}
          {playing && (
            <iframe
              ref={iframeRef}
              key="sc-player"
              src={SC_EMBED}
              style={{
                width: 0, height: 0, border: 'none',
                position: 'absolute', opacity: 0, pointerEvents: 'none'
              }}
              allow="autoplay"
              title="Lover BGM"
              scrolling="no"
            />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>
              {playing ? '🎵' : '🔇'} Lover — Taylor Swift
            </span>
            <button onClick={toggleMusic}
              style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 20,
                padding: '4px 14px', cursor: 'pointer', color: 'var(--muted)', fontSize: 12
              }}>
              {playing ? '⏸ pause' : '▶ play'}
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
