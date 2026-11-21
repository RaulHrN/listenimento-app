import Link from 'next/link';
import { MEDIA_TYPES, MEDIA_TYPE_INFO } from '@listenimento/core';
import { Marquee } from '@/shared/ui/Marquee';

export default function LandingPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* sanefa */}
      <div className="curtain relative z-20 h-10 border-b-[3px] border-ink" />
      <div className="valance relative z-20 -mt-px" />

      {/* cortinas laterais */}
      <div aria-hidden className="curtain absolute inset-y-0 left-0 z-10 w-[14vw] max-w-48 border-r-[3px] border-ink shadow-[8px_0_0_0_rgba(0,0,0,0.5)]" />
      <div aria-hidden className="curtain absolute inset-y-0 right-0 z-10 w-[14vw] max-w-48 border-l-[3px] border-ink shadow-[-8px_0_0_0_rgba(0,0,0,0.5)]" />

      <section className="relative z-0 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-[16vw] py-16 text-center sm:px-6">
        <p className="kicker">★ Sessão contínua · desde 2026 ★</p>

        <Marquee className="w-full">
          <p className="font-mono text-xs font-bold tracking-[0.3em] text-brass">HOJE EM CARTAZ</p>
          <h1 className="font-marquee mt-2 text-[clamp(2.6rem,9vw,6rem)] text-paper [text-shadow:5px_5px_0_var(--color-curtain)]">
            Listenimento
          </h1>
          <p className="mt-3 font-mono text-sm text-muted">Tudo que você quer assistir, jogar, ler, ouvir e visitar.</p>
        </Marquee>

        <ul className="flex flex-wrap justify-center gap-2">
          {MEDIA_TYPES.map((t) => (
            <li key={t} className="border-[3px] border-ink bg-paper px-2 py-1 font-mono text-xs font-bold uppercase text-ink shadow-brut-sm">
              {MEDIA_TYPE_INFO[t].emoji} {MEDIA_TYPE_INFO[t].plural}
            </li>
          ))}
        </ul>

        <Link href="/login" className="btn-primary px-8 py-3 text-xl">
          Entrar na sessão →
        </Link>
      </section>

      {/* palco */}
      <div className="wood relative z-20 h-16 border-t-[3px] border-ink shadow-[0_-4px_0_0_var(--color-brass-dark)]" />
    </main>
  );
}
