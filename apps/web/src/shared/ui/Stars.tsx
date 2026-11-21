'use client';

interface Props {
  value: number | null;
  onChange?: (value: number | null) => void;
  size?: 'sm' | 'lg';
  /** "ink" para usar sobre o papel do ingresso */
  tone?: 'brass' | 'ink';
}

/** Nota de 1 a 5. Clicar na estrela atual limpa a nota. */
export function Stars({ value, onChange, size = 'sm', tone = 'brass' }: Props) {
  const cls = size === 'lg' ? 'text-3xl' : 'text-sm';
  const on = tone === 'ink' ? 'text-curtain' : 'text-brass [text-shadow:2px_2px_0_#0c0806]';
  const off = tone === 'ink' ? 'text-ink/20' : 'text-wood-500';
  return (
    <div className={`flex leading-none ${cls}`} aria-label={value ? `Nota ${value} de 5` : 'Sem nota'}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <span className={(value ?? 0) >= n ? on : off}>★</span>;
        return onChange ? (
          <button key={n} type="button" className="px-0.5 transition hover:scale-125" onClick={() => onChange(value === n ? null : n)}>
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
