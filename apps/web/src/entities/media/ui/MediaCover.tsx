/* eslint-disable @next/next/no-img-element -- capas vêm de vários domínios externos */
import { MEDIA_TYPE_INFO, type MediaType } from '@listenimento/core';

interface Props {
  src: string | null;
  alt: string;
  mediaType: MediaType;
  className?: string;
}

/**
 * Cartaz 2:3 em moldura de latão, para a grade ficar alinhada.
 * Filmes, séries, animes e livros preenchem o cartaz; capas largas
 * (jogos, lugares, álbuns) são "projetadas" sobre a cortina.
 */
export function MediaCover({ src, alt, mediaType, className = '' }: Props) {
  const info = MEDIA_TYPE_INFO[mediaType];
  const projected = mediaType === 'game' || mediaType === 'place' || mediaType === 'album';

  return (
    <div className={`poster-frame relative aspect-[2/3] overflow-hidden ${className}`}>
      {src && !projected && <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover sepia-[.15] saturate-[.9]" />}

      {src && projected && (
        <div className="curtain flex h-full w-full items-center justify-center p-3">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="max-h-full w-full border-[3px] border-ink object-contain shadow-[0_0_24px_rgba(255,217,138,0.35)] sepia-[.15]"
          />
        </div>
      )}

      {!src && (
        <div className="curtain flex h-full w-full flex-col items-center justify-center gap-2">
          <span className="text-4xl drop-shadow-[3px_3px_0_#0c0806]">{info.emoji}</span>
          <span className="font-marquee text-xs tracking-widest text-paper/80">{info.label}</span>
        </div>
      )}

      {/* vinheta de projeção */}
      <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.55)]" />
    </div>
  );
}
