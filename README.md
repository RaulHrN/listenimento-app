# Acervo

Lista pessoal de tudo que você quer assistir, jogar, ler, ouvir e visitar — no celular e na web, sincronizada pela sua conta.

## Estrutura

```
acervo/
├── apps/
│   ├── web/        # Next.js (App Router) + Tailwind
│   └── mobile/     # Expo (React Native) + Expo Router
├── packages/
│   └── core/       # Tipos, rótulos pt-BR e serviços compartilhados (Supabase)
└── supabase/
    ├── migrations/ # Schema + RLS
    └── functions/  # Edge Function "search" (proxy das APIs externas)
```

O guia completo de setup fica em `docs/SETUP.md` (adicionado na última etapa).
