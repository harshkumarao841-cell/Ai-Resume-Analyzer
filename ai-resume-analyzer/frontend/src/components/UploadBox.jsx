// src/components/UploadBox.jsx ─ Drag-and-drop resume upload widget
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react'

// MIME types accepted by the backend
const ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

// Format bytes → human-readable string
const fmt = (bytes) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

export default function UploadBox({ file, onFileSelect }) {
  const [error, setError] = useState('')

  const onDrop = useCallback(
    (accepted, rejected) => {
      setError('')
      if (rejected.length > 0) {
        setError('Only PDF and DOCX files are accepted (max 10 MB).')
        return
      }
      if (accepted.length > 0) onFileSelect(accepted[0])
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const remove = (e) => {
    e.stopPropagation()
    onFileSelect(null)
    setError('')
  }

  return (
    <div className="space-y-2">
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8
                    text-center transition-all duration-250
                    ${isDragActive
                      ? 'border-brand bg-green-50'
                      : file
                        ? 'border-brand/50 bg-green-50/60'
                        : 'border-slate-200 bg-white/50 hover:border-brand/40 hover:bg-green-50/30'
                    }`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">

          {/* ── File selected ── */}
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-brand" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="font-semibold text-sm text-ink truncate">{file.name}</p>
                <p className="text-xs text-slate-400 font-mono">{fmt(file.size)}</p>
              </div>
              <CheckCircle2 size={18} className="text-brand flex-shrink-0" />
              <button
                onClick={remove}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-100
                           hover:text-red-500 flex items-center justify-center
                           transition-colors duration-150 flex-shrink-0"
              >
                <X size={14} />
              </button>
            </motion.div>

          /* ── Dragging ── */
          ) : isDragActive ? (
            <motion.div
              key="drag"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="w-12 h-12 rounded-2xl bg-brand mx-auto flex items-center justify-center"
              >
                <Upload size={22} className="text-white" />
              </motion.div>
              <p className="font-semibold text-ink">Drop it here!</p>
            </motion.div>

          /* ── Empty ── */
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center">
                <Upload size={22} className="text-slate-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">Drop your resume here</p>
                <p className="text-xs text-slate-400 mt-1">
                  or <span className="underline underline-offset-2 cursor-pointer">click to browse</span>
                </p>
              </div>
              <p className="text-xs text-slate-300 font-mono">PDF · DOCX · max 10 MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-500 flex items-center gap-1.5 px-1"
          >
            <X size={12} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
