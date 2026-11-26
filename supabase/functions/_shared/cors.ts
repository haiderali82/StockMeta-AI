// Cross-origin setup for a browser SPA calling these functions directly.
// ALLOWED_ORIGINS is a comma-separated list set via `supabase secrets set`.
const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

export function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('origin') ?? ''
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] ?? ''

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    Vary: 'Origin',
  }
}

export function handleOptions(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req) })
  }
  return null
}
