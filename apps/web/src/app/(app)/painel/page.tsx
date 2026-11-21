import Link from 'next/link';
import { ITEM_STATUSES, MEDIA_TYPES, MEDIA_TYPE_INFO, STATUS_COLORS, genericStatusLabel, getStats } from '@listenimento/core';
import { createSupabaseServer } from '@/shared/lib/supabase/server';
import { Marquee, PageTitle } from '@/shared/ui/Marquee';

export const metadata = { title: 'Placar' };
export const dynamic = 'force-dynamic';

export default async function PainelPage() {
  const supabase = await createSupabaseServer();
  const stats = await getStats(supabase);
  const pct = (n: number) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

  return (
    <div className="flex flex-col gap-10">
      <PageTitle kicker="Movimento da bilheteria" title="Placar" />

      {/* letreiro com os totais */}
      <Marquee>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ITEM_STATUSES.map((s) => (
            <div key={s} className="text-center">
              <p
                className="font-marquee text-6xl tabular-nums"
                style={{ color: STATUS_COLORS[s], textShadow: `0 0 14px ${STATUS_COLORS[s]}88, 3px 3px 0 #000` }}
              >
                {String(stats.byStatus[s]).padStart(2, '0')}
              </p>
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-widest text-muted">{genericStatusLabel(s)}</p>
            </div>
          ))}
        </div>
        {stats.total > 0 && (
          <div className="mt-5 flex h-4 border-2 border-brass-dark">
            {ITEM_STATUSES.map((s) => (
              <div key={s} style={{ width: `${pct(stats.byStatus[s])}%`, backgroundColor: STATUS_COLORS[s] }} title={genericStatusLabel(s)} />
            ))}
          </div>
        )}
      </Marquee>

      {/* um ingresso por tipo */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MEDIA_TYPES.map((t) => {
          const info = MEDIA_TYPE_INFO[t];
          const s = stats.byType[t];
          const done = s ? Math.round((s.completed / s.total) * 100) : 0;
          return (
            <div key={t} className="drop-shadow-[6px_6px_0_#0c0806]">
              <div className="ticket px-7 py-4">
                <div className="flex items-center justify-between border-b-2 border-dashed border-ink/30 pb-2">
                  <p className="font-marquee text-2xl">
                    {info.emoji} {info.plural}
                  </p>
                  <p className="font-mono text-xs font-bold">{String(s?.total ?? 0).padStart(3, '0')}</p>
                </div>
                <div className="mt-3 h-3 border-2 border-ink bg-paper-dark">
                  <div className="h-full" style={{ width: `${done}%`, backgroundColor: info.color }} />
                </div>
                <p className="mt-2 font-mono text-xs">
                  {s?.completed ?? 0} {info.done.toLowerCase()}s · {done}%{s?.avgRating ? ` · nota média ${s.avgRating}★` : ''}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {stats.total === 0 && (
        <p className="font-mono text-muted">
          A sala ainda está vazia.{' '}
          <Link href="/buscar" className="text-brass underline decoration-2 underline-offset-4">
            Comece buscando algo
          </Link>
          .
        </p>
      )}
    </div>
  );
}
