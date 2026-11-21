'use client';

import { MEDIA_TYPES, MEDIA_TYPE_INFO, type MediaType } from '@listenimento/core';

interface Props<AllowAll extends boolean> {
  value: AllowAll extends true ? MediaType | null : MediaType;
  onChange: (value: AllowAll extends true ? MediaType | null : MediaType) => void;
  allowAll?: AllowAll;
}

export function TypeTabs<AllowAll extends boolean = false>({ value, onChange, allowAll }: Props<AllowAll>) {
  return (
    <div className="-mx-4 flex gap-7 overflow-x-auto border-b border-line px-4">
      {allowAll && (
        <button type="button" className={`tab ${value === null ? 'tab-on' : ''}`} onClick={() => onChange(null as never)}>
          Tudo
        </button>
      )}
      {MEDIA_TYPES.map((t) => (
        <button key={t} type="button" className={`tab ${value === t ? 'tab-on' : ''}`} onClick={() => onChange(t as never)}>
          {MEDIA_TYPE_INFO[t].plural}
        </button>
      ))}
    </div>
  );
}
