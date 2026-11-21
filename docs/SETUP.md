# Guia de setup

## 1. Pré-requisitos

- Node.js 20+ e npm 10+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npm i -g supabase` ou `brew install supabase/tap/supabase`)
- Docker (só para rodar o Supabase localmente)
- App **Expo Go** no celular ou um emulador Android/iOS

```bash
npm install
```

## 2. Chaves das APIs externas

| Tipo | API | Chave | Onde pegar |
|---|---|---|---|
| 🎬 Filmes / 📺 Séries | TMDB | `TMDB_READ_TOKEN` | themoviedb.org → Configurações → API → *API Read Access Token* |
| 🎮 Jogos | RAWG | `RAWG_API_KEY` | rawg.io/apidocs |
| 📍 Lugares | OpenTripMap | `OPENTRIPMAP_API_KEY` | opentripmap.io/product |
| 📚 Livros | Google Books | `GOOGLE_BOOKS_API_KEY` (opcional) | console.cloud.google.com → Books API |
| 🍥 Animes | Jikan | — | sem chave |
| 💿 Álbuns | Deezer | — | sem chave |

```bash
cp supabase/functions/.env.example supabase/functions/.env
# preencha as chaves
```

As chaves só existem na Edge Function `search`. O site e o app nunca as recebem.

## 3. Banco de dados

### Opção A — Supabase Cloud (recomendado)

```bash
supabase login
supabase link --project-ref <seu-project-ref>
supabase db push                                   # aplica supabase/migrations
supabase secrets set --env-file supabase/functions/.env
supabase functions deploy search
```

No painel: **Authentication → URL Configuration**
- *Site URL*: a URL do site (ex.: `https://listenimento.vercel.app`)
- *Redirect URLs*: `https://listenimento.vercel.app/auth/callback`, `http://localhost:3000/auth/callback`

Para testar sem confirmar e-mail: **Authentication → Providers → Email → desligue "Confirm email"**.

### Opção B — Local

```bash
supabase start                       # sobe Postgres, Auth, Studio (http://localhost:54323)
npm run functions:serve              # em outro terminal
npm run db:types                     # regenera packages/core/src/database.types.ts
```

## 4. Variáveis dos apps

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```

Preencha com a **URL** e a **anon key** (Project Settings → API).
No celular físico com Supabase local, use o IP da sua máquina na rede, não `127.0.0.1`.

## 5. Rodando

```bash
npm run dev:web       # http://localhost:3000
npm run dev:mobile    # escaneie o QR code com o Expo Go
```

## 6. Deploy

**Site (Vercel):** importe o repositório, defina *Root Directory* = `apps/web` e adicione
`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**App (EAS):**
```bash
cd apps/mobile
npx eas-cli build --platform android --profile preview   # gera APK
```
Configure as variáveis `EXPO_PUBLIC_*` no projeto EAS (`eas env:create`).

## Verificação rápida

```bash
npm run typecheck     # core, web e mobile
npm run build:web
cd apps/mobile && npx expo-doctor
```
