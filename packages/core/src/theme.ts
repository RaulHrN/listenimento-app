/**
 * Identidade visual do Listenimento: brutalismo + cinema de rua antigo.
 * Madeira escura (poltronas, painéis), vermelho de cortina, latão das
 * molduras e lâmpadas de letreiro, papel de ingresso.
 * Usada pelo site (Tailwind) e pelo app (StyleSheet).
 */
export const CINEMA = {
  ink: '#0c0806',

  wood900: '#170d08',
  wood800: '#21130c',
  wood700: '#2d1a10',
  wood600: '#3c2416',
  wood500: '#5a3622',

  curtainDark: '#5c070c',
  curtain: '#8e0e15',
  curtainBright: '#b5121b',

  brassDark: '#9c7430',
  brass: '#d6a54a',
  bulb: '#ffd98a',

  paper: '#f1e4c3',
  paperDark: '#d9c59a',

  muted: '#b8a283',
  neon: '#ff4d3d',
  exit: '#8fbf6a',
} as const;

export const FONTS = {
  /** letreiro: condensada, caixa alta */
  display: 'Anton',
  /** texto corrido */
  body: 'Archivo',
  /** ingresso / máquina de escrever */
  mono: 'Courier Prime',
} as const;
