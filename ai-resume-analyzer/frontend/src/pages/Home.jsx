// src/pages/Home.jsx ─ Landing / hero page
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Target, BarChart2 } from 'lucide-react'

// Reusable fade-up animation helper
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

const FEATURES = [
  { icon: <Zap size={18} />,       title: 'Instant Parsing',     desc: 'Upload PDF or DOCX — skills extracted automatically.' },
  { icon: <Target size={18} />,    title: 'Precision Matching',  desc: 'NLP comparison against any job description.' },
  { icon: <BarChart2 size={18} />, title: 'Actionable Insights', desc: 'Score, gaps, and personalised improvement tips.' },
]

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-10 px-6 md:px-14 pt-10 pb-24 max-w-5xl mx-auto"
    >
      {/* ── Hero ────────────────────────────── */}
      <section className="text-center space-y-6 pt-8">

        {/* Eyebrow badge */}
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                           bg-green-50 border border-green-200 text-xs font-semibold text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            AI-Powered Resume Analysis
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.08)}
          className="text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight text-ink"
        >
          AI Resume
          <br />
          <span className="text-brand">Analyzer</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          {...fadeUp(0.16)}
          className="text-base md:text-lg text-slate-500 max-w-lg mx-auto leading-relaxed"
        >
          Upload your resume, paste a job description, and get an instant AI-powered
          match score — skills matched, gaps identified, improvements suggested.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp(0.24)}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <Link to="/upload" className="btn px-8 py-3.5 text-sm">
            Get Started <ArrowRight size={16} />
          </Link>
          <a href="#features" className="btn-ghost px-8 py-3.5 text-sm">
            How It Works
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          {...fadeUp(0.32)}
          className="flex items-center justify-center gap-10 pt-2"
        >
          {[
            ['PDF & DOCX', 'Supported'],
            ['100+', 'Skills tracked'],
            ['< 5 s', 'Analysis time'],
          ].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <p className="font-bold text-lg text-ink">{val}</p>
              <p className="text-xs text-slate-400 font-mono">{lbl}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Feature cards ───────────────────── */}
      <motion.section
        id="features"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="grid md:grid-cols-3 gap-5 mt-20"
      >
        {FEATURES.map(({ icon, title, desc }) => (
          <motion.div
            key={title}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="glass p-6 space-y-3"
          >
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white">
              {icon}
            </div>
            <h3 className="font-bold text-base text-ink">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* ── How It Works ────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55 }}
        className="mt-16 glass p-8 md:p-12"
      >
        <p className="eyebrow mb-6">How It Works</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { n: '01', title: 'Upload Resume',         desc: 'Drag and drop your PDF or DOCX file.' },
            { n: '02', title: 'Paste Job Description', desc: 'Copy the job posting you want to match.' },
            { n: '03', title: 'Get Insights',          desc: 'Receive score, skill gaps, and tips.' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="flex gap-4">
              <span className="text-brand font-mono text-sm mt-0.5 flex-shrink-0">{n}</span>
              <div>
                <h4 className="font-semibold text-sm text-ink mb-1">{title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.main>
  )
}
