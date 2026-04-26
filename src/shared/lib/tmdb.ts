import axios from 'axios'

export const tmdbClient = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    'Content-Type': 'application/json',
  },
  params: {
    language: 'pt-BR',
  },
})
