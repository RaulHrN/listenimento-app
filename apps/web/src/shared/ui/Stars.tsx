'use client';

interface Props {
  value: number | null;
  onChange?: (value: number | null) => void;
  size?: 'sm' | 'lg';
}

/** Nota de 1 a 5 em estrelas de ouro. Clicar na estrela atual limpa a nota. */
export function Stars({ value, onChange, size = 'sm' }: Props) {
  const cls = size === 'lg' ? 'text-2xl gap-1' : 'text-[0.7rem] gap-px';
  const on = 'text-gold-hi [text-shadow:0_0_8px_color-mix(in_srgb,var(--gold-hi)_45%,transparent)]';
  const off = 'text-line';
  return (
    <div className={`flex leading-none ${cls}`} aria-label={value ? `Nota ${value} de 5` : 'Sem nota'}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <span className={(value ?? 0) >= n ? on : off}>★</span>;
        return onChange ? (
          <button key={n} type="button" className="transition hover:scale-110" onClick={() => onChange(value === n ? null : n)}>
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
