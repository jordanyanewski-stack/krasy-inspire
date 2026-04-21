import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSessionToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Грешна парола' }, { status: 401 })
  }
  const token = createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('admin_token')
  return res
}
