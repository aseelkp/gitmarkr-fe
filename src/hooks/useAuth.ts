import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authApi } from '@/api/auth'
import { authUtils } from '@/lib/auth'

export function useAuth() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.data?.access_token) {
        authUtils.setToken(response.data.access_token)
        authUtils.setUser(response.data.user)

        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
        navigate({ to: '/' })
        toast.success('Login successful')
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed')
    },

  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
        toast.success('Registration successful')
        navigate({ to: '/login' })
    },
    onError: (error) => {
        toast.error(error.message || 'Registration failed')
    },
  })

  const logout = () => {
    authUtils.removeAuth()
    queryClient.clear()
    navigate({ to: '/login' })
    toast.success('Logged out successfully')
  }

  const {data : user } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    enabled: authUtils.isAuthenticated(),
  })

  return {
    user : user?.data,
    isAuthenticated: authUtils.isAuthenticated(),
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  }
}
