// src/pages/Upload.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Inline file upload box ──────────────────────────────────────────────────
function UploadBox({ file, onFileSelect }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (f) => {
    setError('')
    if (!f) return
    const ok = f.name.endsWith('.pdf') || f.name.endsWith('.docx')
    if (!ok) { setError('Only PDF and DOCX files are accepted.'); return }
    if (f.size > 10 * 1024 * 1024) { setError('File must be under 10 MB.'); return }
    onFileSelect(f)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => document.getElementById('resume-input').click()}
        style={{
          border: `2px dashed ${dragging ? '#22c55e' : file ? '#86efac' : '#e2e8f0'}`,
          borderRadius: 16,
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? '#f0fdf4' : file ? '#f0fdf4' : '#fff',
          transition: 'all 0.2s',
        }}
      >
        <input
          id="resume-input"
          type="file"
          accept=".pdf,.docx"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>📄</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{file.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <span style={{ marginLeft: 'auto', color: '#22c55e', fontSize: 20 }}>✓</span>
            <button
              onClick={(e) => { e.stopPropagation(); onFileSelect(null) }}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%',
                       width: 24, height: 24, cursor: 'pointer', fontSize: 12 }}
            >✕</button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⬆️</div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: '#0f172a' }}>
              Drop your resume here
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
              or click to browse · PDF · DOCX · max 10 MB
            </p>
          </div>
        )}
      </div>
      {error && (
        <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>⚠ {error}</p>
      )}
    </div>
  )
}

// ── Loader ──────────────────────────────────────────────────────────────────
function Loader({ progress }) {
  const steps = ['Parsing resume...', 'Extracting skills...', 'Matching JD...', 'Generating insights...']
  const stepIdx = Math.min(Math.floor(progress / 25), 3)
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
      <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600 }}>{steps[stepIdx]}</h3>
      <p style={{ color: '#94a3b8', margin: '0 0 20px', fontSize: 14 }}>
        This may take a few seconds…
      </p>
      <div style={{ width: 240, height: 6, background: '#e2e8f0', borderRadius: 3,
                    margin: '0 auto 16px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#22c55e',
                      borderRadius: 3, transition: 'width 0.3s ease' }} />
      </div>
      <p style={{ fontSize: 13, color: '#94a3b8' }}>{Math.round(progress)}%</p>
    </div>
  )
}

// ── Main Upload page ─────────────────────────────────────────────────────────
export default function Upload() {
  const navigate = useNavigate()

  const [file,          setFile]          = useState(null)
  const [jd,            setJd]            = useState('')
  const [loading,       setLoading]       = useState(false)
  const [progress,      setProgress]      = useState(0)
  const [error,         setError]         = useState('')
  const [backendOnline, setBackendOnline] = useState(null)

  // Check if backend is alive
  useEffect(() => {
    fetch('https://resume-backend-gigu.onrender.com/health')
      .then(r => r.json())
      .then(d => setBackendOnline(d.status === 'healthy'))
      .catch(() => setBackendOnline(false))
  }, [])

  const canSubmit = file && jd.trim().length > 20 && !loading && backendOnline

  const handleSubmit = async () => {
    if (!canSubmit) return
    setError('')
    setLoading(true)
    setProgress(5)

    // Fake progress while backend processes
    const timer = setInterval(() => {
      setProgress(p => p < 85 ? p + Math.random() * 7 : p)
    }, 600)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('job_description', jd)

      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || `Server error ${response.status}`)
      }

      const result = await response.json()
      clearInterval(timer)
      setProgress(100)

      console.log('[Upload] Result:', result)

      setTimeout(() => {
        navigate('/dashboard', { state: { result } })
      }, 500)

    } catch (err) {
      clearInterval(timer)
      setLoading(false)
      setProgress(0)
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (loading) return <Loader progress={progress} />

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px' }}>
          Step 1 of 2
        </p>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 700 }}>
          Analyze your resume
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
          Upload your resume and paste a job description to get started.
        </p>
      </div>

      {/* Backend status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', borderRadius: 12, marginBottom: 20,
        fontSize: 12, fontWeight: 500,
        background: backendOnline === null ? '#f8fafc'
          : backendOnline ? '#f0fdf4' : '#fef2f2',
        color: backendOnline === null ? '#94a3b8'
          : backendOnline ? '#15803d' : '#dc2626',
        border: `1px solid ${backendOnline === null ? '#e2e8f0'
          : backendOnline ? '#bbf7d0' : '#fecaca'}`,
      }}>
        <span>{backendOnline === null ? '⏳' : backendOnline ? '🟢' : '🔴'}</span>
        {backendOnline === null && 'Checking backend…'}
        {backendOnline === true  && 'Backend connected — ready to analyze'}
        {backendOnline === false && 'Backend offline — start FastAPI on port 8000 first'}
      </div>

      {/* Upload card */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
                    padding: '1.25rem', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Your Resume</h2>
          <span style={{ fontSize: 11, background: '#f1f5f9', color: '#64748b',
                         padding: '2px 8px', borderRadius: 10 }}>PDF · DOCX</span>
        </div>
        <UploadBox file={file} onFileSelect={setFile} />
      </div>

      {/* JD card */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
                    padding: '1.25rem', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Job Description</h2>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10,
                         background: jd.length > 20 ? '#f0fdf4' : '#f1f5f9',
                         color: jd.length > 20 ? '#15803d' : '#64748b' }}>
            {jd.length} chars
          </span>
        </div>
        <textarea
          value={jd}
          onChange={e => setJd(e.target.value)}
          placeholder={'Paste the full job description here…\n\ne.g. "We are looking for a Python developer with FastAPI, Docker, PostgreSQL experience…"'}
          rows={10}
          style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0',
                   borderRadius: 12, padding: '10px 14px', fontSize: 13, lineHeight: 1.6,
                   resize: 'none', outline: 'none', fontFamily: 'inherit', color: '#0f172a',
                   boxSizing: 'border-box' }}
        />
        <p style={{ margin: '6px 0 0', fontSize: 11, color: '#cbd5e1' }}>
          Minimum 20 characters — more detail = better analysis.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: '#fef2f2',
                      border: '1px solid #fecaca', borderRadius: 12, marginBottom: 16,
                      fontSize: 13, color: '#dc2626' }}>
          <span>⚠</span>
          <div>
            <p style={{ margin: 0 }}>{error}</p>
            <button onClick={handleSubmit} style={{ marginTop: 6, background: 'none',
              border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 12,
              textDecoration: 'underline', padding: 0 }}>
              Try again →
            </button>
          </div>
        </div>
      )}

      {/* Submit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 50, border: 'none',
            background: canSubmit ? '#22c55e' : '#e2e8f0',
            color: canSubmit ? '#fff' : '#94a3b8',
            fontSize: 14, fontWeight: 600,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          🚀 Analyze Resume
        </button>
        {backendOnline === false && (
          <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>Start backend first</p>
        )}
        {backendOnline && !file && (
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>↑ Upload a resume first</p>
        )}
        {backendOnline && file && jd.trim().length <= 20 && (
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>↑ Add a job description</p>
        )}
      </div>
    </div>
  )
}