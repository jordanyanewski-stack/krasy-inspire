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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminNav />
      <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.75rem', color: 'var(--ink)', fontWeight: 400 }}>
            Публикации
          </h1>
          <Link href="/admin/posts/new" style={{
            padding: '0.65rem 1.25rem',
            background: 'var(--ink)',
            color: '#fdf8f2',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontSize: '0.85rem',
          }}>
            + Нова публикация
          </Link>
        </div>

        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '1rem', border: '1px solid #e0d8cc' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.25rem', color: 'var(--ink-soft)' }}>
              Няма публикации
            </p>
            <Link href="/admin/posts/new" style={{ color: 'var(--gold)', fontSize: '0.875rem' }}>
              Създай първата публикация →
            </Link>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #e0d8cc', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fdf8f2', borderBottom: '1px solid #e0d8cc' }}>
                  {['Заглавие', 'Дата', 'Категория', 'Статус', ''].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', fontWeight: 400 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr key={post.slug} style={{ borderTop: i > 0 ? '1px solid #f0ebe3' : 'none' }}>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>{post.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.1rem' }}>{post.slug}</p>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--ink-mid)', whiteSpace: 'nowrap' }}>
                      {post.date}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--ink-mid)' }}>
                      {post.category ? (catMap[post.category] ?? post.category) : '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.7rem',
                        background: post.published !== false ? '#d4e8d8' : '#fee2e2',
                        color: post.published !== false ? '#2d6a4f' : '#c0392b',
                      }}>
                        {post.published !== false ? 'Публикувана' : 'Чернова'}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link
                          href={`/journal/${post.slug}`}
                          target="_blank"
                          style={{ padding: '0.35rem 0.75rem', background: '#f5f4f0', borderRadius: '0.5rem', fontSize: '0.75rem', color: 'var(--ink-mid)', textDecoration: 'none' }}
                        >
                          Виж ↗
                        </Link>
                        <Link
                          href={`/admin/posts/${post.slug}/edit`}
                          style={{ padding: '0.35rem 0.75rem', background: 'var(--ink)', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#fff', textDecoration: 'none' }}
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
