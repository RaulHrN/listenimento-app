import type { UserItem } from '@listenimento/core';
import { MediaCover } from '@/entities/media/ui/MediaCover';
import { Stars } from '@/shared/ui/Stars';
import { StatusBadge } from './StatusBadge';

export function ItemCard({ item, onClick }: { item: UserItem; onClick: () => void }) {
  return (
    <li>
      <button type="button" onClick={onClick} className="group flex w-full flex-col gap-3 text-left">
        <div className="relative transition duration-300 group-hover:-translate-y-1 group-hover:[&>.poster]:shadow-3">
          <MediaCover src={item.image_url} alt={item.title} mediaType={item.media_type} />
          {item.priority > 0 && (
            <span className="font-marquee absolute right-2 top-2 rounded-[3px] bg-[linear-gradient(180deg,#f3cf7f,#c9953a)] px-1.5 text-sm text-[#1b110b] shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
              {'!'.repeat(item.priority)}
            </span>
          )}
        </div>
        <div className="min-w-0 space-y-1.5">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-fg">{item.title}</p>
          <div className="flex items-center justify-between gap-2">
            <StatusBadge status={item.status} mediaType={item.media_type} />
            {item.rating ? <Stars value={item.rating} /> : null}
          </div>
        </div>
      </button>
    </li>
  );
}
