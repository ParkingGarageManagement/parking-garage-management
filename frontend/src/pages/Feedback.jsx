import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Feedback = () => {
  const { submitFeedback } = useAuth()
  const [form, setForm] = useState({ name: '', rating: 5, message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    const res = await submitFeedback(form)
    if (res.success) setStatus('success')
    else setStatus('error')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Feedback</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Rating</label>
            <select name="rating" value={form.rating} onChange={handleChange} className="input-field">
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Comments</label>
            <textarea name="message" value={form.message} onChange={handleChange} className="input-field min-h-[120px]" required />
          </div>

          <button className="btn btn-primary" type="submit">Submit Feedback</button>

          {status === 'success' && <p className="text-green-400 mt-2">Thanks for your feedback!</p>}
          {status === 'error' && <p className="text-red-400 mt-2">Failed to submit, try again.</p>}
        </form>
      </div>
    </motion.div>
  )
}

export default Feedback
