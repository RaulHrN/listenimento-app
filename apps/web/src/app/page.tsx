import Link from 'next/link';
import { MEDIA_TYPES, MEDIA_TYPE_INFO } from '@acervo/core';

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-wrap justify-center gap-3 text-4xl">
        {MEDIA_TYPES.map((t) => (
          <span key={t} title={MEDIA_TYPE_INFO[t].plural}>
            {MEDIA_TYPE_INFO[t].emoji}
          </span>
        ))}
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Tudo que você quer viver, num só lugar.</h1>
      <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Filmes, séries, jogos, livros, lugares, animes e álbuns. Busque, salve e acompanhe o que já curtiu — no site e no
        celular.
      </p>
      <Link href="/login" className="btn-primary px-6 py-3 text-base">
        Começar
      </Link>
    </main>
  );
}
