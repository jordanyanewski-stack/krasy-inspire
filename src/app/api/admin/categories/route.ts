import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'
import { getAllCategories, addCategory, deleteCategory } from '@/lib/categories'

async function requireAuth() {
  const store = await cookies()
  const token = store.get('admin_token')?.value ?? ''
  return verifySessionToken(token)
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Неоторизиран' }, { status: 401 })
  }
  return NextResponse.json(await getAllCategories())
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Неоторизиран' }, { status: 401 })
  }
  const { slug, name } = await req.json()
  if (!slug || !name) {
    return NextResponse.json({ error: 'Липсват полета' }, { status: 400 })
  }
  try {
    const updated = await addCategory(slug, name)
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 409 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Неоторизиран' }, { status: 401 })
  }
  const { slug } = await req.json()
  const updated = await deleteCategory(slug)
  return NextResponse.json(updated)
}
