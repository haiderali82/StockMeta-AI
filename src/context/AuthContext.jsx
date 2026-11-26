import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../lib/authApi'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [pendingEmail, setPendingEmail] = useState('')
  const [ticket, setTicket] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    authApi
      .me()
      .then((data) => setUser({ id: data.id, email: data.email }))
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  const isAuthenticated = Boolean(user)

  async function startLogin(email, password) {
    const data = await authApi.login(email, password)
    setPendingEmail(email)
    setTicket(data.ticket)
  }

  async function verifyOtp(code) {
    if (!ticket) throw new Error('Session expired. Please log in again.')
    const data = await authApi.verifyOtp(ticket, code)
    setTicket(null)
    setUser({ email: data.email })
  }

  async function resendOtp() {
    if (!ticket) throw new Error('Session expired. Please log in again.')
    await authApi.resendOtp(ticket)
  }

  async function logout() {
    await authApi.logout().catch(() => {})
    setUser(null)
  }

  const value = {
    isAuthenticated,
    ready,
    email: user?.email ?? null,
    pendingEmail,
    setPendingEmail,
    startLogin,
    verifyOtp,
    resendOtp,
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
