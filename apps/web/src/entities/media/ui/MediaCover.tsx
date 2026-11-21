/* eslint-disable @next/next/no-img-element -- capas vêm de vários domínios externos */
import { MEDIA_TYPE_INFO, type MediaType } from '@listenimento/core';

interface Props {
  src: string | null;
  alt: string;
  mediaType: MediaType;
  className?: string;
}

/**
 * Cartaz 2:3 para a grade ficar alinhada.
 * Filmes, séries, animes e livros preenchem o cartaz; capas largas
 * (jogos, lugares, álbuns) aparecem projetadas sobre o veludo.
 */
export function MediaCover({ src, alt, mediaType, className = '' }: Props) {
  const info = MEDIA_TYPE_INFO[mediaType];
  const projected = mediaType === 'game' || mediaType === 'place' || mediaType === 'album';

  return (
    <div className={`poster aspect-[2/3] ${className}`}>
      {src && !projected && <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />}

      {src && projected && (
        <div className="velvet flex h-full w-full items-center justify-center p-3">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="max-h-full w-full rounded-[2px] object-contain shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_10px_24px_rgba(0,0,0,0.55),0_0_40px_rgba(255,217,138,0.18)]"
          />
        </div>
      )}

      {!src && (
        <div className="velvet flex h-full w-full flex-col items-center justify-center gap-2">
          <span className="text-4xl opacity-90 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">{info.emoji}</span>
          <span className="font-marquee text-xs tracking-[0.2em] text-[#fbf1de]/70">{info.label}</span>
        </div>
      )}

      {/* luz: brilho suave no topo e vinheta nas bordas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),transparent_30%,transparent_70%,rgba(0,0,0,0.35))] shadow-[inset_0_0_30px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
}
