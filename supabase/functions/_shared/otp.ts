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

// Placeholder until a real provider (nodemailer/Resend/SendGrid/Brevo) is
// wired up. Edge Function logs (`supabase functions logs <name>`) are
// where this ends up for now.
export function sendOtpEmailPlaceholder(email: string, otp: string): void {
  console.log(`[dev-only] OTP for ${email}: ${otp}`)
}
