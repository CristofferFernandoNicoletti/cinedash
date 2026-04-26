import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movie, WatchlistStatus, WatchlistMovie } from '@/entities/movie/model/types'

interface WatchlistState {
  movies: WatchlistMovie[]
  addMovie: (movie: Movie) => void
  removeMovie: (id: number) => void
  updateStatus: (id: number, status: WatchlistStatus) => void
  isInWatchlist: (id: number) => boolean
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      movies: [],

      addMovie: (movie) =>
        set((state) => ({
          movies: [
            ...state.movies,
            {
              ...movie,
              status: 'want' as WatchlistStatus,
              addedAt: new Date().toISOString(),
            },
          ],
        })),

      removeMovie: (id) =>
        set((state) => ({
          movies: state.movies.filter((m) => m.id !== id),
        })),

      updateStatus: (id, status) =>
        set((state) => ({
          movies: state.movies.map((m) =>
            m.id === id ? { ...m, status } : m
          ),
        })),

      isInWatchlist: (id) => get().movies.some((m) => m.id === id),
    }),
    { name: 'cinedash-watchlist' }
  )
)
