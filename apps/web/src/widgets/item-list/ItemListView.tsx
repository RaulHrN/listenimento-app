'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ITEM_STATUSES,
  genericStatusLabel,
  getItem,
  listItems,
  type ItemFilters,
  type ItemStatus,
  type MediaType,
  type UserItem,
} from '@acervo/core';
import { getSupabase } from '@/shared/lib/supabase/client';
import { TypeTabs } from '@/shared/ui/TypeTabs';
import { ItemCard } from '@/entities/item/ui/ItemCard';
import { ItemEditor } from '@/features/edit-item/ui/ItemEditor';

const PAGE = 60;
const SORTS: Array<{ value: NonNullable<ItemFilters['sort']>; label: string }> = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'priority', label: 'Prioridade' },
  { value: 'rating', label: 'Nota' },
  { value: 'title', label: 'Título (A–Z)' },
];

export function ItemListView() {
  const supabase = getSupabase();
  const router = useRouter();
  const params = useSearchParams();

  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [status, setStatus] = useState<ItemStatus | null>(null);
  const [sort, setSort] = useState<NonNullable<ItemFilters['sort']>>('recent');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<UserItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<UserItem | null>(null);

  const load = useCallback(
    async (offset = 0) => {
      setLoading(true);
      setError(null);
      try {
        const data = await listItems(supabase, { mediaType, status, sort, search, limit: PAGE, offset });
        setItems((prev) => (offset === 0 ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar');
      } finally {
        setLoading(false);
      }
    },
    [supabase, mediaType, status, sort, search],
  );

  useEffect(() => {
    const t = setTimeout(() => void load(0), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  // abre direto um item vindo da busca (?item=<id>)
  const itemParam = params.get('item');
  useEffect(() => {
    if (!itemParam) return;
    getItem(supabase, itemParam).then((it) => it && setEditing(it)).catch(() => undefined);
  }, [itemParam, supabase]);

  function closeEditor() {
    setEditing(null);
    if (itemParam) router.replace('/lista');
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Minha lista</h1>
        <Link href="/buscar" className="btn-primary">
          + Adicionar
        </Link>
      </div>

      <TypeTabs value={mediaType} onChange={setMediaType} allowAll />

      <div className="flex flex-col gap-2 sm:flex-row">
        <input className="input sm:max-w-xs" placeholder="Filtrar pelo título…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input sm:w-48" value={status ?? ''} onChange={(e) => setStatus((e.target.value || null) as ItemStatus | null)}>
          <option value="">Todos os status</option>
          {ITEM_STATUSES.map((s) => (
            <option key={s} value={s}>
              {genericStatusLabel(s)}
            </option>
          ))}
        </select>
        <select className="input sm:w-44" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

      {!loading && items.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-zinc-500">Nada por aqui ainda.</p>
          <Link href="/buscar" className="btn-primary mt-4">
            Buscar algo para adicionar
          </Link>
        </div>
      )}

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onClick={() => setEditing(item)} />
        ))}
      </ul>

      {loading && <p className="text-center text-sm text-zinc-500">Carregando…</p>}
      {hasMore && !loading && (
        <button className="btn-ghost self-center" onClick={() => load(items.length)}>
          Carregar mais
        </button>
      )}

      {editing && (
        <ItemEditor
          key={editing.id}
          item={editing}
          onClose={closeEditor}
          onSaved={(u) => setItems((prev) => prev.map((i) => (i.id === u.id ? u : i)))}
          onRemoved={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
        />
      )}
    </div>
  );
}
