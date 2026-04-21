import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { posts, categories } from '../src/db/schema'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function seed() {
  // Seed categories
  const catFile = path.join(process.cwd(), 'content/categories.json')
  const cats = JSON.parse(fs.readFileSync(catFile, 'utf-8'))
  for (const cat of cats) {
    await db.insert(categories).values(cat).onConflictDoNothing()
  }
  console.log(`✓ Seeded ${cats.length} categories`)

  // Seed posts
  const postsDir = path.join(process.cwd(), 'content/posts')
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
    const { data, content } = matter(raw)
    await db.insert(posts).values({
      slug,
      title: data.title ?? slug,
      date: data.date ? String(data.date) : new Date().toISOString().slice(0, 10),
      excerpt: data.excerpt ?? null,
      category: data.category ?? null,
      coverColor: data.coverColor ?? null,
      coverImage: data.coverImage ?? null,
      content: content.trim(),
      published: data.published !== false,
    }).onConflictDoNothing()
  }
  console.log(`✓ Seeded ${files.length} posts`)
  console.log('Done!')
}

seed().catch(console.error)
