import { useState, useEffect, useCallback } from 'react'
import { burstHearts } from './FloatingHearts.jsx'
import { config } from '../config.js'

const EMOJIS = ['🍦','🍨','🍧','🍰','🧁','🍩','🍪','🎂']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeCards() {
  const chosen = shuffle(EMOJIS).slice(0, 6)
  return shuffle([...chosen, ...chosen].map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false })))
}

// Memory match game: flip cards and find pairs!
export default function CatchHearts() {
  const [cards, setCards] = useState(makeCards)
  const [selected, setSelected] = useState([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [locked, setLocked] = useState(false)

  const reset = () => { setCards(makeCards()); setSelected([]); setMoves(0); setWon(false); setLocked(false) }

  const flip = useCallback((id) => {
    if (locked) return
    setCards(prev => {
      const card = prev.find(c => c.id === id)
      if (!card || card.flipped || card.matched) return prev
      return prev.map(c => c.id === id ? { ...c, flipped: true } : c)
    })
    setSelected(prev => [...prev, id])
  }, [locked, cards])

  useEffect(() => {
    if (selected.length !== 2) return
    setLocked(true)
    setMoves(m => m + 1)
    const [a, b] = selected
    const ca = cards.find(c => c.id === a)
    const cb = cards.find(c => c.id === b)
    if (ca && cb && ca.emoji === cb.emoji) {
      setCards(prev => prev.map(c => (c.id === a || c.id === b) ? { ...c, matched: true } : c))
      setSelected([])
      setLocked(false)
      setTimeout(() => {
        setCards(prev => {
          const allDone = prev.every(c => c.matched)
          if (allDone) { burstHearts(); setWon(true) }
          return prev
        })
      }, 300)
    } else {
      setTimeout(() => {
        setCards(prev => prev.map(c => (c.id === a || c.id === b) ? { ...c, flipped: false } : c))
        setSelected([])
        setLocked(false)
      }, 900)
    }
  }, [selected])

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 14 }}>
        <span style={{ fontWeight: 600, color: 'var(--muted)', fontSize: 14 }}>moves: <span className="accent">{moves}</span></span>
        <button className="btn" onClick={reset} style={{ padding: '8px 20px', fontSize: 14 }}>
          {won ? 'Play again 🔁' : 'Restart'}
        </button>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10, maxWidth: 360, margin: '0 auto',
      }}>
        {cards.map(card => (
          <button key={card.id} onClick={() => flip(card.id)}
            style={{
              height: 72, borderRadius: 14, border: '2px solid var(--border)',
              fontSize: 30, cursor: card.matched ? 'default' : 'pointer',
              background: card.flipped || card.matched
                ? 'linear-gradient(135deg,var(--accent),var(--accent2,#b98bff))'
                : 'var(--card)',
              boxShadow: card.flipped || card.matched ? '0 4px 12px rgba(0,0,0,.15)' : 'none',
              transition: 'all .25s ease',
              transform: card.flipped || card.matched ? 'scale(1.05)' : 'scale(1)',
              opacity: card.matched ? 0.6 : 1,
            }}>
            {card.flipped || card.matched ? card.emoji : '❓'}
          </button>
        ))}
      </div>

      {won && (
        <p className="script accent" style={{ fontSize: 24, marginTop: 20, animation: 'fadeUp .5s ease both' }}>
          {config.catchReward} 🎉
        </p>
      )}
    </div>
  )
}
