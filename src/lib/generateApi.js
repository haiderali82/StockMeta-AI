const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

// Calls the auth-gated /generate function for a single image. See the
// "/api/generate request order" in claude/spec/dashboard-logic.md: one
// image per request, auth checked server-side before any AI call.
export async function generateMetadata(file, platform) {
  const formData = new FormData()
  formData.append('image', file, file.name)
  formData.append('platform', platform)

  let res
  try {
    res = await fetch(`${FUNCTIONS_URL}/generate`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
  } catch {
    // fetch rejects (not an HTTP error response) only when the request never reached the server —
    // offline, DNS failure, CORS, etc. Flag it so callers can tell "never sent" from "server said no".
    const error = new Error('No internet connection or server down, the request was never sent.')
    error.isNetworkError = true
    throw error
  }

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(body.error || 'Something went wrong')
    error.status = res.status
    throw error
  }
  return body
}
