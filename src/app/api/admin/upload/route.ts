import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'
import path from 'path'
import fs from 'fs'

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

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Неподдържан тип файл' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const uploadsDir = path.join(process.cwd(), 'public/uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(path.join(uploadsDir, safeName), buffer)

  return NextResponse.json({ url: `/uploads/${safeName}` })
}
