import { omdbClient } from '@/shared/lib/omdb'
import { adaptSearchMovie, adaptMovieDetail } from './movieAdapter'
import type { SearchResult } from '../model/types'

export const movieApi = {
  // Busca por texto — retorna lista paginada
  search: async (query: string, page = 1): Promise<SearchResult> => {
    const { data } = await omdbClient.get('/', {
      params: { s: query, type: 'movie', page },
    })

    if (data.Response === 'False') {
      return { movies: [], totalResults: 0 }
    }

    return {
      movies: data.Search.map(adaptSearchMovie),
      totalResults: parseInt(data.totalResults ?? '0', 10),
    }
  },

  // Detalhe de um filme pelo ID
  getById: async (id: string) => {
    const { data } = await omdbClient.get('/', {
      params: { i: id, plot: 'full' },
    })
    return adaptMovieDetail(data)
  },
}
