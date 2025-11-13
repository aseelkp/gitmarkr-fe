import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { AnalyticsPage } from '@/components/analytics/Analytics'

export const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: () => (
    <ProtectedRoute>
      <AnalyticsPage />
    </ProtectedRoute>
  ),
})
