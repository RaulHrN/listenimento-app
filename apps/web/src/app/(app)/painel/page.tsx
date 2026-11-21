import Link from 'next/link';
import { ITEM_STATUSES, MEDIA_TYPES, MEDIA_TYPE_INFO, PALETTES, genericStatusLabel, getStats } from '@listenimento/core';
import { createSupabaseServer } from '@/shared/lib/supabase/server';
import { Marquee, PageTitle } from '@/shared/ui/Marquee';

export const metadata = { title: 'Placar' };
export const dynamic = 'force-dynamic';

// o letreiro é sempre escuro, então usa as cores de status do tema escuro
const SIGN = PALETTES.dark.status;

export default async function PainelPage() {
  const supabase = await createSupabaseServer();
  const stats = await getStats(supabase);
  const pct = (n: number) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

  return (
    <div className="flex flex-col gap-10">
      <PageTitle kicker="Movimento da bilheteria" title="Placar" />

      <Marquee bulbs={false}>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {ITEM_STATUSES.map((s) => (
            <div key={s} className="text-center">
              <p className="font-marquee text-6xl tabular-nums" style={{ color: SIGN[s], textShadow: `0 0 18px ${SIGN[s]}66, 0 2px 0 rgba(0,0,0,0.6)` }}>
                {String(stats.byStatus[s]).padStart(2, '0')}
              </p>
              <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#a8927a]">{genericStatusLabel(s)}</p>
            </div>
          ))}
        </div>
        {stats.total > 0 && (
          <div className="mt-6 flex h-1.5 overflow-hidden rounded-full bg-white/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
            {ITEM_STATUSES.map((s) => (
              <div key={s} style={{ width: `${pct(stats.byStatus[s])}%`, backgroundColor: SIGN[s] }} title={genericStatusLabel(s)} />
            ))}
          </div>
        )}
      </Marquee>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MEDIA_TYPES.map((t) => {
          const info = MEDIA_TYPE_INFO[t];
          const s = stats.byType[t];
          const done = s ? Math.round((s.completed / s.total) * 100) : 0;
          return (
            <div key={t} className="card p-5">
              <div className="flex items-baseline justify-between">
                <p className="font-marquee text-2xl text-fg">{info.plural}</p>
                <p className="font-mono text-xs text-muted">{s?.total ?? 0} na lista</p>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-fg/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                <div
                  className="h-full rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                  style={{ width: `${done}%`, background: `linear-gradient(180deg, ${info.color}, ${info.color}cc)` }}
                />
              </div>
              <p className="mt-2.5 font-mono text-xs text-muted">
                {s?.completed ?? 0} {info.done.toLowerCase()}s · {done}%{s?.avgRating ? ` · ${s.avgRating}★` : ''}
              </p>
            </div>
          );
        })}
      </section>

      {stats.total === 0 && (
        <p className="font-mono text-sm text-muted">
          A sala ainda está vazia.{' '}
          <Link href="/buscar" className="text-accent-hi underline underline-offset-4">
            Comece buscando algo
          </Link>
          .
        </p>
      )}
    </div>
  );
}
