const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

async function call(path, options) {
  const res = await fetch(`${FUNCTIONS_URL}/${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Something went wrong')
  return body
}

export function login(email, password) {
  return call('login', { body: JSON.stringify({ email, password }) })
}

export function verifyOtp(ticket, otp) {
  return call('verify-otp', { body: JSON.stringify({ ticket, otp }) })
}

export function resendOtp(ticket) {
  return call('resend-otp', { body: JSON.stringify({ ticket }) })
}

export function logout() {
  return call('logout')
}

export function me() {
  return call('me', { method: 'GET', body: undefined })
}
