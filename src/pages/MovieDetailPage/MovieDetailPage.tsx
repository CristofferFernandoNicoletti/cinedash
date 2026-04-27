import { useState } from 'react'
import { useParams, useNavigate, useSearch, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { movieApi } from '@/entities/movie/api/movieApi'
import { buildImageUrl } from '@/entities/movie/model/types'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft, Star, Clock, Bookmark,
  BookmarkCheck, Calendar, Play, X, Tv,
} from 'lucide-react'

export function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movie/$movieId' })
  const { type } = useSearch({ from: '/movie/$movieId' })
  const navigate = useNavigate({ from: '/movie/$movieId' })
  const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore()
  const [showTrailer, setShowTrailer] = useState(false)

  const id = Number(movieId)
  const isTv = type === 'tv'

  const { data: movie, isLoading: loadingMovie } = useQuery({
    queryKey: ['movie', id, type],
    queryFn: () => movieApi.getById(id, type),
  })

  const { data: cast } = useQuery({
    queryKey: ['movie-credits', id, type],
    queryFn: () => movieApi.getCredits(id, type),
  })

  const { data: trailerKey } = useQuery({
    queryKey: ['movie-trailer', id, type],
    queryFn: () => movieApi.getTrailer(id, type),
  })

  const { data: similar } = useQuery({
    queryKey: ['movie-similar', id, type],
    queryFn: () => movieApi.getSimilar(id, type),
  })

  const inWatchlist = movie ? isInWatchlist(movie.id) : false
  const backdropUrl = buildImageUrl(movie?.backdrop_path ?? null, 'original')
  const posterUrl = buildImageUrl(movie?.poster_path ?? null, 'w300')
  const title = movie?.title || movie?.name || ''
  const releaseDate = movie?.release_date || movie?.first_air_date
  const runtime = isTv
    ? movie?.episode_run_time?.[0]
    : movie?.runtime

  return (
    <div className="min-h-screen bg-background">

      {/* BACKDROP com gradiente */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className="w-full h-full object-cover scale-105"
            style={{ filter: 'brightness(0.6)' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        {/* Gradiente inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Botão voltar sobre o backdrop */}
        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate({ to: '/dashboard' })}
            className="bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-32 relative z-10 pb-16 space-y-10">
        {loadingMovie ? (
          <MovieDetailSkeleton />
        ) : movie ? (
          <>
            {/* INFO PRINCIPAL */}
            <div className="flex gap-6 flex-col sm:flex-row items-start">
              {/* Poster com sombra */}
              <div className="shrink-0 shadow-2xl rounded-xl overflow-hidden">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-44 rounded-xl"
                  />
                ) : (
                  <div className="w-44 aspect-[2/3] bg-muted rounded-xl flex items-center justify-center text-5xl">
                    🎬
                  </div>
                )}
              </div>

              {/* Dados */}
              <div className="space-y-4 flex-1 pt-2">
                <div>
                  <h1 className="text-4xl font-bold leading-tight">{title}</h1>
                  {isTv && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Tv className="w-3 h-3" /> Série
                    </span>
                  )}
                  {movie.tagline && (
                    <p className="text-muted-foreground italic mt-1">
                      "{movie.tagline}"
                    </p>
                  )}
                </div>

                {/* Badges de info */}
                <div className="flex flex-wrap gap-2">
                  {movie.vote_average > 0 && (
                    <Badge className="bg-yellow-500 text-black flex items-center gap-1 px-3 py-1">
                      <Star className="w-3 h-3 fill-black" />
                      {movie.vote_average.toFixed(1)}
                    </Badge>
                  )}
                  {runtime && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      <Clock className="w-3 h-3" />
                      {runtime} min{isTv ? '/ep' : ''}
                    </Badge>
                  )}
                  {isTv && movie.number_of_seasons && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {movie.number_of_seasons} temporada{movie.number_of_seasons > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {releaseDate && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(releaseDate).toLocaleDateString('pt-BR')}
                    </Badge>
                  )}
                </div>

                {/* Gêneros */}
                <div className="flex flex-wrap gap-1">
                  {movie.genres?.map((g) => (
                    <Badge key={g.id} variant="outline">{g.name}</Badge>
                  ))}
                </div>

                {/* Sinopse */}
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {movie.overview || 'Sinopse não disponível.'}
                </p>

                {/* Ações */}
                <div className="flex gap-3 flex-wrap">
                  {/* Botão Trailer */}
                  {trailerKey && (
                    <Button
                      size="lg"
                      onClick={() => setShowTrailer(true)}
                      className="bg-red-600 hover:bg-red-700 text-white gap-2"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      Assistir Trailer
                    </Button>
                  )}

                  {/* Botão Watchlist */}
                  <Button
                    size="lg"
                    variant={inWatchlist ? 'secondary' : 'outline'}
                    onClick={() =>
                      inWatchlist ? removeMovie(movie.id) : addMovie(movie)
                    }
                    className="gap-2"
                  >
                    {inWatchlist ? (
                      <>
                        <BookmarkCheck className="w-5 h-5" />
                        Na minha lista
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5" />
                        Adicionar à lista
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* ELENCO */}
            {cast && cast.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Elenco Principal</h2>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-3">
                  {cast.map((actor) => {
                    const profileUrl = buildImageUrl(actor.profile_path, 'w200')
                    return (
                      <div key={actor.id} className="text-center space-y-1 group">
                        <div className="aspect-square rounded-full overflow-hidden bg-muted">
                          {profileUrl ? (
                            <img
                              src={profileUrl}
                              alt={actor.name}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              👤
                            </div>
                          )}
                        </div>
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

            {/* SIMILARES */}
            {similar && similar.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  {isTv ? 'Séries Similares' : 'Filmes Similares'}
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted">
                  {similar.map((item) => {
                    const posterUrl = buildImageUrl(item.poster_path, 'w300')
                    const itemTitle = item.title || item.name || ''
                    return (
                      <Link
                        key={item.id}
                        to="/movie/$movieId"
                        params={{ movieId: String(item.id) }}
                        search={{ type }}
                        className="group shrink-0 w-32 block"
                      >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted shadow group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                          {posterUrl ? (
                            <img
                              src={posterUrl}
                              alt={itemTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              🎬
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                          {item.vote_average > 0 && (
                            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                              <span className="text-[10px] text-white font-medium">
                                {item.vote_average.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="mt-1.5 text-xs font-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                          {itemTitle}
                        </p>
                      </Link>
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

      {/* MODAL DO TRAILER */}
      {showTrailer && trailerKey && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white hover:text-red-400 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>

            {/* YouTube embed */}
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function MovieDetailSkeleton() {
  return (
    <div className="flex gap-6 mt-8">
      <Skeleton className="w-44 aspect-[2/3] rounded-xl shrink-0" />
      <div className="space-y-4 flex-1 pt-2">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-11 w-40 rounded-lg" />
          <Skeleton className="h-11 w-44 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
