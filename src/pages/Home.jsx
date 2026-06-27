import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Character from "../components/Character.jsx"
import StepDots from "../components/StepDots.jsx"
import { config } from "../config.js"

function useCountup() {
  const [elapsed, setElapsed] = useState({})
  useEffect(() => {
    const start = new Date("2025-09-01T00:00:00")
    const calc = () => {
      const now = new Date()
      const diff = now - start
      const totalSec = Math.floor(diff / 1000)
      const days = Math.floor(totalSec / 86400)
      const hours = Math.floor((totalSec % 86400) / 3600)
      const mins = Math.floor((totalSec % 3600) / 60)
      const secs = totalSec % 60
      setElapsed({ days, hours, mins, secs })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])
  return elapsed
}

export default function Home() {
  const title = config.introTitle.replace("{name}", config.herName)
  const { days, hours, mins, secs } = useCountup()

  return (
    <div className="page" style={{ textAlign: "center", display: "flex",
      flexDirection: "column", alignItems: "center", minHeight: "78vh", justifyContent: "center" }}>
      <h1 className="h1 script accent">{title}</h1>
      <p className="lead" style={{ margin: "4px auto 20px" }}>{config.introSubtitle}</p>

      {/* Countdown */}
      <div style={{
        display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
        margin: "0 auto 28px", maxWidth: 480,
      }}>
        {[
          { val: days, label: "days" },
          { val: hours, label: "hours" },
          { val: mins, label: "mins" },
          { val: secs, label: "secs" },
        ].map(({ val, label }) => (
          <div key={label} style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "14px 18px", minWidth: 70,
            boxShadow: "0 4px 18px rgba(0,0,0,.08)",
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>
              {val ?? "—"}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, letterSpacing: 0.5 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: "var(--muted)", fontSize: 13, marginTop: -16, marginBottom: 16 }}>
        since the day we met 🗓️ 01 Sep 2025
      </p>

      <Character size={210} />

      <Link to="/games" className="btn" style={{ marginTop: 34 }}>{config.introButton}</Link>

      <p style={{ color: "var(--muted)", marginTop: 22, fontSize: 13 }}>
        psst — try clicking the little one 👆
      </p>

      <StepDots current={0} />
    </div>
  )
}
