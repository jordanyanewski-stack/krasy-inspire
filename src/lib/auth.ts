import crypto from 'crypto'

export function verifyPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD
}

export function createSessionToken(): string {
  const ts = Date.now().toString()
  const secret = process.env.ADMIN_PASSWORD ?? ''
  const sig = crypto.createHmac('sha256', secret).update(ts).digest('hex')
  return Buffer.from(`${ts}.${sig}`).toString('base64url')
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const dot = decoded.lastIndexOf('.')
    if (dot === -1) return false
    const ts = decoded.slice(0, dot)
    const sig = decoded.slice(dot + 1)
    const secret = process.env.ADMIN_PASSWORD ?? ''
    if (!secret) return false
    const expected = crypto.createHmac('sha256', secret).update(ts).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}
