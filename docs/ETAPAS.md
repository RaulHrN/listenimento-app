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

## Identidade visual

Brutalismo + cinema de rua antigo. A paleta fica em `packages/core/src/theme.ts` e vale para o site e o app.

| Token | Cor | Uso |
|---|---|---|
| `ink` | `#0c0806` | bordas grossas e sombras duras |
| `wood900`–`wood500` | `#170d08` → `#5a3622` | fundo em tábuas, painéis |
| `curtain` | `#8e0e15` | botões principais, sanefa, cartaz sem capa |
| `brass` / `bulb` | `#d6a54a` / `#ffd98a` | molduras, lâmpadas do letreiro, destaques |
| `paper` | `#f1e4c3` | ingressos (login, itens, placar) |

Fontes: **Anton** (letreiro), **Archivo** (texto) e **Courier Prime** (ingresso/carimbos).

## Modelo de dados

```
auth.users 1──1 profiles
auth.users 1──N user_items
                  ├─ media_type   movie | series | game | book | place | anime | album
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
