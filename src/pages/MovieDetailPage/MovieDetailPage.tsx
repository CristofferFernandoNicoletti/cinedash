import { useParams, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { movieApi } from '@/entities/movie/api/movieApi'
import { buildImageUrl } from '@/entities/movie/model/types'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Star,
  Clock,
  Bookmark,
  BookmarkCheck,
  Calendar,
} from 'lucide-react'

export function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movie/$movieId' })
  const navigate = useNavigate()
  const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore()

  const id = Number(movieId)

  const { data: movie, isLoading: loadingMovie } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieApi.getById(id),
  })

  const { data: cast, isLoading: loadingCast } = useQuery({
    queryKey: ['movie-credits', id],
    queryFn: () => movieApi.getCredits(id),
  })

  const inWatchlist = movie ? isInWatchlist(movie.id) : false
  const backdropUrl = buildImageUrl(movie?.backdrop_path ?? null, 'original')
  const posterUrl = buildImageUrl(movie?.poster_path ?? null, 'w300')

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-72 md:h-96 w-full overflow-hidden">
          <img
            src={backdropUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Botão voltar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/dashboard' })}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>

        {loadingMovie ? (
          <MovieDetailSkeleton />
        ) : movie ? (
          <>
            <div className="flex gap-6 flex-col sm:flex-row">
              {/* Poster */}
              <div className="shrink-0">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-40 rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="w-40 aspect-[2/3] rounded-xl bg-muted flex items-center justify-center text-4xl">
                    🎬
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-3 flex-1">
                <h1 className="text-3xl font-bold">{movie.title}</h1>

                {movie.tagline && (
                  <p className="text-muted-foreground italic">"{movie.tagline}"</p>
                )}

                {/* Metadados */}
                <div className="flex flex-wrap gap-2 items-center">
                  {movie.vote_average > 0 && (
                    <Badge className="flex items-center gap-1 bg-yellow-500 text-black">
                      <Star className="w-3 h-3 fill-black" />
                      {movie.vote_average.toFixed(1)}
                    </Badge>
                  )}
                  {movie.runtime && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {movie.runtime} min
                    </Badge>
                  )}
                  {movie.release_date && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(movie.release_date).toLocaleDateString('pt-BR')}
                    </Badge>
                  )}
                </div>

                {/* Gêneros */}
                <div className="flex flex-wrap gap-1">
                  {movie.genres?.map((g) => (
                    <Badge key={g.id} variant="outline">
                      {g.name}
                    </Badge>
                  ))}
                </div>

                {/* Sinopse */}
                <p className="text-muted-foreground leading-relaxed">
                  {movie.overview || 'Sinopse não disponível.'}
                </p>

                {/* Botão watchlist */}
                <Button
                  onClick={() =>
                    inWatchlist ? removeMovie(movie.id) : addMovie(movie)
                  }
                  variant={inWatchlist ? 'secondary' : 'default'}
                  className="mt-2"
                >
                  {inWatchlist ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                      Na minha lista
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Adicionar à lista
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Elenco */}
            {!loadingCast && cast && cast.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Elenco Principal</h2>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {cast.map((actor) => {
                    const profileUrl = buildImageUrl(actor.profile_path, 'w200')
                    return (
                      <div key={actor.id} className="text-center space-y-1">
                        {profileUrl ? (
                          <img
                            src={profileUrl}
                            alt={actor.name}
                            className="w-full aspect-square object-cover object-top rounded-lg"
                          />
                        ) : (
                          <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-2xl">
                            👤
                          </div>
                        )}
                        <p className="text-xs font-medium line-clamp-1">{actor.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {actor.character}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground py-16">
            Filme não encontrado.
          </p>
        )}
      </div>
    </div>
  )
}

function MovieDetailSkeleton() {
  return (
    <div className="flex gap-6">
      <Skeleton className="w-40 aspect-[2/3] rounded-xl shrink-0" />
      <div className="space-y-3 flex-1">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
