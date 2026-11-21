import type { ItemStatus } from './types';

/**
 * Identidade visual do Listenimento: modernismo dos teatros de ópera.
 * Geometria limpa, arcos de proscênio, lustres em estrela, veludo carmim,
 * folha de ouro e marfim. Profundidade por luz e sombra, sem ornamento demais.
 *
 * Dois temas: "light" (foyer de dia) e "dark" (noite de estreia).
 * O site espelha estes valores em CSS (apps/web/src/app/globals.css).
 */
export type ColorMode = 'light' | 'dark';

export interface Palette {
  /** fundo da página e a luz difusa no topo */
  bg: string;
  bgSpot: string;
  /** superfícies: base e elevada */
  surface: string;
  raised: string;
  /** texto */
  fg: string;
  muted: string;
  line: string;
  /** veludo carmim: sombra, base e brilho */
  accentDeep: string;
  accent: string;
  accentHi: string;
  accentFg: string;
  /** folha de ouro: filetes, lustre, destaques */
  gold: string;
  goldHi: string;
  /** campos de formulário (afundados) */
  field: string;
  fieldLine: string;
  /** cor-base das sombras */
  shadow: string;
  status: Record<ItemStatus, string>;
}

export const PALETTES: Record<ColorMode, Palette> = {
  light: {
    bg: '#f4eee4',
    bgSpot: '#fffcf6',
    surface: '#faf6ef',
    raised: '#fffefb',
    fg: '#1f1416',
    muted: '#7a6a62',
    line: 'rgba(31,20,22,0.10)',
    accentDeep: '#4a0a12',
    accent: '#8a1424',
    accentHi: '#b3222f',
    accentFg: '#fffaf2',
    gold: '#9b7a3c',
    goldHi: '#c9a45c',
    field: '#fffefb',
    fieldLine: 'rgba(31,20,22,0.16)',
    shadow: '#3a2025',
    status: { wishlist: '#9b7a3c', in_progress: '#b3222f', completed: '#3f7a3a', dropped: '#8a7d74' },
  },
  dark: {
    bg: '#0f0a0c',
    bgSpot: '#24141b',
    surface: '#171013',
    raised: '#20161a',
    fg: '#f3ead9',
    muted: '#a8978a',
    line: 'rgba(243,234,217,0.09)',
    accentDeep: '#3e0710',
    accent: '#7d1222',
    accentHi: '#b02232',
    accentFg: '#fbf3e4',
    gold: '#c9a45c',
    goldHi: '#e7cd8f',
    field: '#0b0709',
    fieldLine: 'rgba(201,164,92,0.25)',
    shadow: '#000000',
    status: { wishlist: '#c9a45c', in_progress: '#e0605a', completed: '#8fb57a', dropped: '#8a7d74' },
  },
};

export const FONTS = {
  /** títulos: didone de alto contraste, como nos programas de ópera */
  display: 'Bodoni Moda',
  /** interface: geométrica modernista */
  body: 'Jost',
} as const;
