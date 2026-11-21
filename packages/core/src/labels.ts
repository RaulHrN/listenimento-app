import type { ItemStatus, MediaType } from './types';

interface MediaTypeInfo {
  label: string;
  plural: string;
  emoji: string;
  /** verbo no infinitivo usado nos status: "Quero assistir", "Quero jogar"... */
  verb: string;
  /** verbo no gerúndio: "Assistindo", "Jogando"... */
  gerund: string;
  /** particípio: "Assistido", "Jogado"... */
  done: string;
  placeholder: string;
  color: string;
}

export const MEDIA_TYPE_INFO: Record<MediaType, MediaTypeInfo> = {
  movie:  { label: 'Filme', plural: 'Filmes', emoji: '🎬', verb: 'assistir', gerund: 'Assistindo', done: 'Assistido', placeholder: 'Ex.: Cidade de Deus', color: '#e11d48' },
  series: { label: 'Série', plural: 'Séries', emoji: '📺', verb: 'assistir', gerund: 'Assistindo', done: 'Assistida', placeholder: 'Ex.: Sintonia', color: '#7c3aed' },
  game:   { label: 'Jogo', plural: 'Jogos', emoji: '🎮', verb: 'jogar', gerund: 'Jogando', done: 'Zerado', placeholder: 'Ex.: Hollow Knight', color: '#059669' },
  book:   { label: 'Livro', plural: 'Livros', emoji: '📚', verb: 'ler', gerund: 'Lendo', done: 'Lido', placeholder: 'Ex.: Torto Arado', color: '#d97706' },
  place:  { label: 'Lugar', plural: 'Lugares', emoji: '📍', verb: 'visitar', gerund: 'Visitando', done: 'Visitado', placeholder: 'Ex.: Ouro Preto', color: '#0284c7' },
  anime:  { label: 'Anime', plural: 'Animes', emoji: '🍥', verb: 'assistir', gerund: 'Assistindo', done: 'Assistido', placeholder: 'Ex.: Frieren', color: '#db2777' },
  album:  { label: 'Álbum', plural: 'Álbuns', emoji: '💿', verb: 'ouvir', gerund: 'Ouvindo', done: 'Ouvido', placeholder: 'Ex.: Clube da Esquina', color: '#4f46e5' },
};

export const STATUS_COLORS: Record<ItemStatus, string> = {
  wishlist: '#64748b',
  in_progress: '#2563eb',
  completed: '#16a34a',
  dropped: '#9ca3af',
};

const GENERIC_STATUS: Record<ItemStatus, string> = {
  wishlist: 'Quero',
  in_progress: 'Em andamento',
  completed: 'Concluído',
  dropped: 'Abandonado',
};

/** Rótulo do status adaptado ao tipo ("Quero jogar", "Lendo", "Visitado"...). */
export function statusLabel(status: ItemStatus, mediaType?: MediaType | null): string {
  if (!mediaType) return GENERIC_STATUS[status];
  const info = MEDIA_TYPE_INFO[mediaType];
  switch (status) {
    case 'wishlist':
      return `Quero ${info.verb}`;
    case 'in_progress':
      return info.gerund;
    case 'completed':
      return info.done;
    case 'dropped':
      return 'Abandonado';
  }
}

export const PRIORITY_LABELS = ['Sem prioridade', 'Baixa', 'Média', 'Alta'] as const;

export function genericStatusLabel(status: ItemStatus): string {
  return GENERIC_STATUS[status];
}
