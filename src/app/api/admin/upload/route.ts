import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'
import { put } from '@vercel/blob'

async function requireAuth() {
  const store = await cookies()
  const token = store.get('admin_token')?.value ?? ''
  return verifySessionToken(token)
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Неоторизиран' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'Няма файл' }, { status: 400 })
  }

  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm',
  ]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Неподдържан тип файл' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const safeName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const blob = await put(safeName, file, { access: 'public' })

  return NextResponse.json({ url: blob.url })
}
