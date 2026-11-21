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
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, Line, RadialGradient, Stop } from 'react-native-svg';
import { elevation, fonts, useTheme } from '@/theme';

/* ------------------------------------------------------------------ */
/* Ornamentos                                                           */
/* ------------------------------------------------------------------ */

/**
 * Lustre em estrela (lustres modernistas dos teatros de ópera dos anos 60):
 * hastes finas irradiando de um núcleo, com cristais nas pontas.
 */
export function Chandelier({ size = 48, color }: { size?: number; color?: string }) {
  const t = useTheme();
  const c = 50;
  const rays = 24;
  const stroke = color ?? t.gold;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#fff6dc" stopOpacity={0.9} />
          <Stop offset="40%" stopColor="#e7cd8f" stopOpacity={0.25} />
          <Stop offset="100%" stopColor="#e7cd8f" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={c} cy={c} r={30} fill="url(#glow)" />
      {Array.from({ length: rays }, (_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const long = i % 2 === 0;
        const r = long ? 46 : 32;
        return (
          <Line
            key={`l${i}`}
            x1={c + Math.cos(a) * 9}
            y1={c + Math.sin(a) * 9}
            x2={c + Math.cos(a) * r}
            y2={c + Math.sin(a) * r}
            stroke={stroke}
            strokeWidth={long ? 0.9 : 0.6}
            strokeLinecap="round"
          />
        );
      })}
      {Array.from({ length: rays }, (_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const long = i % 2 === 0;
        const r = long ? 46 : 32;
        return <Circle key={`d${i}`} cx={c + Math.cos(a) * r} cy={c + Math.sin(a) * r} r={long ? 1.9 : 1.3} fill={stroke} />;
      })}
      <Circle cx={c} cy={c} r={6} fill={stroke} />
      <Circle cx={c} cy={c} r={2.4} fill="#fff6dc" />
    </Svg>
  );
}

/** Filete de ouro que esmaece nas pontas. */
export function GoldRule({ width = 64 }: { width?: number }) {
  const t = useTheme();
  return (
    <LinearGradient
      colors={['transparent', t.gold, 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ width, height: StyleSheet.hairlineWidth * 2, alignSelf: 'center' }}
    />
  );
}

/** Logotipo: Listen*i*mento em Bodoni, com o "i" em itálico carmim. */
export function Logo({ size = 24, color }: { size?: number; color?: string }) {
  const t = useTheme();
  const base: TextStyle = { fontFamily: fonts.display, fontSize: size, color: color ?? t.fg };
  return (
    <Text style={base}>
      Listen
      <Text style={{ fontFamily: fonts.displayItalic, color: t.mode === 'dark' ? t.accentHi : t.accent }}>i</Text>
      mento
    </Text>
  );
}

/* ------------------------------------------------------------------ */
/* Superfícies                                                          */
/* ------------------------------------------------------------------ */

/** Fundo da tela: luz difusa do lustre vindo de cima. */
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
export function Card({
  children,
  style,
  level = 2,
  radius = 2,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  level?: 1 | 2 | 3;
  radius?: number;
}) {
  const t = useTheme();
  return (
    <View style={[{ borderRadius: radius, backgroundColor: t.surface }, elevation(level, t), style]}>
      <LinearGradient
        colors={[t.raised, t.surface]}
        style={{ borderRadius: radius, borderWidth: StyleSheet.hairlineWidth, borderColor: t.line, overflow: 'hidden' }}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

/** Veludo carmim: dobras com luz e sombra + queda de luz vertical. */
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
      <LinearGradient
        colors={colors as [string, string, ...string[]]}
        locations={locations as [number, number, ...number[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient colors={['rgba(255,255,255,0.06)', 'transparent', 'rgba(0,0,0,0.42)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

/** Faixa de veludo com filete de ouro, projetando sombra sobre a tela. */
export function VelvetBand({ height = 6 }: { height?: number }) {
  const t = useTheme();
  return (
    <View style={[{ zIndex: 2 }, elevation(2, { ...t, mode: 'dark' })]}>
      <Velvet folds={14} style={{ height, borderBottomWidth: 1, borderBottomColor: t.goldHi }} />
    </View>
  );
}

/** Painel noturno (programa da noite): sempre escuro, filete duplo de ouro. */
export function NightPanel({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <View style={[{ borderRadius: 2 }, elevation(3, t), style]}>
      <LinearGradient colors={['#2a1820', '#0f0a0c']} style={{ borderRadius: 2, borderWidth: 1, borderColor: 'rgba(201,164,92,0.4)', padding: 6 }}>
        <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(201,164,92,0.35)', paddingHorizontal: 16, paddingVertical: 20 }}>
          {children}
        </View>
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
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const color = { primary: t.accentFg, ghost: t.fg, danger: t.accentHi }[variant];

  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={[{ opacity: disabled ? 0.45 : 1 }, style]}>
      {({ pressed }) =>
        variant === 'primary' ? (
          <View style={[{ borderRadius: 2 }, !pressed && elevation(1, t), { transform: [{ translateY: pressed ? 1 : 0 }] }]}>
            <LinearGradient
              colors={[t.accentHi, t.accent, t.accentDeep]}
              locations={[0, 0.6, 1]}
              style={[styles.button, { borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'rgba(255,255,255,0.2)' }]}
            >
              {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.buttonText, { color }]}>{title}</Text>}
            </LinearGradient>
          </View>
        ) : (
          <View
            style={[
              styles.button,
              variant === 'ghost' ? { borderColor: t.gold + '88' } : { borderColor: 'transparent' },
              pressed && { backgroundColor: t.gold + '14' },
            ]}
          >
            {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.buttonText, { color }]}>{title}</Text>}
          </View>
        )
      }
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
          borderTopColor: t.mode === 'dark' ? '#000' : 'rgba(31,20,22,0.26)',
        },
        props.style,
      ]}
    />
  );
}

/** Pílula de seleção (status, prioridade, tema). */
export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} style={{ marginRight: 8 }}>
      <View style={[{ borderRadius: 999 }, elevation(1, t)]}>
        <LinearGradient
          colors={active ? [t.accentHi, t.accent, t.accentDeep] : [t.raised, t.raised, t.raised]}
          locations={[0, 0.6, 1]}
          style={[styles.chip, { borderColor: active ? 'transparent' : t.line }]}
        >
          <Text style={[styles.chipText, { color: active ? t.accentFg : t.muted }]}>{label}</Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

/** Aba em versaletes com filete de ouro quando ativa. */
export function Tab({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} style={{ marginRight: 22, paddingVertical: 10 }}>
      <Text style={[styles.tabText, { color: active ? t.fg : t.muted }]}>{label}</Text>
      {active && (
        <LinearGradient
          colors={[t.gold, t.goldHi, t.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2 }}
        />
      )}
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
    <View style={[styles.error, { borderColor: t.accentHi, backgroundColor: t.accentHi + '14' }]}>
      <Text style={{ color: t.accentHi, fontFamily: fonts.body, fontSize: 14 }}>{children}</Text>
    </View>
  ) : null;
}

export function Center({ children }: { children: ReactNode }) {
  return <View style={styles.center}>{children}</View>;
}

/** Título de tela: ato em versaletes dourados + título em Bodoni. */
export function ScreenTitle({ kicker, title }: { kicker: string; title: string }) {
  const t = useTheme();
  return (
    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.line, paddingBottom: 14 }}>
      <Text style={[styles.kicker, { color: t.gold }]}>{kicker}</Text>
      <Text style={[styles.screenTitle, { color: t.fg }]}>{title}</Text>
    </View>
  );
}

export const textStyles = StyleSheet.create({
  display: { fontFamily: fonts.display },
  displayItalic: { fontFamily: fonts.displayItalic },
  light: { fontFamily: fonts.light },
  body: { fontFamily: fonts.body },
  medium: { fontFamily: fonts.medium },
  caps: { fontFamily: fonts.medium, textTransform: 'uppercase', letterSpacing: 2.2, fontSize: 10 },
});

const styles = StyleSheet.create({
  button: { height: 50, borderRadius: 2, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  buttonText: { fontFamily: fonts.medium, fontSize: 12, letterSpacing: 3, textTransform: 'uppercase' },
  input: { height: 50, borderWidth: 1, borderRadius: 2, paddingHorizontal: 14, fontSize: 15, fontFamily: fonts.body },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth },
  chipText: { fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase' },
  tabText: { fontFamily: fonts.medium, fontSize: 11, letterSpacing: 2.4, textTransform: 'uppercase' },
  label: { fontFamily: fonts.medium, fontSize: 10, letterSpacing: 2.6, textTransform: 'uppercase', marginBottom: 8 },
  error: { borderLeftWidth: 2, padding: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  kicker: { fontFamily: fonts.medium, fontSize: 10, letterSpacing: 3.6, textTransform: 'uppercase' },
  screenTitle: { fontFamily: fonts.display, fontSize: 40, lineHeight: 48, marginTop: 6 },
});
