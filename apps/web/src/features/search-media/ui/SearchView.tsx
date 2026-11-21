'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ITEM_STATUSES,
  MEDIA_TYPE_INFO,
  addItem,
  getSavedKeys,
  itemKey,
  searchMedia,
  statusLabel,
  type ItemStatus,
  type MediaType,
  type SearchResult,
} from '@acervo/core';
import { getSupabase } from '@/shared/lib/supabase/client';
import { TypeTabs } from '@/shared/ui/TypeTabs';
import { MediaCover } from '@/entities/media/ui/MediaCover';

export function SearchView() {
  const supabase = getSupabase();
  const [type, setType] = useState<MediaType>('movie');
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Map<string, string>>(new Map());
  const requestId = useRef(0);

  const refreshSaved = useCallback(async (t: MediaType) => {
    try {
      setSaved(await getSavedKeys(supabase, t));
    } catch {
      /* não bloqueia a busca */
    }
  }, [supabase]);

  const run = useCallback(
    async (t: MediaType, q: string, p: number) => {
      if (q.trim().length < 2) return;
      const id = ++requestId.current;
      setLoading(true);
      setError(null);
      try {
        const res = await searchMedia(supabase, t, q, p);
        if (id !== requestId.current) return;
        setResults((prev) => (p === 1 ? res.results : [...prev, ...res.results]));
        setHasMore(res.hasMore);
        setPage(p);
      } catch (err) {
        if (id === requestId.current) setError(err instanceof Error ? err.message : 'Erro na busca');
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    void refreshSaved(type);
    setResults([]);
    setHasMore(false);
    if (submitted) void run(type, submitted, 1);
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(query);
    void run(type, query, 1);
  }

  async function onAdd(result: SearchResult, status: ItemStatus) {
    const item = await addItem(supabase, result, status);
    setSaved((prev) => new Map(prev).set(itemKey(result), item.id));
  }

  const info = MEDIA_TYPE_INFO[type];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Buscar</h1>
      <TypeTabs value={type} onChange={setType} />

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={type === 'place' ? 'Digite uma cidade. Ex.: Ouro Preto' : info.placeholder}
          autoFocus
        />
        <button className="btn-primary" disabled={loading || query.trim().length < 2}>
          Buscar
        </button>
      </form>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

      {results.length === 0 && !loading && submitted && !error && (
        <p className="text-zinc-500">Nada encontrado para “{submitted}”.</p>
      )}

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {results.map((r) => (
          <SearchResultCard key={itemKey(r)} result={r} savedId={saved.get(itemKey(r))} onAdd={onAdd} />
        ))}
      </ul>

      {loading && <p className="text-center text-sm text-zinc-500">Buscando…</p>}
      {hasMore && !loading && (
        <button className="btn-ghost self-center" onClick={() => run(type, submitted, page + 1)}>
          Carregar mais
        </button>
      )}
    </div>
  );
}

function SearchResultCard({
  result,
  savedId,
  onAdd,
}: {
  result: SearchResult;
  savedId?: string;
  onAdd: (r: SearchResult, s: ItemStatus) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  async function add(status: ItemStatus) {
    setBusy(true);
    setErr(false);
    try {
      await onAdd(result, status);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="flex flex-col gap-2">
      <MediaCover src={result.imageUrl} alt={result.title} mediaType={result.mediaType} />
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{result.title}</p>
        <p className="truncate text-xs text-zinc-500">
          {[result.year, result.subtitle].filter(Boolean).join(' · ')}
        </p>
      </div>
      {savedId ? (
        <Link href={`/lista?item=${savedId}`} className="btn-ghost justify-start px-2 py-1 text-xs text-emerald-600">
          ✓ Na sua lista
        </Link>
      ) : (
        <select
          className="input py-1.5 text-xs"
          disabled={busy}
          value=""
          onChange={(e) => e.target.value && add(e.target.value as ItemStatus)}
        >
          <option value="">{busy ? 'Salvando…' : err ? 'Erro — tentar de novo' : '+ Adicionar como…'}</option>
          {ITEM_STATUSES.filter((s) => s !== 'dropped').map((s) => (
            <option key={s} value={s}>
              {statusLabel(s, result.mediaType)}
            </option>
          ))}
        </select>
      )}
    </li>
  );
}
