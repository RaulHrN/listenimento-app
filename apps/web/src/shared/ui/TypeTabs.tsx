'use client';

import { MEDIA_TYPES, MEDIA_TYPE_INFO, type MediaType } from '@listenimento/core';

interface Props<AllowAll extends boolean> {
  value: AllowAll extends true ? MediaType | null : MediaType;
  onChange: (value: AllowAll extends true ? MediaType | null : MediaType) => void;
  allowAll?: AllowAll;
}

export function TypeTabs<AllowAll extends boolean = false>({ value, onChange, allowAll }: Props<AllowAll>) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 pt-1">
      {allowAll && (
        <button type="button" className={`pill ${value === null ? 'pill-on' : ''}`} onClick={() => onChange(null as never)}>
          Tudo
        </button>
      )}
      {MEDIA_TYPES.map((t) => (
        <button key={t} type="button" className={`pill ${value === t ? 'pill-on' : ''}`} onClick={() => onChange(t as never)}>
          <span aria-hidden>{MEDIA_TYPE_INFO[t].emoji}</span> {MEDIA_TYPE_INFO[t].plural}
        </button>
      ))}
    </div>
  );
}
