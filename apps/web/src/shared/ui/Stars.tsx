'use client';

interface Props {
  value: number | null;
  onChange?: (value: number | null) => void;
  size?: 'sm' | 'lg';
}

/** Nota de 1 a 5 em estrelas de latão. Clicar na estrela atual limpa a nota. */
export function Stars({ value, onChange, size = 'sm' }: Props) {
  const cls = size === 'lg' ? 'text-3xl' : 'text-xs';
  const on = 'text-brass-hi [text-shadow:0_1px_0_rgba(0,0,0,0.35),0_0_8px_rgba(255,200,110,0.35)]';
  const off = 'text-muted/30';
  return (
    <div className={`flex leading-none ${cls}`} aria-label={value ? `Nota ${value} de 5` : 'Sem nota'}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <span className={(value ?? 0) >= n ? on : off}>★</span>;
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
