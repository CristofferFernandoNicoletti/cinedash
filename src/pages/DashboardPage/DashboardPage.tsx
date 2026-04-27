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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, LogOut, Bookmark, BookmarkCheck, Star, Sun, Moon, Play } from 'lucide-react'
import { useThemeStore } from '@/features/theme/model/themeStore'
import type { Movie } from '@/entities/movie/model/types'

export function DashboardPage() {
  const { userEmail, logout } = useAuthStore()
  const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', debouncedSearch, page],
    queryFn: () =>
      debouncedSearch
        ? movieApi.search(debouncedSearch, page)
        : movieApi.getPopular(page),
  })

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const totalPages = data ? Math.min(data.total_pages, 500) : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">🎬 CineDash</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/watchlist' })}
            >
              <Bookmark className="w-4 h-4 mr-1" />
              Minha Lista
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {userEmail}
            </span>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Busca */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar filmes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        {/* Total */}
        {data && (
          <p className="text-sm text-muted-foreground">
            {data.total_results.toLocaleString('pt-BR')} filmes encontrados
          </p>
        )}

        {/* Erro */}
        {isError && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-2">⚠️</p>
            <p>Erro ao carregar filmes. Tente novamente.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading &&
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}

          {!isLoading &&
            data?.results.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                inWatchlist={isInWatchlist(movie.id)}
                onAdd={() => addMovie(movie)}
                onRemove={() => removeMovie(movie.id)}
                onClick={() =>
                  navigate({
                    to: '/movie/$movieId',
                    params: { movieId: String(movie.id) },
                  })
                }
              />
            ))}
        </div>

        {/* Empty state */}
        {!isLoading && data?.results.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-2">🎬</p>
            <p>Nenhum filme encontrado para "{debouncedSearch}"</p>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
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

// Card de filme
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
    <div
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      {/* Poster */}
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

        {/* Overlay escuro no hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

        {/* Ícone play no centro ao hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {/* Rating badge */}
        {movie.vote_average > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        {/* Botão watchlist */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            inWatchlist ? onRemove() : onAdd()
          }}
          className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          {inWatchlist ? (
            <BookmarkCheck className="w-4 h-4 text-yellow-400" />
          ) : (
            <Bookmark className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* Info abaixo do card */}
      <div className="mt-2 space-y-0.5 px-0.5">
        <p className="text-sm font-medium leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {movie.release_date?.split('-')[0] ?? '—'}
        </p>
      </div>
    </div>
  )
}
