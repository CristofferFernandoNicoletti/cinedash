import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { movieApi } from '@/entities/movie/api/movieApi'
import { buildImageUrl } from '@/entities/movie/model/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useThemeStore } from '@/features/theme/model/themeStore'
import {
  Search, LogOut, Bookmark, BookmarkCheck,
  Star, Play, Sun, Moon, SlidersHorizontal, X
} from 'lucide-react'
import type { Movie } from '@/entities/movie/model/types'

// Tipos de mídia
const MEDIA_TYPES = [
  { value: 'movie', label: '🎬 Filmes' },
  { value: 'tv', label: '📺 Séries' },
  { value: 'trending', label: '🔥 Populares' },
]

export function DashboardPage() {
  const { userEmail, logout } = useAuthStore()
  const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | 'trending'>('trending')
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const debouncedSearch = useDebounce(search, 500)

  // Busca gêneros
  const { data: genres } = useQuery({
    queryKey: ['genres', mediaType],
    queryFn: () =>
      mediaType === 'tv' ? movieApi.getTvGenres() : movieApi.getGenres(),
    staleTime: Infinity,
  })

  // Busca filmes/séries
  const { data, isLoading, isError } = useQuery({
    queryKey: ['media', debouncedSearch, mediaType, selectedGenre, page],
    queryFn: () => {
      if (debouncedSearch) {
        return mediaType === 'tv'
          ? movieApi.searchTv(debouncedSearch, page)
          : movieApi.search(debouncedSearch, page)
      }
      if (mediaType === 'trending') {
        // A TMDB não filtra trending por gênero — usa discover quando um gênero está selecionado
        if (selectedGenre) return movieApi.getPopular(page, selectedGenre)
        return movieApi.getTrending(page)
      }
      if (mediaType === 'tv') return movieApi.getPopularTv(page, selectedGenre)
      return movieApi.getPopular(page, selectedGenre)
    },
  })

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const clearFilters = () => {
    setSelectedGenre(null)
    setSearch('')
    setPage(1)
  }

  const totalPages = data ? Math.min(data.total_pages, 500) : 0
  const hasActiveFilters = selectedGenre !== null || search !== ''

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">🎬 CineDash</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate({ to: '/watchlist' })}>
              <Bookmark className="w-4 h-4 mr-1" />
              Minha Lista
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* Tabs de tipo de mídia */}
        <div className="flex gap-2 flex-wrap">
          {MEDIA_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setMediaType(type.value as 'movie' | 'tv' | 'trending')
                setSelectedGenre(null)
                setPage(1)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mediaType === type.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Busca + botão filtros */}
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={`Buscar ${mediaType === 'tv' ? 'séries' : 'filmes'}...`}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </div>

        {/* Painel de filtros de gênero */}
        {showFilters && (
          <div className="bg-muted/40 rounded-xl p-4 space-y-3 border">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Filtrar por Gênero</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Limpar filtros
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {genres?.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => {
                    setSelectedGenre(selectedGenre === genre.id ? null : genre.id)
                    setPage(1)
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                    selectedGenre === genre.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-border text-muted-foreground'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Total de resultados */}
        {data && (
          <p className="text-sm text-muted-foreground">
            {data.total_results.toLocaleString('pt-BR')} resultados
            {selectedGenre && genres && (
              <span className="ml-2 text-primary font-medium">
                · {genres.find(g => g.id === selectedGenre)?.name}
              </span>
            )}
          </p>
        )}

        {/* Erro */}
        {isError && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-2">⚠️</p>
            <p>Erro ao carregar. Tente novamente.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading &&
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}

          {!isLoading &&
            data?.results.map((item: Movie) => (
              <MovieCard
                key={item.id}
                movie={item}
                inWatchlist={isInWatchlist(item.id)}
                onAdd={() => addMovie(item)}
                onRemove={() => removeMovie(item.id)}
                onClick={() => {
                  const itemType = item.media_type === 'tv' || (!item.media_type && mediaType === 'tv')
                    ? 'tv'
                    : 'movie'
                  navigate({
                    to: '/movie/$movieId',
                    params: () => ({ movieId: String(item.id) }),
                    search: { type: itemType },
                  })
                }}
              />
            ))}
        </div>

        {/* Empty state */}
        {!isLoading && data?.results.length === 0 && (
          <div className="text-center py-16 text-muted-foreground space-y-3">
            <p className="text-5xl">🎬</p>
            <p>Nenhum resultado encontrado</p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button variant="outline" size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button variant="outline" size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              Próxima
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

// Card
interface MovieCardProps {
  movie: Movie
  inWatchlist: boolean
  onAdd: () => void
  onRemove: () => void
  onClick: () => void
}

function MovieCard({ movie, inWatchlist, onAdd, onRemove, onClick }: MovieCardProps) {
  const posterUrl = buildImageUrl(movie.poster_path, 'w300')

  return (
    <div className="group relative cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <span className="text-5xl">🎬</span>
            <span className="text-xs text-center px-2 line-clamp-2">{movie.title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {movie.vote_average > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            if (inWatchlist) { onRemove() } else { onAdd() }
          }}
          className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          {inWatchlist
            ? <BookmarkCheck className="w-4 h-4 text-yellow-400" />
            : <Bookmark className="w-4 h-4 text-white" />
          }
        </button>
      </div>

      <div className="mt-2 space-y-0.5 px-0.5">
        <p className="text-sm font-medium leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title || (movie as { name?: string }).name}
        </p>
        <p className="text-xs text-muted-foreground">
          {(movie.release_date || (movie as { first_air_date?: string }).first_air_date)?.split('-')[0] ?? '—'}
        </p>
      </div>
    </div>
  )
}
