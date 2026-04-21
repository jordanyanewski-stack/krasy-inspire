import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { verifySessionToken } from '@/lib/auth'
import { getPost, writePost, deletePost } from '@/lib/posts'

async function requireAuth() {
  const store = await cookies()
  const token = store.get('admin_token')?.value ?? ''
  return verifySessionToken(token)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Неоторизиран' }, { status: 401 })
  }
  const { slug } = await params
  try {
    return NextResponse.json(await getPost(slug))
  } catch {
    return NextResponse.json({ error: 'Не е намерен' }, { status: 404 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Неоторизиран' }, { status: 401 })
  }
  const { slug } = await params
  const body = await req.json()
  const { slug: _s, ...rest } = body
  await writePost(slug, rest)
  revalidatePath('/admin/posts')
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Неоторизиран' }, { status: 401 })
  }
  const { slug } = await params
  await deletePost(slug)
  revalidatePath('/admin/posts')
  return NextResponse.json({ ok: true })
}
