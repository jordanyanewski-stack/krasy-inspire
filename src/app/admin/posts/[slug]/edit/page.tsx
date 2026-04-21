import AdminNav from '@/components/admin/AdminNav'
import PostEditor from '@/components/admin/PostEditor'
import { getPost } from '@/lib/posts'
import { getAllCategories } from '@/lib/categories'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = getAllCategories()

  let post
  try {
    post = getPost(slug)
  } catch {
    notFound()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminNav />
      <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
        <PostEditor
          categories={categories}
          mode="edit"
          initial={{
            slug: post.slug,
            title: post.title,
            date: post.date,
            category: post.category ?? '',
            excerpt: post.excerpt ?? '',
            coverColor: post.coverColor ?? '#e8c4c4',
            coverImage: post.coverImage ?? '',
            content: post.content,
            published: post.published !== false,
          }}
        />
      </main>
    </div>
  )
}
