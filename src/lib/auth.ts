export function verifyPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD
}

export function getSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN ?? ''
}

export function verifySessionToken(token: string): boolean {
  const expected = process.env.ADMIN_SESSION_TOKEN
  return Boolean(expected && token === expected)
}
