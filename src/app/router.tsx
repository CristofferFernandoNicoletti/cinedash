import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage'
import { useAuthStore } from '@/features/auth/model/authStore'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) throw redirect({ to: '/login' })
  },
  component: DashboardPage,
})

const routeTree = rootRoute.addChildren([loginRoute, dashboardRoute])

export const router = createRouter({ routeTree })

// Tipagem necessária para o TanStack Router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
