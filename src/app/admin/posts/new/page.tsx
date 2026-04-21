import AdminNav from '@/components/admin/AdminNav'
import PostEditor from '@/components/admin/PostEditor'
import { getAllCategories } from '@/lib/categories'

export default function NewPostPage() {
  const categories = getAllCategories()
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminNav />
      <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
        <PostEditor categories={categories} mode="create" />
      </main>
    </div>
  )
}
