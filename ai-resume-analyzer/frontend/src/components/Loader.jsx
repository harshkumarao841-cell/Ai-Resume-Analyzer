// src/components/Loader.jsx ─ Animated analysis progress screen
import { motion } from 'framer-motion'

const STEPS = [
  'Parsing resume...',
  'Extracting skills...',
  'Matching job description...',
  'Generating insights...',
]

export default function Loader({ progress = 0 }) {
  // Which step label to show based on progress 0-100
  const stepIdx = Math.min(Math.floor(progress / 25), STEPS.length - 1)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center gap-8 py-20"
    >
      {/* Pulsing rings */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-brand"
            animate={{ scale: [1, 1.8 + i * 0.3], opacity: [0.8, 0] }}
            transition={{
              duration: 1.8,
              delay: i * 0.45,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
        {/* Centre dot */}
        <motion.div
          className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white text-xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✦
        </motion.div>
      </div>

      {/* Step label */}
      <div className="text-center space-y-1">
        <motion.p
          key={stepIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-lg text-ink"
        >
          {STEPS[stepIdx]}
        </motion.p>
        <p className="text-sm text-slate-400">This may take a few seconds…</p>
      </div>

      {/* Progress bar */}
      <div className="w-60 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand rounded-full"
          initial={{ width: '4%' }}
          animate={{ width: `${Math.max(progress, 6)}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      {/* Step dots */}
      <div className="flex gap-2">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300
              ${i <= stepIdx ? 'bg-brand' : 'bg-slate-200'}`}
            animate={i === stepIdx ? { scale: [1, 1.35, 1] } : {}}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  )
}
