import axios from 'axios'

// Instância Axios pré-configurada para a OMDb API.
// A chave é injetada automaticamente em toda requisição via params.
export const omdbClient = axios.create({
  baseURL: import.meta.env.VITE_OMDB_BASE_URL,
})

// Interceptor que injeta a apikey em TODOS os requests automaticamente
omdbClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    apikey: import.meta.env.VITE_OMDB_API_KEY,
  }
  return config
})
