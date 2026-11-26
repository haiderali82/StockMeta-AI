import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'stockmeta.auth'
const CREDENTIALS_KEY = 'stockmeta.credentials'
const AuthContext = createContext(null)

function readStoredEmail() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw).email : null
  } catch {
    return null
  }
}

function AuthProvider({ children }) {
  const [email, setEmail] = useState(readStoredEmail())
  const [pendingEmail, setPendingEmail] = useState('')
  const isAuthenticated = Boolean(email)

  function startLogin(nextEmail, password) {
    setPendingEmail(nextEmail)
    // Placeholder credential storage until a real backend exists.
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ email: nextEmail, password }))
  }

  function completeVerification() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: pendingEmail }))
    setEmail(pendingEmail)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setEmail(null)
  }

  const value = {
    isAuthenticated,
    email,
    pendingEmail,
    setPendingEmail,
    startLogin,
    completeVerification,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export { AuthProvider, useAuth }
