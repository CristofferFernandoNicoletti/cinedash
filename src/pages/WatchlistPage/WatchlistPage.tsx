import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useWatchlistStore } from '@/features/watchlist/model/watchlistStore'
import { buildImageUrl, type WatchlistStatus } from '@/entities/movie/model/types'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trash2, ArrowUpDown, Star } from 'lucide-react'

const columnHelper = createColumnHelper<any>()

export function WatchlistPage() {
  const { movies, removeMovie, updateStatus } = useWatchlistStore()
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      // Capa
      columnHelper.accessor('poster_path', {
        header: 'Capa',
        enableSorting: false,
        cell: (info) => {
          const url = buildImageUrl(info.getValue(), 'w200')
          return url ? (
            <img
              src={url}
              alt=""
              className="w-12 h-16 object-cover rounded cursor-pointer"
              onClick={() =>
                navigate({
                  to: '/movie/$movieId',
                  params: { movieId: String(info.row.original.id) },
                })
              }
            />
          ) : (
            <div className="w-12 h-16 bg-muted rounded flex items-center justify-center text-xl">
              🎬
            </div>
          )
        },
      }),

      // Título
      columnHelper.accessor('title', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground"
            onClick={() => column.toggleSorting()}
          >
            Título <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => (
          <span
            className="font-medium cursor-pointer hover:underline"
            onClick={() =>
              navigate({
                to: '/movie/$movieId',
                params: { movieId: String(info.row.original.id) },
              })
            }
          >
            {info.getValue()}
          </span>
        ),
      }),

      // Ano
      columnHelper.accessor('release_date', {
        header: 'Ano',
        cell: (info) => info.getValue()?.split('-')[0] ?? '—',
      }),

      // Rating
      columnHelper.accessor('vote_average', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground"
            onClick={() => column.toggleSorting()}
          >
            Nota <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) =>
          info.getValue() > 0 ? (
            <span className="flex items-center gap-1 text-yellow-500 font-medium">
              <Star className="w-3 h-3 fill-yellow-500" />
              {info.getValue().toFixed(1)}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      }),

      // Status
      columnHelper.accessor('status', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground"
            onClick={() => column.toggleSorting()}
          >
            Status <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => (
          <select
            value={info.getValue()}
            onChange={(e) =>
              updateStatus(info.row.original.id, e.target.value as WatchlistStatus)
            }
            className="text-sm bg-background border rounded px-2 py-1 cursor-pointer"
          >
            <option value="want">🕐 Quero Ver</option>
            <option value="watching">▶️ Assistindo</option>
            <option value="done">✅ Concluído</option>
          </select>
        ),
      }),

      // Ações
      columnHelper.display({
        id: 'actions',
        header: 'Ações',
        cell: (info) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeMovie(info.row.original.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        ),
      }),
    ],
    [navigate, updateStatus, removeMovie]
  )

  const table = useReactTable({
    data: movies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/dashboard' })}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">📋 Minha Lista</h1>
            <Badge variant="secondary">{movies.length} filmes</Badge>
          </div>
        </div>

        {/* Empty state */}
        {movies.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground space-y-3">
            <p className="text-5xl">🎬</p>
            <p className="text-lg font-medium">Sua lista está vazia</p>
            <p className="text-sm">
              Adicione filmes clicando no ícone de bookmark no dashboard
            </p>
            <Button onClick={() => navigate({ to: '/dashboard' })}>
              Explorar filmes
            </Button>
          </div>
        ) : (
          /* Tabela TanStack Table */
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-3 text-muted-foreground font-medium"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
