import Link from 'next/link';
import { ITEM_STATUSES, MEDIA_TYPES, MEDIA_TYPE_INFO, PALETTES, genericStatusLabel, getStats } from '@listenimento/core';
import { createSupabaseServer } from '@/shared/lib/supabase/server';
import { NightPanel, PageTitle } from '@/shared/ui/Marquee';
import { Chandelier } from '@/shared/ui/Chandelier';

export const metadata = { title: 'Programa' };
export const dynamic = 'force-dynamic';

// o painel noturno é sempre escuro, então usa as cores de status do tema escuro
const NIGHT = PALETTES.dark.status;

export default async function PainelPage() {
  const supabase = await createSupabaseServer();
  const stats = await getStats(supabase);
  const pct = (n: number) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

  return (
    <div className="flex flex-col gap-12">
      <PageTitle kicker="Ato III · Programa da noite" title="Programa" />

      <NightPanel className="px-6 pb-10 pt-8 sm:px-10">
        <Chandelier size={54} className="mx-auto text-[#c9a45c]" />
        <div className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
          {ITEM_STATUSES.map((s, i) => (
            <div key={s} className={`text-center ${i > 0 ? 'sm:border-l sm:border-[#c9a45c]/20' : ''}`}>
              <p className="font-display text-6xl tabular-nums" style={{ color: NIGHT[s], textShadow: `0 0 24px ${NIGHT[s]}55` }}>
                {stats.byStatus[s]}
              </p>
              <p className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-[#a8978a]">{genericStatusLabel(s)}</p>
            </div>
          ))}
        </div>
        {stats.total > 0 && (
          <div className="mx-auto mt-10 flex h-1 max-w-md overflow-hidden rounded-full bg-white/5">
            {ITEM_STATUSES.map((s) => (
              <div key={s} style={{ width: `${pct(stats.byStatus[s])}%`, backgroundColor: NIGHT[s] }} title={genericStatusLabel(s)} />
            ))}
          </div>
        )}
      </NightPanel>

      <section className="grid gap-px overflow-hidden border border-line bg-line shadow-2 sm:grid-cols-2 lg:grid-cols-3">
        {MEDIA_TYPES.map((t) => {
          const info = MEDIA_TYPE_INFO[t];
          const s = stats.byType[t];
          const done = s ? Math.round((s.completed / s.total) * 100) : 0;
          return (
            <div key={t} className="bg-raised p-6">
              <div className="flex items-baseline justify-between">
                <p className="font-display text-2xl text-fg">{info.plural}</p>
                <p className="text-xs font-light text-muted">{s?.total ?? 0} na lista</p>
              </div>
              <div className="mt-5 h-px bg-line">
                <div className="h-px" style={{ width: `${done}%`, backgroundColor: info.color, boxShadow: `0 0 6px ${info.color}` }} />
              </div>
              <p className="mt-3 text-xs font-light text-muted">
                {s?.completed ?? 0} {info.done.toLowerCase()}s · {done}%{s?.avgRating ? ` · ${s.avgRating}★` : ''}
              </p>
            </div>
          );
        })}
      </section>

      {stats.total === 0 && (
        <p className="text-sm font-light text-muted">
          A temporada ainda não começou.{' '}
          <Link href="/buscar" className="text-accent-hi underline underline-offset-4">
            Monte seu repertório
          </Link>
          .
        </p>
      )}
    </div>
  );
}
