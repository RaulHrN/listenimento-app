import type { ReactNode } from 'react';

/** Painel noturno (como a capa do programa da noite): sempre escuro, filete de ouro. */
export function NightPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`night gilt ${className}`}>{children}</div>;
}

/** Título de página: ato em versaletes dourados + título em Bodoni. */
export function PageTitle({ kicker, title, action }: { kicker: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
      <div>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-2 font-display text-5xl leading-none text-fg sm:text-6xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
