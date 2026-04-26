import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 minutos de cache
      gcTime: 1000 * 60 * 10,      // 10 minutos na memória
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
