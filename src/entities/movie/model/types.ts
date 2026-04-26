export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetail extends Movie {
  genres: Genre[]
  runtime: number | null
  tagline: string
  status: string
  budget: number
  revenue: number
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type WatchlistStatus = 'want' | 'watching' | 'done'

export interface WatchlistMovie extends Movie {
  status: WatchlistStatus
  addedAt: string
}

// Helper para montar URL de imagem
export type ImageSize = 'w200' | 'w300' | 'w500' | 'original'

export const buildImageUrl = (
  path: string | null,
  size: ImageSize = 'w500'
): string | null => {
  if (!path) return null
  return `${import.meta.env.VITE_TMDB_IMAGE_URL}/${size}${path}`
}
