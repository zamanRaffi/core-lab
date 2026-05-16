'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.status === 401) {
      setError('পাসওয়ার্ড ভুল! আবার চেষ্টা করুন।')
    } else if (!res.ok) {
      setError('সার্ভার সমস্যা। dev server রিস্টার্ট করে আবার চেষ্টা করুন।')
    } else {
      sessionStorage.setItem('admin_pw', password)
      router.push('/admin/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-gold-light text-3xl font-bold">Core Lab</div>
          <div className="text-white/40 text-sm mt-1">Admin Panel</div>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 text-sm"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-deep font-bold py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'লগইন হচ্ছে...' : '🔐 লগইন করুন'}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-white/30 text-xs hover:text-white/60 transition-colors">
            ← মূল ওয়েবসাইটে ফিরুন
          </a>
        </div>
      </div>
    </div>
  )
}
