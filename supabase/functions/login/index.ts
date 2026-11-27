import { corsHeaders, handleOptions } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts'
import { checkRateLimit, clientIp } from '../_shared/rateLimit.ts'
import { generateOtp, hashOtp, sendOtpEmail, OTP_TTL_MS } from '../_shared/otp.ts'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  const { email, password } = await req.json().catch(() => ({}))

  if (typeof email !== 'string' || !EMAIL_RE.test(email) || typeof password !== 'string' || password.length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 400, headers })
  }

  const ip = clientIp(req)
  const ipOk = await checkRateLimit('login:ip', ip, 10, 15 * 60)
  const emailOk = await checkRateLimit('login:email', email.toLowerCase(), 5, 15 * 60)
  if (!ipOk || !emailOk) {
    return new Response(JSON.stringify({ error: 'Too many attempts. Please try again later.' }), { status: 429, headers })
  }

  // Verify the password the same way supabase-js's signInWithPassword does,
  // without keeping the session it issues — our own JWT only gets minted
  // after the OTP step succeeds.
  const tokenRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: Deno.env.get('SUPABASE_ANON_KEY')!,
    },
    body: JSON.stringify({ email, password }),
  })

  if (!tokenRes.ok) {
    return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401, headers })
  }

  const { user } = await tokenRes.json()

  const otp = generateOtp()
  const otpHash = await hashOtp(otp)

  await supabaseAdmin.from('login_otps').update({ used: true }).eq('user_id', user.id).eq('used', false)

  const { data: inserted, error } = await supabaseAdmin
    .from('login_otps')
    .insert({
      user_id: user.id,
      email: user.email,
      otp_hash: otpHash,
      otp_plain: otp,
      expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
    })
    .select('ticket')
    .single()

  if (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Could not start login. Please try again.' }), { status: 500, headers })
  }

  await sendOtpEmail(user.email, otp)

  return new Response(JSON.stringify({ message: 'OTP sent to your email', ticket: inserted.ticket }), { status: 200, headers })
})
