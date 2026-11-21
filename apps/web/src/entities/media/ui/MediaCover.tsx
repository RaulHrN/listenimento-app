/* eslint-disable @next/next/no-img-element -- capas vêm de vários domínios externos */
import { MEDIA_TYPE_INFO, type MediaType } from '@listenimento/core';

interface Props {
  src: string | null;
  alt: string;
  mediaType: MediaType;
  className?: string;
}

export function MediaCover({ src, alt, mediaType, className = '' }: Props) {
  const info = MEDIA_TYPE_INFO[mediaType];
  const wide = mediaType === 'game' || mediaType === 'place';

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800 ${wide ? 'aspect-video' : mediaType === 'album' ? 'aspect-square' : 'aspect-[2/3]'} ${className}`}
      style={!src ? { background: `linear-gradient(135deg, ${info.color}33, ${info.color}11)` } : undefined}
    >
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-4xl">{info.emoji}</div>
      )}
    </div>
  );
}
