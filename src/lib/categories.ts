import { getDb } from '@/db'
import { categories } from '@/db/schema'
import { eq } from 'drizzle-orm'

export type Category = {
  slug: string
  name: string
}

export async function getAllCategories(): Promise<Category[]> {
  const db = getDb()
  const rows = await db.select().from(categories)
  return rows.map(r => ({ slug: r.slug, name: r.name }))
}

export async function addCategory(slug: string, name: string): Promise<Category[]> {
  const db = getDb()
  await db.insert(categories).values({ slug, name })
  return getAllCategories()
}

export async function deleteCategory(slug: string): Promise<Category[]> {
  const db = getDb()
  await db.delete(categories).where(eq(categories.slug, slug))
  return getAllCategories()
}
