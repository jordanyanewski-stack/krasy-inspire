'use client'

import AdminNav from '@/components/admin/AdminNav'
import { useState, useEffect } from 'react'

type Category = { slug: string; name: string }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories)
  }, [])

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }

  function handleNameChange(val: string) {
    setName(val)
    if (!slugManual) setSlug(slugify(val))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!slug || !name) { setError('Попълни и двете полета'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setCategories(data)
      setName('')
      setSlug('')
      setSlugManual(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(s: string) {
    if (!confirm(`Изтрий категория "${s}"?`)) return
    const res = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: s }),
    })
    const data = await res.json()
    if (res.ok) setCategories(data)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.875rem',
    border: '1px solid #e0d8cc',
    borderRadius: '0.625rem',
    background: '#fff',
    color: 'var(--ink)',
    fontSize: '0.9rem',
    outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--ink-soft)',
    marginBottom: '0.375rem',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminNav />
      <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.75rem', color: 'var(--ink)', fontWeight: 400, marginBottom: '1.5rem' }}>
          Категории
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
          {/* List */}
          <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #e0d8cc', overflow: 'hidden' }}>
            {categories.length === 0 ? (
              <p style={{ padding: '2rem', color: 'var(--ink-soft)', textAlign: 'center' }}>Няма категории</p>
            ) : (
              categories.map((cat, i) => (
                <div key={cat.slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderTop: i > 0 ? '1px solid #f0ebe3' : 'none' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>{cat.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.1rem' }}>{cat.slug}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.slug)}
                    style={{ padding: '0.35rem 0.75rem', background: '#fee2e2', border: 'none', borderRadius: '0.5rem', color: '#c0392b', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Изтрий
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add form */}
          <div>
            <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e0d8cc' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem', color: 'var(--ink)', fontWeight: 400, marginBottom: '1rem' }}>
                Добави категория
              </h2>
              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Име</label>
                  <input type="text" value={name} onChange={e => handleNameChange(e.target.value)} placeholder="Духовност" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => { setSlugManual(true); setSlug(e.target.value) }}
                    placeholder="spirituality"
                    style={inputStyle}
                  />
                </div>
                {error && <p style={{ color: '#c0392b', fontSize: '0.8rem' }}>{error}</p>}
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '0.7rem', background: 'var(--ink)', border: 'none', borderRadius: '0.625rem', color: '#fdf8f2', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {saving ? 'Запазване…' : 'Добави'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
