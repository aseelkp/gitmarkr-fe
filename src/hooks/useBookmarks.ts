import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { bookmarksApi } from '@/api/bookmarks'

export function useBookmarks(page = 1, per_page = 10) {
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: ['bookmarks', 'list', page, per_page],
    queryFn: () => bookmarksApi.getAllBookmarks(page, per_page),
    placeholderData: keepPreviousData,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookmarksApi.deleteBookmark(id),
    onSuccess: () => {
      toast.success('Bookmark deleted successfully')
      queryClient.invalidateQueries({
        queryKey: ['bookmarks', 'list', page, per_page],
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete bookmark')
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: Array<string>) => bookmarksApi.bulkDeleteBookmarks(ids),
    onSuccess: () => {
      toast.success('Bookmarks deleted successfully')
      queryClient.invalidateQueries({
        queryKey: ['bookmarks', 'list', page, per_page],
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete bookmarks')
    },
  })

  const importMutation = useMutation({
    mutationFn: (file: File) => bookmarksApi.importFromCSV(file),
    onSuccess: (response) => {
      const importData = response.data
      if (!importData) {
        toast.error('Failed to import bookmarks')
        return
      }

      const { success_count, failed_count, errors, imported_bookmarks } =
        importData

      if (failed_count === 0 && success_count > 0) {
        toast.success(`${success_count} bookmarks imported successfully`)
        queryClient.invalidateQueries({
          queryKey: ['bookmarks', 'list', page, per_page],
        })
      } else if (success_count > 0 && failed_count > 0) {
        toast.warning(
          `Imported ${success_count} bookmarks successfully, but ${failed_count} bookmarks failed to import`,
          {
            duration: 5000,
          },
        )
        queryClient.invalidateQueries({
          queryKey: ['bookmarks', 'list', page, per_page],
        })
      } else if (failed_count > 0 && success_count === 0) {
        toast.error(`${failed_count} bookmarks failed to import`)
        return response
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to import bookmarks')
    },
  })

  return {
    listQuery,
    deleteBookmark: deleteMutation.mutateAsync,
    deleteLoading: deleteMutation.isPending,
    bulkDeleteBookmarks: bulkDeleteMutation.mutateAsync,
    bulkDeleteLoading: bulkDeleteMutation.isPending,
    importBookmarks: importMutation.mutateAsync,
    importLoading: importMutation.isPending,

    importMutation
  }
}
