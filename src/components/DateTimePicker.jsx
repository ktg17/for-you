import { useEffect, useState } from 'react'

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

// Date + 12-hour (AM/PM) time picker. Calls onChange with the full selection.
export default function DateTimePicker({ onChange }) {
  const [date, setDate] = useState('')
  const [hour, setHour] = useState(5)
  const [minute, setMinute] = useState('00')
  const [ampm, setAmpm] = useState('PM')

  useEffect(() => {
    const time12 = `${hour}:${minute} ${ampm}`
    let prettyDate = ''
    if (date) {
      const d = new Date(date + 'T00:00:00')
      prettyDate = d.toLocaleDateString(undefined, {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    }
    onChange && onChange({ date, time12, prettyDate, ready: !!date })
  }, [date, hour, minute, ampm, onChange])

  // no past dates
  const today = new Date()
  const min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const fieldStyle = {
    fontFamily: 'inherit', fontSize: 16, padding: '12px 14px', borderRadius: 14,
    border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)',
    outline: 'none',
  }
  const label = { display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6, letterSpacing: .3 }

  return (
    <div style={{ display: 'grid', gap: 18, maxWidth: 420, margin: '0 auto', textAlign: 'left' }}>
      <div>
        <span style={label}>📅 which day?</span>
        <input type="date" value={date} min={min} onChange={(e) => setDate(e.target.value)}
          style={{ ...fieldStyle, width: '100%' }} />
      </div>

      <div>
        <span style={label}>⏰ what time?</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={hour} onChange={(e) => setHour(+e.target.value)} style={fieldStyle}>
            {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
          <span style={{ fontWeight: 700, fontSize: 20 }}>:</span>
          <select value={minute} onChange={(e) => setMinute(e.target.value)} style={fieldStyle}>
            {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
            {['AM', 'PM'].map((p) => (
              <button key={p} type="button" onClick={() => setAmpm(p)}
                style={{
                  ...fieldStyle, cursor: 'pointer', fontWeight: 600,
                  color: ampm === p ? '#fff' : 'var(--muted)',
                  background: ampm === p ? 'linear-gradient(120deg,var(--accent),var(--accent2))' : 'var(--card)',
                  border: ampm === p ? '1px solid transparent' : '1px solid var(--border)',
                }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
