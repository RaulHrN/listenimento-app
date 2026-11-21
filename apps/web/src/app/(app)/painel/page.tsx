import Link from 'next/link';
import { ITEM_STATUSES, MEDIA_TYPES, MEDIA_TYPE_INFO, STATUS_COLORS, genericStatusLabel, getStats } from '@acervo/core';
import { createSupabaseServer } from '@/shared/lib/supabase/server';

export const metadata = { title: 'Painel' };
export const dynamic = 'force-dynamic';

export default async function PainelPage() {
  const supabase = await createSupabaseServer();
  const stats = await getStats(supabase);
  const pct = (n: number) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Painel</h1>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ITEM_STATUSES.map((s) => (
          <div key={s} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">{genericStatusLabel(s)}</p>
            <p className="mt-1 text-3xl font-bold" style={{ color: STATUS_COLORS[s] }}>
              {stats.byStatus[s]}
            </p>
          </div>
        ))}
      </section>

      {stats.total > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-medium text-zinc-500">Distribuição ({stats.total} itens)</h2>
          <div className="flex h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            {ITEM_STATUSES.map((s) => (
              <div key={s} style={{ width: `${pct(stats.byStatus[s])}%`, backgroundColor: STATUS_COLORS[s] }} title={genericStatusLabel(s)} />
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MEDIA_TYPES.map((t) => {
          const info = MEDIA_TYPE_INFO[t];
          const s = stats.byType[t];
          const done = s ? Math.round((s.completed / s.total) * 100) : 0;
          return (
            <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {info.emoji} {info.plural}
                </p>
                <p className="text-sm text-zinc-500">{s?.total ?? 0} na lista</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div className="h-full rounded-full" style={{ width: `${done}%`, backgroundColor: info.color }} />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {s?.completed ?? 0} {info.done.toLowerCase()}s · {done}%{s?.avgRating ? ` · nota média ${s.avgRating}★` : ''}
              </p>
            </div>
          );
        })}
      </section>

      {stats.total === 0 && (
        <p className="text-zinc-500">
          Sua lista está vazia. <Link href="/buscar" className="text-brand-600 underline">Comece buscando algo</Link>.
        </p>
      )}
    </div>
  );
}
