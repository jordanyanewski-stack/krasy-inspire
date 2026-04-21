import AdminNav from '@/components/admin/AdminNav'
import PostEditor from '@/components/admin/PostEditor'
import { getAllCategories } from '@/lib/categories'

export default async function NewPostPage() {
  const categories = await getAllCategories()
  return (
    <div className="a-shell">
      <AdminNav />
      <main className="a-main a-fade">
        <PostEditor categories={categories} mode="create" />
      </main>
    </div>
  )
}
