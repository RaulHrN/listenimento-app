'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/features/theme/ui/ThemeToggle';

const LINKS = [
  { href: '/lista', label: 'Minha lista' },
  { href: '/buscar', label: 'Buscar' },
  { href: '/painel', label: 'Placar' },
];

export function Header({ displayName }: { displayName: string | null }) {
  const pathname = usePathname();

  return (
    <header className="relative z-30 sm:sticky sm:top-0">
      {/* fachada de madeira */}
      <div className="wood">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3">
          <Link
            href="/lista"
            className="font-marquee text-2xl text-[#e8bd63] [text-shadow:0_1px_0_rgba(0,0,0,0.6),0_0_18px_rgba(255,200,110,0.25)] sm:text-[1.7rem]"
          >
            Listenimento
          </Link>
          <nav className="order-3 flex w-full gap-6 sm:order-none sm:w-auto">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative py-1 font-mono text-xs font-bold uppercase tracking-[0.18em] transition ${
                    active ? 'text-wood-fg' : 'text-wood-fg/55 hover:text-wood-fg'
                  }`}
                >
                  {l.label}
                  {active && <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-[#e8bd63] shadow-[0_0_8px_rgba(255,200,110,0.6)]" />}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {displayName && <span className="hidden font-mono text-xs text-wood-fg/55 md:inline">Olá, {displayName}</span>}
            <ThemeToggle className="text-wood-fg" />
            <form action="/auth/signout" method="post">
              <button className="font-mono text-xs font-bold uppercase tracking-widest text-wood-fg/55 transition hover:text-wood-fg">Sair</button>
            </form>
          </div>
        </div>
      </div>
      <div className="curtain-strip" />
    </header>
  );
}
