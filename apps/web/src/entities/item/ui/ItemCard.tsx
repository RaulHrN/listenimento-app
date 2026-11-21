import { MEDIA_TYPE_INFO, type UserItem } from '@listenimento/core';
import { MediaCover } from '@/entities/media/ui/MediaCover';
import { Stars } from '@/shared/ui/Stars';
import { StatusBadge } from './StatusBadge';

export function ItemCard({ item, onClick }: { item: UserItem; onClick: () => void }) {
  return (
    <li>
      <button type="button" onClick={onClick} className="group flex w-full flex-col text-left">
        <div className="relative transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
          <MediaCover src={item.image_url} alt={item.title} mediaType={item.media_type} />
          <span className="absolute left-2 top-2 border-2 border-ink bg-paper px-1 text-xs shadow-[2px_2px_0_#0c0806]">
            {MEDIA_TYPE_INFO[item.media_type].emoji}
          </span>
          {item.priority > 0 && (
            <span className="font-marquee absolute right-2 top-2 border-2 border-ink bg-brass px-1.5 text-sm text-ink shadow-[2px_2px_0_#0c0806]">
              {'!'.repeat(item.priority)}
            </span>
          )}
          <div className="absolute bottom-2 left-2">
            <StatusBadge status={item.status} mediaType={item.media_type} />
          </div>
        </div>
        {/* canhoto do ingresso */}
        <div className="mt-3 border-[3px] border-ink bg-paper px-2.5 py-2 text-ink shadow-brut-sm">
          <p className="line-clamp-2 text-sm font-extrabold uppercase leading-tight">{item.title}</p>
          <div className="mt-1 flex items-center justify-between gap-2 border-t-2 border-dashed border-ink/30 pt-1">
            <p className="truncate font-mono text-[11px]">{[item.year, item.subtitle].filter(Boolean).join(' · ') || '—'}</p>
            {item.rating ? <Stars value={item.rating} tone="ink" /> : null}
          </div>
        </div>
      </button>
    </li>
  );
}
