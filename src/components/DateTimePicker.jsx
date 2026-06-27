import { useEffect, useState } from 'react'

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

function isWeekend(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T00:00:00')
  return d.getDay() === 0 || d.getDay() === 6
}

// Returns the next Saturday date string from today
function nextWeekendDates() {
  const dates = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  // collect next 30 days worth of weekends
  for (let i = 0; i < 90; i++) {
    const day = d.getDay()
    if (day === 0 || day === 6) {
      dates.push(d.toISOString().slice(0, 10))
    }
    d.setDate(d.getDate() + 1)
  }
  return dates
}

export default function DateTimePicker({ onChange }) {
  const [date, setDate] = useState('')
  const [hour, setHour] = useState(5)
  const [minute, setMinute] = useState('00')
  const [ampm, setAmpm] = useState('PM')

  const weekendDates = nextWeekendDates()

  useEffect(() => {
    const time12 = `${hour}:${minute} ${ampm}`
    let prettyDate = ''
    if (date) {
      const d = new Date(date + 'T00:00:00')
      prettyDate = d.toLocaleDateString(undefined, {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    }
    onChange && onChange({ date, time12, prettyDate, ready: !!date && isWeekend(date) })
  }, [date, hour, minute, ampm, onChange])

  const fieldStyle = {
    fontFamily: 'inherit', fontSize: 16, padding: '12px 14px', borderRadius: 14,
    border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)',
    outline: 'none',
  }
  const label = { display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6, letterSpacing: .3 }

  return (
    <div style={{ display: 'grid', gap: 18, maxWidth: 420, margin: '0 auto', textAlign: 'left' }}>
      <div>
        <span style={label}>📅 pick a saturday or sunday</span>
        <select value={date} onChange={e => setDate(e.target.value)}
          style={{ ...fieldStyle, width: '100%' }}>
          <option value="">— choose a weekend day —</option>
          {weekendDates.map(d => {
            const obj = new Date(d + 'T00:00:00')
            const label = obj.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            return <option key={d} value={d}>{label}</option>
          })}
        </select>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, marginBottom: 0 }}>
          only saturdays & sundays available 🗓️
        </p>
      </div>

      <div>
        <span style={label}>⏰ what time?</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={hour} onChange={e => setHour(+e.target.value)} style={fieldStyle}>
            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <span style={{ fontWeight: 700, fontSize: 20 }}>:</span>
          <select value={minute} onChange={e => setMinute(e.target.value)} style={fieldStyle}>
            {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
            {['AM', 'PM'].map(p => (
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
