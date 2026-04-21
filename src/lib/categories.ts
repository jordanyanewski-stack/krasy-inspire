import fs from 'fs'
import path from 'path'

const categoriesFile = path.join(process.cwd(), 'content/categories.json')

export type Category = {
  slug: string
  name: string
}

export function getAllCategories(): Category[] {
  if (!fs.existsSync(categoriesFile)) return []
  try {
    return JSON.parse(fs.readFileSync(categoriesFile, 'utf-8')) as Category[]
  } catch {
    return []
  }
}

export function saveCategories(categories: Category[]): void {
  fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2), 'utf-8')
}

export function addCategory(slug: string, name: string): Category[] {
  const categories = getAllCategories()
  if (categories.find(c => c.slug === slug)) {
    throw new Error('Категорията вече съществува')
  }
  const updated = [...categories, { slug, name }]
  saveCategories(updated)
  return updated
}

export function deleteCategory(slug: string): Category[] {
  const categories = getAllCategories()
  const updated = categories.filter(c => c.slug !== slug)
  saveCategories(updated)
  return updated
}
