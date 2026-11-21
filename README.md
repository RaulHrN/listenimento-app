# Listenimento

Lista pessoal de tudo que você quer assistir, jogar, ler, ouvir e visitar — no celular e na web, sincronizada pela sua conta.

🎬 Filmes · 📺 Séries · 🎮 Jogos · 📚 Livros · 📍 Lugares · 🍥 Animes · 💿 Álbuns

Visual: brutalismo + cinema de rua antigo — madeira escura, vermelho de cortina, latão e papel de ingresso.

## Estrutura

```
listenimento/
├── apps/
│   ├── web/        # Next.js 15 (App Router) + Tailwind v4, organizado em FSD
│   └── mobile/     # Expo SDK 58 + Expo Router
├── packages/
│   └── core/       # Tipos, rótulos pt-BR e serviços Supabase compartilhados
├── supabase/
│   ├── migrations/ # Schema + RLS
│   └── functions/  # Edge Function "search" (proxy das APIs externas)
└── docs/
    ├── SETUP.md    # Como configurar e rodar
    └── ETAPAS.md   # Etapas/commits do projeto
```

## Como funciona

```
App / Site ──(login Supabase)──► Supabase Auth
     │
     ├── busca ──► Edge Function "search" ──► TMDB · RAWG · Google Books · OpenTripMap · Jikan · Deezer
     │
     └── salvar/editar ──► Postgres (user_items, protegido por RLS)
```

## Começando

```bash
npm install
# configure Supabase e chaves → docs/SETUP.md
npm run dev:web
npm run dev:mobile
```
