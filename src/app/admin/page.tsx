import AdminNav from '@/components/admin/AdminNav'
import { getAllPosts } from '@/lib/posts'
import { getAllCategories } from '@/lib/categories'
import Link from 'next/link'

export default async function AdminDashboard() {
  const posts = await getAllPosts()
  const categories = await getAllCategories()
  const published = posts.filter(p => p.published !== false)
  const drafts = posts.filter(p => p.published === false)
  const recent = posts.slice(0, 5)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminNav />
      <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.75rem', color: 'var(--ink)', fontWeight: 400, marginBottom: '0.25rem' }}>
          Добре дошла, Краси ✦
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Управлявай своето свещено пространство
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Публикувани', value: published.length, color: '#d4e8d8' },
            { label: 'Чернови', value: drafts.length, color: '#f7e8e8' },
            { label: 'Категории', value: categories.length, color: '#e8e0f0' },
            { label: 'Всички', value: posts.length, color: '#fdf8f2' },
          ].map(s => (
            <div key={s.label} style={{ background: s.color, borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '2rem', fontFamily: 'Cormorant Garamond, Georgia, serif', color: 'var(--ink)', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-mid)', marginTop: '0.25rem', letterSpacing: '0.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <Link href="/admin/posts/new" style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--ink)',
            color: '#fdf8f2',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
          }}>
            + Нова публикация
          </Link>
          <Link href="/admin/categories" style={{
            padding: '0.75rem 1.5rem',
            background: '#fff',
            color: 'var(--ink)',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
            border: '1px solid #e0d8cc',
          }}>
            Категории
          </Link>
        </div>

        {/* Recent posts */}
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.25rem', color: 'var(--ink)', fontWeight: 400, marginBottom: '1rem' }}>
          Последни публикации
        </h2>
        {recent.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.875rem' }}>Няма публикации още. <Link href="/admin/posts/new" style={{ color: 'var(--gold)' }}>Създай първата</Link>.</p>
        ) : (
          <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #e0d8cc', overflow: 'hidden' }}>
            {recent.map((post, i) => (
              <div key={post.slug} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1.25rem',
                borderTop: i > 0 ? '1px solid #f0ebe3' : 'none',
              }}>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink)', fontWeight: 400 }}>{post.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.1rem' }}>
                    {post.date} · {post.category ?? 'без категория'}
                    {post.published === false && (
                      <span style={{ marginLeft: '0.5rem', padding: '0.1rem 0.4rem', background: '#f7e8e8', borderRadius: '0.25rem', color: '#c0392b', fontSize: '0.7rem' }}>
                        Чернова
                      </span>
                    )}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/posts/${post.slug}/edit`} style={{
                    padding: '0.4rem 0.875rem',
                    background: '#f5f4f0',
                    color: 'var(--ink-mid)',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                  }}>
                    Редактирай
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
