import { useState } from 'react'
import { Link } from 'react-router-dom'
import DateTimePicker from '../components/DateTimePicker.jsx'
import StepDots from '../components/StepDots.jsx'
import { burstHearts } from '../components/FloatingHearts.jsx'
import { config } from '../config.js'

const NUDGES = ['you sure? 🥺', 'pretty please 🍦', 'ice cream though…', 'one chance? 👉👈', 'okay last try 🙈']

// Page 4 · the ask
export default function Ask() {
  const [stage, setStage] = useState('asking') // asking | picking | done
  const [sel, setSel] = useState({ ready: false })
  const [noIdx, setNoIdx] = useState(-1)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [sending, setSending] = useState(false)

  const dodge = () => {
    setNoIdx((i) => Math.min(i + 1, NUDGES.length - 1))
    setNoPos({ x: (Math.random() - 0.5) * 240, y: (Math.random() - 0.5) * 120 })
  }

  const submit = async () => {
    if (!sel.ready) return
    setSending(true)
    const payload = {
      name: config.herName,
      date: sel.date,
      prettyDate: sel.prettyDate,
      time: sel.time12,
      submittedAt: new Date().toISOString(),
    }
    // keep a local copy so nothing is lost
    localStorage.setItem('icecream-rsvp', JSON.stringify(payload))
    // email the answer to me via Web3Forms
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: config.web3formsKey,
          subject: `🍦 ${config.herName} said YES — and picked a time!`,
          from_name: 'Ice-cream site 🍦',
          Who: config.herName,
          Day: sel.prettyDate,
          Time: sel.time12,
          'Submitted at': payload.submittedAt,
        }),
      })
    } catch { /* if the email service is unreachable, the localStorage copy remains */ }
    burstHearts()
    setStage('done')
    setSending(false)
  }

  return (
    <div className="page" style={{ textAlign: 'center', display: 'flex',
      flexDirection: 'column', alignItems: 'center', minHeight: '74vh', justifyContent: 'center' }}>

      {stage === 'asking' && (
        <>
          <div style={{ fontSize: 64, animation: 'bob 4s ease-in-out infinite' }}>🍦</div>
          <h1 className="h1" style={{ maxWidth: 620 }}>{config.askQuestion}</h1>
          <p className="lead" style={{ margin: '6px auto 30px' }}>{config.askNote}</p>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center',
            flexWrap: 'wrap', minHeight: 120 }}>
            <button className="btn" style={{ fontSize: 18, padding: '16px 36px' }}
              onClick={() => { burstHearts(); setStage('picking') }}>
              {config.askYes}
            </button>
            <button className="btn"
              onMouseEnter={dodge} onClick={dodge}
              style={{
                background: 'transparent', color: 'var(--muted)', border: '2px solid var(--border)',
                boxShadow: 'none', transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                transition: 'transform .2s ease',
              }}>
              {noIdx < 0 ? config.askNo : NUDGES[noIdx]}
            </button>
          </div>
        </>
      )}

      {stage === 'picking' && (
        <>
          <div style={{ fontSize: 56 }}>🎉</div>
          <h1 className="h1">yay! pick a day & time 🍦</h1>
          <p className="lead" style={{ margin: '4px auto 26px' }}>whatever works best for you.</p>

          <div className="card" style={{ width: 'min(92vw, 480px)' }}>
            <DateTimePicker onChange={setSel} />
            <button className="btn" disabled={!sel.ready || sending}
              onClick={submit}
              style={{ marginTop: 24, width: '100%', opacity: sel.ready ? 1 : 0.5,
                cursor: sel.ready ? 'pointer' : 'not-allowed' }}>
              {sending ? 'locking it in…' : 'lock it in 🔒🍦'}
            </button>
            {!sel.ready && (
              <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 12, marginBottom: 0 }}>
                pick a day to continue 📅
              </p>
            )}
          </div>
        </>
      )}

      {stage === 'done' && (
        <>
          <div style={{ fontSize: 70, animation: 'bob 4s ease-in-out infinite' }}>🍦🎉</div>
          <h1 className="h1 script accent" style={{ marginTop: 10 }}>{config.askSuccess}</h1>
          <div className="card" style={{ marginTop: 16, fontSize: 18 }}>
            <div>📅 {sel.prettyDate}</div>
            <div style={{ marginTop: 6 }}>⏰ {sel.time12}</div>
          </div>
          <p className="lead" style={{ marginTop: 22 }}>can’t wait 🙂 — {config.yourName}</p>
        </>
      )}

      {stage !== 'done' && (
        <div style={{ marginTop: 28 }}>
          <Link to="/tell" style={{ color: 'var(--muted)', fontSize: 14 }}>← back</Link>
        </div>
      )}

      <StepDots current={3} />
    </div>
  )
}
