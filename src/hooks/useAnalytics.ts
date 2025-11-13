import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { bookmarksApi } from '@/api/bookmarks'

export function useAnalytics() {
  const analyticsQuery = useQuery({
    queryKey: ['analytics'],
    queryFn: () => bookmarksApi.getAnalytics(),
    placeholderData: keepPreviousData,
  })

  return {
    analytics: analyticsQuery.data?.data ?? [],
    isLoading: analyticsQuery.isLoading,
    isError: analyticsQuery.isError,
    error: analyticsQuery.error,
    refetch: analyticsQuery.refetch,
  }
}
