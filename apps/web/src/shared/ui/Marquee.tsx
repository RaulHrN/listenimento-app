import type { ReactNode } from 'react';

/** Letreiro iluminado (sempre escuro, com lâmpadas e brilho quente). */
export function Marquee({ children, className = '', bulbs = true }: { children: ReactNode; className?: string; bulbs?: boolean }) {
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      {bulbs && <div className="bulbs mt-2 animate-flicker" />}
      <div className="px-6 py-5">{children}</div>
      {bulbs && <div className="bulbs mb-2 animate-flicker [animation-delay:1.3s]" />}
    </div>
  );
}

/** Título de página: kicker discreto + nome em letreiro. */
export function PageTitle({ kicker, title, action }: { kicker: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
      <div>
        <p className="kicker">{kicker}</p>
        <h1 className="font-marquee mt-1 text-5xl text-fg [text-shadow:0_1px_0_var(--hi),0_2px_10px_rgba(0,0,0,0.12)] sm:text-6xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
