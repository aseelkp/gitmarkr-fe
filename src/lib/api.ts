import axios from 'axios'
import type { AxiosError, AxiosInstance } from 'axios'
import type { ErrorDetail } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: Array<ErrorDetail>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('access_token')
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      const message = (error.response.data as any)?.message || error.message || 'An error occurred'
      throw new ApiError(error.response.status, message)
    } else {
      throw new ApiError(0, 'Network error - Please check your connection')
    }
  }
)

export { axiosInstance as apiClient }