import { useState } from 'react'
import { Link } from 'react-router-dom'
import DateTimePicker from '../components/DateTimePicker.jsx'
import StepDots from '../components/StepDots.jsx'
import { burstHearts } from '../components/FloatingHearts.jsx'
import { config } from '../config.js'

const NUDGES = [
  'okay but… ice cream 🍦',
  'i promise i wont be weird 😇',
  'my treat!! 🙏',
  'last time asking… maybe 🥺',
  'fine. i asked. no regrets. 😤',
]

const CUTE_LINES = [
  "i've been practising this ask for 3 days btw 😭",
  "scientifically proven: ice cream = best date idea 📊",
  "the ice cream is already picking the flavour 🍦",
  "i literally googled 'how to ask someone for ice cream' 💀",
]

export default function Ask() {
  const [stage, setStage] = useState('asking')
  const [sel, setSel] = useState({ ready: false })
  const [noIdx, setNoIdx] = useState(-1)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [cuteIdx] = useState(() => Math.floor(Math.random() * CUTE_LINES.length))
  const [sending, setSending] = useState(false)

  const dodge = () => {
    setNoIdx(i => Math.min(i + 1, NUDGES.length - 1))
    setNoPos({ x: (Math.random() - 0.5) * 260, y: (Math.random() - 0.5) * 130 })
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
    localStorage.setItem('icecream-rsvp', JSON.stringify(payload))
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
    } catch {}
    burstHearts()
    setStage('done')
    setSending(false)
  }

  return (
    <div className="page" style={{ textAlign: 'center', display: 'flex',
      flexDirection: 'column', alignItems: 'center', minHeight: '74vh', justifyContent: 'center' }}>

      {stage === 'asking' && (
        <>
          {/* Animated ice cream + hearts */}
          <div style={{ fontSize: 64, animation: 'bob 2.5s ease-in-out infinite', marginBottom: 4 }}>🍦</div>

          <h1 className="h1 script accent" style={{ maxWidth: 640, fontSize: 'clamp(28px,5vw,52px)', marginBottom: 8 }}>
            okay hi, so… 👉👈
          </h1>

          <p style={{ fontSize: 'clamp(18px,3vw,26px)', fontWeight: 600, color: 'var(--text)', marginBottom: 6, maxWidth: 560 }}>
            i kinda really wanna take you out for ice cream 🍦
          </p>

          <p className="lead" style={{ margin: '0 auto 6px', maxWidth: 480, color: 'var(--muted)' }}>
            just the two of us, good flavours, maybe terrible jokes (mostly from me), and a really nice time 🌸
          </p>

          <p style={{ fontSize: 13, color: 'var(--accent)', fontStyle: 'italic', marginBottom: 28 }}>
            {CUTE_LINES[cuteIdx]}
          </p>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center',
            flexWrap: 'wrap', minHeight: 110, position: 'relative' }}>
            <button className="btn" style={{ fontSize: 18, padding: '16px 38px', animation: 'bob 3s ease-in-out infinite' }}
              onClick={() => { burstHearts(); setStage('picking') }}>
              yes!! 🥰🍦
            </button>
            <button className="btn"
              onMouseEnter={dodge} onClick={dodge}
              style={{
                background: 'transparent', color: 'var(--muted)', border: '2px solid var(--border)',
                boxShadow: 'none',
                transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                transition: 'transform .18s ease',
              }}>
              {noIdx < 0 ? 'hmm let me think 🤔' : NUDGES[noIdx]}
            </button>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 10 }}>
            psst — try hovering the second button 👀
          </p>
        </>
      )}

      {stage === 'picking' && (
        <>
          <div style={{ fontSize: 56, animation: 'bob 2s ease-in-out infinite' }}>🎉</div>
          <h1 className="h1">yay!! okay okay okay 🤩</h1>
          <p className="lead" style={{ margin: '4px auto 8px' }}>
            pick a saturday or sunday that works for you 💖
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
            (weekends only — because you deserve a proper day off 🌸)
          </p>

          <div className="card" style={{ width: 'min(92vw, 480px)' }}>
            <DateTimePicker onChange={setSel} />
            <button className="btn" disabled={!sel.ready || sending}
              onClick={submit}
              style={{ marginTop: 24, width: '100%', opacity: sel.ready ? 1 : 0.5,
                cursor: sel.ready ? 'pointer' : 'not-allowed' }}>
              {sending ? 'locking it in…' : "it's a plan! lock it in 🔒🍦"}
            </button>
            {!sel.ready && (
              <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 12, marginBottom: 0 }}>
                pick a saturday or sunday to continue 📅
              </p>
            )}
          </div>
        </>
      )}

      {stage === 'done' && (
        <>
          <div style={{ fontSize: 70, animation: 'bob 3s ease-in-out infinite' }}>🍦🎉</div>
          <h1 className="h1 script accent" style={{ marginTop: 10 }}>{config.askSuccess}</h1>
          <p className="lead" style={{ margin: '8px auto 16px' }}>
            genuinely cannot wait 🌸
          </p>
          <div className="card" style={{ marginTop: 4, fontSize: 18 }}>
            <div>📅 {sel.prettyDate}</div>
            <div style={{ marginTop: 6 }}>⏰ {sel.time12}</div>
          </div>
          <p className="lead" style={{ marginTop: 22 }}>see you then 🙂 — {config.yourName}</p>
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
