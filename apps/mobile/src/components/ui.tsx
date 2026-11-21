import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { elevation, fonts, useTheme } from '@/theme';

const BRASS_BUTTON = ['#f3cf7f', '#d6a54a', '#9a6d22'] as const;

/* ------------------------------------------------------------------ */
/* Superfícies                                                          */
/* ------------------------------------------------------------------ */

/** Fundo da tela: foco de luz do projetor vindo de cima. */
export function Backdrop() {
  const t = useTheme();
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[t.bgSpot, t.bg, t.bg]}
      locations={[0, 0.45, 1]}
      style={StyleSheet.absoluteFill}
    />
  );
}

/** Cartão elevado: gradiente de luz de cima, borda fina e sombra suave. */
export function Card({ children, style, level = 2 }: { children: ReactNode; style?: StyleProp<ViewStyle>; level?: 1 | 2 | 3 }) {
  const t = useTheme();
  return (
    <View style={[{ borderRadius: 8, backgroundColor: t.surface }, elevation(level, t), style]}>
      <LinearGradient
        colors={[t.raised, t.surface]}
        style={{ borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: t.line, overflow: 'hidden' }}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

/** Veludo da cortina: dobras com luz e sombra + queda de luz vertical. */
export function Velvet({ folds = 6, style, children }: { folds?: number; style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const t = useTheme();
  const colors: string[] = [];
  const locations: number[] = [];
  const cycle = [t.accentDeep, t.accent, t.accentHi, t.accent];
  const steps = folds * cycle.length;
  for (let i = 0; i <= steps; i++) {
    colors.push(cycle[i % cycle.length]!);
    locations.push(i / steps);
  }
  return (
    <View style={[{ overflow: 'hidden' }, style]}>
      <LinearGradient colors={colors as [string, string, ...string[]]} locations={locations as [number, number, ...number[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(255,255,255,0.08)', 'transparent', 'rgba(0,0,0,0.45)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

/** Faixa de cortina que projeta sombra sobre a tela. */
export function CurtainStrip({ height = 8 }: { height?: number }) {
  const t = useTheme();
  return (
    <View style={[{ zIndex: 2 }, elevation(2, { ...t, mode: 'dark' })]}>
      <Velvet folds={14} style={{ height }} />
    </View>
  );
}

/** Madeira envernizada (fachada / cabeçalho). */
export function WoodBar({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <LinearGradient colors={[t.woodHi, t.wood, '#1a0f09']} locations={[0, 0.55, 1]} style={style}>
      <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,230,190,0.12)' }} />
      {children}
    </LinearGradient>
  );
}

/** Fileira de lâmpadas acesas. */
export function Bulbs({ count = 14 }: { count?: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 6 }}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#fff2c8',
            shadowColor: '#ffd98a',
            shadowOpacity: 1,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
      ))}
    </View>
  );
}

/** Letreiro iluminado: sempre escuro, com brilho quente. */
export function Marquee({ children, style, bulbs = true }: { children: ReactNode; style?: StyleProp<ViewStyle>; bulbs?: boolean }) {
  const t = useTheme();
  return (
    <View style={[{ borderRadius: 8 }, elevation(3, t), style]}>
      <LinearGradient
        colors={['#2a1a10', '#0d0805']}
        style={{ borderRadius: 8, borderWidth: 1, borderColor: 'rgba(214,165,74,0.35)', overflow: 'hidden' }}
      >
        {bulbs && <Bulbs />}
        <View style={{ paddingHorizontal: 18, paddingVertical: 14 }}>{children}</View>
        {bulbs && <Bulbs />}
      </LinearGradient>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Controles                                                            */
/* ------------------------------------------------------------------ */

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'brass' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const colors =
    variant === 'primary'
      ? [t.accentHi, t.accent, t.accentDeep]
      : variant === 'brass'
        ? [...BRASS_BUTTON]
        : variant === 'ghost'
          ? [t.raised, t.surface, t.surface]
          : ['transparent', 'transparent', 'transparent'];
  const color = { primary: t.accentFg, brass: '#1b110b', ghost: t.fg, danger: t.accentHi }[variant];
  const flat = variant === 'danger';

  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={[{ opacity: disabled ? 0.5 : 1 }, style]}>
      {({ pressed }) => (
        <View style={[{ borderRadius: 6 }, !flat && !pressed && elevation(1, t), { transform: [{ translateY: pressed ? 1 : 0 }] }]}>
          <LinearGradient
            colors={colors as [string, string, string]}
            locations={[0, 0.5, 1]}
            style={[
              styles.button,
              {
                borderColor: flat ? t.line : variant === 'ghost' ? t.line : 'rgba(0,0,0,0.25)',
                borderTopColor: flat ? t.line : 'rgba(255,255,255,0.25)',
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={color} />
            ) : (
              <Text style={[styles.buttonText, { color }, variant === 'primary' && styles.engraved]}>{title}</Text>
            )}
          </LinearGradient>
        </View>
      )}
    </Pressable>
  );
}

/** Campo "afundado": borda superior mais escura simula a sombra interna. */
export function Input(props: TextInputProps) {
  const t = useTheme();
  return (
    <TextInput
      placeholderTextColor={t.muted}
      selectionColor={t.accentHi}
      {...props}
      style={[
        styles.input,
        {
          backgroundColor: t.field,
          color: t.fg,
          borderColor: t.fieldLine,
          borderTopColor: t.mode === 'dark' ? '#000' : 'rgba(35,21,13,0.28)',
        },
        props.style,
      ]}
    />
  );
}

/** Pílula de seleção (abas, status, tema). */
export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} style={{ marginRight: 8 }}>
      <View style={[{ borderRadius: 999 }, elevation(1, t)]}>
        <LinearGradient
          colors={active ? [t.accentHi, t.accent, t.accentDeep] : [t.raised, t.surface, t.surface]}
          locations={[0, 0.55, 1]}
          style={[styles.chip, { borderColor: active ? 'rgba(0,0,0,0.3)' : t.line }]}
        >
          <Text style={[styles.chipText, { color: active ? t.accentFg : t.muted }]}>{label}</Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

export function Label({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={[styles.label, { color: t.muted }]}>{children}</Text>;
}

export function ErrorText({ children }: { children: ReactNode }) {
  const t = useTheme();
  return children ? (
    <View style={[styles.error, { borderColor: t.accentHi, backgroundColor: t.mode === 'dark' ? 'rgba(200,29,38,0.12)' : 'rgba(200,32,42,0.08)' }]}>
      <Text style={{ color: t.accentHi, fontFamily: fonts.mono, fontSize: 13 }}>{children}</Text>
    </View>
  ) : null;
}

export function Center({ children }: { children: ReactNode }) {
  return <View style={styles.center}>{children}</View>;
}

/** Título de tela: kicker em latão + nome em letreiro. */
export function ScreenTitle({ kicker, title }: { kicker: string; title: string }) {
  const t = useTheme();
  return (
    <View>
      <Text style={[styles.kicker, { color: t.brass }]}>{kicker}</Text>
      <Text
        style={[
          styles.screenTitle,
          { color: t.fg, textShadowColor: t.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1 },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

export const textStyles = StyleSheet.create({
  display: { fontFamily: fonts.display, textTransform: 'uppercase', letterSpacing: 1 },
  body: { fontFamily: fonts.body },
  bodyBold: { fontFamily: fonts.bodyBold },
  mono: { fontFamily: fonts.mono },
  monoBold: { fontFamily: fonts.monoBold },
});

const styles = StyleSheet.create({
  button: { height: 50, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  buttonText: { fontFamily: fonts.display, fontSize: 17, letterSpacing: 1.4, textTransform: 'uppercase' },
  engraved: { textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 0.5 },
  input: { height: 50, borderWidth: 1, borderTopWidth: 1.5, borderRadius: 6, paddingHorizontal: 14, fontSize: 15, fontFamily: fonts.mono },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 13 },
  label: { fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  error: { borderLeftWidth: 3, borderRadius: 4, padding: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  kicker: { fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' },
  screenTitle: { fontFamily: fonts.display, fontSize: 42, textTransform: 'uppercase', lineHeight: 48, marginTop: 2 },
});
