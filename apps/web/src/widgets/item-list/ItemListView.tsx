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
} from '@listenimento/core';
import { getSupabase } from '@/shared/lib/supabase/client';
import { TypeTabs } from '@/shared/ui/TypeTabs';
import { ItemCard } from '@/entities/item/ui/ItemCard';
import { ItemEditor } from '@/features/edit-item/ui/ItemEditor';
import { PageTitle } from '@/shared/ui/Marquee';

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
    <div className="flex flex-col gap-6">
      <PageTitle
        kicker="Programação da casa"
        title="Minha lista"
        action={
          <Link href="/buscar" className="btn-primary">
            + Adicionar
          </Link>
        }
      />

      <TypeTabs value={mediaType} onChange={setMediaType} allowAll />

      <div className="flex flex-col gap-3 sm:flex-row">
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

      {error && <p className="alert">{error}</p>}

      {!loading && items.length === 0 && !error && (
        <div className="card px-6 py-14 text-center">
          <p className="font-marquee text-4xl text-fg">Sala vazia</p>
          <p className="mt-2 font-mono text-sm text-muted">Nenhum título em cartaz por aqui ainda.</p>
          <Link href="/buscar" className="btn-primary mt-6">
            Buscar algo para adicionar
          </Link>
        </div>
      )}

      <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onClick={() => setEditing(item)} />
        ))}
      </ul>

      {loading && <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">Acendendo as luzes…</p>}
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
