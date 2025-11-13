import type {
  GitHubRepository,
  GitHubUser,
  StandardResponse,
} from '@/lib/types'
import { apiClient } from '@/lib/api'

const searchUsers = async (
  query: string,
  page = 1,
  per_page = 10,
): Promise<StandardResponse<Array<GitHubUser>>> => {
  return apiClient.get(
    `/api/v1/search/users?query=${query}&page=${page}&per_page=${per_page}`,
  )
}

const searchRepositories = async (
  query: string,
  page = 1,
  per_page = 10,
): Promise<StandardResponse<Array<GitHubRepository>>> => {
  return apiClient.get(
    `/api/v1/search/repositories?query=${query}&page=${page}&per_page=${per_page}`,
  )
}

const searchUserRepos = async (
  username: string,
  page = 1,
  per_page = 10,
): Promise<StandardResponse<Array<GitHubRepository>>> => {
  return apiClient.get(
    `/api/v1/search/user-repos?username=${username}&page=${page}&per_page=${per_page}`,
  )
}

export const searchApi = {
  searchUsers,
  searchRepositories,
  searchUserRepos,
}
