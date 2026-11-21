'use client';

import { MEDIA_TYPES, MEDIA_TYPE_INFO, type MediaType } from '@listenimento/core';

interface Props<AllowAll extends boolean> {
  value: AllowAll extends true ? MediaType | null : MediaType;
  onChange: (value: AllowAll extends true ? MediaType | null : MediaType) => void;
  allowAll?: AllowAll;
}

export function TypeTabs<AllowAll extends boolean = false>({ value, onChange, allowAll }: Props<AllowAll>) {
  const base = 'font-marquee shrink-0 border-[3px] border-ink px-3 py-1.5 text-sm tracking-wider transition';
  const on = 'curtain text-paper shadow-[4px_4px_0_0_var(--color-brass)] -translate-y-0.5';
  const off = 'bg-wood-600 text-muted shadow-brut-sm hover:bg-wood-500 hover:text-paper';

  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-3 pt-1">
      {allowAll && (
        <button type="button" className={`${base} ${value === null ? on : off}`} onClick={() => onChange(null as never)}>
          Tudo
        </button>
      )}
      {MEDIA_TYPES.map((t) => (
        <button key={t} type="button" className={`${base} ${value === t ? on : off}`} onClick={() => onChange(t as never)}>
          {MEDIA_TYPE_INFO[t].emoji} {MEDIA_TYPE_INFO[t].plural}
        </button>
      ))}
    </div>
  );
}
