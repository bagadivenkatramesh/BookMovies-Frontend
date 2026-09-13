import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import ForbiddenPage from '../pages/ForbiddenPage'

export default function AdminRoute({ children }) {
  const { isAdmin, isAuthenticated } = useAuth()

  return (
    <ProtectedRoute>
      {isAuthenticated && !isAdmin ? <ForbiddenPage /> : children}
    </ProtectedRoute>
  )
}
