import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function MusicPlayer() {
  const bgRef = useRef(null)
  const loverRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [loverStarted, setLoverStarted] = useState(false)
  const location = useLocation()

  const isLoverPage = location.pathname === '/tell' || location.pathname === '/ask'

  useEffect(() => {
    // Create both audio elements once
    const bg = new Audio('/music.mp3')
    bg.loop = true
    bg.volume = 0
    bgRef.current = bg

    const lover = new Audio('/lover.mp3')
    lover.loop = true
    lover.volume = 0.38
    loverRef.current = lover

    // Start bg music on first click
    const tryStart = () => {
      if (window._loverPlaying) return
      bg.play().then(() => {
        fadeTo(bg, 0.35)
        setPlaying(true)
      }).catch(() => {})
    }
    window.addEventListener('pointerdown', tryStart, { once: true })
    window._tryStartBg = tryStart

    return () => {
      window.removeEventListener('pointerdown', tryStart)
      bg.pause()
      lover.pause()
    }
  }, [])

  // When route changes to tell/ask — switch to lover.mp3
  // When route leaves tell/ask — switch back to music.mp3
  useEffect(() => {
    const bg = bgRef.current
    const lover = loverRef.current
    if (!bg || !lover) return

    if (isLoverPage) {
      // Pause bg, let Tell page start lover via window._startLover
      bg.pause()
      setPlaying(false)
    } else {
      // Leaving tell/ask — pause lover, resume bg
      if (window._loverPlaying) {
        lover.pause()
        window._loverPlaying = false
        setLoverStarted(false)
      }
      bg.play().then(() => {
        fadeTo(bg, 0.35)
        setPlaying(true)
      }).catch(() => {})
    }
  }, [location.pathname])

  // Expose lover start function for Tell page button
  window._startLover = () => {
    const lover = loverRef.current
    const bg = bgRef.current
    if (!lover) return
    if (window._loverPlaying) return
    if (bg) bg.pause()
    lover.currentTime = 0
    lover.play().then(() => {
      window._loverPlaying = true
      setLoverStarted(true)
      setPlaying(true)
    }).catch(e => console.warn('lover play err:', e))
  }

  const fadeTo = (audio, target) => {
    clearInterval(audio._fade)
    audio._fade = setInterval(() => {
      const step = target > audio.volume ? 0.02 : -0.02
      audio.volume = Math.min(1, Math.max(0, +(audio.volume + step).toFixed(2)))
      if (Math.abs(audio.volume - target) < 0.02) {
        audio.volume = target
        clearInterval(audio._fade)
      }
    }, 40)
  }

  const toggle = () => {
    const bg = bgRef.current
    const lover = loverRef.current
    if (window._loverPlaying && lover) {
      if (lover.paused) { lover.play().catch(() => {}); setPlaying(true) }
      else { lover.pause(); setPlaying(false) }
    } else if (bg) {
      if (playing) { fadeTo(bg, 0); setTimeout(() => bg.pause(), 500); setPlaying(false) }
      else { bg.play().then(() => { fadeTo(bg, 0.35); setPlaying(true) }).catch(() => {}) }
    }
  }

  return (
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
  )
}
