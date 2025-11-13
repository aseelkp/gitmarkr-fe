import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import RegisterForm from '@/components/auth/RegisterForm.tsx'

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "register",
  component: RegisterForm,
})