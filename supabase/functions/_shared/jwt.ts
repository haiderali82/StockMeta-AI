import { SignJWT, jwtVerify } from 'npm:jose@5'

const secret = new TextEncoder().encode(Deno.env.get('JWT_SECRET')!)
const JWT_TTL_SECONDS = 24 * 60 * 60 // 24h, per claude/spec/login.md

export async function signAuthToken(userId: string, email: string): Promise<string> {
  return await new SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + JWT_TTL_SECONDS)
    .sign(secret)
}

export async function verifyAuthToken(token: string): Promise<{ sub: string; email: string }> {
  const { payload } = await jwtVerify(token, secret)
  return { sub: payload.sub as string, email: payload.email as string }
}

export const AUTH_COOKIE_MAX_AGE = JWT_TTL_SECONDS
