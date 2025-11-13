import type {
  LoginResponse,
  StandardResponse,
  UserCreate,
  UserLogin,
} from '@/lib/types'
import { apiClient } from '@/lib/api'

const register = async (data: UserCreate): Promise<StandardResponse> => {
  return apiClient.post('/api/v1/auth/register', data)
}

const login = async (
  data: UserLogin,
): Promise<StandardResponse<LoginResponse>> => {
  return apiClient.post('/api/v1/auth/login', data)
}

const getMe = async (): Promise<StandardResponse> => {
  return apiClient.get('/api/v1/auth/me')
}

export const authApi = {
  register,
  login,
  getMe,
}
