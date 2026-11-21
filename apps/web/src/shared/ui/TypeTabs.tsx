'use client';

import { MEDIA_TYPES, MEDIA_TYPE_INFO, type MediaType } from '@acervo/core';

interface Props<AllowAll extends boolean> {
  value: AllowAll extends true ? MediaType | null : MediaType;
  onChange: (value: AllowAll extends true ? MediaType | null : MediaType) => void;
  allowAll?: AllowAll;
}

export function TypeTabs<AllowAll extends boolean = false>({ value, onChange, allowAll }: Props<AllowAll>) {
  const base = 'shrink-0 rounded-full border px-3 py-1.5 text-sm transition';
  const on = 'border-brand-600 bg-brand-600 text-white';
  const off = 'border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300';

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
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
