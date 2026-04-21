import { NextRequest, NextResponse } from 'next/server'

async function verifyToken(token: string): Promise<boolean> {
  try {
    const decoded = atob(token.replace(/-/g, '+').replace(/_/g, '/'))
    const dot = decoded.lastIndexOf('.')
    if (dot === -1) return false
    const ts = decoded.slice(0, dot)
    const sig = decoded.slice(dot + 1)
    const secret = process.env.ADMIN_PASSWORD ?? ''
    if (!secret) return false

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const sigBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts))
    const expected = Array.from(new Uint8Array(sigBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    return sig === expected
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
