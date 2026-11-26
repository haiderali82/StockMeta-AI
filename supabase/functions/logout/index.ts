import { corsHeaders, handleOptions } from '../_shared/cors.ts'
import { clearAuthCookieHeader } from '../_shared/cookie.ts'

Deno.serve((req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  headers['Set-Cookie'] = clearAuthCookieHeader()
  return new Response(JSON.stringify({ message: 'Logged out' }), { status: 200, headers })
})
