import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function Toast({ message, type = 'success' }) {
  const ok = type === 'success'
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      style={{
        position: 'fixed', top: 16, left: '50%',
        transform: 'translateX(-50%)', zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 20px', borderRadius: 24,
        background: ok ? '#3B6D11' : '#A32D2D', color: '#fff',
        fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
      }}
    >
      {ok ? <CheckCircle2 size={15}/> : <XCircle size={15}/>}
      {message}
    </motion.div>
  )
}