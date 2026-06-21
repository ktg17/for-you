import { useState } from 'react'
import { Link } from 'react-router-dom'
import Typewriter from '../components/Typewriter.jsx'
import StepDots from '../components/StepDots.jsx'
import { config } from '../config.js'

// Page 3 · I want to tell you something
export default function Tell() {
  const [started, setStarted] = useState(false)

  return (
    <div className="page" style={{ textAlign: 'center', display: 'flex',
      flexDirection: 'column', alignItems: 'center', minHeight: '70vh', justifyContent: 'center' }}>
      <h1 className="h1">{config.tellTitle}</h1>

      {!started ? (
        <button className="btn" style={{ marginTop: 24 }} onClick={() => setStarted(true)}>
          read it 💬
        </button>
      ) : (
        <div className="card" style={{ maxWidth: 560, marginTop: 24, textAlign: 'left' }}>
          <Typewriter
            text={config.tellMessage}
            start={started}
            speed={28}
            style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text)' }}
          />
        </div>
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
