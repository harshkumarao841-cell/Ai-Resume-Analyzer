// src/App.jsx ─ Root component: routing + animated page transitions
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar    from './components/Navbar'
import Home      from './pages/Home'
import Upload    from './pages/Upload'
import Dashboard from './pages/Dashboard'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* ── Decorative background blobs ── */}
      <div
        className="pointer-events-none fixed top-[-160px] right-[-160px] w-[500px] h-[500px]
                   rounded-full bg-green-200/40 blur-3xl"
      />
      <div
        className="pointer-events-none fixed bottom-[80px] left-[-120px] w-[380px] h-[380px]
                   rounded-full bg-blue-200/30 blur-3xl"
      />

      <Navbar />

      {/* AnimatePresence enables exit animations between route changes */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"          element={<Home />}      />
          <Route path="/upload"    element={<Upload />}    />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
