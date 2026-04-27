# 🎬 CineDash — Instruções de Execução

## 📋 Projeto Escolhido
**Opção A: CineDash** — Dashboard de curadoria e descoberta de filmes.

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+ (testado com v24.13.0)
- npm 11+

### Setup

1. **Clone o repositório**
```bash
git clone <seu-repo>
cd cinedash
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```bash
VITE_TMDB_TOKEN=seu_token_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
```

**Como obter o token TMDB:**
1. Acesse [themoviedb.org](https://www.themoviedb.org/)
2. Crie uma conta gratuita
3. Vá em Settings → API
4. Copie o "API Read Access Token (v4 auth)"

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

## 🔐 Autenticação

A autenticação é **simulada no frontend**:
- Email: qualquer email válido (ex: `teste@email.com`)
- Senha: qualquer senha com 6+ caracteres (ex: `123456`)

A sessão persiste ao recarregar a página (Zustand + localStorage).

## ✨ Funcionalidades Implementadas

### ✅ Core Obrigatórias
- [x] Autenticação simulada (Zod + Zustand persist)
- [x] Dashboard com busca, debounce e paginação
- [x] Filtros: Tipo de mídia (Filmes/Séries/Trending) + Gênero
- [x] Watchlist com TanStack Table e status editável
- [x] Página de detalhes com elenco e trailer (YouTube embed)
- [x] Tema Dark/Light (persistido)

### 🎁 Diferenciais
- [x] Filtro de gênero com UI responsiva
- [x] Trailer com modal fullscreen
- [x] Elenco em grid com fotos
- [x] Skeleton loaders + Empty states
- [x] UI cinematográfica com hover effects
- [x] Ordenação na tabela (Título, Nota)
- [x] Adapter pattern (dados limpos)

## 🏗️ Arquitetura

Usamos **Feature-Sliced Design (FSD)**:

```
src/
├── app/              # Providers, Router, configuração global
├── entities/         # Tipos, API, adapters
├── features/         # Auth, Watchlist, Theme (lógica reutilizável)
├── pages/            # Componentes de página
├── shared/           # Hooks, utilitários, UI (Shadcn)
└── components/       # Shadcn/ui components
```

## 🧪 Testes

Para rodar os testes:
```bash
npm run test
```

Testes cobrem:
- Validação de formulário (Zod schema)
- Lógica de watchlist (add/remove/update status)
- Hooks customizados (useDebounce, useAuthStore)

## 🛠️ Tech Stack Utilizada

- **React 18** + TypeScript (Strict)
- **Vite** (bundler)
- **TanStack Query** (server state)
- **TanStack Router** (routing)
- **TanStack Table** (data grid)
- **Zustand** (client state + persist)
- **React Hook Form** + **Zod** (validation)
- **Shadcn/ui** + **Tailwind CSS v4** (UI)
- **Vitest** + **React Testing Library** (tests)

## 📝 Git Flow

Commits semânticos:
```
feat: feature nova
fix: correção de bug
refactor: refatoração
test: testes
docs: documentação
```

Branches:
```
main → versão estável
feature/nome-da-feature → desenvolvimento
```

## 🎯 Próximos Passos (se continuasse)

- [ ] Integração com backend real (autenticação JWT)
- [ ] Histórico de visualizações
- [ ] Recomendações personalizadas
- [ ] Compartilhamento de listas
- [ ] Sync com múltiplos dispositivos

---

**Desenvolvido com ❤️ para o desafio técnico.**
