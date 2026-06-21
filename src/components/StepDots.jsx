import { useNavigate } from 'react-router-dom'

const STEPS = ['/', '/games', '/tell', '/ask']

// Little progress dots at the bottom of the linear flow.
export default function StepDots({ current }) {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 40 }}>
      {STEPS.map((path, i) => (
        <button key={path} onClick={() => navigate(path)} aria-label={`step ${i + 1}`}
          style={{
            width: i === current ? 26 : 10, height: 10, borderRadius: 20, border: 'none',
            cursor: 'pointer', padding: 0, transition: 'width .25s, background .25s',
            background: i === current ? 'var(--accent)'
              : i < current ? 'color-mix(in srgb, var(--accent) 45%, transparent)'
              : 'var(--border)',
          }} />
      ))}
    </div>
  )
}
