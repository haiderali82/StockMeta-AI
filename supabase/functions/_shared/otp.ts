export const OTP_TTL_MS = 5 * 60 * 1000
export const MAX_ATTEMPTS = 5
export const RESEND_COOLDOWN_MS = 60 * 1000
export const MAX_RESENDS = 3

export function generateOtp(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000
  return String(n).padStart(6, '0')
}

export async function hashOtp(otp: string): Promise<string> {
  const bytes = new TextEncoder().encode(otp)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Sends the OTP email via Resend (https://resend.com). Requires the
// RESEND_API_KEY secret; RESEND_FROM_EMAIL defaults to Resend's shared
// sandbox sender, which can only deliver to the Resend account's own
// verified address until a custom domain is verified.
export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev'

  if (!apiKey) {
    console.log(`[dev-only] RESEND_API_KEY not set. OTP for ${email}: ${otp}`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: `${otp} is your login code`,
      html: `<p>Your login code is <strong>${otp}</strong>.</p><p>It expires in 5 minutes. If you didn't request this, you can ignore this email.</p>`,
      text: `Your login code is ${otp}. It expires in 5 minutes.`,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error(`Resend error (${res.status}): ${body}`)
  }
}
