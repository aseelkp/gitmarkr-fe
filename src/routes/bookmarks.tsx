import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { BookmarksDashboard } from '@/components/bookmarks/BookmarksDashboard'

export const bookmarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookmarks',
  component: () => (
    <ProtectedRoute>
      <BookmarksDashboard />
    </ProtectedRoute>
  ),
})
