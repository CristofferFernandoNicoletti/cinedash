// Tipos limpos para o frontend — independente do formato da OMDb API.
// O Adapter (próximo passo) vai transformar a resposta suja da API nesses tipos.

export interface Movie {
  id: string           // imdbID da OMDb
  title: string
  year: string
  poster: string | null
  type: 'movie' | 'series' | 'episode'
  imdbRating?: string
  genre?: string
  director?: string
  actors?: string
  plot?: string
  runtime?: string
  released?: string
}

export interface SearchResult {
  movies: Movie[]
  totalResults: number
}

// Status do filme na Watchlist
export type WatchlistStatus = 'want' | 'watching' | 'done'

export interface WatchlistMovie extends Movie {
  status: WatchlistStatus
  addedAt: string
}
