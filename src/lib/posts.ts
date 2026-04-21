import { getDb } from '@/db'
import { posts } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export type PostMeta = {
  slug: string
  title: string
  date: string
  excerpt?: string
  category?: string
  coverColor?: string
  coverImage?: string
  published?: boolean
}

export type Post = PostMeta & { content: string }

export async function getAllPosts(): Promise<PostMeta[]> {
  const db = getDb()
  const rows = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.date))
  return rows.map(rowToMeta)
}

export async function getPost(slug: string): Promise<Post> {
  const db = getDb()
  const [row] = await db.select().from(posts).where(eq(posts.slug, slug))
  if (!row) throw new Error(`Post not found: ${slug}`)
  return { ...rowToMeta(row), content: row.content }
}

export async function getAllSlugs(): Promise<string[]> {
  const db = getDb()
  const rows = await db.select({ slug: posts.slug }).from(posts).where(eq(posts.published, true))
  return rows.map(r => r.slug)
}

export async function writePost(slug: string, data: Omit<Post, 'slug'>): Promise<void> {
  const db = getDb()
  const values = {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt ?? null,
    category: data.category ?? null,
    coverColor: data.coverColor ?? null,
    coverImage: data.coverImage ?? null,
    content: data.content,
    published: data.published !== false,
    updatedAt: new Date(),
  }
  await db
    .insert(posts)
    .values(values)
    .onConflictDoUpdate({ target: posts.slug, set: values })
}

export async function deletePost(slug: string): Promise<void> {
  const db = getDb()
  await db.delete(posts).where(eq(posts.slug, slug))
}

function rowToMeta(row: typeof posts.$inferSelect): PostMeta {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    excerpt: row.excerpt ?? undefined,
    category: row.category ?? undefined,
    coverColor: row.coverColor ?? undefined,
    coverImage: row.coverImage ?? undefined,
    published: row.published,
  }
}
