import { supabaseAdmin } from './supabaseAdmin.ts'

/**
 * Fixed-window rate limit backed by `public.auth_rate_limits`.
 * Returns true if the request is allowed, false if the limit was hit.
 */
export async function checkRateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const now = Date.now()
  const { data: existing } = await supabaseAdmin
    .from('auth_rate_limits')
    .select('*')
    .eq('scope', scope)
    .eq('identifier', identifier)
    .maybeSingle()

  if (!existing) {
    await supabaseAdmin.from('auth_rate_limits').insert({ scope, identifier, window_start: new Date().toISOString(), count: 1 })
    return true
  }

  const windowStart = new Date(existing.window_start).getTime()
  if (now - windowStart > windowSeconds * 1000) {
    await supabaseAdmin
      .from('auth_rate_limits')
      .update({ window_start: new Date().toISOString(), count: 1 })
      .eq('id', existing.id)
    return true
  }

  if (existing.count >= limit) return false

  await supabaseAdmin.from('auth_rate_limits').update({ count: existing.count + 1 }).eq('id', existing.id)
  return true
}

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}
