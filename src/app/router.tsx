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
import { MovieDetailPage } from '@/pages/MovieDetailPage/MovieDetailPage'
import { useAuthStore } from '@/features/auth/model/authStore'

const rootRoute = createRootRoute({ component: () => <Outlet /> })

const requireAuth = () => {
  const { isAuthenticated } = useAuthStore.getState()
  if (!isAuthenticated) throw redirect({ to: '/login' })
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

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

const movieDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movie/$movieId',
  beforeLoad: requireAuth,
  validateSearch: (search: Record<string, unknown>) => ({
    type: (search.type === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv',
  }),
  component: MovieDetailPage,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/login' }) },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  watchlistRoute,
  movieDetailRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
