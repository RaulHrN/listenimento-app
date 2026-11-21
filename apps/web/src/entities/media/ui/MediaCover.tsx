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
 * (jogos, lugares, álbuns) aparecem num arco sobre o veludo.
 * Sem capa: inicial em Bodoni sobre o veludo, como um programa de ópera.
 */
export function MediaCover({ src, alt, mediaType, className = '' }: Props) {
  const info = MEDIA_TYPE_INFO[mediaType];
  const projected = mediaType === 'game' || mediaType === 'place' || mediaType === 'album';
  const initial = alt.trim().charAt(0).toUpperCase() || '·';

  return (
    <div className={`poster aspect-[2/3] ${className}`}>
      {src && !projected && <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />}

      {src && projected && (
        <div className="velvet flex h-full w-full items-center justify-center p-4">
          <div className="arch w-full overflow-hidden shadow-[0_0_0_1px_#e7cd8f,0_14px_30px_rgba(0,0,0,0.55)]">
            <img src={src} alt={alt} loading="lazy" className={`w-full object-cover ${mediaType === 'album' ? 'aspect-square' : 'aspect-[4/5]'}`} />
          </div>
        </div>
      )}

      {!src && (
        <div className="velvet flex h-full w-full flex-col items-center justify-center">
          <span className="font-display text-7xl italic leading-none text-[#f3ead9] drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]">{initial}</span>
          <span className="mt-4 h-px w-8 bg-[#e7cd8f]/70" />
          <span className="mt-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#f3ead9]/75">{info.label}</span>
        </div>
      )}

      {/* luz suave no topo e vinheta nas bordas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_30%,transparent_70%,rgba(0,0,0,0.3))] shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]"
      />
    </div>
  );
}
