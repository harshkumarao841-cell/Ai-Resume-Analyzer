// src/pages/Dashboard.jsx ─ Full results dashboard
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, Lightbulb, CheckCircle2, XCircle, Brain, BarChart2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts'
import ScoreCard from '../components/ScoreCard'
import SkillTags from '../components/SkillTags'

// Staggered fade-up helper
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] },
})

// Custom recharts tooltip (styled to match design)
const ChartTip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="glass px-3 py-2 text-xs shadow-card">
      <p className="font-mono font-medium text-ink">{label}</p>
      <p className="text-brand font-bold">{payload[0].value}</p>
    </div>
  ) : null

export default function Dashboard() {
  const { state }  = useLocation()
  const navigate   = useNavigate()

  // Guard: if user navigates here directly without data
  if (!state?.result) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center
                      min-h-[60vh] gap-4 text-center px-6">
        <p className="text-2xl font-extrabold text-ink">No results found</p>
        <p className="text-sm text-slate-400">Please upload a resume and job description first.</p>
        <Link to="/upload" className="btn mt-2">Go to Upload</Link>
      </div>
    )
  }

  const { score, skills, matched_skills, missing_skills, suggestions } = state.result

  // ── Chart data ───────────────────────────────────────────────────────── //

  // Bar chart — top 10 skills from resume (matched bars taller)
  const barData = skills.slice(0, 10).map((s) => ({
    skill:   s.length > 12 ? s.slice(0, 11) + '…' : s,
    value:   matched_skills.includes(s) ? 2 : 1,
    matched: matched_skills.includes(s),
  }))

  // Radar — categorical breakdown
  const radarData = [
    { subject: 'Matched',   A: matched_skills.length },
    { subject: 'Missing',   A: missing_skills.length },
    { subject: 'Total JD',  A: matched_skills.length + missing_skills.length },
    { subject: 'In Resume', A: skills.length },
    { subject: 'Score /10', A: Math.round(score / 10) },
  ]

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-10 px-6 md:px-14 pt-8 pb-24 max-w-6xl mx-auto"
    >
      {/* ── Page header ──────────────────────── */}
      <motion.div
        {...fadeUp(0)}
        className="flex items-center justify-between mb-8 flex-wrap gap-4"
      >
        <div>
          <p className="eyebrow mb-1">Analysis Complete</p>
          <h1 className="text-3xl font-extrabold text-ink">Your Results</h1>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="btn-ghost text-xs px-5 py-2.5 flex items-center gap-2"
        >
          <RotateCcw size={13} /> Analyze Another
        </button>
      </motion.div>

      {/* ── Row 1: Score card + Stat tiles ───── */}
      <div className="grid md:grid-cols-3 gap-5 mb-5">

        {/* Score */}
        <motion.div {...fadeUp(0.05)}>
          <ScoreCard score={score} />
        </motion.div>

        {/* 4 stat tiles */}
        <motion.div {...fadeUp(0.1)} className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            {
              icon: <CheckCircle2 size={18} className="text-brand" />,
              value: matched_skills.length,
              label: 'Matched Skills',
              sub:   'In both resume & JD',
              ring:  'ring-green-100 bg-green-50/60',
            },
            {
              icon: <XCircle size={18} className="text-red-400" />,
              value: missing_skills.length,
              label: 'Missing Skills',
              sub:   'Required by JD, absent in resume',
              ring:  'ring-red-100 bg-red-50/60',
            },
            {
              icon: <Brain size={18} className="text-blue-400" />,
              value: skills.length,
              label: 'Total Skills',
              sub:   'Extracted from resume',
              ring:  'ring-blue-100 bg-blue-50/60',
            },
            {
              icon: <Lightbulb size={18} className="text-amber-400" />,
              value: suggestions.length,
              label: 'Suggestions',
              sub:   'Actionable improvements',
              ring:  'ring-amber-100 bg-amber-50/60',
            },
          ].map(({ icon, value, label, sub, ring }) => (
            <div
              key={label}
              className={`glass p-5 ring-1 ${ring} space-y-2`}
            >
              <div className="flex items-center justify-between">
                {icon}
                <span className="font-extrabold text-3xl text-ink">{value}</span>
              </div>
              <p className="font-semibold text-sm text-ink">{label}</p>
              <p className="text-[11px] text-slate-400">{sub}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Row 2: Matched / Missing skills ──── */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <motion.div {...fadeUp(0.15)} className="glass p-6">
          <SkillTags
            skills={matched_skills}
            variant="matched"
            title="✅ Matched Skills"
            emptyMsg="No matched skills found."
          />
        </motion.div>
        <motion.div {...fadeUp(0.20)} className="glass p-6">
          <SkillTags
            skills={missing_skills}
            variant="missing"
            title="❌ Missing Skills"
            emptyMsg="No missing skills — great job!"
          />
        </motion.div>
      </div>

      {/* ── Row 3: All resume skills ─────────── */}
      <motion.div {...fadeUp(0.25)} className="glass p-6 mb-5">
        <SkillTags
          skills={skills}
          variant="neutral"
          title="🧠 All Skills Found in Resume"
          emptyMsg="No skills extracted."
        />
      </motion.div>

      {/* ── Row 4: Charts ────────────────────── */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">

        {/* Bar chart */}
        <motion.div {...fadeUp(0.30)} className="glass p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-slate-400" />
            <p className="eyebrow">Skill Presence (top 10)</p>
          </div>

          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={18}>
                <XAxis
                  dataKey="skill"
                  tick={{ fontSize: 9, fontFamily: 'Inter', fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.matched ? '#22c55e' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-400 mt-4">Not enough data to chart.</p>
          )}

          {/* Legend */}
          <div className="flex gap-4 mt-3">
            {[['#22c55e', 'Matched'], ['#e2e8f0', 'Resume only']].map(([color, label]) => (
              <span key={label} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Radar chart */}
        <motion.div {...fadeUp(0.35)} className="glass p-6">
          <p className="eyebrow mb-4">Profile Overview</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 10, fontFamily: 'Inter', fill: '#94a3b8' }}
              />
              <Radar
                dataKey="A"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.22}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── Row 5: AI Suggestions ────────────── */}
      <motion.div {...fadeUp(0.40)} className="glass p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <Lightbulb size={14} className="text-white" />
          </div>
          <p className="eyebrow">AI Suggestions</p>
        </div>

        <ul className="space-y-4">
          {suggestions.map((tip, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.07, duration: 0.4 }}
              className="flex gap-3 text-sm leading-relaxed text-slate-600"
            >
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700
                           text-[10px] font-bold flex items-center justify-center mt-0.5"
              >
                {i + 1}
              </span>
              <span>{tip}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.main>
  )
}
