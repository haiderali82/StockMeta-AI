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

// Table-based, inline-styled layout — the subset that renders consistently
// across Gmail/Outlook/Apple Mail, which strip <style> blocks and most
// modern CSS.
function otpEmailHtml(otp: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background-color:#ffffff;border-radius:16px;border:1px solid #e5e5e5;overflow:hidden;">
            <tr>
              <td style="padding:36px 32px 0 32px;" align="center">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#000000;border-radius:10px;width:36px;height:36px;" align="center" valign="middle">
                      <span style="color:#ffffff;font-size:18px;font-weight:700;line-height:36px;">S</span>
                    </td>
                    <td style="padding-left:10px;">
                      <span style="font-size:18px;font-weight:600;color:#000000;letter-spacing:-0.01em;">StockMeta<span style="font-weight:800;">AI</span></span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 0 32px;" align="center">
                <p style="margin:0;font-size:20px;line-height:28px;font-weight:600;color:#000000;letter-spacing:-0.015em;">Your login code</p>
                <p style="margin:8px 0 0 0;font-size:14px;line-height:20px;color:#666666;">
                  Enter this code to finish signing in. It expires in 5 minutes.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0 32px;" align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="background-color:#000000;border-radius:12px;padding:18px 0;" align="center">
                      <span style="font-family:'JetBrains Mono',Consolas,monospace;font-size:32px;font-weight:600;letter-spacing:0.3em;color:#ffffff;">${otp}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fafafa;border-radius:10px;border:1px solid #ececec;">
                  <tr>
                    <td style="padding:12px 14px;font-size:12px;line-height:17px;color:#666666;">
                      Didn't request this? You can safely ignore this email — your account is still secure.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;padding-top:28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #e5e5e5;font-size:0;line-height:0;">&nbsp;</td></tr></table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 32px 32px;" align="center">
                <p style="margin:0;font-size:11px;line-height:16px;color:#999999;">
                  &copy; 2025 StockMeta AI Inc. &middot; Microstock Metadata Engine
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
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
      html: otpEmailHtml(otp),
      text: `Your login code is ${otp}. It expires in 5 minutes. Didn't request this? You can ignore this email.`,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error(`Resend error (${res.status}): ${body}`)
  }
}
