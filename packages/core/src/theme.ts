import type { ItemStatus } from './types';

/**
 * Identidade visual do Listenimento: cinema de rua antigo, com profundidade.
 * Madeira escura, veludo vermelho de cortina, latão e papel de ingresso.
 *
 * Dois temas: "light" (sala com as luzes acesas) e "dark" (sessão começando).
 * O site espelha estes valores em CSS (apps/web/src/app/globals.css).
 */
export type ColorMode = 'light' | 'dark';

export interface Palette {
  /** fundo da página e o "foco de luz" no topo */
  bg: string;
  bgSpot: string;
  /** superfícies: base e elevada */
  surface: string;
  raised: string;
  /** texto */
  fg: string;
  muted: string;
  line: string;
  /** veludo da cortina: sombra, base e brilho */
  accentDeep: string;
  accent: string;
  accentHi: string;
  accentFg: string;
  /** latão das molduras e lâmpadas */
  brass: string;
  brassHi: string;
  /** papel de ingresso */
  ticket: string;
  ticketFg: string;
  ticketMuted: string;
  /** campos de formulário (afundados) */
  field: string;
  fieldLine: string;
  /** madeira da fachada (cabeçalho) */
  wood: string;
  woodHi: string;
  woodFg: string;
  /** cor-base das sombras */
  shadow: string;
  status: Record<ItemStatus, string>;
}

export const PALETTES: Record<ColorMode, Palette> = {
  light: {
    bg: '#efe7da',
    bgSpot: '#fbf6ee',
    surface: '#f8f2e8',
    raised: '#fffdf9',
    fg: '#23150d',
    muted: '#7b6553',
    line: 'rgba(35,21,13,0.10)',
    accentDeep: '#5c070c',
    accent: '#9b111a',
    accentHi: '#c8202a',
    accentFg: '#fff7ea',
    brass: '#9a6d22',
    brassHi: '#d6a54a',
    ticket: '#f6ecd4',
    ticketFg: '#23150d',
    ticketMuted: '#7b6553',
    field: '#fffdf9',
    fieldLine: 'rgba(35,21,13,0.16)',
    wood: '#3a2416',
    woodHi: '#6b442b',
    woodFg: '#f6ead2',
    shadow: '#3a2212',
    status: { wishlist: '#a87720', in_progress: '#c8202a', completed: '#3f7d2a', dropped: '#8a7868' },
  },
  dark: {
    bg: '#120b07',
    bgSpot: '#2a1a10',
    surface: '#1d120c',
    raised: '#271810',
    fg: '#f1e4c3',
    muted: '#a8927a',
    line: 'rgba(241,228,195,0.09)',
    accentDeep: '#4e060b',
    accent: '#96101a',
    accentHi: '#c81d26',
    accentFg: '#fbf1de',
    brass: '#d6a54a',
    brassHi: '#ffd98a',
    ticket: '#ecdfbf',
    ticketFg: '#1b110b',
    ticketMuted: '#6b5543',
    field: '#0d0805',
    fieldLine: 'rgba(214,165,74,0.28)',
    wood: '#2b190f',
    woodHi: '#4a2d1c',
    woodFg: '#f1e4c3',
    shadow: '#000000',
    status: { wishlist: '#d6a54a', in_progress: '#ff5a48', completed: '#93c46e', dropped: '#8a7868' },
  },
};

export const FONTS = {
  /** letreiro: condensada, caixa alta */
  display: 'Anton',
  /** texto corrido */
  body: 'Archivo',
  /** ingresso / máquina de escrever */
  mono: 'Courier Prime',
} as const;
