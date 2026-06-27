import { useEffect, useRef, useState } from 'react'

// Simple global so Tell page can pause/resume this
window._bgAudio = window._bgAudio || null

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    window._bgAudio = audioRef.current
    const a = audioRef.current
    a.volume = 0
    a.loop = true

    const tryStart = () => {
      if (window._bgSuppressed) return
      a.play().then(() => { fadeTo(0.35); setPlaying(true) }).catch(() => {})
    }
    window.addEventListener('pointerdown', tryStart, { once: true })
    return () => window.removeEventListener('pointerdown', tryStart)
  }, [])

  const fadeTo = (target) => {
    const a = audioRef.current
    if (!a) return
    clearInterval(a._fade)
    a._fade = setInterval(() => {
      const step = target > a.volume ? 0.02 : -0.02
      a.volume = Math.min(1, Math.max(0, +(a.volume + step).toFixed(2)))
      if (Math.abs(a.volume - target) < 0.02) { a.volume = target; clearInterval(a._fade) }
    }, 40)
  }

  const toggle = () => {
    const a = audioRef.current
    if (!a || window._bgSuppressed) return
    if (playing) {
      fadeTo(0); setTimeout(() => a.pause(), 500); setPlaying(false)
    } else {
      a.play().then(() => { fadeTo(0.35); setPlaying(true) }).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" preload="auto" />
      <button onClick={toggle} aria-label="toggle music"
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
