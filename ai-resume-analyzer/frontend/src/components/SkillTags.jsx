// src/components/SkillTags.jsx ─ Animated skill badge grid
import { motion } from 'framer-motion'

// Stagger container / item variants
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}
const item = {
  hidden: { opacity: 0, scale: 0.75, y: 6 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 18 },
  },
}

// Colour map per variant
const STYLE = {
  matched: { badge: 'badge-green', dot: 'bg-green-500' },
  missing: { badge: 'badge-red',   dot: 'bg-red-400'   },
  neutral: { badge: 'badge-gray',  dot: 'bg-slate-400'  },
}

/**
 * @param {string[]} skills   List of skill strings
 * @param {'matched'|'missing'|'neutral'} variant
 * @param {string}   title    Section heading
 * @param {string}   emptyMsg Fallback when list is empty
 */
export default function SkillTags({ skills = [], variant = 'neutral', title, emptyMsg }) {
  const { badge, dot } = STYLE[variant] || STYLE.neutral

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center justify-between">
          <p className="eyebrow">{title}</p>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100
                           px-2 py-0.5 rounded-full">
            {skills.length}
          </span>
        </div>
      )}

      {skills.length === 0 ? (
        <p className="text-xs text-slate-400 italic">{emptyMsg || 'None found.'}</p>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2"
        >
          {skills.map((skill) => (
            <motion.span key={skill} variants={item} className={`badge ${badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {skill}
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  )
}
