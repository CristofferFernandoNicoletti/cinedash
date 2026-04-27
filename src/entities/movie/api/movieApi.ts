import { tmdbClient } from '@/shared/lib/tmdb'
import type { Movie, MovieDetail, Genre, PaginatedResponse, Cast } from '../model/types'

interface VideoResult {
  site: string
  type: string
  key: string
}

export const movieApi = {
  getPopular: (page = 1, with_genres?: number | null) => {
    if (with_genres) {
      return tmdbClient
        .get<PaginatedResponse<Movie>>('/discover/movie', {
          params: { page, with_genres, sort_by: 'popularity.desc' },
        })
        .then((r) => r.data)
    }
    return tmdbClient
      .get<PaginatedResponse<Movie>>('/movie/popular', { params: { page } })
      .then((r) => r.data)
  },

  search: (query: string, page = 1) =>
    tmdbClient
      .get<PaginatedResponse<Movie>>('/search/movie', {
        params: { query, page },
      })
      .then((r) => r.data),

  getById: (id: number, type: 'movie' | 'tv' = 'movie') =>
    tmdbClient.get<MovieDetail>(`/${type}/${id}`).then((r) => r.data),

  getCredits: (id: number, type: 'movie' | 'tv' = 'movie') =>
    tmdbClient
      .get<{ cast: Cast[] }>(`/${type}/${id}/credits`)
      .then((r) => r.data.cast.slice(0, 10)),

  getGenres: () =>
    tmdbClient
      .get<{ genres: Genre[] }>('/genre/movie/list')
      .then((r) => r.data.genres),

  getTrailer: async (id: number, type: 'movie' | 'tv' = 'movie'): Promise<string | null> => {
    const { data } = await tmdbClient.get(`/${type}/${id}/videos`)
    const trailer = (data.results as VideoResult[])?.find(
      (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    )
    return trailer ? trailer.key : null
  },

  // Trending (filmes + séries populares)
  getTrending: (page = 1) =>
    tmdbClient
      .get<PaginatedResponse<Movie>>('/trending/all/week', {
        params: { page },
      })
      .then((r) => r.data),

  // Séries populares
  getPopularTv: (page = 1, with_genres?: number | null) => {
    if (with_genres) {
      return tmdbClient
        .get<PaginatedResponse<Movie>>('/discover/tv', {
          params: { page, with_genres, sort_by: 'popularity.desc' },
        })
        .then((r) => r.data)
    }
    return tmdbClient
      .get<PaginatedResponse<Movie>>('/tv/popular', { params: { page } })
      .then((r) => r.data)
  },

  // Busca séries
  searchTv: (query: string, page = 1) =>
    tmdbClient
      .get<PaginatedResponse<Movie>>('/search/tv', {
        params: { query, page },
      })
      .then((r) => r.data),

  // Gêneros de séries
  getTvGenres: () =>
    tmdbClient
      .get<{ genres: Genre[] }>('/genre/tv/list')
      .then((r) => r.data.genres),

  // Filmes por filtros avançados
  discover: (params: {
    page?: number
    with_genres?: string
    primary_release_year?: number
    'vote_average.gte'?: number
    sort_by?: string
  }) =>
    tmdbClient
      .get<PaginatedResponse<Movie>>('/discover/movie', { params })
      .then((r) => r.data),

  // Similares (filmes ou séries)
  getSimilar: (id: number, type: 'movie' | 'tv' = 'movie') =>
    tmdbClient
      .get<PaginatedResponse<Movie>>(`/${type}/${id}/similar`)
      .then((r) => r.data.results.slice(0, 12)),
}
