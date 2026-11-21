import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform, useColorScheme, type ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETTES, type ColorMode, type Palette } from '@listenimento/core';

export type ThemePreference = 'system' | ColorMode;

export interface Theme extends Palette {
  mode: ColorMode;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}

const STORAGE_KEY = 'listenimento:theme';

const ThemeContext = createContext<Theme>({
  ...PALETTES.light,
  mode: 'light',
  preference: 'system',
  setPreference: () => {},
});

/** Tema claro/escuro: segue o sistema até a pessoa escolher um. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [preference, setPref] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === 'light' || v === 'dark' || v === 'system') setPref(v);
      })
      .catch(() => undefined);
  }, []);

  const value = useMemo<Theme>(() => {
    const mode: ColorMode = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
    return {
      ...PALETTES[mode],
      mode,
      preference,
      setPreference: (p) => {
        setPref(p);
        AsyncStorage.setItem(STORAGE_KEY, p).catch(() => undefined);
      },
    };
  }, [preference, system]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/** Nomes registrados pelo useFonts em app/_layout.tsx */
export const fonts = {
  display: 'Anton_400Regular',
  body: 'Archivo_400Regular',
  bodyBold: 'Archivo_800ExtraBold',
  mono: 'CourierPrime_400Regular',
  monoBold: 'CourierPrime_700Bold',
} as const;

/**
 * Sombra realista por nível de elevação (iOS: sombra suave; Android: elevation).
 * No tema escuro a sombra é mais densa, como num salão com pouca luz.
 */
export function elevation(level: 1 | 2 | 3, t: Pick<Theme, 'shadow' | 'mode'>): ViewStyle {
  const dark = t.mode === 'dark';
  const cfg = {
    1: { y: 2, r: 4, o: dark ? 0.45 : 0.12, e: 2 },
    2: { y: 8, r: 14, o: dark ? 0.55 : 0.16, e: 6 },
    3: { y: 18, r: 30, o: dark ? 0.7 : 0.25, e: 14 },
  }[level];
  return Platform.select<ViewStyle>({
    android: { elevation: cfg.e, shadowColor: t.shadow },
    default: { shadowColor: t.shadow, shadowOffset: { width: 0, height: cfg.y }, shadowRadius: cfg.r, shadowOpacity: cfg.o },
  })!;
}
