import { useColorScheme } from 'react-native';

const light = {
  bg: '#fafafa',
  card: '#ffffff',
  text: '#18181b',
  muted: '#71717a',
  border: '#e4e4e7',
  input: '#ffffff',
  brand: '#4f46e5',
  brandText: '#ffffff',
  danger: '#dc2626',
  chip: '#f4f4f5',
};

const dark: typeof light = {
  bg: '#09090b',
  card: '#18181b',
  text: '#f4f4f5',
  muted: '#a1a1aa',
  border: '#27272a',
  input: '#18181b',
  brand: '#6366f1',
  brandText: '#ffffff',
  danger: '#f87171',
  chip: '#27272a',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
