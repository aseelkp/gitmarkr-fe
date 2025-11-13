import { Navigate, createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { authUtils } from '@/lib/auth'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Navigate to={authUtils.isAuthenticated() ? '/bookmarks' : '/login'} replace={true} />,
})