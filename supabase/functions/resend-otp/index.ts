import { corsHeaders, handleOptions } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts'
import { generateOtp, hashOtp, sendOtpEmailPlaceholder, OTP_TTL_MS, RESEND_COOLDOWN_MS, MAX_RESENDS } from '../_shared/otp.ts'

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  const { ticket } = await req.json().catch(() => ({}))
  if (typeof ticket !== 'string') {
    return new Response(JSON.stringify({ error: 'Session expired. Please log in again.' }), { status: 400, headers })
  }

  const { data: record } = await supabaseAdmin
    .from('login_otps')
    .select('*')
    .eq('ticket', ticket)
    .eq('used', false)
    .maybeSingle()

  if (!record) {
    return new Response(JSON.stringify({ error: 'Session expired. Please log in again.' }), { status: 400, headers })
  }

  if (record.resend_count >= MAX_RESENDS) {
    return new Response(JSON.stringify({ error: 'Too many attempts. Please log in again.' }), { status: 400, headers })
  }

  const lastSent = record.last_resent_at ? new Date(record.last_resent_at).getTime() : new Date(record.created_at).getTime()
  if (Date.now() - lastSent < RESEND_COOLDOWN_MS) {
    return new Response(JSON.stringify({ error: 'Please wait before requesting a new code.' }), { status: 429, headers })
  }

  const otp = generateOtp()
  const otpHash = await hashOtp(otp)

  await supabaseAdmin
    .from('login_otps')
    .update({
      otp_hash: otpHash,
      otp_plain: otp,
      expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
      attempts: 0,
      resend_count: record.resend_count + 1,
      last_resent_at: new Date().toISOString(),
    })
    .eq('id', record.id)

  sendOtpEmailPlaceholder(record.email, otp)

  return new Response(JSON.stringify({ message: 'OTP sent to your email' }), { status: 200, headers })
})
