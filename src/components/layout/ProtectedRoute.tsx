import { Navigate } from '@tanstack/react-router'
import { authUtils } from '@/lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  console.log('ProtectedRoute isAuthenticated', authUtils.isAuthenticated())
  if (!authUtils.isAuthenticated()) {
    return <Navigate to="/login" />
  }
  
  return <>{children}</>
}