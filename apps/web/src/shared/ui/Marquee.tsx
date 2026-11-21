import type { ReactNode } from 'react';

/** Letreiro de cinema: placa escura com lâmpadas em cima e embaixo. */
export function Marquee({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border-[3px] border-ink bg-ink shadow-brut-red ${className}`}>
      <div className="bulbs animate-bulbs" />
      <div className="border-y-2 border-brass-dark px-5 py-4">{children}</div>
      <div className="bulbs animate-bulbs [animation-delay:0.8s]" />
    </div>
  );
}

/** Título de página no estilo de placa de programação. */
export function PageTitle({ kicker, title, action }: { kicker: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-ink pb-3 shadow-[0_3px_0_0_var(--color-brass-dark)]">
      <div>
        <p className="kicker">{kicker}</p>
        <h1 className="font-marquee text-5xl text-paper [text-shadow:4px_4px_0_var(--color-curtain-dark)] sm:text-6xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
