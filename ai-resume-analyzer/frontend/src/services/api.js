import axios from 'axios'

const client = axios.create({
  baseURL: 'https://resume-backend-gigu.onrender.com',
  timeout: 60000,
})

export async function analyzeResume(file, jobDescription, onProgress) {
  const formData = new FormData()
  formData.append('resume', file)
  formData.append('job_description', jobDescription)

  const { data } = await client.post('/api/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress(e) {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total))
      }
    },
  })
  return data
}

export async function checkBackendHealth() {
  try {
    const { data } = await client.get('/health', { timeout: 3000 })
    return data.status === 'healthy'
  } catch { return false }
}

export default client