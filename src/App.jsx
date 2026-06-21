import { Routes, Route, useLocation } from 'react-router-dom'
import Controls from './components/Controls.jsx'
import CursorFollower from './components/CursorFollower.jsx'
import FloatingHearts from './components/FloatingHearts.jsx'
import HeartTrail from './components/HeartTrail.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import Home from './pages/Home.jsx'
import Games from './pages/Games.jsx'
import Tell from './pages/Tell.jsx'
import Ask from './pages/Ask.jsx'

export default function App() {
  const location = useLocation()
  return (
    <>
      <ParticleBackground />
      <CursorFollower />
      <HeartTrail />
      <FloatingHearts />
      <MusicPlayer />
      <Controls />

      {/* key on pathname re-triggers the page fade-in animation on navigation */}
      <main key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/tell" element={<Tell />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  )
}
