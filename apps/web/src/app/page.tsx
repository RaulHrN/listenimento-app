import Link from 'next/link';
import { MEDIA_TYPES, MEDIA_TYPE_INFO } from '@listenimento/core';
import { Marquee } from '@/shared/ui/Marquee';
import { ThemeToggle } from '@/features/theme/ui/ThemeToggle';

export default function LandingPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="curtain-strip relative z-20 !h-6" />

      {/* cortinas laterais com dobras e sombra projetada */}
      <div
        aria-hidden
        className="velvet absolute inset-y-0 left-0 z-10 hidden w-[12vw] max-w-40 shadow-[18px_0_40px_-10px_rgba(0,0,0,0.55)] [border-bottom-right-radius:40%_8%] sm:block"
      />
      <div
        aria-hidden
        className="velvet absolute inset-y-0 right-0 z-10 hidden w-[12vw] max-w-40 shadow-[-18px_0_40px_-10px_rgba(0,0,0,0.55)] [border-bottom-left-radius:40%_8%] sm:block"
      />

      <div className="absolute right-4 top-9 z-30 sm:right-[14vw]">
        <ThemeToggle className="text-fg" />
      </div>

      <section className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
        <Marquee className="w-full">
          <p className="font-mono text-[11px] font-bold tracking-[0.35em] text-[#d6a54a]">HOJE EM CARTAZ</p>
          <h1 className="font-marquee mt-3 text-[clamp(2.6rem,9vw,5.5rem)] text-[#f6ead2] [text-shadow:0_0_24px_rgba(255,200,110,0.35),0_2px_0_rgba(0,0,0,0.6)]">
            Listenimento
          </h1>
          <p className="mt-3 font-mono text-sm text-[#a8927a]">Tudo que você quer assistir, jogar, ler, ouvir e visitar.</p>
        </Marquee>

        <p className="max-w-md font-mono text-sm leading-relaxed text-muted">
          {MEDIA_TYPES.map((t) => MEDIA_TYPE_INFO[t].plural).join(' · ')}
        </p>

        <Link href="/login" className="btn-primary px-8 py-3 text-lg">
          Entrar na sessão
        </Link>
      </section>

      {/* palco de madeira com borda iluminada */}
      <div className="wood relative z-20 h-14 shadow-[0_-1px_0_rgba(214,165,74,0.35),0_-12px_30px_-10px_rgba(0,0,0,0.5)]" />
    </main>
  );
}
