const TOKEN_KEY = 'access_token'
const USER_KEY = 'user'

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY)
}

const setUser = (user: unknown) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const getUser = () => {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export const authUtils = {
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
  setUser,
  getUser,
}
