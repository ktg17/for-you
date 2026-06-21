import { useTheme } from '../theme.jsx'

const SWATCHES = {
  neon: 'linear-gradient(120deg,#b98bff,#6ea8ff)',
  warm: 'linear-gradient(120deg,#ff9d6e,#ff6f91)',
  pastel: 'linear-gradient(120deg,#b388ff,#7ec8ff)',
}

// Floating theme switcher (top-right). Music button lives bottom-right separately.
export default function Controls() {
  const { theme, setTheme, themes } = useTheme()
  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 60, display: 'flex', gap: 8 }}>
      {themes.map((t) => (
        <button key={t} onClick={() => setTheme(t)} title={t} aria-label={`${t} theme`}
          style={{
            width: 24, height: 24, borderRadius: '50%', background: SWATCHES[t], padding: 0,
            border: theme === t ? '2px solid var(--text)' : '2px solid rgba(255,255,255,.4)',
            transform: theme === t ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform .15s', cursor: 'pointer',
          }} />
      ))}
    </div>
  )
}
