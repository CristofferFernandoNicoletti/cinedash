import { tmdbClient } from '@/shared/lib/tmdb'
import type { Movie, MovieDetail, Genre, PaginatedResponse, Cast } from '../model/types'

export const movieApi = {
  // Filmes populares (tela inicial)
  getPopular: (page = 1) =>
    tmdbClient
      .get<PaginatedResponse<Movie>>('/movie/popular', { params: { page } })
      .then((r) => r.data),

  // Busca por texto
  search: (query: string, page = 1) =>
    tmdbClient
      .get<PaginatedResponse<Movie>>('/search/movie', {
        params: { query, page },
      })
      .then((r) => r.data),

  // Detalhe do filme
  getById: (id: number) =>
    tmdbClient
      .get<MovieDetail>(`/movie/${id}`)
      .then((r) => r.data),

  // Elenco do filme
  getCredits: (id: number) =>
    tmdbClient
      .get<{ cast: Cast[] }>(`/movie/${id}/credits`)
      .then((r) => r.data.cast.slice(0, 10)),

  // Gêneros para os filtros
  getGenres: () =>
    tmdbClient
      .get<{ genres: Genre[] }>('/genre/movie/list')
      .then((r) => r.data.genres),

  // Trailer do YouTube
  getTrailer: async (id: number): Promise<string | null> => {
    const { data } = await tmdbClient.get(`/movie/${id}/videos`)
    const trailer = data.results?.find(
      (v: any) =>
        v.site === 'YouTube' &&
        (v.type === 'Trailer' || v.type === 'Teaser')
    )
    return trailer ? trailer.key : null
  },

  // Filmes por gênero/filtros
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
}
