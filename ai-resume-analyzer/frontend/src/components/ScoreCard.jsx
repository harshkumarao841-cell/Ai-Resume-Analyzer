// src/components/ScoreCard.jsx ─ Animated circular match-score display
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

// Returns label + colour based on score value
function meta(score) {
  if (score >= 80) return { label: 'Excellent Match', color: '#22c55e', bg: 'bg-green-100',  text: 'text-green-800', emoji: '🔥' }
  if (score >= 60) return { label: 'Good Match',      color: '#86efac', bg: 'bg-green-50',   text: 'text-green-700', emoji: '✅' }
  if (score >= 40) return { label: 'Fair Match',      color: '#fbbf24', bg: 'bg-amber-50',   text: 'text-amber-700', emoji: '⚠️' }
  return               { label: 'Low Match',       color: '#f87171', bg: 'bg-red-50',     text: 'text-red-700',   emoji: '❌' }
}

export default function ScoreCard({ score }) {
  // Animate counter from 0 → score
  const [displayed, setDisplayed] = useState(0)
  const { label, color, bg, text, emoji } = meta(score)

  useEffect(() => {
    let n = 0
    const target = Math.round(score)
    const step   = Math.max(1, Math.ceil(target / 45))
    const timer  = setInterval(() => {
      n = Math.min(n + step, target)
      setDisplayed(n)
      if (n >= target) clearInterval(timer)
    }, 28)
    return () => clearInterval(timer)
  }, [score])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-8 flex flex-col items-center gap-5 text-center"
    >
      <p className="eyebrow">Match Score</p>

      {/* Circular progress */}
      <div className="w-40 h-40 relative">
        <CircularProgressbar
          value={displayed}
          text={`${displayed}%`}
          strokeWidth={9}
          styles={buildStyles({
            pathColor:           color,
            trailColor:          '#e2e8f0',
            textColor:           '#0f172a',
            textSize:            '20px',
            pathTransitionDuration: 0.5,
          })}
        />
        {/* Subtle glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 0px ${color}00`,
              `0 0 28px ${color}55`,
              `0 0 0px ${color}00`,
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Badge + description */}
      <div className="space-y-1.5">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
          {emoji} {label}
        </span>
        <p className="text-xs text-slate-400 leading-relaxed">
          Your resume covers <strong className="text-ink">{Math.round(score)}%</strong> of the job requirements
        </p>
      </div>

      {/* Gradient bar */}
      <div className="w-full">
        <div className="flex justify-between text-[10px] text-slate-300 font-mono mb-1">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
