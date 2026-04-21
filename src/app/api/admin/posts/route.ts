import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { verifySessionToken } from '@/lib/auth'
import { getAllPosts, writePost } from '@/lib/posts'

async function requireAuth() {
  const store = await cookies()
  const token = store.get('admin_token')?.value ?? ''
  return verifySessionToken(token)
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Неоторизиран' }, { status: 401 })
  }
  return NextResponse.json(await getAllPosts())
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Неоторизиран' }, { status: 401 })
  }
  const body = await req.json()
  const { slug, ...rest } = body
  if (!slug || !rest.title) {
    return NextResponse.json({ error: 'Липсва slug или заглавие' }, { status: 400 })
  }
  await writePost(slug, rest)
  revalidatePath('/admin/posts')
  return NextResponse.json({ ok: true, slug })
}
