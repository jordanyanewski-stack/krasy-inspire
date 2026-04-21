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
    <div className="a-login">
      <div className="a-fade" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            className="a-aside__mark"
            style={{
              width: 52,
              height: 52,
              fontSize: '1.6rem',
              margin: '0 auto 1rem',
              display: 'flex',
            }}
          >
            ✦
          </div>
          <p className="a-eyebrow" style={{ marginBottom: '0.65rem' }}>Krasy Inspire</p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '2.15rem',
            color: 'var(--a-text)',
            fontWeight: 400,
            letterSpacing: '0.005em',
          }}>
            Администрация
          </h1>
          <p className="a-page-subtitle" style={{ marginTop: '0.5rem' }}>
            Влез, за да продължиш писането
          </p>
        </div>

        <form onSubmit={handleSubmit} className="a-login__card">
          <div style={{ marginBottom: '1.1rem' }}>
            <label htmlFor="password" className="a-label">Парола</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="Въведи паролата"
              className="a-input"
              style={{ padding: '0.85rem 1rem', fontSize: '1rem' }}
            />
          </div>

          {error && (
            <div className="a-alert a-alert--danger" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="a-btn a-btn--primary a-btn--lg a-btn--full"
            style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}
          >
            {loading ? 'Влизане…' : 'Влез'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--a-text-soft)', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          ✦ свещено пространство ✦
        </p>
      </div>
    </div>
  )
}
