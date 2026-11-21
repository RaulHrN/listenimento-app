'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/features/theme/ui/ThemeToggle';
import { Chandelier } from '@/shared/ui/Chandelier';

const LINKS = [
  { href: '/lista', label: 'Minha lista' },
  { href: '/buscar', label: 'Buscar' },
  { href: '/painel', label: 'Programa' },
];

export function Header({ displayName }: { displayName: string | null }) {
  const pathname = usePathname();

  return (
    <header className="relative z-30 sm:sticky sm:top-0">
      <div className="accent-bar" />
      <div className="border-b border-line bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-1 px-4 py-4">
          <Link href="/lista" className="flex items-center gap-2.5">
            <Chandelier size={26} className="text-gold" />
            <span className="font-display text-2xl leading-none text-fg">
              Listen<span className="italic text-accent dark:text-accent-hi">i</span>mento
            </span>
          </Link>
          <nav className="order-3 flex w-full gap-7 sm:order-none sm:w-auto">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`tab ${pathname.startsWith(l.href) ? 'tab-on' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            {displayName && <span className="hidden text-sm font-light text-muted md:inline">{displayName}</span>}
            <ThemeToggle className="text-fg" />
            <form action="/auth/signout" method="post">
              <button className="tab">Sair</button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
