import type { Movie } from '../model/types'

// Adapter Pattern: transforma a resposta "suja" da OMDb
// em objetos limpos e previsíveis para o frontend.
// Nunca deixa `undefined` chegar nos componentes.

// Resposta da busca (/search)
export function adaptSearchMovie(raw: Record<string, string>): Movie {
  return {
    id: raw.imdbID ?? '',
    title: raw.Title ?? 'Sem título',
    year: raw.Year ?? '—',
    poster: raw.Poster && raw.Poster !== 'N/A' ? raw.Poster : null,
    type: (raw.Type as Movie['type']) ?? 'movie',
  }
}

// Resposta do detalhe (/by ID)
export function adaptMovieDetail(raw: Record<string, string>): Movie {
  return {
    id: raw.imdbID ?? '',
    title: raw.Title ?? 'Sem título',
    year: raw.Year ?? '—',
    poster: raw.Poster && raw.Poster !== 'N/A' ? raw.Poster : null,
    type: (raw.Type as Movie['type']) ?? 'movie',
    imdbRating: raw.imdbRating !== 'N/A' ? raw.imdbRating : undefined,
    genre: raw.Genre !== 'N/A' ? raw.Genre : undefined,
    director: raw.Director !== 'N/A' ? raw.Director : undefined,
    actors: raw.Actors !== 'N/A' ? raw.Actors : undefined,
    plot: raw.Plot !== 'N/A' ? raw.Plot : undefined,
    runtime: raw.Runtime !== 'N/A' ? raw.Runtime : undefined,
    released: raw.Released !== 'N/A' ? raw.Released : undefined,
  }
}
