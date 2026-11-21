'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/lista', label: 'Minha lista' },
  { href: '/buscar', label: 'Buscar' },
  { href: '/painel', label: 'Placar' },
];

export function Header({ displayName }: { displayName: string | null }) {
  const pathname = usePathname();

  return (
    <header className="z-30 sm:sticky sm:top-0">
      <div className="border-b-[3px] border-ink bg-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/lista" className="font-marquee text-2xl text-brass sm:text-3xl [text-shadow:3px_3px_0_var(--color-curtain)]">
            Listenimento
          </Link>
          <nav className="order-3 flex w-full gap-2 sm:order-none sm:w-auto">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`font-marquee border-[3px] border-ink px-2.5 py-1 text-sm tracking-wider transition sm:px-3 sm:py-1.5 sm:text-base ${
                    active ? 'curtain text-paper shadow-[3px_3px_0_0_var(--color-brass)]' : 'bg-wood-600 text-muted hover:bg-wood-500 hover:text-paper'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {displayName && (
              <span className="hidden font-mono text-xs uppercase tracking-widest text-muted md:inline">Poltrona de {displayName}</span>
            )}
            <form action="/auth/signout" method="post">
              <button className="btn-ghost px-3 py-1 text-sm">Sair</button>
            </form>
          </div>
        </div>
      </div>
      <div className="curtain h-3 border-b-2 border-ink" />
      <div className="valance -mt-px" />
    </header>
  );
}
