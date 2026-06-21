import { useEffect, useState } from 'react'

// Types `text` out character by character once `start` is true.
export default function Typewriter({ text, start = true, speed = 35, style }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!start) { setN(0); return }
    if (n >= text.length) return
    const id = setTimeout(() => setN((c) => c + 1), speed)
    return () => clearTimeout(id)
  }, [n, start, text, speed])

  const done = n >= text.length
  return (
    <span style={style}>
      {text.slice(0, n)}
      <span style={{
        opacity: done ? 0 : 1,
        animation: 'caret 1s steps(1) infinite', color: 'var(--accent)', fontWeight: 700,
      }}>|</span>
      <style>{`@keyframes caret{50%{opacity:0}}`}</style>
    </span>
  )
}
