import { corsHeaders, handleOptions } from '../_shared/cors.ts'
import { verifyAuthToken } from '../_shared/jwt.ts'
import { readAuthCookie } from '../_shared/cookie.ts'

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  const token = readAuthCookie(req)
  if (!token) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers })
  }

  try {
    const { sub, email } = await verifyAuthToken(token)
    return new Response(JSON.stringify({ id: sub, email }), { status: 200, headers })
  } catch {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers })
  }
})
