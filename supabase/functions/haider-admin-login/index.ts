import { corsHeaders, handleOptions } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  const adminKey = req.headers.get('x-admin-key')
  if (!adminKey || adminKey !== Deno.env.get('ADMIN_API_KEY')) {
    return new Response(JSON.stringify({ error: 'Not authorized' }), { status: 401, headers })
  }

  const { email, password } = await req.json().catch(() => ({}))

  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers })
  }
  if (typeof password !== 'string' || password.length < 8) {
    return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), { status: 400, headers })
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    const status = error.status === 422 || /already.*registered/i.test(error.message) ? 409 : 500
    return new Response(JSON.stringify({ error: error.message }), { status, headers })
  }

  return new Response(
    JSON.stringify({ message: 'User created', user: { id: data.user.id, email: data.user.email } }),
    { status: 201, headers },
  )
})
