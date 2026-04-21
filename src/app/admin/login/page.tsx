'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Грешка при влизане')
        return
      }
      router.push('/admin')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#fdf8f2' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem', color: 'var(--ink-soft)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Krasy Inspire
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2rem', color: 'var(--ink)', fontWeight: 400 }}>
            Администрация
          </h1>
          <div className="divider mt-3">
            <span className="divider-ornament">✦</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          <div>
            <label
              htmlFor="password"
              style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}
            >
              Парола
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="Въведи паролата"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #e0d8cc',
                borderRadius: '0.75rem',
                background: '#fdf8f2',
                color: 'var(--ink)',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#c0392b', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: 'var(--ink)',
              color: '#fdf8f2',
              border: 'none',
              borderRadius: '0.75rem',
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Влизане…' : 'Влез'}
          </button>
        </form>
      </div>
    </div>
  )
}
