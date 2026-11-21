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

**App Android (APK pelo GitHub Actions)** — workflow em `.github/workflows/android-apk.yml`.

1. Em **Settings → Secrets and variables → Actions**, crie os secrets:
   - `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` (os mesmos do `.env` do app).
2. Na aba **Actions → Android APK → Run workflow**, rode o build (~15–25 min na primeira vez).
3. Baixe o APK em **Artifacts** no fim da execução e instale no celular
   (permita "instalar apps de fontes desconhecidas").

Para publicar uma versão: `git tag v0.2.0 && git push origin v0.2.0` — o APK é anexado à Release.
Cada build usa o número da execução como `versionCode`, então o APK novo instala por cima do antigo.

**Assinatura própria (recomendado antes de distribuir):** sem ela, o APK sai assinado com a
chave de debug — serve para testar, mas trocar de chave depois obriga a desinstalar o app.

```bash
keytool -genkeypair -v -keystore listenimento.jks -alias listenimento \
  -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 listenimento.jks   # no macOS: base64 -i listenimento.jks
```

Crie os secrets `ANDROID_KEYSTORE_BASE64` (saída do base64), `ANDROID_KEYSTORE_PASSWORD`,
`ANDROID_KEY_ALIAS` (`listenimento`) e `ANDROID_KEY_PASSWORD`. Guarde o `.jks` fora do repositório.

**Build local:** `cd apps/mobile && npx expo prebuild -p android && cd android && ./gradlew assembleRelease`
(precisa de JDK 17 e Android SDK).

## Verificação rápida

```bash
npm run typecheck     # core, web e mobile
npm run build:web
cd apps/mobile && npx expo-doctor
```
