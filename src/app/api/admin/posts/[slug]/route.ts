import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
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
    return NextResponse.json(getPost(slug))
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
  writePost(slug, rest)
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
  deletePost(slug)
  return NextResponse.json({ ok: true })
}
