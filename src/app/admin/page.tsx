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

  const stats: Array<{ label: string; value: number; glow: string; accent: string; icon: string }> = [
    { label: 'Публикувани', value: published.length, glow: 'rgba(125, 211, 168, 0.18)', accent: 'var(--a-sage)', icon: '✦' },
    { label: 'Чернови',     value: drafts.length,    glow: 'rgba(240, 184, 184, 0.18)', accent: 'var(--a-blush)', icon: '◷' },
    { label: 'Категории',   value: categories.length, glow: 'rgba(201, 184, 232, 0.18)', accent: 'var(--a-lavender)', icon: '◈' },
    { label: 'Всички',      value: posts.length,     glow: 'rgba(212, 175, 122, 0.22)', accent: 'var(--a-gold)', icon: '⬡' },
  ]

  return (
    <div className="a-shell">
      <AdminNav />
      <main className="a-main a-fade">
        <div className="a-page-head">
          <div>
            <p className="a-eyebrow" style={{ marginBottom: '0.5rem' }}>Добре дошла</p>
            <h1 className="a-page-title">Краси ✦</h1>
            <p className="a-page-subtitle">Управлявай своето свещено пространство</p>
          </div>
          <div className="a-quick" style={{ marginBottom: 0 }}>
            <Link href="/admin/posts/new" className="a-btn a-btn--primary">
              <span>+</span> Нова публикация
            </Link>
            <Link href="/admin/categories" className="a-btn a-btn--ghost">
              Категории
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`a-stat a-fade a-fade-${i + 1}`}
              style={{ ['--_glow' as string]: s.glow, ['--_accent' as string]: s.accent }}
            >
              <span className="a-stat__icon">{s.icon}</span>
              <p className="a-stat__value">{s.value}</p>
              <p className="a-stat__label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent posts */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.35rem', color: 'var(--a-text)' }}>
            Последни публикации
          </h2>
          {posts.length > 0 && (
            <Link href="/admin/posts" style={{ color: 'var(--a-gold)', fontSize: '0.82rem', textDecoration: 'none' }}>
              Виж всички →
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="a-empty">
            <p className="a-empty__title">Още няма публикации</p>
            <Link href="/admin/posts/new" className="a-empty__cta">
              Създай първата →
            </Link>
          </div>
        ) : (
          <div className="a-card-flush">
            <div className="a-list">
              {recent.map((post) => (
                <div key={post.slug} className="a-list__row">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="a-list__title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </p>
                    <div className="a-list__meta">
                      <span>{post.date}</span>
                      <span style={{ color: 'var(--a-text-faint)' }}>·</span>
                      <span>{post.category ?? 'без категория'}</span>
                      {post.published === false && (
                        <span className="a-badge a-badge--draft">
                          <span className="a-badge__dot" />
                          Чернова
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/admin/posts/${post.slug}/edit`} className="a-btn a-btn--ghost a-btn--sm">
                    Редактирай
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
