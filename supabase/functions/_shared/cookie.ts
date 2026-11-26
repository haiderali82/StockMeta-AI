const COOKIE_NAME = 'token'

export function readAuthCookie(req: Request): string | null {
  const header = req.headers.get('cookie') ?? ''
  for (const part of header.split(';')) {
    const [rawKey, ...rawVal] = part.trim().split('=')
    if (rawKey === COOKIE_NAME) return rawVal.join('=')
  }
  return null
}

// SameSite=None (not Strict) because this cookie is set by a different
// origin (*.supabase.co) than the frontend that calls it — a cross-site
// cookie only survives at all with None + Secure.
export function authCookieHeader(token: string, maxAgeSeconds: number): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${maxAgeSeconds}`
}

export function clearAuthCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0`
}
