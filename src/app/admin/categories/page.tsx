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

  return (
    <div className="a-shell">
      <AdminNav />
      <main className="a-main a-fade">
        <div className="a-page-head">
          <div>
            <p className="a-eyebrow" style={{ marginBottom: '0.5rem' }}>Организация</p>
            <h1 className="a-page-title">Категории</h1>
            <p className="a-page-subtitle">{categories.length} {categories.length === 1 ? 'категория' : 'категории'}</p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 340px',
            gap: '1.5rem',
            alignItems: 'start',
          }}
          className="a-categories-grid"
        >
          <div className="a-card-flush">
            {categories.length === 0 ? (
              <p style={{ padding: '3rem', color: 'var(--a-text-soft)', textAlign: 'center', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem' }}>
                Още няма категории
              </p>
            ) : (
              <div className="a-list">
                {categories.map((cat) => (
                  <div key={cat.slug} className="a-list__row">
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p className="a-list__title">{cat.name}</p>
                      <p className="a-list__meta">
                        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.72rem' }}>{cat.slug}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(cat.slug)}
                      className="a-btn a-btn--danger a-btn--sm"
                    >
                      Изтрий
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="a-card" style={{ position: 'sticky', top: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <p className="a-eyebrow" style={{ marginBottom: '0.3rem' }}>Добавяне</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.25rem', color: 'var(--a-text)' }}>
                Нова категория
              </h2>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label className="a-label">Име</label>
                <input type="text" value={name} onChange={e => handleNameChange(e.target.value)} placeholder="Духовност" className="a-input" />
              </div>
              <div>
                <label className="a-label">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => { setSlugManual(true); setSlug(e.target.value) }}
                  placeholder="spirituality"
                  className="a-input"
                  style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem' }}
                />
              </div>
              {error && <div className="a-alert a-alert--danger">{error}</div>}
              <button
                type="submit"
                disabled={saving}
                className="a-btn a-btn--primary a-btn--full"
              >
                {saving ? 'Запазване…' : 'Добави категория'}
              </button>
            </form>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .a-categories-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </main>
    </div>
  )
}
