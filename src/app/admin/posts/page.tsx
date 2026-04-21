export const dynamic = 'force-dynamic'

import AdminNav from '@/components/admin/AdminNav'
import { getAllPosts } from '@/lib/posts'
import { getAllCategories } from '@/lib/categories'
import Link from 'next/link'

export default async function AdminPostsPage() {
  const posts = await getAllPosts()
  const categories = await getAllCategories()
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.name]))

  return (
    <div className="a-shell">
      <AdminNav />
      <main className="a-main a-fade">
        <div className="a-page-head">
          <div>
            <p className="a-eyebrow" style={{ marginBottom: '0.5rem' }}>Библиотека</p>
            <h1 className="a-page-title">Публикации</h1>
            <p className="a-page-subtitle">{posts.length} {posts.length === 1 ? 'публикация' : 'публикации'} общо</p>
          </div>
          <Link href="/admin/posts/new" className="a-btn a-btn--primary">
            <span>+</span> Нова публикация
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="a-empty">
            <p className="a-empty__title">Още няма публикации</p>
            <Link href="/admin/posts/new" className="a-empty__cta">
              Създай първата публикация →
            </Link>
          </div>
        ) : (
          <div className="a-card-flush" style={{ overflowX: 'auto' }}>
            <table className="a-table">
              <thead>
                <tr>
                  <th>Заглавие</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Дата</th>
                  <th>Категория</th>
                  <th>Статус</th>
                  <th style={{ textAlign: 'right' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.slug}>
                    <td>
                      <p className="a-table__title">{post.title}</p>
                      <p className="a-table__sub">{post.slug}</p>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--a-text-mid)' }}>{post.date}</td>
                    <td style={{ color: 'var(--a-text-mid)' }}>
                      {post.category ? (catMap[post.category] ?? post.category) : '—'}
                    </td>
                    <td>
                      {post.published !== false ? (
                        <span className="a-badge a-badge--success">
                          <span className="a-badge__dot" />
                          Публикувана
                        </span>
                      ) : (
                        <span className="a-badge a-badge--draft">
                          <span className="a-badge__dot" />
                          Чернова
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link
                          href={`/journal/${post.slug}`}
                          target="_blank"
                          className="a-btn a-btn--subtle a-btn--sm"
                        >
                          Виж ↗
                        </Link>
                        <Link
                          href={`/admin/posts/${post.slug}/edit`}
                          className="a-btn a-btn--primary a-btn--sm"
                        >
                          Редактирай
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
