'use client';

interface Props {
  value: number | null;
  onChange?: (value: number | null) => void;
  size?: 'sm' | 'lg';
}

/** Nota de 1 a 5. Clicar na estrela atual limpa a nota. */
export function Stars({ value, onChange, size = 'sm' }: Props) {
  const cls = size === 'lg' ? 'text-2xl' : 'text-sm';
  return (
    <div className={`flex ${cls}`} aria-label={value ? `Nota ${value} de 5` : 'Sem nota'}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (value ?? 0) >= n;
        const star = <span className={filled ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-700'}>★</span>;
        return onChange ? (
          <button key={n} type="button" className="px-0.5 transition hover:scale-110" onClick={() => onChange(value === n ? null : n)}>
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
