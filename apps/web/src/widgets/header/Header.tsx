'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/lista', label: 'Minha lista' },
  { href: '/buscar', label: 'Buscar' },
  { href: '/painel', label: 'Painel' },
];

export function Header({ displayName }: { displayName: string | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/lista" className="text-lg font-bold">
          Listenimento
        </Link>
        <nav className="flex gap-1">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  active
                    ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-100'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          {displayName && <span className="hidden text-zinc-500 sm:inline">Olá, {displayName}</span>}
          <form action="/auth/signout" method="post">
            <button className="btn-ghost px-3 py-1.5">Sair</button>
          </form>
        </div>
      </div>
    </header>
  );
}
