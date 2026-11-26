import { Navigate, Route, Routes } from 'react-router-dom'
import SignInPage from './pages/SignInPage'
import VerifyCodePage from './pages/VerifyCodePage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { isAuthenticated, ready } = useAuth()

  if (!ready) return null

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignInPage />}
      />
      <Route
        path="/verify"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <VerifyCodePage />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
