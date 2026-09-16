import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ role, children }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'cliente' ? '/cliente' : '/agente'} replace />
  }
  return children
}
