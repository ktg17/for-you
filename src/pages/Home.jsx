import { Link } from 'react-router-dom'
import Character from '../components/Character.jsx'
import StepDots from '../components/StepDots.jsx'
import { config } from '../config.js'

// Page 1 · little intro
export default function Home() {
  const title = config.introTitle.replace('{name}', config.herName)

  return (
    <div className="page" style={{ textAlign: 'center', display: 'flex',
      flexDirection: 'column', alignItems: 'center', minHeight: '78vh', justifyContent: 'center' }}>
      <h1 className="h1 script accent">{title}</h1>
      <p className="lead" style={{ margin: '4px auto 30px' }}>{config.introSubtitle}</p>

      <Character size={210} />

      <Link to="/games" className="btn" style={{ marginTop: 34 }}>{config.introButton}</Link>

      <p style={{ color: 'var(--muted)', marginTop: 22, fontSize: 13 }}>
        psst — try clicking the little one 👆
      </p>

      <StepDots current={0} />
    </div>
  )
}
