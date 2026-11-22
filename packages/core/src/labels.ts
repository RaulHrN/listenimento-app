import type { ItemStatus, MediaType } from './types';
import { PALETTES, type ColorMode } from './theme';

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
  movie:  { label: 'Filme', plural: 'Filmes', emoji: '🎬', verb: 'assistir', gerund: 'Assistindo', done: 'Assistido', placeholder: 'Ex.: Cidade de Deus', color: '#8a1424' },
  series: { label: 'Série', plural: 'Séries', emoji: '📺', verb: 'assistir', gerund: 'Assistindo', done: 'Assistida', placeholder: 'Ex.: Sintonia', color: '#a5503a' },
  game:   { label: 'Jogo', plural: 'Jogos', emoji: '🎮', verb: 'jogar', gerund: 'Jogando', done: 'Zerado', placeholder: 'Ex.: Hollow Knight', color: '#5f7a46' },
  book:   { label: 'Livro', plural: 'Livros', emoji: '📚', verb: 'ler', gerund: 'Lendo', done: 'Lido', placeholder: 'Ex.: Torto Arado', color: '#9b7a3c' },
  place:  { label: 'Lugar', plural: 'Lugares', emoji: '📍', verb: 'visitar', gerund: 'Visitando', done: 'Visitado', placeholder: 'Ex.: Ouro Preto', color: '#3f6a7a' },
  anime:  { label: 'Anime', plural: 'Animes', emoji: '🍥', verb: 'assistir', gerund: 'Assistindo', done: 'Assistido', placeholder: 'Ex.: Frieren', color: '#8e3a5e' },
  boardgame: { label: 'Jogo de tabuleiro', plural: 'Jogos de tabuleiro', emoji: '🎲', verb: 'jogar', gerund: 'Jogando', done: 'Jogado', placeholder: 'Ex.: Catan', color: '#8a6a3a' },
};

/** Cores de status do tema escuro (padrão). Use statusColor() para o tema atual. */
export const STATUS_COLORS: Record<ItemStatus, string> = PALETTES.dark.status;

export function statusColor(status: ItemStatus, mode: ColorMode = 'dark'): string {
  return PALETTES[mode].status[status];
}

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

/** Fontes de dados exibidas nos créditos (exigência dos termos de uso das APIs). */
export const DATA_SOURCES = [
  { name: 'TMDB', url: 'https://www.themoviedb.org', note: 'Filmes e séries' },
  { name: 'RAWG', url: 'https://rawg.io', note: 'Jogos' },
  { name: 'Google Books', url: 'https://books.google.com', note: 'Livros' },
  { name: 'OpenTripMap', url: 'https://opentripmap.com', note: 'Lugares' },
  { name: 'Jikan / MyAnimeList', url: 'https://myanimelist.net', note: 'Animes' },
  { name: 'Powered by BGG', url: 'https://boardgamegeek.com', note: 'Jogos de tabuleiro' },
] as const;
