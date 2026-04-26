import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage'
import { WatchlistPage } from '@/pages/WatchlistPage/WatchlistPage'
import { useAuthStore } from '@/features/auth/model/authStore'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// Guard reutilizável
const requireAuth = () => {
  const { isAuthenticated } = useAuthStore.getState()
  if (!isAuthenticated) throw redirect({ to: '/login' })
}

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: requireAuth,
  component: DashboardPage,
})

const watchlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watchlist',
  beforeLoad: requireAuth,
  component: WatchlistPage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  watchlistRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
