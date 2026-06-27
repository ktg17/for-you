import { useEffect, useRef, useState } from 'react'

// Global audio ref accessible by other pages
export const globalAudio = { ref: null, playing: false }

export default function MusicPlayer() {
  const audio = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    globalAudio.ref = audio.current
    const a = audio.current
    a.volume = 0
    a.loop = true

    const tryStart = () => {
      // Don't start if Tell page has taken over audio
      if (globalAudio.suppressed) return
      a.play().then(() => {
        fadeTo(0.35)
        setPlaying(true)
        globalAudio.playing = true
      }).catch(() => {})
      window.removeEventListener('pointerdown', tryStart)
    }
    window.addEventListener('pointerdown', tryStart, { once: true })
    globalAudio.tryStart = tryStart
    return () => window.removeEventListener('pointerdown', tryStart)
  }, [])

  const fadeTo = (target) => {
    const a = audio.current
    clearInterval(a._fade)
    a._fade = setInterval(() => {
      const step = target > a.volume ? 0.02 : -0.02
      a.volume = Math.min(1, Math.max(0, +(a.volume + step).toFixed(2)))
      if (Math.abs(a.volume - target) < 0.02) { a.volume = target; clearInterval(a._fade) }
    }, 40)
  }

  const toggle = () => {
    const a = audio.current
    if (playing) {
      fadeTo(0)
      setTimeout(() => a.pause(), 500)
      setPlaying(false)
      globalAudio.playing = false
    } else {
      if (globalAudio.suppressed) return
      a.play().then(() => { fadeTo(0.35); setPlaying(true); globalAudio.playing = true }).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audio} src="/music.mp3" preload="auto" />
      <button onClick={toggle} aria-label="toggle music" title={playing ? 'Pause music' : 'Play music'}
        style={{
          position: 'fixed', bottom: 22, right: 22, zIndex: 60,
          width: 52, height: 52, borderRadius: '50%', border: '1px solid var(--border)',
          background: 'color-mix(in srgb, var(--bg2) 70%, transparent)',
          backdropFilter: 'blur(10px)', color: 'var(--accent)', fontSize: 20, cursor: 'pointer',
          boxShadow: '0 8px 24px color-mix(in srgb, var(--accent) 30%, transparent)',
          display: 'grid', placeItems: 'center',
        }}>
        <span style={{ display: 'inline-block', animation: playing ? 'spin 6s linear infinite' : 'none' }}>
          {playing ? '🎵' : '🔈'}
        </span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </button>
    </>
  )
}
