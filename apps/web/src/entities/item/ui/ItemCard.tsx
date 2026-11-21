import type { UserItem } from '@listenimento/core';
import { MediaCover } from '@/entities/media/ui/MediaCover';
import { Stars } from '@/shared/ui/Stars';
import { StatusBadge } from './StatusBadge';

export function ItemCard({ item, onClick }: { item: UserItem; onClick: () => void }) {
  return (
    <li>
      <button type="button" onClick={onClick} className="group flex w-full flex-col gap-4 text-left">
        <div className="relative transition duration-500 ease-out group-hover:-translate-y-1.5 group-hover:[&>.poster]:shadow-3">
          <MediaCover src={item.image_url} alt={item.title} mediaType={item.media_type} />
          {item.priority > 0 && (
            <span
              className="absolute right-2.5 top-2.5 flex gap-0.5"
              title={`Prioridade ${item.priority}`}
              aria-label={`Prioridade ${item.priority}`}
            >
              {Array.from({ length: item.priority }, (_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#e7cd8f] shadow-[0_0_6px_rgba(231,205,143,0.8)]" />
              ))}
            </span>
          )}
        </div>
        <div className="min-w-0 space-y-2">
          <p className="line-clamp-2 font-display text-[1.05rem] leading-snug text-fg">{item.title}</p>
          <div className="flex items-center justify-between gap-2">
            <StatusBadge status={item.status} mediaType={item.media_type} />
            {item.rating ? <Stars value={item.rating} /> : null}
          </div>
        </div>
      </button>
    </li>
  );
}
