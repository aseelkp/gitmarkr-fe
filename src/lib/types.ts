// API Response Types
export interface StandardResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  errors?: Array<ErrorDetail>
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface ErrorDetail {
  field?: string | null
  code: string
  message: string
}

// Auth Types
export interface UserCreate {
  username: string
  email: string
  password: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user?: {
    id: string
    username: string
    email: string
  }
}

// Bookmark Types
export interface Bookmark {
  id: string
  repo_name: string
  repo_url: string
  repo_description: string | null
  repo_stars: number
  repo_forks: number
  repo_language: string | null
  owner_username: string
  created_at: string
  updated_at: string
}

export interface BookmarkCreate {
  repo_name: string
  repo_url: string
  repo_description: string | null
  repo_stars: number
  repo_forks: number
  repo_language: string | null
  owner_username: string
}

// Search Types
export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  type: string
  name?: string
  bio?: string
  public_repos?: number
  followers?: number
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  owner: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
}

// Analytics Types
export interface BookmarkAnalytics {
  date: string
  count: number
}

export interface ValidationError {
  loc: Array<string | number>
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail: Array<ValidationError>
}