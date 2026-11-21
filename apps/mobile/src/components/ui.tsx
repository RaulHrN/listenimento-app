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
import { fonts, theme as t } from '@/theme';

const SHADOW = 4;

/**
 * Bloco brutalista: borda grossa preta e sombra dura deslocada.
 * (RN não faz box-shadow sem desfoque, então a sombra é uma View atrás.)
 */
export function Brut({
  children,
  style,
  contentStyle,
  shadowColor = t.ink,
  offset = SHADOW,
  pressed,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  shadowColor?: string;
  offset?: number;
  pressed?: boolean;
}) {
  return (
    <View style={[{ marginRight: offset, marginBottom: offset }, style]}>
      {!pressed && <View style={[StyleSheet.absoluteFill, { top: offset, left: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }]} />}
      <View style={[styles.brut, pressed && { transform: [{ translateX: offset }, { translateY: offset }] }, contentStyle]}>{children}</View>
    </View>
  );
}

/** Faixas verticais imitando as dobras de uma cortina de veludo. */
export function CurtainStripes({ height, stripes = 28, style }: { height?: number; stripes?: number; style?: StyleProp<ViewStyle> }) {
  const shades = [t.curtainDark, t.curtain, t.curtainBright, t.curtain];
  return (
    <View style={[{ flexDirection: 'row', height, overflow: 'hidden' }, style]}>
      {Array.from({ length: stripes }, (_, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: shades[i % shades.length] }} />
      ))}
    </View>
  );
}

/** Sanefa: barra de cortina + franja arredondada com acabamento de latão. */
export function Valance({ count = 14 }: { count?: number }) {
  return (
    <View>
      <CurtainStripes height={14} stripes={40} style={{ borderBottomWidth: 2, borderColor: t.ink }} />
      <View style={{ flexDirection: 'row', marginTop: -1 }}>
        {Array.from({ length: count }, (_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 14,
              backgroundColor: t.curtain,
              borderBottomLeftRadius: 999,
              borderBottomRightRadius: 999,
              borderWidth: 2,
              borderTopWidth: 0,
              borderColor: t.brass,
            }}
          />
        ))}
      </View>
    </View>
  );
}

/** Fileira de lâmpadas do letreiro. */
export function Bulbs({ count = 16 }: { count?: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 4 }}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: t.bulb,
            borderWidth: 1.5,
            borderColor: t.brassDark,
            shadowColor: t.bulb,
            shadowOpacity: 0.9,
            shadowRadius: 4,
            elevation: 2,
          }}
        />
      ))}
    </View>
  );
}

/** Letreiro: placa preta com lâmpadas em cima e embaixo. */
export function Marquee({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Brut shadowColor={t.curtainDark} offset={6} style={style} contentStyle={{ backgroundColor: t.ink }}>
      <Bulbs />
      <View style={{ borderTopWidth: 2, borderBottomWidth: 2, borderColor: t.brassDark, padding: 16 }}>{children}</View>
      <Bulbs />
    </Brut>
  );
}

/** Tábuas de madeira ao fundo da tela. */
export function Planks() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: t.wood900 }]}>
      {Array.from({ length: 14 }, (_, i) => (
        <View key={i} style={{ height: 120, borderBottomWidth: 3, borderBottomColor: 'rgba(0,0,0,0.55)', borderTopWidth: 1, borderTopColor: 'rgba(255,220,170,0.04)' }}>
          <View style={{ position: 'absolute', top: 38 + (i % 3) * 14, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,210,160,0.035)' }} />
          <View style={{ position: 'absolute', top: 76 - (i % 2) * 10, left: 0, right: 0, height: 2, backgroundColor: 'rgba(0,0,0,0.18)' }} />
        </View>
      ))}
    </View>
  );
}

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
  const bg = { primary: t.curtain, brass: t.brass, ghost: t.wood600, danger: t.ink }[variant];
  const color = { primary: t.paper, brass: t.ink, ghost: t.paper, danger: t.neon }[variant];
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={[{ opacity: disabled ? 0.5 : 1 }, style]}>
      {({ pressed }) => (
        <Brut pressed={pressed} contentStyle={[styles.button, { backgroundColor: bg }]}>
          {variant === 'primary' && <CurtainStripes stripes={18} style={StyleSheet.absoluteFill} />}
          {loading ? (
            <ActivityIndicator color={color} />
          ) : (
            <Text style={[styles.buttonText, { color }, variant === 'primary' && styles.textShadow]}>{title}</Text>
          )}
        </Brut>
      )}
    </Pressable>
  );
}

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor="#7d6a55"
      selectionColor={t.curtainBright}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ marginRight: 8 }}>
      {({ pressed }) => (
        <Brut
          offset={3}
          pressed={pressed}
          shadowColor={active ? t.brass : t.ink}
          contentStyle={[styles.chip, { backgroundColor: active ? t.curtain : t.wood600 }]}
        >
          <Text style={[styles.chipText, { color: active ? t.paper : t.muted }]}>{label}</Text>
        </Brut>
      )}
    </Pressable>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function ErrorText({ children }: { children: ReactNode }) {
  return children ? (
    <View style={styles.error}>
      <Text style={{ color: t.paper, fontFamily: fonts.mono, fontSize: 13 }}>{children}</Text>
    </View>
  ) : null;
}

export function Center({ children }: { children: ReactNode }) {
  return <View style={styles.center}>{children}</View>;
}

/** Título de tela: kicker em latão + nome em letreiro. */
export function ScreenTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <View style={{ borderBottomWidth: 3, borderColor: t.brassDark, paddingBottom: 8 }}>
      <Text style={styles.kicker}>{kicker}</Text>
      <Text style={[styles.screenTitle, styles.textShadow]}>{title}</Text>
    </View>
  );
}

export const textStyles = StyleSheet.create({
  display: { fontFamily: fonts.display, textTransform: 'uppercase', letterSpacing: 1 },
  mono: { fontFamily: fonts.mono },
  monoBold: { fontFamily: fonts.monoBold },
});

const styles = StyleSheet.create({
  brut: { borderWidth: 3, borderColor: t.ink, overflow: 'hidden' },
  button: { height: 50, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  buttonText: { fontFamily: fonts.display, fontSize: 18, letterSpacing: 1.5, textTransform: 'uppercase' },
  textShadow: { textShadowColor: t.curtainDark, textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 0.1 },
  input: {
    height: 50,
    borderWidth: 3,
    borderColor: t.brassDark,
    backgroundColor: t.ink,
    color: t.paper,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: fonts.mono,
  },
  chip: { paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontFamily: fonts.display, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' },
  label: { color: t.brass, fontFamily: fonts.monoBold, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  error: { backgroundColor: t.curtainDark, borderWidth: 3, borderColor: t.ink, padding: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  kicker: { color: t.brass, fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' },
  screenTitle: { color: t.paper, fontFamily: fonts.display, fontSize: 44, textTransform: 'uppercase', lineHeight: 50 },
});
