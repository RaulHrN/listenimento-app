import Link from 'next/link';
import { MEDIA_TYPES, MEDIA_TYPE_INFO } from '@listenimento/core';
import { Chandelier } from '@/shared/ui/Chandelier';
import { ThemeToggle } from '@/features/theme/ui/ThemeToggle';

export default function LandingPage() {
  return (
    <main className="velvet relative flex min-h-dvh items-end justify-center overflow-hidden px-4 pt-16">
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle className="text-accent-fg" />
      </div>

      {/* sanefa: faixa de veludo mais escura com filete de ouro */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/45 to-transparent" />

      {/* proscênio em arco, recortado no veludo */}
      <section className="arch relative flex w-full max-w-xl flex-col items-center bg-bg px-8 pb-16 pt-24 text-center shadow-[0_0_0_1px_var(--gold-hi),0_0_0_10px_rgba(0,0,0,0.12),0_0_0_11px_color-mix(in_srgb,var(--gold-hi)_55%,transparent),0_-30px_80px_rgba(0,0,0,0.45)] sm:pt-28">
        {/* luz de palco caindo de cima */}
        <div aria-hidden className="arch pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,var(--bg-spot),transparent_70%)]" />

        <Chandelier size={92} className="relative text-gold drop-shadow-[0_6px_18px_rgba(201,164,92,0.35)]" />

        <p className="kicker relative mt-8">Temporada 2026 · Ato I</p>
        <h1 className="relative mt-3 font-display text-[clamp(2.8rem,9vw,4.8rem)] leading-none text-fg">
          Listen<span className="italic text-accent dark:text-accent-hi">i</span>mento
        </h1>
        <div aria-hidden className="relative mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <p className="relative mt-6 max-w-sm text-[0.95rem] font-light leading-relaxed text-muted">
          O repertório de tudo que você quer assistir, jogar, ler, ouvir e visitar.
        </p>

        <Link href="/login" className="btn-primary relative mt-10 px-9 py-3.5">
          Entrar
        </Link>

        <p className="relative mt-12 text-[0.64rem] font-medium uppercase tracking-[0.3em] text-muted/80">
          {MEDIA_TYPES.map((t) => MEDIA_TYPE_INFO[t].plural).join(' · ')}
        </p>
      </section>
    </main>
  );
}
