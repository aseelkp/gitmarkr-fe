import { Navigate } from '@tanstack/react-router'
import { authUtils } from '@/lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authUtils.isAuthenticated()) {
    return <Navigate to="/login" />
  }
  
  return <>{children}</>
}