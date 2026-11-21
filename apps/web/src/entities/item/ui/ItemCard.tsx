import { MEDIA_TYPE_INFO, type UserItem } from '@acervo/core';
import { MediaCover } from '@/entities/media/ui/MediaCover';
import { Stars } from '@/shared/ui/Stars';
import { StatusBadge } from './StatusBadge';

export function ItemCard({ item, onClick }: { item: UserItem; onClick: () => void }) {
  return (
    <li>
      <button type="button" onClick={onClick} className="group flex w-full flex-col gap-2 text-left">
        <div className="relative">
          <MediaCover src={item.image_url} alt={item.title} mediaType={item.media_type} className="transition group-hover:opacity-90" />
          <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white">
            {MEDIA_TYPE_INFO[item.media_type].emoji}
          </span>
          {item.priority > 0 && (
            <span className="absolute right-2 top-2 rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {'!'.repeat(item.priority)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-medium leading-snug">{item.title}</p>
          <p className="truncate text-xs text-zinc-500">{[item.year, item.subtitle].filter(Boolean).join(' · ')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={item.status} mediaType={item.media_type} />
          {item.rating && <Stars value={item.rating} />}
        </div>
      </button>
    </li>
  );
}
