import { corsHeaders, handleOptions } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts'
import { hashOtp, MAX_ATTEMPTS } from '../_shared/otp.ts'
import { signAuthToken, AUTH_COOKIE_MAX_AGE } from '../_shared/jwt.ts'
import { authCookieHeader } from '../_shared/cookie.ts'

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  const { ticket, otp } = await req.json().catch(() => ({}))
  if (typeof ticket !== 'string' || typeof otp !== 'string') {
    return new Response(JSON.stringify({ error: 'Code expired. Please request a new one.' }), { status: 400, headers })
  }

  const { data: record } = await supabaseAdmin
    .from('login_otps')
    .select('*')
    .eq('ticket', ticket)
    .eq('used', false)
    .maybeSingle()

  if (!record) {
    return new Response(JSON.stringify({ error: 'Code expired. Please request a new one.' }), { status: 400, headers })
  }

  if (new Date(record.expires_at).getTime() < Date.now()) {
    await supabaseAdmin.from('login_otps').update({ used: true }).eq('id', record.id)
    return new Response(JSON.stringify({ error: 'Code expired. Please request a new one.' }), { status: 400, headers })
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await supabaseAdmin.from('login_otps').update({ used: true }).eq('id', record.id)
    return new Response(JSON.stringify({ error: 'Too many attempts. Please log in again.' }), { status: 400, headers })
  }

  const submittedHash = await hashOtp(otp)
  if (submittedHash !== record.otp_hash) {
    const attempts = record.attempts + 1
    await supabaseAdmin.from('login_otps').update({ attempts }).eq('id', record.id)
    const remaining = MAX_ATTEMPTS - attempts
    if (remaining <= 0) {
      await supabaseAdmin.from('login_otps').update({ used: true }).eq('id', record.id)
      return new Response(JSON.stringify({ error: 'Too many attempts. Please log in again.' }), { status: 400, headers })
    }
    return new Response(JSON.stringify({ error: `Invalid code. ${remaining} attempts remaining.` }), { status: 400, headers })
  }

  await supabaseAdmin.from('login_otps').update({ used: true }).eq('id', record.id)

  const jwt = await signAuthToken(record.user_id, record.email)
  headers['Set-Cookie'] = authCookieHeader(jwt, AUTH_COOKIE_MAX_AGE)

  return new Response(JSON.stringify({ message: 'Logged in', email: record.email }), { status: 200, headers })
})
