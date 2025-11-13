import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BookmarkCreate } from '@/lib/types'
import { bookmarksApi } from '@/api/bookmarks'
import { searchApi } from '@/api/search'

type SearchUsersParams = {
  query: string
  page?: number
  perPage?: number
}

type SearchReposVariables = {
  query: string
  page?: number
  perPage?: number
}

type SearchUserReposVariables = {
  username: string
  page?: number
  perPage?: number
}

export function useSearch() {
  const queryClient = useQueryClient()

  const searchUsersMutation = useMutation({
    mutationFn: ({ query, page = 1, perPage = 10 }: SearchUsersParams) =>
      searchApi.searchUsers(query, page, perPage),
    onError: (error) => {
      toast.error(error.message || 'Failed to search users')
    },
  })

  const searchReposMutation = useMutation({
    mutationFn: ({ query, page = 1, perPage = 10 }: SearchReposVariables) =>
      searchApi.searchRepositories(query, page, perPage),
    onError: (error) => {
      toast.error(error.message || 'Failed to search repositories')
    },
  })

  const searchUserReposMutation = useMutation({
    mutationFn: ({
      username,
      page = 1,
      perPage = 10,
    }: SearchUserReposVariables) =>
      searchApi.searchUserRepos(username, page, perPage),
    onError: (error) => {
      toast.error(error.message || 'Failed to search user repositories')
    },
  })

  const bookmarkMutation = useMutation({
    mutationFn: (payload: BookmarkCreate) =>
      bookmarksApi.createBookmark(payload),
    onSuccess: () => {
      toast.success('Bookmark created successfully')
      queryClient.invalidateQueries({ queryKey: ['bookmarks', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['search', 'userRepos'] })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create bookmark')
    },
  })

  const deleteBookmarkMutation = useMutation({
    mutationFn: (id: string) => bookmarksApi.deleteBookmark(id),
    onSuccess: () => {
      toast.success('Bookmark deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['bookmarks', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['search', 'userRepos'] })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete bookmark')
    },
  })
  return {
    searchUsers: searchUsersMutation.mutateAsync,
    usersResult: searchUsersMutation.data?.data?.items ?? [],
    usersTotal: searchUsersMutation.data?.data?.total_count ?? 0,
    usersMeta: searchUsersMutation.data?.pagination,
    usersLoading: searchUsersMutation.isPending,
    usersError: searchUsersMutation.isError ? searchUsersMutation.error : null,

    searchRepositories: searchReposMutation.mutateAsync,
    repositoriesResult: searchReposMutation.data?.data?.items ?? [],
    repositoriesTotal: searchReposMutation.data?.data?.total_count ?? 0,
    repositoriesMeta: searchReposMutation.data?.pagination,
    repositoriesLoading: searchReposMutation.isPending,
    repositoriesError: searchReposMutation.isError
      ? searchReposMutation.error
      : null,

    searchUserRepos: searchUserReposMutation.mutateAsync,
    userReposResult: searchUserReposMutation.data?.data ?? [],
    userReposTotal: searchUserReposMutation.data?.data?.length ?? 0,
    userReposMeta: searchUserReposMutation.data?.pagination,
    userReposLoading: searchUserReposMutation.isPending,
    userReposError: searchUserReposMutation.isError
      ? searchUserReposMutation.error
      : null,

    bookmarkRepository: bookmarkMutation.mutateAsync,
    bookmarkLoading: bookmarkMutation.isPending,

    deleteBookmark: deleteBookmarkMutation.mutateAsync,
    deleteBookmarkLoading: deleteBookmarkMutation.isPending,
  }
}
