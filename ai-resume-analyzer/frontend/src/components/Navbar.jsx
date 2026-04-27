// src/components/Navbar.jsx ─ Top navigation bar
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/',       label: 'Home'    },
    { to: '/upload', label: 'Analyze' },
  ]

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative z-50 flex items-center justify-between px-6 md:px-14 py-4"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <span className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center
                         group-hover:scale-110 transition-transform duration-200 shadow-sm">
          <Zap size={16} className="text-white" fill="white" />
        </span>
        <span className="font-bold text-base tracking-tight text-ink">
          Resume<span className="text-brand">AI</span>
        </span>
      </Link>

      {/* Centre links with animated pill */}
      <div className="flex items-center gap-1 bg-white/70 backdrop-blur border
                      border-white/80 rounded-full px-2 py-1.5 shadow-card">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium
                        transition-colors duration-200 z-10
                        ${pathname === to ? 'text-ink' : 'text-slate-500 hover:text-ink'}`}
          >
            {/* Sliding background pill */}
            {pathname === to && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 bg-brand-light rounded-full -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            {label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link to="/upload" className="btn hidden md:inline-flex text-xs px-5 py-2.5">
        Get Started →
      </Link>
    </motion.nav>
  )
}
