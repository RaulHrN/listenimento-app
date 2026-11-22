# Etapas de desenvolvimento

Cada etapa é um commit no histórico do repositório (`git log --oneline`).

| # | Commit | O que entrega |
|---|---|---|
| 1 | `chore: estrutura inicial do monorepo` | Workspaces npm, tsconfig base, gitignore, README |
| 2 | `feat(db): schema Supabase com perfis, itens do usuário e RLS` | Migration com enums, `profiles`, `user_items`, triggers, RLS e view de estatísticas |
| 3 | `feat(api): edge function search com provedores de entretenimento` | Proxy autenticado para TMDB, RAWG, Google Books, OpenTripMap, Jikan e Deezer |
| 4 | `feat(core): pacote compartilhado com tipos, rótulos e serviços` | Tipos, rótulos pt-BR e serviços Supabase usados por web e mobile |
| 5 | `feat(web): setup Next.js com autenticação Supabase` | Next.js 15 + Tailwind v4 (FSD), login/cadastro, middleware de sessão |
| 6 | `feat(web): busca nas APIs e adicionar itens à lista` | Tela de busca por tipo, paginação e adicionar com status |
| 7 | `feat(web): minha lista, edição de itens e painel` | Lista com filtros, modal de edição e painel de estatísticas |
| 8 | `feat(mobile): setup Expo Router com autenticação Supabase` | Expo SDK 58, sessão no AsyncStorage, rotas protegidas e abas |
| 9 | `feat(mobile): lista, busca, detalhe do item e painel` | Telas completas do app |
| 10 | `docs: guia de setup, etapas e lockfile` | Documentação e `package-lock.json` |
| 11 | `chore: renomeia o app de Acervo para Listenimento` | Novo nome em pacotes, app, scheme e docs |
| 12 | `feat(web): identidade visual cinema brutalista` | Paleta, fontes e redesign completo do site |
| 13 | `feat(mobile): identidade visual cinema brutalista` | Mesmo design no app Expo |
| 14 | `feat(web): temas claro e escuro com sombreamento realista` | Light/dark, sombras em camadas, visual mais enxuto no site |
| 15 | `feat(mobile): temas claro e escuro com sombreamento realista` | Light/dark com preferência salva e gradientes no app |
| 16 | `feat(web): redesign modernista inspirado nos teatros de ópera` | Nova identidade no site (sai o brutalismo) |
| 17 | `feat(mobile): redesign modernista inspirado nos teatros de ópera` | Mesma identidade no app |
| 18 | `refactor(ui): remove a estética de cortina` | Só cores sólidas, gradientes e sombras |
| 19 | `ci: workflow do GitHub Actions para gerar o APK Android` | APK por execução manual ou tag `v*` |
| 20 | `fix(mobile): app não fecha mais ao abrir sem configuração do Supabase` | Tela de diagnóstico, ErrorBoundary e CI que barra build sem secrets |
| 21 | `feat: jogos de tabuleiro (BoardGameGeek) no lugar de música` | Migration do enum, provedor BGG e créditos das fontes |

## Identidade visual

**Modernismo dos teatros de ópera** (anos 60): geometria limpa, arcos de proscênio, lustre em estrela, carmim, folha de ouro e marfim. Profundidade por luz e sombra, sem excesso de ornamento.

- Temas: **claro** (foyer de dia) e **escuro** (noite de estreia); segue o sistema até a pessoa escolher.
- Paletas em `packages/core/src/theme.ts` (`PALETTES.light` / `PALETTES.dark`); o site espelha os valores em variáveis CSS (`globals.css`).
- Tipografia: **Bodoni Moda** (títulos, didone de alto contraste) + **Jost** (interface, geométrica modernista).
- Motivos: lustre em estrela (logo e painel do Programa), arco de proscênio (landing, login, capas largas), filete duplo de ouro. Sem texturas: só cores sólidas, gradientes e sombras.
- Seções como atos: **Ato I · Temporada** (Minha lista), **Ato II · Repertório** (Buscar), **Ato III · Programa** (estatísticas).
- Onde trocar o tema: botão de meia-lua no cabeçalho do site; Programa → Tema no app.

## Modelo de dados

```
auth.users 1──1 profiles
auth.users 1──N user_items
                  ├─ media_type   movie | series | game | book | place | anime | boardgame
                  ├─ provider + external_id   (único por usuário)
                  ├─ title, subtitle, image_url, year, metadata   ← snapshot da API
                  └─ status, rating, priority, notes, tags, started_at, finished_at
```

## Próximas ideias

- Listas personalizadas (ex.: "Viagem pro Sul", "Jogar com amigos")
- Tela de detalhes buscando mais dados na API (elenco, onde assistir, mapa do lugar)
- Login com Google (Supabase Auth)
- Sugestões aleatórias: "o que eu faço hoje?"
- Importar listas (Letterboxd, Goodreads, Steam)
