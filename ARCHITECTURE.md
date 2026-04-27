# 🏗️ Arquitetura — CineDash

## Visão Geral

CineDash é uma aplicação React moderna que demonstra:
- Arquitetura escalável (Feature-Sliced Design)
- Gestão eficiente de estado (Zustand + TanStack Query)
- Tratamento robusto de dados assíncronos
- UI responsiva e intuitiva

## 📂 Estrutura de Pastas

### `src/app/`
Configuração global da aplicação.

```
app/
├── providers.tsx    # QueryClient, Router, ThemeSync
├── router.tsx       # Definição de rotas com guards
└── main.tsx         # Entry point
```

**Decisão:** Concentrar toda a config global em um lugar facilita manutenção.

---

### `src/entities/`
Modelos de domínio e serviços de dados.

```
entities/movie/
├── model/
│   └── types.ts         # Interfaces (Movie, Genre, etc)
├── api/
│   ├── movieApi.ts      # Serviços da TMDB
│   └── movieAdapter.ts  # Transformação de dados
```

**Decisão:** Adapter pattern separa a API "suja" da TMDB dos tipos limpos do frontend. Qualquer mudança na API TMDB = muda só aqui.

---

### `src/features/`
Funcionalidades isoladas e reutilizáveis.

```
features/
├── auth/
│   └── model/
│       ├── authStore.ts    # Zustand store com persist
│       └── loginSchema.ts   # Zod validation
├── watchlist/
│   └── model/
│       └── watchlistStore.ts # Gerenciamento da lista
└── theme/
    └── model/
        └── themeStore.ts    # Dark/Light mode
```

**Decisão:** Cada feature é independente. Auth, Watchlist e Theme não conhecem uma à outra — pura composição.

---

### `src/pages/`
Componentes de página (rotas).

```
pages/
├── LoginPage/
├── DashboardPage/
├── WatchlistPage/
└── MovieDetailPage/
```

**Decisão:** Uma pasta por página = imports e organização claros.

---

### `src/shared/`
Código reutilizável.

```
shared/
├── ui/                  # Shadcn components
├── lib/
│   ├── tmdb.ts         # Axios instance
│   └── queryClient.ts  # TanStack Query config
└── hooks/
    └── useDebounce.ts  # Custom hooks
```

---

## 🔄 Fluxo de Dados

### Dashboard → Filtro → Busca

```
UserInput (filtro de gênero)
    ↓
Dashboard state (selectedGenre)
    ↓
TanStack Query (queryKey muda)
    ↓
movieApi.getPopular(page, with_genres)
    ↓
TMDB API
    ↓
Cache (5 min)
    ↓
Grid de filmes
```

**Cache Strategy:**
- `staleTime: 5 min` — dados não refetch automático
- `gcTime: 10 min` — cache em memória por 10 min
- Key: `['movies', search, mediaType, genre, page]`

### Adicionar à Watchlist

```
Click bookmark
    ↓
useWatchlistStore.addMovie(movie)
    ↓
Zustand state updated
    ↓
localStorage atualizado (persist middleware)
    ↓
UI re-renderiza (MovieCard bookmark vira amarelo)
```

**Persistência:**
- Zustand com middleware `persist`
- Salva em localStorage automaticamente
- Recupera ao reload da página

---

## 🔐 Autenticação Simulada

**Por quê não usar backend real?**
- Desafio era frontend-only
- Simular autenticação é prática comum em testes
- O padrão é escalável: trocar `authStore.login()` por `api.login()` é trivial

**Flow:**

```typescript
// src/features/auth/model/authStore.ts
login: (email: string) => {
  token: `fake-jwt-${Date.now()}`,  // Gerado no client
  userEmail: email,
  isAuthenticated: true
}
```

**Guards de Rota:**

```typescript
// src/app/router.tsx
beforeLoad: () => {
  const { isAuthenticated } = useAuthStore.getState()
  if (!isAuthenticated) throw redirect({ to: '/login' })
}
```

Não autenticado? Redireciona pra login automaticamente.

---

## 🎨 UI/UX Decisions

### Componentes Shadcn/ui
- **Button, Input, Badge, Card, Skeleton:** base visual
- **Dark mode:** Tailwind `dark:` + Zustand store
- **Temas:** Nova (preset Shadcn) — moderno e limpo

### Responsividade
```css
grid-cols-2         /* mobile */
sm:grid-cols-3      /* tablet */
md:grid-cols-4      /* desktop */
lg:grid-cols-5      /* large desktop */
```

### Hover Effects Cinematográficos
```css
group-hover:scale-110           /* zoom do poster */
group-hover:bg-black/40         /* overlay escuro */
group-hover:opacity-100         /* ícone play apareça */
group-hover:-translate-y-1      /* card sobe 4px */
transition-all duration-300     /* animação suave */
```

---

## 🚀 Performance

### TanStack Query
- Cache automático
- Deduplicação de requests (mesmo queryKey)
- Garbage collection inteligente
- Refetch manual: `queryClient.invalidateQueries()`

### Debounce
```typescript
const debouncedSearch = useDebounce(search, 500)
// Só dispara query após 500ms de inatividade
```

### Lazy Loading
- Skeletons enquanto carrega (não fica em branco)
- Imagens otimizadas (w300, w500 — não w1080)

---

## 🔧 Extensibilidade

### Adicionar novo tipo de mídia (ex: Documentários)?

1. **Enum no backend:**
```typescript
const MEDIA_TYPES = [
  { value: 'movie', label: '🎬 Filmes' },
  { value: 'tv', label: '📺 Séries' },
  { value: 'documentaries', label: '📚 Documentários' },
]
```

2. **Endpoint na API:**
```typescript
getDocumentaries: (page = 1) =>
  tmdbClient.get('/discover/movie', {
    params: { page, with_genres: '99' } // ID do gênero Documentary
  })
```

3. **Usar no Dashboard:**
```typescript
if (mediaType === 'documentaries') 
  return movieApi.getDocumentaries(page)
```

**Conclusão:** Arquitetura suporta isso sem quebrar nada.

---

## 🧪 Testabilidade

### Estrutura favorece testes

```typescript
// movieApi.ts — função pura, fácil de mock
export const movieApi = {
  search: (query, page) => tmdbClient.get(...).then(r => r.data)
}

// No teste, mock o tmdbClient
vi.mock('@/shared/lib/tmdb', () => ({
  tmdbClient: { get: vi.fn() }
}))
```

### Hooks customizados

```typescript
// useDebounce é puro — fácil testar
const debouncedValue = useDebounce('batman', 500)
expect(debouncedValue).toBe('batman') // após 500ms
```

---

## 📊 Comparação: Código sem arquitetura vs COM

### ❌ SEM (tudo em um componente)
```typescript
export function App() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    // API call aqui
    // Lógica de filtro aqui
    // Lógica de watchlist aqui
    // Validação aqui
    // Tema aqui
  }, [search])
  
  return (
    // 500+ linhas de JSX
  )
}
```

**Problemas:**
- Impossível reutilizar lógica
- Testes = pesadelo
- Escalabilidade zero

### ✅ COM FSD + Zustand + TanStack Query
```typescript
export function DashboardPage() {
  const { addMovie } = useWatchlistStore()        // Watchlist reutilizável
  const { data } = useQuery(...)                  // Cache automático
  const debouncedSearch = useDebounce(search, 500) // Debounce isolado
  const { theme } = useThemeStore()               // Tema global
  
  return <MovieCard />                            // Componente dumb
}
```

**Benefícios:**
- Cada lógica em seu lugar
- Reutilizável em qualquer componente
- Testável isoladamente
- Escalável (adicionar feature = adicionar pasta)

---

## 🎯 Decisões Técnicas Importantes

| Decisão | Alternativa | Por quê? |
|---------|------------|---------|
| Zustand | Redux/Context | Menos boilerplate, persist fácil |
| TanStack Query | SWR/Axios manual | Cache automático, dedup, garbage collection |
| TanStack Table | DataGrid lib | Headless = controle total, leve |
| Zod | Yup/Joi | TypeScript-first, melhor DX |
| Tailwind | Styled-components | Utility-first = rápido, consistente |
| FSD | Flat/Domain | Escalável, imports claros, feature isolation |

---

## 🔮 Lições Aprendidas

1. **Adapter Pattern é ouro:** API externa muda? Só adapta lá, resto da app não mexe.
2. **Zustand persist:** Uma linha resolve sessão persistida — game changer.
3. **TanStack Query queryKey:** Bem estruturada = cache funciona 100%.
4. **Skeletons > spinners:** Usuário vê conteúdo carregando, melhor UX.
5. **Feature-Sliced:** Novo membro da equipe entra, vê a estrutura, entende tudo.

---

**Desenvolvido com ❤️ para demonstrar que "fazer funcionar" é só o começo.**
