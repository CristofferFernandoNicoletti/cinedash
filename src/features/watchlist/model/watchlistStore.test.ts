import { describe, it, expect, beforeEach } from 'vitest'
import { useWatchlistStore } from './watchlistStore'
import type { Movie } from '@/entities/movie/model/types'

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2024-01-01',
  vote_average: 8.5,
  vote_count: 100,
  genre_ids: [1, 2],
  popularity: 100,
}

const anotherMovie: Movie = {
  ...mockMovie,
  id: 2,
  title: 'Another Movie',
}

describe('watchlistStore', () => {
  beforeEach(() => {
    useWatchlistStore.setState({ movies: [] })
  })

  it('deve adicionar filme à watchlist com status "want"', () => {
    const { addMovie } = useWatchlistStore.getState()
    addMovie(mockMovie)

    const { movies } = useWatchlistStore.getState()
    expect(movies).toHaveLength(1)
    expect(movies[0].id).toBe(1)
    expect(movies[0].status).toBe('want')
    expect(movies[0].addedAt).toBeDefined()
  })

  it('deve remover filme da watchlist', () => {
    const store = useWatchlistStore.getState()
    store.addMovie(mockMovie)
    store.removeMovie(1)

    expect(useWatchlistStore.getState().movies).toHaveLength(0)
  })

  it('deve atualizar status do filme para "watching"', () => {
    const store = useWatchlistStore.getState()
    store.addMovie(mockMovie)
    store.updateStatus(1, 'watching')

    expect(useWatchlistStore.getState().movies[0].status).toBe('watching')
  })

  it('deve atualizar status do filme para "done"', () => {
    const store = useWatchlistStore.getState()
    store.addMovie(mockMovie)
    store.updateStatus(1, 'done')

    expect(useWatchlistStore.getState().movies[0].status).toBe('done')
  })

  it('deve verificar se filme está na watchlist', () => {
    const store = useWatchlistStore.getState()
    store.addMovie(mockMovie)

    expect(useWatchlistStore.getState().isInWatchlist(1)).toBe(true)
    expect(useWatchlistStore.getState().isInWatchlist(999)).toBe(false)
  })

  it('deve adicionar múltiplos filmes', () => {
    const store = useWatchlistStore.getState()
    store.addMovie(mockMovie)
    store.addMovie(anotherMovie)

    expect(useWatchlistStore.getState().movies).toHaveLength(2)
  })

  it('deve remover apenas o filme correto', () => {
    const store = useWatchlistStore.getState()
    store.addMovie(mockMovie)
    store.addMovie(anotherMovie)
    store.removeMovie(1)

    const { movies } = useWatchlistStore.getState()
    expect(movies).toHaveLength(1)
    expect(movies[0].id).toBe(2)
  })
})
