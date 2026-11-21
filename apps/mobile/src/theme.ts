import { CINEMA } from '@listenimento/core';

/** Tema único (escuro) — cinema de rua antigo + brutalismo. */
export const theme = {
  ...CINEMA,
  bg: CINEMA.wood900,
  card: CINEMA.wood700,
  text: CINEMA.paper,
  border: CINEMA.ink,
  input: CINEMA.ink,
  brand: CINEMA.curtain,
  brandText: CINEMA.paper,
  danger: CINEMA.neon,
  chip: CINEMA.wood600,
};

export type Theme = typeof theme;

/** Nomes registrados pelo useFonts em app/_layout.tsx */
export const fonts = {
  display: 'Anton_400Regular',
  body: 'Archivo_400Regular',
  bodyBold: 'Archivo_800ExtraBold',
  mono: 'CourierPrime_400Regular',
  monoBold: 'CourierPrime_700Bold',
} as const;

/** Mantido como hook para facilitar um tema alternativo no futuro. */
export function useTheme(): Theme {
  return theme;
}
