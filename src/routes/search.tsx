import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { SearchPage } from "@/components/search/SearchPage";


export const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => (
    <ProtectedRoute>
      <SearchPage />
    </ProtectedRoute>
  ),
})