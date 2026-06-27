import { Link } from 'react-router-dom'
import Balloons from '../components/Balloons.jsx'
import CatchHearts from '../components/CatchHearts.jsx'
import StepDots from '../components/StepDots.jsx'
import { config } from '../config.js'

function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: 52 }}>
      <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', margin: '0 0 4px' }}>{title}</h2>
      <p className="lead" style={{ marginBottom: 12 }}>{subtitle}</p>
      {children}
    </section>
  )
}

export default function Games() {
  return (
    <div className="page">
      <h1 className="h1">{config.gamesTitle}</h1>
      <p className="lead" style={{ marginBottom: 36 }}>{config.gamesSubtitle}</p>

      <Section title="🍦 memory match" subtitle="flip the cards and find all the pairs! how few moves can you do it in?">
        <CatchHearts />
      </Section>

      <Section title="🎈 pop the balloons" subtitle="each one has a tiny something about her inside 🤫">
        <Balloons />
      </Section>

      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 8 }}>
        <Link to="/" className="btn" style={{ background: 'transparent', color: 'var(--accent)',
          border: '2px solid var(--accent)', boxShadow: 'none' }}>← back</Link>
        <Link to="/tell" className="btn">next →</Link>
      </div>

      <StepDots current={1} />
    </div>
  )
}
